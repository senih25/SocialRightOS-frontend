import type {
  BirthGrantBenefitDetails,
  DecisionReason,
  EligibilityCheckRequest,
  EligibilityCheckResponse,
  EligibilityMetadata,
  IncomeEvaluationRequest,
  IncomeEvaluationResponse,
  LeadCreateResponse,
  MissingFact,
  RuleResult,
} from "@/lib/types";

type LocalApiResponse =
  | EligibilityCheckResponse
  | IncomeEvaluationResponse
  | LeadCreateResponse
  | { message: string; error: string; status: number; correlation_id: string };

const ELIGIBILITY_BENEFIT_CODES = new Set<EligibilityCheckRequest["benefit_code"]>([
  "TR_HOME_CARE_ALLOWANCE",
  "TR_GSS",
  "TR_OLD_AGE_PENSION",
  "TR_BIRTH_GRANT",
]);

const ENGINE_VERSION = "local-fallback-v1";
const GSS_THRESHOLD = 6667;
const OLD_AGE_THRESHOLD = 10000;

function nowIso(): string {
  return new Date().toISOString();
}

function decisionId(benefitCode: string, requestId?: string): string {
  const suffix = requestId?.trim() || crypto.randomUUID();
  return `local-${benefitCode.toLowerCase()}-${suffix}`;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function reason(
  code: string,
  message: string,
  severity: DecisionReason["severity"],
  value?: number | string | boolean | null,
  threshold?: number | string | null,
): DecisionReason {
  const item: DecisionReason = { code, message, severity };

  if (value !== undefined) {
    (item as DecisionReason & { value?: number | string | boolean | null }).value = value;
  }

  if (threshold !== undefined) {
    (item as DecisionReason & { threshold?: number | string | null }).threshold = threshold;
  }

  return item;
}

function missingFact(key: string, message: string, factGroup?: string): MissingFact {
  const item: MissingFact = { key, message };

  if (factGroup) {
    item.fact_group = factGroup;
  }

  return item;
}

function metadata(input: {
  benefitCode: string;
  visibleTestName: string;
  benefitFamily: string;
  requiresIncomeTest: boolean;
  applicationState: "ready" | "needs_review";
  primaryChannel: string;
  description: string;
}): EligibilityMetadata {
  return {
    engine_version: ENGINE_VERSION,
    evaluation_mode: "LOCAL_FALLBACK",
    policy_code: input.benefitCode,
    policy_version: "local-2026-05",
    jurisdiction: "TR",
    evaluation_date: nowIso(),
    benefit_family: input.benefitFamily,
    requires_income_test: input.requiresIncomeTest,
    visible_test_name: input.visibleTestName,
    policy_jurisdiction: "TR",
    policy_effective_from: "2026-01-01",
    policy_source_effective_date: "2026-01-01",
    policy_snapshot_hash: "local-fallback",
    application_guidance: {
      application_state: input.applicationState,
      primary_channel: input.primaryChannel,
      description: input.description,
    },
  };
}

function rule(
  ruleCode: string,
  passed: boolean,
  message: string,
  value?: number | string | boolean | null,
  threshold?: number | string | null,
): RuleResult {
  const item: RuleResult = { rule_code: ruleCode, passed, message };

  if (value !== undefined) {
    item.value = value;
  }

  if (threshold !== undefined) {
    item.threshold = threshold;
  }

  return item;
}

function guidanceItems(benefitCode: string): EligibilityCheckResponse["guidance_items"] {
  switch (benefitCode) {
    case "TR_HOME_CARE_ALLOWANCE":
      return [
        { title: "Evde bakım şartları", url: "/evde-bakim-maasi/sartlar" },
        { title: "Başvuru rehberi", url: "/evde-bakim-maasi/basvuru-rehberi" },
      ];
    case "TR_OLD_AGE_PENSION":
      return [
        { title: "65 yaş aylığı rehberi", url: "/65-yas-ayligi-uygunluk-testi/rehber" },
        { title: "Ana sayfa", url: "/" },
      ];
    case "TR_BIRTH_GRANT":
      return [
        { title: "Doğum yardımı rehberi", url: "/dogum-yardimi-uygunluk-testi/rehber" },
        { title: "Başvuru adımları", url: "/dogum-yardimi-uygunluk-testi/e-devlet-basvurusu" },
      ];
    default:
      return [
        { title: "GSS rehberi", url: "/gss-gelir-testi/rehber" },
        { title: "Ana sayfa", url: "/" },
      ];
  }
}

function missingResponse(routeKey: string): LocalApiResponse {
  return {
    message: `Yerel geri dönüş bu yol için tanımlı değil: ${routeKey}`,
    error: "unsupported_route",
    status: 503,
    correlation_id: "",
  };
}

export function invalidEligibilityRequestResponse(): LocalApiResponse {
  return {
    message: "Uygunluk değerlendirme isteği geçerli değil.",
    error: "invalid_request",
    status: 400,
    correlation_id: "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFactValue(value: unknown): boolean {
  return (
    value === null ||
    typeof value === "string" ||
    (typeof value === "number" && Number.isFinite(value)) ||
    typeof value === "boolean"
  );
}

export function normalizeEligibilityCheckRequest(
  payload: unknown,
): EligibilityCheckRequest | null {
  if (!isRecord(payload)) {
    return null;
  }

  const benefitCode = payload.benefit_code;
  if (
    typeof benefitCode !== "string" ||
    !ELIGIBILITY_BENEFIT_CODES.has(benefitCode as EligibilityCheckRequest["benefit_code"])
  ) {
    return null;
  }

  if (!isRecord(payload.facts) || !Object.values(payload.facts).every(isFactValue)) {
    return null;
  }

  const context = payload.context;
  if (context !== undefined) {
    if (!isRecord(context)) {
      return null;
    }

    const knownContextValues = [
      context.jurisdiction,
      context.evaluation_date,
      context.request_id,
      context.policy_version,
    ];
    if (knownContextValues.some((value) => value !== undefined && typeof value !== "string")) {
      return null;
    }
    if (context.jurisdiction !== undefined && context.jurisdiction !== "TR") {
      return null;
    }
  }

  return {
    benefit_code: benefitCode as EligibilityCheckRequest["benefit_code"],
    facts: { ...payload.facts },
    ...(context === undefined
      ? {}
      : {
          context: {
            ...(context.jurisdiction === undefined
              ? {}
              : { jurisdiction: context.jurisdiction as "TR" }),
            ...(context.evaluation_date === undefined
              ? {}
              : { evaluation_date: context.evaluation_date as string }),
            ...(context.request_id === undefined
              ? {}
              : { request_id: context.request_id as string }),
            ...(context.policy_version === undefined
              ? {}
              : { policy_version: context.policy_version as string }),
          },
        }),
  };
}

function homeCareStatus(
  facts: EligibilityCheckRequest["facts"],
): EligibilityCheckResponse["status"] {
  const disabilityRate = toNumber(facts.care_recipient_disability_rate);
  const householdIncome = toNumber(facts.household_total_income);
  const householdSize = toNumber(facts.household_size);
  const isTurkishCitizen = toBoolean(facts.is_turkish_citizen);
  const isResidentInTr = toBoolean(facts.is_resident_in_tr);
  const dependency = typeof facts.care_dependency_status === "string" ? facts.care_dependency_status : null;
  const boardConfirmed = toBoolean(facts.care_need_confirmed_by_board);
  const caregiverSameResidence = toBoolean(facts.caregiver_same_residence);
  const hasAdditionalIncomeOrAssets = toBoolean(facts.has_additional_income_or_assets);

  if (
    disabilityRate === null ||
    householdIncome === null ||
    householdSize === null ||
    isTurkishCitizen === null ||
    isResidentInTr === null ||
    dependency === null ||
    boardConfirmed === null ||
    caregiverSameResidence === null ||
    hasAdditionalIncomeOrAssets === null
  ) {
    return "NEEDS_INFO";
  }

  if (isTurkishCitizen === false || isResidentInTr === false) {
    return "NOT_ELIGIBLE";
  }

  if (disabilityRate < 50) {
    return "NOT_ELIGIBLE";
  }

  if (dependency !== "full_dependency") {
    return "NOT_ELIGIBLE";
  }

  if (!boardConfirmed || !caregiverSameResidence || hasAdditionalIncomeOrAssets) {
    return "NOT_ELIGIBLE";
  }

  return householdIncome / Math.max(1, householdSize) <= 7000 ? "ELIGIBLE" : "NOT_ELIGIBLE";
}

function buildHomeCare(
  payload: EligibilityCheckRequest,
): EligibilityCheckResponse {
  const facts = payload.facts ?? {};
  const requestId = payload.context?.request_id;
  const currentStatus = homeCareStatus(facts);
  const resultId = decisionId(payload.benefit_code, requestId);
  const householdIncome = toNumber(facts.household_total_income);
  const householdSize = toNumber(facts.household_size);
  const perCapitaIncome =
    householdIncome !== null && householdSize !== null
      ? Number((householdIncome / Math.max(1, householdSize)).toFixed(2))
      : null;

  return {
    decision_id: resultId,
    request_id: requestId?.trim() || resultId,
    status: currentStatus,
    benefit_id: payload.benefit_code,
    reasons: buildHomeCareReasons(facts, currentStatus, perCapitaIncome),
    missing_facts: currentStatus === "NEEDS_INFO" ? buildHomeCareMissingFacts(facts) : [],
    rule_results: buildHomeCareRules(facts, currentStatus, perCapitaIncome),
    metadata: metadata({
      benefitCode: payload.benefit_code,
      visibleTestName: "Evde bakım maaşı",
      benefitFamily: "home-care",
      requiresIncomeTest: true,
      applicationState: currentStatus === "ELIGIBLE" ? "ready" : "needs_review",
      primaryChannel: "e-Devlet",
      description:
        currentStatus === "ELIGIBLE"
          ? "Başvuru kanalı açık görünüyor. Resmî başvuru öncesinde belgeleri gözden geçirin."
          : "Eksik ya da kritik bilgileri tamamladıktan sonra yeniden değerlendirme alın.",
    }),
    user_message:
      currentStatus === "ELIGIBLE"
        ? "Mevcut bilgilerle evde bakım maaşı için olumlu bir ön değerlendirme görünüyor."
        : currentStatus === "NEEDS_INFO"
          ? "Sonuç için bazı alanların tamamlanması gerekiyor."
          : "Mevcut bilgilerle evde bakım maaşı için olumsuz bir ön değerlendirme oluştu.",
    disclaimer:
      "Bu sonuç yerel ön değerlendirme motoru tarafından üretildi; resmî kurum kararı yerine geçmez.",
    guidance_items: guidanceItems(payload.benefit_code),
    benefit_details: null,
  };
}

function buildHomeCareReasons(
  facts: EligibilityCheckRequest["facts"],
  status: EligibilityCheckResponse["status"],
  perCapitaIncome: number | null,
): DecisionReason[] {
  const disabilityRate = toNumber(facts.care_recipient_disability_rate);
  const isTurkishCitizen = toBoolean(facts.is_turkish_citizen);
  const isResidentInTr = toBoolean(facts.is_resident_in_tr);
  const dependency = typeof facts.care_dependency_status === "string" ? facts.care_dependency_status : null;
  const boardConfirmed = toBoolean(facts.care_need_confirmed_by_board);
  const caregiverSameResidence = toBoolean(facts.caregiver_same_residence);
  const hasAdditionalIncomeOrAssets = toBoolean(facts.has_additional_income_or_assets);

  if (status === "NEEDS_INFO") {
    return [reason("household_information_missing", "Hane, gelir veya bakım bilgileri eksik.", "WARNING")];
  }

  if (isTurkishCitizen === false) {
    return [reason("citizen_requirement_not_met", "Vatandaşlık bilgisi bu ön değerlendirmede uygun görünmüyor.", "ERROR")];
  }

  if (isResidentInTr === false) {
    return [reason("resident_requirement_not_met", "İkamet bilgisi bu ön değerlendirmede uygun görünmüyor.", "ERROR")];
  }

  if (disabilityRate !== null && disabilityRate < 50) {
    return [reason("disability_rate_below_threshold", "Sağlık raporu oranı evde bakım maaşı için yeterli görünmüyor.", "ERROR", disabilityRate, 50)];
  }

  if (dependency !== "full_dependency") {
    return [reason("care_dependency_not_full", "Tam bağımlılık durumu doğrulanmadığı için sonuç olumsuz görünüyor.", "ERROR")];
  }

  if (!boardConfirmed) {
    return [reason("care_need_not_confirmed_by_board", "Heyet bakım ihtiyacını doğrulamıyor.", "ERROR")];
  }

  if (!caregiverSameResidence) {
    return [reason("caregiver_residence_mismatch", "Bakım verenle aynı evde yaşama koşulu sağlanmıyor.", "ERROR")];
  }

  if (hasAdditionalIncomeOrAssets) {
    return [reason("income_or_assets_exceed_limit", "Ek gelir veya varlık bilgisi sonucu olumsuz etkiliyor.", "ERROR")];
  }

  if (perCapitaIncome !== null && perCapitaIncome > 7000) {
    return [reason("income_threshold_exceeded", "Kişi başı gelir eşik üstünde görünüyor.", "ERROR", perCapitaIncome, 7000)];
  }

  return [
    reason("disability_rate_requirement_met", "Engellilik oranı temel koşulu karşılanıyor.", "INFO"),
    reason("income_threshold_within_limit", "Gelir bilgisi eşik altında görünüyor.", "INFO"),
  ];
}

function buildHomeCareMissingFacts(
  facts: EligibilityCheckRequest["facts"],
): MissingFact[] {
  const items: MissingFact[] = [];

  if (toNumber(facts.care_recipient_disability_rate) === null) {
    items.push(missingFact("care_recipient_disability_rate", "Sağlık raporundaki oranı girin.", "health"));
  }

  if (toNumber(facts.household_total_income) === null) {
    items.push(missingFact("household_total_income", "Toplam hane gelirini girin.", "income"));
  }

  if (toNumber(facts.household_size) === null) {
    items.push(missingFact("household_size", "Hanedeki kişi sayısını girin.", "household"));
  }

  if (toBoolean(facts.is_turkish_citizen) === null) {
    items.push(missingFact("is_turkish_citizen", "Vatandaşlık durumunu seçin.", "citizenship"));
  }

  if (toBoolean(facts.is_resident_in_tr) === null) {
    items.push(missingFact("is_resident_in_tr", "İkamet durumunu seçin.", "residency"));
  }

  if (typeof facts.care_dependency_status !== "string") {
    items.push(missingFact("care_dependency_status", "Tam bağımlılık durumunu seçin.", "health"));
  }

  if (toBoolean(facts.care_need_confirmed_by_board) === null) {
    items.push(missingFact("care_need_confirmed_by_board", "Heyet teyidi bilgisini girin.", "health"));
  }

  if (toBoolean(facts.caregiver_same_residence) === null) {
    items.push(missingFact("caregiver_same_residence", "Bakım verenle aynı evde yaşama durumunu seçin.", "household"));
  }

  if (toBoolean(facts.has_additional_income_or_assets) === null) {
    items.push(missingFact("has_additional_income_or_assets", "Ek gelir veya varlık etkisi bilgisini seçin.", "income"));
  }

  return items;
}

function buildHomeCareRules(
  facts: EligibilityCheckRequest["facts"],
  status: EligibilityCheckResponse["status"],
  perCapitaIncome: number | null,
): Record<string, RuleResult> {
  return {
    disability_rate: rule(
      "disability_rate",
      status !== "NEEDS_INFO" && (toNumber(facts.care_recipient_disability_rate) ?? 0) >= 50,
      "Evde bakım maaşı için sağlık raporu oranı en az %50 olmalıdır.",
      toNumber(facts.care_recipient_disability_rate),
      50,
    ),
    income_threshold: rule(
      "income_threshold",
      status !== "NEEDS_INFO" && (perCapitaIncome ?? Number.POSITIVE_INFINITY) <= 7000,
      "Kişi başı gelir eşik altında olmalıdır.",
      perCapitaIncome,
      7000,
    ),
  };
}

function gssStatus(facts: EligibilityCheckRequest["facts"]): EligibilityCheckResponse["status"] {
  const grossHouseholdIncome = toNumber(facts.gross_household_income);
  const householdSize = toNumber(facts.household_size);
  const hasSocialSecurity = toBoolean(facts.has_social_security);
  const hasActiveInsurance = toBoolean(facts.has_active_insurance);
  const isCoveredAsDependent = toBoolean(facts.is_covered_as_dependent);

  if (
    grossHouseholdIncome === null ||
    householdSize === null ||
    hasSocialSecurity === null ||
    hasActiveInsurance === null ||
    isCoveredAsDependent === null
  ) {
    return "NEEDS_INFO";
  }

  if (hasActiveInsurance || hasSocialSecurity || isCoveredAsDependent) {
    return "NOT_ELIGIBLE";
  }

  return grossHouseholdIncome / Math.max(1, householdSize) <= GSS_THRESHOLD
    ? "ELIGIBLE"
    : "NOT_ELIGIBLE";
}

function buildGss(
  payload: EligibilityCheckRequest,
): EligibilityCheckResponse {
  const facts = payload.facts ?? {};
  const requestId = payload.context?.request_id;
  const currentStatus = gssStatus(facts);
  const grossHouseholdIncome = toNumber(facts.gross_household_income);
  const householdSize = toNumber(facts.household_size);
  const perCapitaIncome =
    grossHouseholdIncome !== null && householdSize !== null
      ? Number((grossHouseholdIncome / Math.max(1, householdSize)).toFixed(2))
      : null;
  const resultId = decisionId(payload.benefit_code, requestId);

  return {
    decision_id: resultId,
    request_id: requestId?.trim() || resultId,
    status: currentStatus,
    benefit_id: payload.benefit_code,
    reasons: buildGssReasons(facts, currentStatus, perCapitaIncome),
    missing_facts: currentStatus === "NEEDS_INFO" ? buildGssMissingFacts(facts) : [],
    rule_results: buildGssRules(facts, currentStatus, perCapitaIncome),
    metadata: metadata({
      benefitCode: payload.benefit_code,
      visibleTestName: "GSS gelir testi",
      benefitFamily: "gss",
      requiresIncomeTest: true,
      applicationState: currentStatus === "ELIGIBLE" ? "ready" : "needs_review",
      primaryChannel: "Sosyal Güvenlik Kurumu",
      description:
        currentStatus === "ELIGIBLE"
          ? "Gelir durumu uygun görünüyor. Resmî başvuru öncesi sosyal güvence bilgilerini doğrulayın."
          : "Sosyal güvence veya gelir bilgisi eksik ya da uyumsuz görünüyor.",
    }),
    user_message:
      currentStatus === "ELIGIBLE"
        ? "Mevcut bilgilerle GSS gelir testi için olumlu bir ön değerlendirme görünüyor."
        : currentStatus === "NEEDS_INFO"
          ? "GSS gelir testi için bazı alanlar eksik."
          : "Mevcut bilgilerle GSS gelir testi için olumsuz bir ön değerlendirme oluştu.",
    disclaimer:
      "Bu sonuç yerel ön değerlendirme motoru tarafından üretildi; resmî kurum kararı yerine geçmez.",
    guidance_items: guidanceItems(payload.benefit_code),
    benefit_details: null,
  };
}

function buildGssReasons(
  facts: EligibilityCheckRequest["facts"],
  status: EligibilityCheckResponse["status"],
  perCapitaIncome: number | null,
): DecisionReason[] {
  const hasSocialSecurity = toBoolean(facts.has_social_security);
  const hasActiveInsurance = toBoolean(facts.has_active_insurance);
  const isCoveredAsDependent = toBoolean(facts.is_covered_as_dependent);

  if (status === "NEEDS_INFO") {
    return [reason("household_information_missing", "Hane gelir veya kişi sayısı eksik.", "WARNING")];
  }

  if (hasActiveInsurance) {
    return [reason("active_insurance_present", "Aktif sigorta bilgisi sonucu olumsuz etkiliyor.", "ERROR")];
  }

  if (hasSocialSecurity) {
    return [reason("social_security_present", "Sosyal güvence bilgisi sonucu olumsuz etkiliyor.", "ERROR")];
  }

  if (isCoveredAsDependent) {
    return [reason("dependent_coverage_present", "Bir yakın üzerinden kapsam bilgisi sonucu etkiliyor.", "ERROR")];
  }

  if (perCapitaIncome !== null && perCapitaIncome > GSS_THRESHOLD) {
    return [reason("income_threshold_exceeded", "Kişi başı gelir eşik üstünde görünüyor.", "ERROR", perCapitaIncome, GSS_THRESHOLD)];
  }

  return [
    reason("income_within_threshold", "Kişi başı gelir eşik altında görünüyor.", "INFO"),
    reason("coverage_status_clear", "Aktif sigorta veya bağımlılık bilgisi sonucu olumsuz etkilemiyor.", "INFO"),
  ];
}

function buildGssMissingFacts(
  facts: EligibilityCheckRequest["facts"],
): MissingFact[] {
  const items: MissingFact[] = [];

  if (toNumber(facts.gross_household_income) === null) {
    items.push(missingFact("gross_household_income", "Toplam hane gelirini girin.", "income"));
  }

  if (toNumber(facts.household_size) === null) {
    items.push(missingFact("household_size", "Hanedeki kişi sayısını girin.", "household"));
  }

  if (toBoolean(facts.has_social_security) === null) {
    items.push(missingFact("has_social_security", "Sosyal güvence durumunu seçin.", "security"));
  }

  if (toBoolean(facts.has_active_insurance) === null) {
    items.push(missingFact("has_active_insurance", "Aktif sigorta durumunu seçin.", "security"));
  }

  if (toBoolean(facts.is_covered_as_dependent) === null) {
    items.push(missingFact("is_covered_as_dependent", "Bir yakın üzerinden kapsam durumunu seçin.", "security"));
  }

  return items;
}

function buildGssRules(
  facts: EligibilityCheckRequest["facts"],
  status: EligibilityCheckResponse["status"],
  perCapitaIncome: number | null,
): Record<string, RuleResult> {
  return {
    active_insurance: rule(
      "active_insurance",
      status !== "NEEDS_INFO" && !toBoolean(facts.has_active_insurance),
      "Aktif sigorta varsa GSS gelir testi sonucu değişebilir.",
      toBoolean(facts.has_active_insurance),
    ),
    social_security: rule(
      "social_security",
      status !== "NEEDS_INFO" && !toBoolean(facts.has_social_security),
      "Sosyal güvence bilgisi sonucu etkileyebilir.",
      toBoolean(facts.has_social_security),
    ),
    per_capita_income: rule(
      "per_capita_income",
      status !== "NEEDS_INFO" && (perCapitaIncome ?? Number.POSITIVE_INFINITY) <= GSS_THRESHOLD,
      "Kişi başı gelir eşik altında olmalıdır.",
      perCapitaIncome,
      GSS_THRESHOLD,
    ),
  };
}

function oldAgeStatus(facts: EligibilityCheckRequest["facts"]): EligibilityCheckResponse["status"] {
  const age = toNumber(facts.age);
  const selfIncome = toNumber(facts.self_monthly_income);
  const spouseIncome = toNumber(facts.spouse_monthly_income);
  const hasSpouse = toBoolean(facts.has_spouse);
  const hasSocialSecurity = toBoolean(facts.has_social_security);
  const receivesPension = toBoolean(facts.receives_pension);

  if (
    age === null ||
    selfIncome === null ||
    hasSpouse === null ||
    hasSocialSecurity === null ||
    receivesPension === null ||
    (hasSpouse === true && spouseIncome === null)
  ) {
    return "NEEDS_INFO";
  }

  if (age < 65) {
    return "NOT_ELIGIBLE";
  }

  if (hasSocialSecurity || receivesPension) {
    return "NOT_ELIGIBLE";
  }

  const totalIncome = selfIncome + (hasSpouse ? spouseIncome ?? 0 : 0);
  return totalIncome > OLD_AGE_THRESHOLD ? "NOT_ELIGIBLE" : "ELIGIBLE";
}

function buildOldAge(
  payload: EligibilityCheckRequest,
): EligibilityCheckResponse {
  const facts = payload.facts ?? {};
  const requestId = payload.context?.request_id;
  const currentStatus = oldAgeStatus(facts);
  const resultId = decisionId(payload.benefit_code, requestId);

  return {
    decision_id: resultId,
    request_id: requestId?.trim() || resultId,
    status: currentStatus,
    benefit_id: payload.benefit_code,
    reasons: buildOldAgeReasons(facts, currentStatus),
    missing_facts: currentStatus === "NEEDS_INFO" ? buildOldAgeMissingFacts(facts) : [],
    rule_results: buildOldAgeRules(facts, currentStatus),
    metadata: metadata({
      benefitCode: payload.benefit_code,
      visibleTestName: "65 yaş aylığı",
      benefitFamily: "old-age",
      requiresIncomeTest: true,
      applicationState: currentStatus === "ELIGIBLE" ? "ready" : "needs_review",
      primaryChannel: "e-Devlet",
      description:
        currentStatus === "ELIGIBLE"
          ? "Başvuru hazırlığı yapılabilir. Resmî kanal üzerinden güncel belge kontrolü yapın."
          : "Eksik bilgileri tamamladıktan sonra yeniden değerlendirme alın.",
    }),
    user_message:
      currentStatus === "ELIGIBLE"
        ? "Mevcut bilgilerle 65 yaş aylığı için olumlu bir ön değerlendirme görünüyor."
        : currentStatus === "NEEDS_INFO"
          ? "65 yaş aylığı değerlendirmesi için bazı alanlar eksik."
          : "Mevcut bilgilerle 65 yaş aylığı için olumsuz bir ön değerlendirme oluştu.",
    disclaimer:
      "Bu sonuç yerel ön değerlendirme motoru tarafından üretildi; resmî kurum kararı yerine geçmez.",
  };
}

function buildOldAgeReasons(
  facts: EligibilityCheckRequest["facts"],
  status: EligibilityCheckResponse["status"],
): DecisionReason[] {
  const age = toNumber(facts.age);
  const selfIncome = toNumber(facts.self_monthly_income);
  const spouseIncome = toNumber(facts.spouse_monthly_income);
  const hasSpouse = toBoolean(facts.has_spouse);
  const hasSocialSecurity = toBoolean(facts.has_social_security);
  const receivesPension = toBoolean(facts.receives_pension);
  const totalIncome = (selfIncome ?? 0) + (hasSpouse ? spouseIncome ?? 0 : 0);

  if (status === "NEEDS_INFO") {
    return [
      reason("age_or_income_missing", "Yaş veya gelir bilgisi eksik.", "WARNING"),
      reason("household_status_missing", "Eş durumu ya da sosyal güvence bilgisi tamamlanmalı.", "WARNING"),
    ];
  }

  if ((age ?? 0) < 65) {
    return [reason("age_below_threshold", "Yaş koşulu sağlanmıyor.", "ERROR", age, 65)];
  }

  if (hasSocialSecurity) {
    return [reason("social_security_present", "Sosyal güvence bilgisi sonucu olumsuz etkiliyor.", "ERROR")];
  }

  if (receivesPension) {
    return [reason("pension_already_received", "Hâlen emekli aylığı alındığı için sonuç olumsuz.", "ERROR")];
  }

  if (totalIncome > OLD_AGE_THRESHOLD) {
    return [reason("income_above_threshold", "Gelir bilgisi 65 yaş aylığı eşiğinin üstünde görünüyor.", "ERROR", totalIncome, OLD_AGE_THRESHOLD)];
  }

  return [
    reason("age_requirement_met", "Yaş koşulu karşılanıyor.", "INFO"),
    reason("income_within_limit", "Gelir bilgisi belirtilen eşiğin altında görünüyor.", "INFO"),
  ];
}

function buildOldAgeMissingFacts(
  facts: EligibilityCheckRequest["facts"],
): MissingFact[] {
  const items: MissingFact[] = [];

  if (toNumber(facts.age) === null) {
    items.push(missingFact("age", "Yaş bilgisini girin.", "identity"));
  }

  if (toNumber(facts.self_monthly_income) === null) {
    items.push(missingFact("self_monthly_income", "Aylık gelir bilgilerinizi girin.", "income"));
  }

  if (toBoolean(facts.has_spouse) === null) {
    items.push(missingFact("has_spouse", "Eş durumunu seçin.", "household"));
  }

  if (toBoolean(facts.has_social_security) === null) {
    items.push(missingFact("has_social_security", "Sosyal güvence durumunu seçin.", "security"));
  }

  if (toBoolean(facts.receives_pension) === null) {
    items.push(missingFact("receives_pension", "Emekli aylığı durumunu seçin.", "income"));
  }

  if (toBoolean(facts.has_spouse) === true && toNumber(facts.spouse_monthly_income) === null) {
    items.push(missingFact("spouse_monthly_income", "Eşiniz varsa aylık gelir bilgisini girin.", "income"));
  }

  return items;
}

function buildOldAgeRules(
  facts: EligibilityCheckRequest["facts"],
  status: EligibilityCheckResponse["status"],
): Record<string, RuleResult> {
  const age = toNumber(facts.age);
  const selfIncome = toNumber(facts.self_monthly_income);
  const spouseIncome = toNumber(facts.spouse_monthly_income);
  const hasSpouse = toBoolean(facts.has_spouse);
  const totalIncome = (selfIncome ?? 0) + (hasSpouse ? spouseIncome ?? 0 : 0);

  return {
    age_requirement: rule(
      "age_requirement",
      status !== "NEEDS_INFO" && (age ?? 0) >= 65,
      "65 yaş ve üzeri olması gerekir.",
      age,
      65,
    ),
    income_limit: rule(
      "income_limit",
      status !== "NEEDS_INFO" && totalIncome <= OLD_AGE_THRESHOLD,
      "Toplam aylık gelir eşik altında olmalıdır.",
      totalIncome,
      OLD_AGE_THRESHOLD,
    ),
  };
}

function buildBirthGrant(
  payload: EligibilityCheckRequest,
): EligibilityCheckResponse {
  const facts = payload.facts ?? {};
  const requestId = payload.context?.request_id;
  const currentStatus = birthGrantStatus(facts);
  const resultId = decisionId(payload.benefit_code, requestId);

  return {
    decision_id: resultId,
    request_id: requestId?.trim() || resultId,
    status: currentStatus,
    benefit_id: payload.benefit_code,
    reasons: buildBirthGrantReasons(facts, currentStatus),
    missing_facts: currentStatus === "NEEDS_INFO" ? buildBirthGrantMissingFacts(facts) : [],
    rule_results: buildBirthGrantRules(facts, currentStatus),
    metadata: metadata({
      benefitCode: payload.benefit_code,
      visibleTestName: "Doğum yardımı",
      benefitFamily: "birth-grant",
      requiresIncomeTest: false,
      applicationState: currentStatus === "ELIGIBLE" ? "ready" : "needs_review",
      primaryChannel: "e-Devlet",
      description:
        currentStatus === "ELIGIBLE"
          ? "Başvuru yolu açık görünüyor. Nüfus ve ikamet bilgilerini hazırlayabilirsiniz."
          : "Eksik bilgileri tamamladıktan sonra yeniden değerlendirme alın.",
    }),
    user_message:
      currentStatus === "ELIGIBLE"
        ? "Mevcut bilgilerle doğum yardımı için olumlu bir ön değerlendirme görünüyor."
        : currentStatus === "NEEDS_INFO"
          ? "Doğum yardımı değerlendirmesi için bazı alanlar eksik."
          : "Mevcut bilgilerle doğum yardımı için olumsuz bir ön değerlendirme oluştu.",
    disclaimer:
      "Bu sonuç yerel ön değerlendirme motoru tarafından üretildi; resmî kurum kararı yerine geçmez.",
    guidance_items: guidanceItems(payload.benefit_code),
    benefit_details: currentStatus === "ELIGIBLE" ? buildBirthGrantBenefitDetails(facts) : null,
  };
}

function birthGrantStatus(
  facts: EligibilityCheckRequest["facts"],
): EligibilityCheckResponse["status"] {
  const childIsLiveBirth = toBoolean(facts.child_is_live_birth);
  const childBirthDate = typeof facts.child_birth_date === "string" ? facts.child_birth_date.trim() : "";
  const childOrder = toNumber(facts.previous_live_children_count);
  const applicantIsTurkishCitizen = toBoolean(facts.applicant_is_turkish_citizen);
  const applicantResidesInTr = toBoolean(facts.applicant_resides_in_tr);
  const childResidesInTr = toBoolean(facts.child_resides_in_tr);
  const childIsKpsRegistered = toBoolean(facts.child_is_kps_registered);
  const childIsAlive = toBoolean(facts.child_is_alive);

  if (
    childIsLiveBirth === null ||
    applicantIsTurkishCitizen === null ||
    applicantResidesInTr === null ||
    childResidesInTr === null ||
    childIsKpsRegistered === null ||
    childIsAlive === null ||
    (childIsLiveBirth === true && !childBirthDate) ||
    childOrder === null
  ) {
    return "NEEDS_INFO";
  }

  if (!childIsLiveBirth) {
    return "NOT_ELIGIBLE";
  }

  if (isFutureDate(childBirthDate)) {
    return "NOT_ELIGIBLE";
  }

  if (!applicantIsTurkishCitizen || !applicantResidesInTr || !childResidesInTr) {
    return "NOT_ELIGIBLE";
  }

  if (!childIsKpsRegistered || !childIsAlive) {
    return "NOT_ELIGIBLE";
  }

  return "ELIGIBLE";
}

function buildBirthGrantReasons(
  facts: EligibilityCheckRequest["facts"],
  status: EligibilityCheckResponse["status"],
): DecisionReason[] {
  const childIsLiveBirth = toBoolean(facts.child_is_live_birth);
  const childBirthDate = typeof facts.child_birth_date === "string" ? facts.child_birth_date.trim() : "";
  const applicantIsTurkishCitizen = toBoolean(facts.applicant_is_turkish_citizen);
  const applicantResidesInTr = toBoolean(facts.applicant_resides_in_tr);
  const childResidesInTr = toBoolean(facts.child_resides_in_tr);
  const childIsKpsRegistered = toBoolean(facts.child_is_kps_registered);
  const childIsAlive = toBoolean(facts.child_is_alive);

  if (status === "NEEDS_INFO") {
    return [reason("birth_or_identity_info_missing", "Doğum ve kimlik bilgileri tamamlanmalı.", "WARNING")];
  }

  if (!childIsLiveBirth) {
    return [reason("LIVE_BIRTH_REQUIRED", "Canlı doğum bilgisi uygun değil.", "ERROR")];
  }

  if (isFutureDate(childBirthDate)) {
    return [reason("BIRTH_DATE_OUT_OF_RANGE", "Doğum tarihi bu ön değerlendirme için uygun değil.", "ERROR")];
  }

  if (!applicantIsTurkishCitizen) {
    return [reason("CITIZENSHIP_REQUIREMENT_NOT_MET", "Vatandaşlık bilgisi uygun değil.", "ERROR")];
  }

  if (!applicantResidesInTr || !childResidesInTr) {
    return [reason("RESIDENCY_REQUIREMENT_NOT_MET", "İkamet bilgisi uygun değil.", "ERROR")];
  }

  if (!childIsKpsRegistered) {
    return [reason("KPS_REGISTRATION_REQUIRED", "KPS kaydı tamamlanmamış görünüyor.", "ERROR")];
  }

  if (!childIsAlive) {
    return [reason("CHILD_STATUS_NOT_ELIGIBLE", "Çocuğun mevcut durumu bu sonuçla uyumlu değil.", "ERROR")];
  }

  return [
    reason("live_birth_confirmed", "Canlı doğum bilgisi doğrulanıyor.", "INFO"),
    reason("residency_and_registration_met", "İkamet ve kayıt bilgileri uygun görünüyor.", "INFO"),
  ];
}

function buildBirthGrantMissingFacts(
  facts: EligibilityCheckRequest["facts"],
): MissingFact[] {
  const items: MissingFact[] = [];

  if (toBoolean(facts.child_is_live_birth) === null) {
    items.push(missingFact("child_is_live_birth", "Canlı doğum durumunu seçin.", "identity"));
  }

  if (typeof facts.child_birth_date !== "string" || !facts.child_birth_date.trim()) {
    items.push(missingFact("child_birth_date", "Doğum tarihini girin.", "identity"));
  }

  if (toNumber(facts.previous_live_children_count) === null) {
    items.push(missingFact("previous_live_children_count", "Çocuk sırasını seçin.", "household"));
  }

  if (toBoolean(facts.applicant_is_turkish_citizen) === null) {
    items.push(missingFact("applicant_is_turkish_citizen", "Vatandaşlık bilgisini seçin.", "citizenship"));
  }

  if (toBoolean(facts.applicant_resides_in_tr) === null) {
    items.push(missingFact("applicant_resides_in_tr", "Başvuru sahibinin ikamet durumunu seçin.", "residency"));
  }

  if (toBoolean(facts.child_resides_in_tr) === null) {
    items.push(missingFact("child_resides_in_tr", "Çocuğun ikamet durumunu seçin.", "residency"));
  }

  if (toBoolean(facts.child_is_kps_registered) === null) {
    items.push(missingFact("child_is_kps_registered", "KPS kaydı durumunu seçin.", "identity"));
  }

  if (toBoolean(facts.child_is_alive) === null) {
    items.push(missingFact("child_is_alive", "Çocuğun mevcut durumunu seçin.", "identity"));
  }

  return items;
}

function buildBirthGrantRules(
  facts: EligibilityCheckRequest["facts"],
  status: EligibilityCheckResponse["status"],
): Record<string, RuleResult> {
  const childIsLiveBirth = toBoolean(facts.child_is_live_birth);
  const childBirthDate = typeof facts.child_birth_date === "string" ? facts.child_birth_date.trim() : "";
  const childIsKpsRegistered = toBoolean(facts.child_is_kps_registered);
  const childIsAlive = toBoolean(facts.child_is_alive);

  return {
    live_birth: rule(
      "live_birth",
      status !== "NEEDS_INFO" && Boolean(childIsLiveBirth),
      "Canlı doğum bilgisi doğrulanmalıdır.",
      childIsLiveBirth,
    ),
    birth_date: rule(
      "birth_date",
      status !== "NEEDS_INFO" && !isFutureDate(childBirthDate),
      "Doğum tarihi gelecekte olmamalıdır.",
      childBirthDate || null,
      null,
    ),
    kps_registration: rule(
      "kps_registration",
      status !== "NEEDS_INFO" && Boolean(childIsKpsRegistered),
      "KPS kaydı tamamlanmış görünmelidir.",
      childIsKpsRegistered,
    ),
    child_status: rule(
      "child_status",
      status !== "NEEDS_INFO" && Boolean(childIsAlive),
      "Başvuru anında çocuk sağ olmalıdır.",
      childIsAlive,
    ),
  };
}

function buildBirthGrantBenefitDetails(
  facts: EligibilityCheckRequest["facts"],
): BirthGrantBenefitDetails {
  const childOrder = Math.max(1, Math.floor(toNumber(facts.previous_live_children_count) ?? 0) + 1);
  const paymentAmount = childOrder === 1 ? 5000 : childOrder === 2 ? 5500 : 6000;

  return {
    child_order: childOrder,
    payment_type: "ONE_TIME",
    payment_amount: paymentAmount,
    total_estimated_amount: paymentAmount,
    remaining_months: 1,
    calculation_profile: `local_birth_grant_child_${childOrder}`,
  };
}

function buildIncomeEvaluation(
  payload: IncomeEvaluationRequest,
): IncomeEvaluationResponse {
  const householdSize = toNumber(payload.household_size);
  const totalIncome = toNumber(payload.total_income);

  if (householdSize === null || totalIncome === null || householdSize <= 0) {
    return {
      status: "NEEDS_INFO",
      message: "Gelir değerlendirmesi için hane kişi sayısı ve toplam gelir gerekir.",
      reasons: [reason("household_information_missing", "Hane bilgileri tamamlanmalı.", "WARNING")],
      ui_hints: {
        guidance_text: "Hanedeki kişi sayısını ve toplam geliri tamamladıktan sonra sonucu yeniden alın.",
        next_steps: [
          "Hanedeki kişi sayısını girin.",
          "Toplam aylık geliri girin.",
          "Sonra değerlendirmeyi yeniden çalıştırın.",
        ],
      },
      decision: "needs_info",
      rule_trace: {
        household_size: { message: "Hanedeki kişi sayısı eksik ya da geçersiz.", passed: false },
        total_income: { message: "Toplam gelir eksik ya da geçersiz.", passed: false },
      },
      eligible_benefits: [
        {
          name: "Gelir değerlendirmesi",
          reason: "Bilgiler tamamlandığında uygunluk daha net görülebilir.",
          confidence: "low",
          priority: 1,
          next_step_details: { description: "Hane büyüklüğünü ve toplam geliri tamamlayın." },
        },
      ],
      routing_context: { source: "local-fallback" },
    };
  }

  const perCapitaIncome = Number((totalIncome / householdSize).toFixed(2));
  const eligible = perCapitaIncome <= GSS_THRESHOLD;

  return {
    status: eligible ? "ELIGIBLE" : "NOT_ELIGIBLE",
    message: eligible
      ? "Kişi başı gelir eşik altında görünüyor."
      : "Kişi başı gelir eşik üstünde görünüyor.",
    per_capita_income: perCapitaIncome,
    threshold: GSS_THRESHOLD,
    reasons: [
      reason(
        eligible ? "income_within_threshold" : "income_above_threshold",
        eligible
          ? "Kişi başı gelir ön değerlendirme eşiğinin altında."
          : "Kişi başı gelir ön değerlendirme eşiğinin üstünde.",
        eligible ? "INFO" : "ERROR",
      ),
    ],
    ui_hints: {
      guidance_text: eligible
        ? "Gelir durumu olumlu görünüyor. Sonraki adım için rehber ve başvuru notlarını inceleyin."
        : "Gelir durumu sonucu etkiliyor. Hane bilgilerini yeniden kontrol edin.",
      next_steps: eligible
        ? ["Rehber sayfasını açın.", "Başvuru öncesi belgeleri hazırlayın."]
        : ["Hanedeki kişi sayısını doğrulayın.", "Toplam geliri yeniden kontrol edin."],
    },
    decision: eligible ? "eligible" : "not_eligible",
    rule_trace: {
      household_size: {
        message: `Hanedeki kişi sayısı ${householdSize}.`,
        passed: true,
      },
      total_income: {
        message: `Toplam gelir ${Math.round(totalIncome).toLocaleString("tr-TR")} TL.`,
        passed: true,
      },
      per_capita_income: {
        message: `Kişi başı gelir ${perCapitaIncome.toLocaleString("tr-TR")} TL olarak hesaplandı.`,
        passed: eligible,
      },
      threshold: {
        message: `Kullanılan eşik ${GSS_THRESHOLD.toLocaleString("tr-TR")} TL.`,
        passed: true,
      },
    },
    eligible_benefits: [
      {
        name: "Gelir testi özeti",
        reason: eligible
          ? "Mevcut bilgilerle kişi başı gelir eşik altında."
          : "Gelir dağılımı eşik üstünde görünüyor.",
        confidence: eligible ? "high" : "medium",
        priority: 1,
        next_step_details: {
          description: eligible
            ? "Başvuru öncesi belgeleri hazırlayabilirsiniz."
            : "Hane bilgilerini doğrulayıp testi yeniden çalıştırın.",
        },
      },
    ],
    routing_context: { source: "local-fallback" },
  };
}

function buildLeadResponse(): LeadCreateResponse {
  return {
    message: "Talebiniz alındı. En kısa sürede sizinle iletişime geçilecektir.",
  };
}

function isFutureDate(value: string): boolean {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return true;
  }

  return parsed > Date.now();
}

export function buildLocalApiPayload(
  routeSegments: string[],
  payload: unknown,
): LocalApiResponse | null {
  const routeKey = routeSegments.join("/");

  if (routeKey === "v1/eligibility-check") {
    const request = normalizeEligibilityCheckRequest(payload);
    if (!request) {
      return invalidEligibilityRequestResponse();
    }

    switch (request.benefit_code) {
      case "TR_HOME_CARE_ALLOWANCE":
        return buildHomeCare(request);
      case "TR_OLD_AGE_PENSION":
        return buildOldAge(request);
      case "TR_BIRTH_GRANT":
        return buildBirthGrant(request);
      case "TR_GSS":
      default:
        return buildGss(request);
    }
  }

  if (routeKey === "evaluate/income") {
    if (!isRecord(payload)) {
      return missingResponse(routeKey);
    }

    return buildIncomeEvaluation(payload as IncomeEvaluationRequest);
  }

  if (routeKey === "lead") {
    return buildLeadResponse();
  }

  return missingResponse(routeKey);
}

export const resolveLocalApiFallback = buildLocalApiPayload;
