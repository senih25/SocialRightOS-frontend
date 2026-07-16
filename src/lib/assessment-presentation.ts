import type {
  AssessmentExtensionMap,
  AssessmentMissingInformation,
  AssessmentReason,
  AssessmentResult,
  AssessmentRuleCriterion,
} from "./assessment-result.ts";
import type { EligibilityBenefitCode, EligibilityStatus } from "./types.ts";

export type PresentationOutcome =
  | "POSITIVE"
  | "NEGATIVE"
  | "INCOMPLETE"
  | "UNAVAILABLE";

export type AssessmentIdentityState =
  | "VERIFIED_BACKEND"
  | "MISSING_BACKEND_DECISION"
  | "LOCAL_LEGACY";

export type TrustedOfficialChannel = {
  label: string;
  href: string;
};

export type DocumentChecklistItem = {
  label: string;
  description?: string;
};

export type AssessmentPresentationCopy = {
  title: string;
  summary: string;
  disclaimer: string;
};

export type AssessmentPresentationCopyProfile = {
  outcomes: Record<PresentationOutcome, AssessmentPresentationCopy>;
  documentChecklist?: readonly DocumentChecklistItem[];
};

export type AssessmentPresentationModel<
  TBenefit extends EligibilityBenefitCode = EligibilityBenefitCode,
> = {
  outcome: PresentationOutcome;
  status: EligibilityStatus | null;
  identityState: AssessmentIdentityState | null;
  title: string;
  summary: string;
  reasons: AssessmentReason[];
  ruleCriteria: AssessmentRuleCriterion[];
  missingInformation: AssessmentMissingInformation[];
  nextSteps: Array<{ title: string; url: string }>;
  documentChecklist: DocumentChecklistItem[];
  officialChannels: TrustedOfficialChannel[];
  validAsOf: string | null;
  basisVersion: string | null;
  policyVersion: string | null;
  engineVersion: string | null;
  disclaimer: string;
  benefitSpecificDetails: AssessmentExtensionMap[TBenefit] | null;
};

function outcomeForStatus(status: EligibilityStatus): PresentationOutcome {
  switch (status) {
    case "ELIGIBLE":
      return "POSITIVE";
    case "NOT_ELIGIBLE":
      return "NEGATIVE";
    case "NEEDS_INFO":
      return "INCOMPLETE";
    default:
      throw new Error("Unsupported assessment status");
  }
}

function identityStateForResult(result: AssessmentResult): AssessmentIdentityState {
  if (result.source === "LOCAL_LEGACY_EVALUATOR") {
    return "LOCAL_LEGACY";
  }

  return typeof result.identity.backendDecisionId === "string" &&
    result.identity.backendDecisionId.trim().length > 0
    ? "VERIFIED_BACKEND"
    : "MISSING_BACKEND_DECISION";
}

export function buildUnavailableAssessmentPresentationModel(
  profile: AssessmentPresentationCopyProfile,
): AssessmentPresentationModel {
  const copy = profile.outcomes.UNAVAILABLE;

  return {
    outcome: "UNAVAILABLE",
    status: null,
    identityState: null,
    title: copy.title,
    summary: copy.summary,
    reasons: [],
    ruleCriteria: [],
    missingInformation: [],
    nextSteps: [],
    documentChecklist: [],
    officialChannels: [],
    validAsOf: null,
    basisVersion: null,
    policyVersion: null,
    engineVersion: null,
    disclaimer: copy.disclaimer,
    benefitSpecificDetails: null,
  };
}

export function buildAssessmentPresentationModel<
  TBenefit extends EligibilityBenefitCode,
>(
  result: AssessmentResult<TBenefit>,
  profile: AssessmentPresentationCopyProfile,
  trustedOfficialChannels: readonly TrustedOfficialChannel[] = [],
): AssessmentPresentationModel<TBenefit> {
  try {
    const outcome = outcomeForStatus(result.status);
    const copy = profile.outcomes[outcome];
    const policyVersion = result.validity.policyVersion;
    const engineVersion = result.validity.engineVersion;

    return {
      outcome,
      status: result.status,
      identityState: identityStateForResult(result),
      title: copy.title,
      summary: copy.summary,
      reasons: result.reasons.map((item) => ({ ...item })),
      ruleCriteria: result.ruleCriteria.map((item) => ({ ...item })),
      missingInformation: result.missingInformation.map((item) => ({ ...item })),
      nextSteps: result.guidance.map((item) => ({ ...item })),
      documentChecklist: (profile.documentChecklist ?? []).map((item) => ({ ...item })),
      officialChannels: trustedOfficialChannels.map((item) => ({ ...item })),
      validAsOf: result.validity.evaluatedAt,
      basisVersion: policyVersion || engineVersion || null,
      policyVersion,
      engineVersion,
      disclaimer: copy.disclaimer,
      benefitSpecificDetails: { ...result.extension },
    };
  } catch {
    return buildUnavailableAssessmentPresentationModel(profile) as AssessmentPresentationModel<TBenefit>;
  }
}
