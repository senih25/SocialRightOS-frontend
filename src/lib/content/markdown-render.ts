import { createElement, type ReactNode } from "react";

import { classifyUrl, type MdastNode } from "./markdown-trust.ts";

/**
 * Safe MDAST → React renderer for article bodies.
 *
 * `dangerouslySetInnerHTML` is never used here and no raw-HTML plugin exists in
 * the pipeline. Every node type is mapped explicitly to a React element; a type
 * that is not in the map throws. Combined with `markdown-trust.ts` (which rejects
 * raw HTML, MDX/JSX and unsafe URLs before rendering), an article body cannot
 * introduce executable markup — the renderer has no code path that emits raw HTML.
 *
 * Written with `createElement` rather than JSX on purpose: this keeps the module
 * a plain `.ts` file, so the same code that ships is exercised directly by the
 * Node test runner (which strips types but does not compile JSX).
 *
 * Pure and deterministic: no dates, no randomness, no I/O.
 */

type RenderContext = { keyPrefix: string };

function renderChildren(node: MdastNode, context: RenderContext): ReactNode[] {
  return (node.children ?? []).map((child, index) =>
    renderNode(child, { keyPrefix: `${context.keyPrefix}-${index}` }),
  );
}

function renderNode(node: MdastNode, context: RenderContext): ReactNode {
  const key = context.keyPrefix;

  switch (node.type) {
    case "root":
      return createElement("div", { key, className: "space-y-4" }, ...renderChildren(node, context));

    case "paragraph":
      return createElement(
        "p",
        { key, className: "text-sm leading-relaxed text-slate-700" },
        ...renderChildren(node, context),
      );

    case "heading": {
      const depth = Math.min(Math.max(Number((node as { depth?: number }).depth ?? 2), 2), 4);
      return createElement(
        `h${depth}`,
        { key, className: "mt-6 text-base font-semibold text-slate-900" },
        ...renderChildren(node, context),
      );
    }

    case "text":
      return String(node.value ?? "");

    case "strong":
      return createElement("strong", { key }, ...renderChildren(node, context));

    case "emphasis":
      return createElement("em", { key }, ...renderChildren(node, context));

    case "delete":
      return createElement("del", { key }, ...renderChildren(node, context));

    case "inlineCode":
      return createElement(
        "code",
        { key, className: "rounded bg-slate-100 px-1 py-0.5 text-xs" },
        String(node.value ?? ""),
      );

    case "code":
      return createElement(
        "pre",
        { key, className: "overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100" },
        createElement("code", null, String(node.value ?? "")),
      );

    case "blockquote":
      return createElement(
        "blockquote",
        { key, className: "border-l-4 border-slate-300 pl-3 text-sm text-slate-600" },
        ...renderChildren(node, context),
      );

    case "list": {
      const ordered = Boolean((node as { ordered?: boolean }).ordered);
      return createElement(
        ordered ? "ol" : "ul",
        {
          key,
          className: ordered ? "list-decimal space-y-1 pl-5 text-sm" : "list-disc space-y-1 pl-5 text-sm",
        },
        ...renderChildren(node, context),
      );
    }

    case "listItem":
      return createElement("li", { key }, ...renderChildren(node, context));

    case "link": {
      const url = String(node.url ?? "");
      // Second, independent check at render time: a link is only emitted when its
      // URL is still classified safe. Fail-closed, never silently dropped.
      const verdict = classifyUrl(url);
      if (!verdict.ok) throw new Error(`Refusing to render unsafe link URL "${url}": ${verdict.reason}`);
      const isExternal = /^https:\/\//i.test(url);
      return createElement(
        "a",
        {
          key,
          href: url,
          className: "underline",
          ...(isExternal ? { rel: "noopener noreferrer nofollow", target: "_blank" } : {}),
        },
        ...renderChildren(node, context),
      );
    }

    case "linkReference":
      // Reference-style links resolve through `definition` nodes, which carry no
      // visible output; render the label text only, never a synthesized href.
      return createElement("span", { key }, ...renderChildren(node, context));

    case "thematicBreak":
      return createElement("hr", { key, className: "my-6 border-slate-200" });

    case "break":
      return createElement("br", { key });

    case "definition":
      return null;

    default:
      throw new Error(`Refusing to render unsupported Markdown node type "${node.type}"`);
  }
}

/** Renders a validated, trust-checked MDAST tree into a safe React tree. */
export function renderArticleMarkdown(tree: MdastNode): ReactNode {
  return renderNode(tree, { keyPrefix: "md" });
}
