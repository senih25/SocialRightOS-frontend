import {
  adaptEligibilityResponse,
  type AssessmentResult,
} from "./assessment-result.ts";
import {
  buildAssessmentPresentationModel,
  buildUnavailableAssessmentPresentationModel,
  type AssessmentPresentationModel,
  type TrustedOfficialChannel,
} from "./assessment-presentation.ts";
import {
  buildGssDecisionViewModel,
  gssPresentationCopyProfile,
  type GssDecisionViewModel,
} from "./gss-explanations.ts";
import type { EligibilityCheckResponse } from "./types.ts";

export type GssPilotPresentationViewModel = {
  presentation: AssessmentPresentationModel<"TR_GSS">;
  decisionView: GssDecisionViewModel | null;
};

function isGssResult(
  result: AssessmentResult,
): result is AssessmentResult<"TR_GSS"> {
  return result.benefitCode === "TR_GSS";
}

function unavailableView(): GssPilotPresentationViewModel {
  return {
    presentation: buildUnavailableAssessmentPresentationModel(
      gssPresentationCopyProfile,
    ) as AssessmentPresentationModel<"TR_GSS">,
    decisionView: null,
  };
}

export function buildGssPilotPresentationViewModel(
  response: EligibilityCheckResponse,
  localEvaluationId: string,
  trustedOfficialChannels: readonly TrustedOfficialChannel[] = [],
): GssPilotPresentationViewModel {
  try {
    const { result } = adaptEligibilityResponse(response, localEvaluationId);
    if (!isGssResult(result)) {
      return unavailableView();
    }

    const presentation = buildAssessmentPresentationModel(
      result,
      gssPresentationCopyProfile,
      trustedOfficialChannels,
    );

    if (presentation.outcome === "UNAVAILABLE" || presentation.status === null) {
      return { presentation, decisionView: null };
    }

    const decisionView = buildGssDecisionViewModel({
      status: presentation.status,
      reasons: presentation.reasons.map(({ code, message, severity }) => ({
        code,
        message,
        severity,
      })),
      missingFacts: presentation.missingInformation.map(
        ({ key, message, priority, factGroup, howToObtainUrl }) => ({
          key,
          message,
          priority,
          fact_group: factGroup,
          how_to_obtain_url: howToObtainUrl,
        }),
      ),
    });

    return { presentation, decisionView };
  } catch {
    return unavailableView();
  }
}
