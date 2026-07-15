import type {
  BirthGrantBenefitDetails,
  DecisionReason,
  EligibilityBenefitCode,
  EligibilityCheckResponse,
  EligibilityStatus,
  MissingFact,
  RuleResult,
} from "./types.ts";

export type AssessmentSource = "BACKEND_ELIGIBILITY_API" | "LOCAL_LEGACY_EVALUATOR";

export type AssessmentIdentity = {
  localEvaluationId: string;
  backendDecisionId: string | null;
  requestId: string | null;
};

export type AssessmentReason = {
  origin: "BACKEND_REASON" | "LOCAL_REASON";
  code: string;
  message: string;
  severity: string;
};

export type AssessmentRuleCriterion = {
  origin: "BACKEND_RULE_RESULT" | "LOCAL_RULE_RESULT";
  code: string;
  passed: boolean;
  message: string;
  value?: number | string | boolean | null;
  threshold?: number | string | null;
  inputMode?: string;
};

export type AssessmentMissingInformation = {
  origin: "BACKEND_MISSING_FACT" | "LOCAL_MISSING_INFORMATION";
  key: string;
  message: string;
  priority?: number;
  factGroup?: string;
  howToObtainUrl?: string;
};

export type AssessmentValidity = {
  evaluatedAt: string | null;
  engineVersion: string | null;
  policyCode: string | null;
  policyVersion: string | null;
  policyEffectiveFrom: string | null;
  policySourceEffectiveDate: string | null;
  policySnapshotHash: string | null;
};

export type AssessmentGuidance = {
  title: string;
  url: string;
};

export type AssessmentExtensionMap = {
  TR_HOME_CARE_ALLOWANCE: {
    perCapitaIncome?: number | null;
    incomeLimit?: number | null;
    incomeLimitYear?: number | null;
  };
  TR_GSS: Record<string, never>;
  TR_OLD_AGE_PENSION: Record<string, never>;
  TR_BIRTH_GRANT: {
    benefitDetails?: BirthGrantBenefitDetails | null;
  };
};

export type AssessmentResult<
  TBenefit extends EligibilityBenefitCode = EligibilityBenefitCode,
> = {
  schemaVersion: "1.0";
  identity: AssessmentIdentity;
  benefitCode: TBenefit;
  status: EligibilityStatus;
  source: AssessmentSource;
  summary: {
    message: string | null;
    disclaimer: string | null;
  };
  reasons: AssessmentReason[];
  ruleCriteria: AssessmentRuleCriterion[];
  missingInformation: AssessmentMissingInformation[];
  guidance: AssessmentGuidance[];
  validity: AssessmentValidity;
  extension: AssessmentExtensionMap[TBenefit];
};

/**
 * Ephemeral adapter output for parity tests and migration diagnostics.
 * sourcePayload must not be persisted as part of AssessmentResult.
 */
export type AssessmentAdapterValidationCarrier<TResult, TSourcePayload> = {
  result: TResult;
  sourcePayload: TSourcePayload;
};

export type LegacyHomeCareResult = {
  status: EligibilityStatus;
  reasons: string[];
};

export type LegacyHomeCareEvaluationContext = {
  localEvaluationId: string;
  perCapitaIncome?: number | null;
  incomeLimit: number;
  incomeLimitYear: number;
};

const benefitCodes: readonly EligibilityBenefitCode[] = [
  "TR_HOME_CARE_ALLOWANCE",
  "TR_GSS",
  "TR_OLD_AGE_PENSION",
  "TR_BIRTH_GRANT",
];

function assertBenefitCode(value: string): asserts value is EligibilityBenefitCode {
  if (!benefitCodes.includes(value as EligibilityBenefitCode)) {
    throw new Error(`Unsupported eligibility benefit code: ${value}`);
  }
}

function normalizeRules(
  rules: Record<string, RuleResult> | RuleResult[],
): AssessmentRuleCriterion[] {
  const values = Array.isArray(rules) ? rules : Object.values(rules);

  return values.map((rule) => ({
    origin: "BACKEND_RULE_RESULT",
    code: rule.rule_code,
    passed: rule.passed,
    message: rule.message,
    value: rule.value,
    threshold: rule.threshold,
    inputMode: rule.input_mode,
  }));
}

function normalizeReasons(reasons: DecisionReason[]): AssessmentReason[] {
  return reasons.map((reason) => ({
    origin: "BACKEND_REASON",
    code: reason.code,
    message: reason.message,
    severity: reason.severity,
  }));
}

function normalizeMissingFacts(facts: MissingFact[]): AssessmentMissingInformation[] {
  return facts.map((fact) => ({
    origin: "BACKEND_MISSING_FACT",
    key: fact.key,
    message: fact.message,
    priority: fact.priority,
    factGroup: fact.fact_group,
    howToObtainUrl: fact.how_to_obtain_url,
  }));
}

export function adaptEligibilityResponse(
  response: EligibilityCheckResponse,
  localEvaluationId: string,
): AssessmentAdapterValidationCarrier<AssessmentResult, EligibilityCheckResponse> {
  assertBenefitCode(response.benefit_id);

  const extension =
    response.benefit_id === "TR_BIRTH_GRANT"
      ? { benefitDetails: response.benefit_details ?? null }
      : {};

  const result: AssessmentResult = {
    schemaVersion: "1.0",
    identity: {
      localEvaluationId,
      backendDecisionId: response.decision_id,
      requestId: response.request_id,
    },
    benefitCode: response.benefit_id,
    status: response.status,
    source: "BACKEND_ELIGIBILITY_API",
    summary: {
      message: response.user_message ?? null,
      disclaimer: response.disclaimer ?? null,
    },
    reasons: normalizeReasons(response.reasons),
    ruleCriteria: normalizeRules(response.rule_results),
    missingInformation: normalizeMissingFacts(response.missing_facts),
    guidance: (response.guidance_items ?? []).map((item) => ({
      title: item.title,
      url: item.url,
    })),
    validity: {
      evaluatedAt: response.metadata.evaluation_date,
      engineVersion: response.metadata.engine_version,
      policyCode: response.metadata.policy_code,
      policyVersion: response.metadata.policy_version,
      policyEffectiveFrom: response.metadata.policy_effective_from ?? null,
      policySourceEffectiveDate: response.metadata.policy_source_effective_date ?? null,
      policySnapshotHash: response.metadata.policy_snapshot_hash ?? null,
    },
    extension,
  };

  return { result, sourcePayload: response };
}

export function adaptLegacyHomeCareResult(
  legacyResult: LegacyHomeCareResult,
  context: LegacyHomeCareEvaluationContext,
): AssessmentAdapterValidationCarrier<
  AssessmentResult<"TR_HOME_CARE_ALLOWANCE">,
  LegacyHomeCareResult
> {
  const result: AssessmentResult<"TR_HOME_CARE_ALLOWANCE"> = {
    schemaVersion: "1.0",
    identity: {
      localEvaluationId: context.localEvaluationId,
      backendDecisionId: null,
      requestId: null,
    },
    benefitCode: "TR_HOME_CARE_ALLOWANCE",
    status: legacyResult.status,
    source: "LOCAL_LEGACY_EVALUATOR",
    summary: {
      message: null,
      disclaimer: null,
    },
    reasons: legacyResult.reasons.map((message, index) => ({
      origin: "LOCAL_REASON",
      code: `LEGACY_HOME_CARE_REASON_${index + 1}`,
      message,
      severity: legacyResult.status === "NOT_ELIGIBLE" ? "ERROR" : "INFO",
    })),
    ruleCriteria: [],
    missingInformation: [],
    guidance: [],
    validity: {
      evaluatedAt: null,
      engineVersion: null,
      policyCode: null,
      policyVersion: null,
      policyEffectiveFrom: null,
      policySourceEffectiveDate: null,
      policySnapshotHash: null,
    },
    extension: {
      perCapitaIncome: context.perCapitaIncome,
      incomeLimit: context.incomeLimit,
      incomeLimitYear: context.incomeLimitYear,
    },
  };

  return { result, sourcePayload: legacyResult };
}
