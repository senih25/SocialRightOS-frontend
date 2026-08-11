"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { buildAccessiblePageSummary, type AccessiblePageSummary } from "@/lib/page-summary";
import VoiceGuide from "@/components/ui/VoiceGuide";

const SUMMARY_ID = "page-accessibility-summary";

export default function PageSummaryGuide() {
  const pathname = usePathname();
  const [expandedPathname, setExpandedPathname] = useState<string | null>(null);
  const [summaryState, setSummaryState] = useState<{
    pathname: string;
    value: AccessiblePageSummary | null;
  } | null>(null);
  const expanded = expandedPathname === pathname;
  const summary = summaryState?.pathname === pathname ? summaryState.value : null;

  useEffect(() => {
    const updateSummary = () => {
      const pageHeading = document.querySelector("main h1")?.textContent;
      const metadataDescription = document
        .querySelector<HTMLMetaElement>('meta[name="description"]')
        ?.getAttribute("content");
      const nextSummary = buildAccessiblePageSummary({
        title: pageHeading || document.title,
        description: metadataDescription,
      });

      setSummaryState((current) => {
        if (
          current?.pathname === pathname &&
          current.value?.title === nextSummary?.title &&
          current.value?.description === nextSummary?.description
        ) {
          return current;
        }

        return { pathname, value: nextSummary };
      });
    };

    const animationFrame = window.requestAnimationFrame(updateSummary);

    const observer = new MutationObserver(updateSummary);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["content"],
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [pathname]);

  if (!summary) return null;

  return (
    <aside className="page-summary-shell" aria-label="Sayfa erişilebilirlik araçları">
      <div className="page-summary-card">
        <button
          type="button"
          className="page-summary-toggle"
          aria-expanded={expanded}
          aria-controls={SUMMARY_ID}
          onClick={() => setExpandedPathname(expanded ? null : pathname)}
        >
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          <span>{expanded ? "Sayfa özetini kapat" : "Sayfanın kısa özetini aç"}</span>
        </button>

        {expanded ? (
          <div id={SUMMARY_ID} className="page-summary-content" role="region" aria-live="polite">
            <div>
              <p className="page-summary-label">Bu sayfanın kısa özeti</p>
              <h2 className="page-summary-title">{summary.title}</h2>
              <p id={`${SUMMARY_ID}-text`} className="page-summary-copy">
                {summary.description}
              </p>
            </div>
            <VoiceGuide text={summary.speechText} label="Sayfa özetini sesli dinle" />
          </div>
        ) : null}
      </div>
    </aside>
  );
}
