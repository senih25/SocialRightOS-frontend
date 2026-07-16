import type {
  ToolAnalyticsEvent,
  ToolAnalyticsTargetKind,
  ToolAnalyticsTool,
  ToolAnalyticsSurface,
} from "./analytics.ts";
import type { EligibilityStatus } from "./types.ts";

export type ToolAnalyticsSession = {
  trackOpened: () => void;
  trackFormStarted: () => void;
  trackFormSubmitted: () => void;
  trackResultReceived: (decisionId: string, status: EligibilityStatus) => void;
  trackValidationFailed: () => void;
  trackApiFailed: () => void;
  trackLinkClick: (
    surface: ToolAnalyticsSurface,
    targetKind: ToolAnalyticsTargetKind,
    targetHref: string,
  ) => void;
};

type ToolAnalyticsTracker = (event: ToolAnalyticsEvent) => void;

export function createToolAnalyticsSession(
  tool: ToolAnalyticsTool,
  tracker: ToolAnalyticsTracker,
): ToolAnalyticsSession {
  let hasTrackedOpen = false;
  let hasTrackedFormStart = false;
  let lastDecisionId: string | null = null;

  return {
    trackOpened() {
      if (hasTrackedOpen) {
        return;
      }

      hasTrackedOpen = true;
      tracker({
        name: "page_view",
        tool,
        surface: "tool-page",
      });
    },

    trackFormStarted() {
      if (hasTrackedFormStart) {
        return;
      }

      hasTrackedFormStart = true;
      tracker({
        name: "assessment_started",
        tool,
        surface: "tool-page",
      });
    },

    trackFormSubmitted() {
      if (!hasTrackedFormStart) {
        hasTrackedFormStart = true;
        tracker({ name: "assessment_started", tool, surface: "tool-page" });
      }
    },

    trackResultReceived(decisionId, status) {
      if (!decisionId || lastDecisionId === decisionId) {
        return;
      }

      lastDecisionId = decisionId;
      tracker({
        name: "assessment_completed",
        tool,
        surface: "result",
        status,
      });
    },

    trackValidationFailed() {
      tracker({ name: "assessment_validation_failed", tool, surface: "tool-page" });
    },

    trackApiFailed() {
      tracker({ name: "assessment_api_failed", tool, surface: "tool-page" });
    },

    trackLinkClick(surface, targetKind, targetHref) {
      if (surface === "result" && targetKind === "primary-action") {
        tracker({
          name: "result_cta_clicked",
          tool,
          surface: "result",
          target_kind: "primary-action",
          target_href: targetHref,
        });
      }
    },
  };
}
