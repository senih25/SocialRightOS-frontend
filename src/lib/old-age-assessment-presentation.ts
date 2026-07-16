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
  buildOldAgeDecisionViewModel,
  oldAgePresentationCopyProfile,
  type OldAgeDecisionViewModel,
} from "./old-age-explanations.ts";
import type { EligibilityCheckResponse } from "./types.ts";

export type OldAgePilotPresentationViewModel = {
  presentation: AssessmentPresentationModel<"TR_OLD_AGE_PENSION">;
  decisionView: OldAgeDecisionViewModel | null;
};

function isOldAgeResult(
  result: AssessmentResult,
): result is AssessmentResult<"TR_OLD_AGE_PENSION"> {
  return result.benefitCode === "TR_OLD_AGE_PENSION";
}

function unavailableView(): OldAgePilotPresentationViewModel {
  return {
    presentation: buildUnavailableAssessmentPresentationModel(
      oldAgePresentationCopyProfile,
    ) as AssessmentPresentationModel<"TR_OLD_AGE_PENSION">,
    decisionView: null,
  };
}

export function buildOldAgePilotPresentationViewModel(
  response: EligibilityCheckResponse,
  localEvaluationId: string,
  trustedOfficialChannels: readonly TrustedOfficialChannel[] = [],
): OldAgePilotPresentationViewModel {
  try {
    const { result } = adaptEligibilityResponse(response, localEvaluationId);
    if (!isOldAgeResult(result)) {
      return unavailableView();
    }

    const presentation = buildAssessmentPresentationModel(
      result,
      oldAgePresentationCopyProfile,
      trustedOfficialChannels,
    );

    if (presentation.outcome === "UNAVAILABLE" || presentation.status === null) {
      return { presentation, decisionView: null };
    }

    const decisionView = buildOldAgeDecisionViewModel({
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
