import type { EligibilityStatus } from "@/lib/types";

export type ToolAnalyticsTool = "home-care" | "gss" | "old-age" | "birth-grant";
export type ToolAnalyticsSurface = "tool-page" | "result" | "guidance";
export type ToolAnalyticsTargetKind = "guide" | "tool" | "primary-action";

export type ToolAnalyticsEvent =
  | {
      name: "page_view";
      tool: ToolAnalyticsTool;
      surface: "tool-page";
    }
  | {
      name: "assessment_started";
      tool: ToolAnalyticsTool;
      surface: "tool-page";
    }
  | {
      name: "assessment_completed";
      tool: ToolAnalyticsTool;
      surface: "result";
      status: EligibilityStatus;
    }
  | {
      name: "assessment_validation_failed" | "assessment_api_failed";
      tool: ToolAnalyticsTool;
      surface: "tool-page";
    }
  | {
      name: "result_cta_clicked";
      tool: ToolAnalyticsTool;
      surface: "result";
      target_kind: "primary-action";
      target_href: string;
    }
  | {
      name: "feedback_opened";
      tool: ToolAnalyticsTool;
      surface: ToolAnalyticsSurface;
    };

export type AnalyticsEnvelope = {
  event: ToolAnalyticsEvent["name"];
  tool: ToolAnalyticsTool;
  surface: ToolAnalyticsSurface;
  status?: EligibilityStatus;
  target_kind?: ToolAnalyticsTargetKind;
  target_href?: string;
};

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, string>>;
};

function safeTargetHref(value: string): string {
  if (!value.startsWith("/")) {
    return "/";
  }

  try {
    return new URL(value, "https://local.invalid").pathname;
  } catch {
    return "/";
  }
}

export function buildAnalyticsEnvelope(event: ToolAnalyticsEvent): AnalyticsEnvelope {
  const baseEnvelope: AnalyticsEnvelope = {
    event: event.name,
    tool: event.tool,
    surface: event.surface,
  };

  if (event.name === "assessment_completed") {
    return {
      ...baseEnvelope,
      status: event.status,
    };
  }

  if (event.name === "result_cta_clicked") {
    return {
      ...baseEnvelope,
      target_kind: event.target_kind,
      target_href: safeTargetHref(event.target_href),
    };
  }

  return baseEnvelope;
}

export function trackAnalyticsEvent(event: ToolAnalyticsEvent): void {
  if (typeof window === "undefined") {
    return;
  }

  const envelope = buildAnalyticsEnvelope(event);
  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.dispatchEvent(
    new CustomEvent<AnalyticsEnvelope>("shr:analytics", {
      detail: envelope,
    }),
  );

  if (Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push(
      Object.fromEntries(
        Object.entries(envelope).filter((entry): entry is [string, string] => {
          const [, value] = entry;
          return typeof value === "string";
        }),
      ),
    );
  }
}
