export type RightsGuidanceAssessmentType =
  | "GSS_PRELIMINARY_GUIDANCE"
  | "OLD_AGE_PENSION_PRELIMINARY_GUIDANCE";

export type RightsGuidanceDisplayStatus =
  | "CONDITION_APPEARS_SATISFIED"
  | "CONDITION_APPEARS_NOT_SATISFIED"
  | "INSUFFICIENT_INFORMATION";

export type RightsGuidanceEvidence = {
  evidenceId: string;
  approvedText: string;
};

export type RightsGuidanceApprovedCatalog = {
  assessmentType: RightsGuidanceAssessmentType;
  reasons: readonly RightsGuidanceEvidence[];
  nextSteps: readonly RightsGuidanceEvidence[];
  limitations: readonly string[];
};

export type RightsGuidanceInput = {
  assessmentType: RightsGuidanceAssessmentType;
  coarseDisplayStatus: RightsGuidanceDisplayStatus;
  approvedReasons: RightsGuidanceEvidence[];
  approvedNextSteps: RightsGuidanceEvidence[];
  validAsOf: string;
  basisVersion: string;
};

export type RightsGuidanceInputSelection = {
  assessmentType: RightsGuidanceAssessmentType;
  coarseDisplayStatus: RightsGuidanceDisplayStatus;
  reasonEvidenceIds: readonly string[];
  nextStepEvidenceIds: readonly string[];
  validAsOf: string;
  basisVersion: string;
};

export type RightsGuidanceExplanation = {
  overallStatus: "EXPLANATION_AVAILABLE";
  reasonExplanations: Array<{ evidenceId: string; plainLanguageText: string }>;
  nextStepExplanations: Array<{ evidenceId: string; plainLanguageText: string }>;
};

export type UnavailableRightsGuidanceExplanation = {
  overallStatus: "UNAVAILABLE";
  reasonExplanations: [];
  nextStepExplanations: [];
};

export type RightsGuidanceRenderModel =
  | RightsGuidanceExplanation
  | UnavailableRightsGuidanceExplanation;

export type RightsGuidanceApplicationCopy = {
  heading: string;
  summary: string;
  limitations: string[];
  disclaimer: string;
};

export type RightsGuidanceProviderResult = {
  output: unknown;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
};

export interface RightsGuidanceProvider {
  readonly mode: "MOCK" | "LIVE";
  generate(input: RightsGuidanceInput): Promise<RightsGuidanceProviderResult>;
}

export type RightsGuidanceBudgetSnapshot = {
  hardLimitMicros: number;
  committedMicros: number;
  reservedMicros: number;
};

export interface RightsGuidanceAtomicBudgetStore {
  reserve(maximumCostMicros: number): Promise<{ reservationId: string } | null>;
  settle(
    reservationId: string,
    usage: RightsGuidanceProviderResult["usage"],
  ): Promise<void>;
  release(reservationId: string): Promise<void>;
}

export type RightsGuidanceValidationIssue =
  | "INVALID_RESPONSE_SHAPE"
  | "UNKNOWN_EVIDENCE_ID"
  | "DUPLICATE_EVIDENCE_ID"
  | "EVIDENCE_COVERAGE_MISMATCH"
  | "UNSUPPORTED_CONCRETE_CLAIM"
  | "SEMANTIC_FIDELITY_VIOLATION"
  | "PROHIBITED_CERTAINTY_CLAIM";

export type RightsGuidanceValidationResult =
  | { ok: true; value: RightsGuidanceExplanation }
  | { ok: false; issues: RightsGuidanceValidationIssue[] };

const assessmentTypes: readonly RightsGuidanceAssessmentType[] = [
  "GSS_PRELIMINARY_GUIDANCE",
  "OLD_AGE_PENSION_PRELIMINARY_GUIDANCE",
];

const displayStatuses: readonly RightsGuidanceDisplayStatus[] = [
  "CONDITION_APPEARS_SATISFIED",
  "CONDITION_APPEARS_NOT_SATISFIED",
  "INSUFFICIENT_INFORMATION",
];

const selectionKeys = [
  "assessmentType",
  "coarseDisplayStatus",
  "reasonEvidenceIds",
  "nextStepEvidenceIds",
  "validAsOf",
  "basisVersion",
] as const;

const responseKeys = [
  "reasonExplanations",
  "nextStepExplanations",
] as const;

const applicationSummaryByStatus: Record<RightsGuidanceDisplayStatus, string> = {
  CONDITION_APPEARS_SATISFIED:
    "Ön değerlendirmede seçilen koşulların sağlanmış göründüğü sonucu korunmaktadır.",
  CONDITION_APPEARS_NOT_SATISFIED:
    "Ön değerlendirmede seçilen koşullardan en az birinin sağlanmamış göründüğü sonucu korunmaktadır.",
  INSUFFICIENT_INFORMATION:
    "Ön değerlendirme sonucunu açıklamak için ek bilgi gerektiği durumu korunmaktadır.",
};

const applicationHeading = "Ön değerlendirme açıklaması";
const applicationDisclaimer =
  "Bu açıklama resmî bir uygunluk kararı değildir ve ön değerlendirme sonucunu değiştirmez.";

const prohibitedCertaintyPatterns = [
  /\bkesin(?:dir|likle)?\b/iu,
  /\bgaranti(?:dir|len(?:miştir|ir|iyor)?)?\b/iu,
  /\b(?:mutlaka|şüphesiz|tartışmasız)\b/iu,
  /\b(?:bağlayıcı(?:dır)?|nihai)\b/iu,
  /kesin(?:likle)?\s+hak\s+kazan/iu,
  /hak\s+kazan/iu,
  /resm[iî]\s+(?:uygunluk|hak)\s+karar/iu,
  /resm[iî]\s+(?:bir\s+)?karar/iu,
  /(?:nihai|bağlayıcı)\s+(?:uygunluk|hak|başvuru|değerlendirme)\s+karar/iu,
  /başvurunuz\s+(?:kesin\s+)?onaylan/iu,
  /hukuken\s+hak\s+sahib/iu,
  /\b(?:uygundur|uygun\s+değildir|hak\s+kazanmıştır|hak\s+kazanmamıştır)\b/iu,
];

const negativeMeaningPhrases = [
  "sağlanmamış",
  "sağlanmış değil",
  "karşılanmamış",
  "karşılanmış değil",
  "uygun değil",
  "mevcut değil",
  "bulunmuyor",
  "yok",
];

const positiveMeaningPhrases = [
  "sağlanmış",
  "karşılanmış",
  "uygun görün",
  "mevcut görün",
  "bulunuyor",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isSafeText(value: unknown, maximumLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximumLength &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(value)
  );
}

function isEvidenceId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z][A-Z0-9_]{2,63}$/u.test(value);
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throw new Error(`Duplicate ${label}`);
  }
}

function validateCatalog(catalog: RightsGuidanceApprovedCatalog): void {
  if (!assessmentTypes.includes(catalog.assessmentType)) {
    throw new Error("Unsupported guidance assessment type");
  }

  const evidence = [...catalog.reasons, ...catalog.nextSteps];
  for (const item of evidence) {
    if (!isEvidenceId(item.evidenceId) || !isSafeText(item.approvedText, 500)) {
      throw new Error("Invalid approved evidence catalog");
    }
  }
  assertUnique(
    evidence.map((item) => item.evidenceId),
    "approved evidence id",
  );

  if (
    catalog.limitations.length === 0 ||
    catalog.limitations.some((item) => !isSafeText(item, 300))
  ) {
    throw new Error("Invalid approved limitation catalog");
  }
  assertUnique(catalog.limitations, "approved limitation");
}

function readStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    return null;
  }
  return [...value];
}

function selectEvidence(
  ids: readonly string[],
  catalog: readonly RightsGuidanceEvidence[],
): RightsGuidanceEvidence[] {
  assertUnique(ids, "selected evidence id");
  const byId = new Map(catalog.map((item) => [item.evidenceId, item]));

  return ids.map((id) => {
    const item = byId.get(id);
    if (!item) {
      throw new Error("Unapproved evidence selection");
    }
    return { ...item };
  });
}

export function buildRightsGuidanceInput(
  value: unknown,
  catalog: RightsGuidanceApprovedCatalog,
): RightsGuidanceInput {
  validateCatalog(catalog);
  if (!isRecord(value) || !hasExactKeys(value, selectionKeys)) {
    throw new Error("Invalid guidance input selection");
  }

  const reasonEvidenceIds = readStringArray(value.reasonEvidenceIds);
  const nextStepEvidenceIds = readStringArray(value.nextStepEvidenceIds);
  if (
    !assessmentTypes.includes(value.assessmentType as RightsGuidanceAssessmentType) ||
    value.assessmentType !== catalog.assessmentType ||
    !displayStatuses.includes(value.coarseDisplayStatus as RightsGuidanceDisplayStatus) ||
    !reasonEvidenceIds ||
    !nextStepEvidenceIds ||
    !isSafeText(value.validAsOf, 40) ||
    !/^\d{4}-\d{2}-\d{2}(?:T[^\s]{1,30})?$/u.test(value.validAsOf) ||
    !isSafeText(value.basisVersion, 80)
  ) {
    throw new Error("Invalid guidance input selection");
  }

  return {
    assessmentType: value.assessmentType as RightsGuidanceAssessmentType,
    coarseDisplayStatus: value.coarseDisplayStatus as RightsGuidanceDisplayStatus,
    approvedReasons: selectEvidence(reasonEvidenceIds, catalog.reasons),
    approvedNextSteps: selectEvidence(nextStepEvidenceIds, catalog.nextSteps),
    validAsOf: value.validAsOf,
    basisVersion: value.basisVersion,
  };
}

export function buildRightsGuidanceApplicationCopy(
  value: unknown,
  catalog: RightsGuidanceApprovedCatalog,
): RightsGuidanceApplicationCopy {
  const input = buildRightsGuidanceInput(value, catalog);
  return {
    heading: applicationHeading,
    summary: applicationSummaryByStatus[input.coarseDisplayStatus],
    limitations: [...catalog.limitations],
    disclaimer: applicationDisclaimer,
  };
}

function extractConcreteTokens(value: string): Set<string> {
  const matches = value.match(
    /https?:\/\/[^\s]+|\b\d+(?:[.,]\d+)?(?:\s?%|\s?(?:TL|TRY|₺))?|\b[A-ZÇĞİÖŞÜ]{3,}\b/gu,
  );
  return new Set((matches ?? []).map((item) => item.toLocaleLowerCase("tr-TR")));
}

function hasUnsupportedConcreteClaim(statement: string, approvedText: string): boolean {
  const approved = extractConcreteTokens(approvedText);
  return [...extractConcreteTokens(statement)].some((token) => !approved.has(token));
}

function meaningPolarity(value: string): "POSITIVE" | "NEGATIVE" | "UNKNOWN" {
  const normalized = value.toLocaleLowerCase("tr-TR");
  if (negativeMeaningPhrases.some((phrase) => normalized.includes(phrase))) {
    return "NEGATIVE";
  }
  if (positiveMeaningPhrases.some((phrase) => normalized.includes(phrase))) {
    return "POSITIVE";
  }
  return "UNKNOWN";
}

function reversesApprovedMeaning(statement: string, approvedText: string): boolean {
  const approvedPolarity = meaningPolarity(approvedText);
  const generatedPolarity = meaningPolarity(statement);
  return (
    approvedPolarity !== "UNKNOWN" &&
    generatedPolarity !== "UNKNOWN" &&
    approvedPolarity !== generatedPolarity
  );
}

function hasExactEvidenceCoverage(
  items: readonly { evidenceId: string }[],
  allowed: ReadonlyMap<string, string>,
): boolean {
  return (
    items.length === allowed.size &&
    items.every((item) => allowed.has(item.evidenceId))
  );
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }
  return Object.freeze(value);
}

function parseExplanationItems(
  value: unknown,
  allowed: Map<string, string>,
  issues: Set<RightsGuidanceValidationIssue>,
): Array<{ evidenceId: string; plainLanguageText: string }> | null {
  if (!Array.isArray(value)) {
    issues.add("INVALID_RESPONSE_SHAPE");
    return null;
  }

  const parsed: Array<{ evidenceId: string; plainLanguageText: string }> = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (
      !isRecord(item) ||
      !hasExactKeys(item, ["evidenceId", "plainLanguageText"]) ||
      !isEvidenceId(item.evidenceId) ||
      !isSafeText(item.plainLanguageText, 500)
    ) {
      issues.add("INVALID_RESPONSE_SHAPE");
      return null;
    }

    const evidenceId = item.evidenceId;
    const plainLanguageText = item.plainLanguageText;

    if (seen.has(evidenceId)) {
      issues.add("DUPLICATE_EVIDENCE_ID");
    }
    seen.add(evidenceId);

    const approvedText = allowed.get(evidenceId);
    if (!approvedText) {
      issues.add("UNKNOWN_EVIDENCE_ID");
    } else if (hasUnsupportedConcreteClaim(plainLanguageText, approvedText)) {
      issues.add("UNSUPPORTED_CONCRETE_CLAIM");
    } else if (reversesApprovedMeaning(plainLanguageText, approvedText)) {
      issues.add("SEMANTIC_FIDELITY_VIOLATION");
    }
    if (prohibitedCertaintyPatterns.some((pattern) => pattern.test(plainLanguageText))) {
      issues.add("PROHIBITED_CERTAINTY_CLAIM");
    }

    parsed.push({ evidenceId, plainLanguageText });
  }
  return parsed;
}

export function validateRightsGuidanceExplanation(
  raw: unknown,
  input: RightsGuidanceInput,
): RightsGuidanceValidationResult {
  const issues = new Set<RightsGuidanceValidationIssue>();
  if (!isRecord(raw) || !hasExactKeys(raw, responseKeys)) {
    return { ok: false, issues: ["INVALID_RESPONSE_SHAPE"] };
  }
  const reasonById = new Map(input.approvedReasons.map((item) => [item.evidenceId, item.approvedText]));
  const nextStepById = new Map(
    input.approvedNextSteps.map((item) => [item.evidenceId, item.approvedText]),
  );

  const reasonExplanations = parseExplanationItems(
    raw.reasonExplanations,
    reasonById,
    issues,
  );
  const nextStepExplanations = parseExplanationItems(
    raw.nextStepExplanations,
    nextStepById,
    issues,
  );

  if (
    reasonExplanations &&
    !hasExactEvidenceCoverage(reasonExplanations, reasonById)
  ) {
    issues.add("EVIDENCE_COVERAGE_MISMATCH");
  }
  if (
    nextStepExplanations &&
    !hasExactEvidenceCoverage(nextStepExplanations, nextStepById)
  ) {
    issues.add("EVIDENCE_COVERAGE_MISMATCH");
  }

  if (issues.size > 0 || !reasonExplanations || !nextStepExplanations) {
    return { ok: false, issues: [...issues] };
  }

  return {
    ok: true,
    value: {
      overallStatus: "EXPLANATION_AVAILABLE",
      reasonExplanations,
      nextStepExplanations,
    },
  };
}

export function buildUnavailableRightsGuidanceExplanation(): UnavailableRightsGuidanceExplanation {
  return {
    overallStatus: "UNAVAILABLE",
    reasonExplanations: [],
    nextStepExplanations: [],
  };
}

export function canReserveRightsGuidanceCost(
  snapshot: RightsGuidanceBudgetSnapshot,
  maximumRequestCostMicros: number,
): boolean {
  const values = [
    snapshot.hardLimitMicros,
    snapshot.committedMicros,
    snapshot.reservedMicros,
    maximumRequestCostMicros,
  ];
  if (values.some((value) => !Number.isSafeInteger(value) || value < 0)) {
    return false;
  }
  return (
    snapshot.committedMicros + snapshot.reservedMicros + maximumRequestCostMicros <=
    snapshot.hardLimitMicros
  );
}

export class DeterministicRightsGuidanceMockProvider implements RightsGuidanceProvider {
  readonly mode = "MOCK" as const;

  async generate(input: RightsGuidanceInput): Promise<RightsGuidanceProviderResult> {
    return {
      output: {
        reasonExplanations: input.approvedReasons.map((item) => ({
          evidenceId: item.evidenceId,
          plainLanguageText: item.approvedText,
        })),
        nextStepExplanations: input.approvedNextSteps.map((item) => ({
          evidenceId: item.evidenceId,
          plainLanguageText: item.approvedText,
        })),
      },
      usage: { inputTokens: 0, outputTokens: 0 },
    };
  }
}

export async function generateRightsGuidanceExplanation(
  input: RightsGuidanceInput,
  provider: RightsGuidanceProvider,
  options: { enabled: boolean },
): Promise<RightsGuidanceRenderModel> {
  if (!options.enabled || provider.mode === "LIVE") {
    return buildUnavailableRightsGuidanceExplanation();
  }

  try {
    const validationInput = structuredClone(input);
    const providerInput = deepFreeze(structuredClone(input));
    const result = await provider.generate(providerInput);
    const validation = validateRightsGuidanceExplanation(result.output, validationInput);
    return validation.ok ? validation.value : buildUnavailableRightsGuidanceExplanation();
  } catch {
    return buildUnavailableRightsGuidanceExplanation();
  }
}
