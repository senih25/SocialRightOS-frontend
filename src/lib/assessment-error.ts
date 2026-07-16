import { ApiClientError } from "./api.ts";

export type AssessmentErrorKind = "VALIDATION" | "API" | "UNEXPECTED";

export type SafeFieldError = {
  field: string;
  label: string;
  message: string;
  descriptionId: string;
};

export type AssessmentErrorViewModel = {
  kind: AssessmentErrorKind;
  title: string;
  message: string;
  fieldErrors: SafeFieldError[];
};

const FIELD_LABELS: Record<string, string> = {
  age: "Yaşınız",
  grossHouseholdIncome: "Brüt toplam hane geliri",
  gross_household_income: "Brüt toplam hane geliri",
  householdSize: "Hanedeki kişi sayısı",
  household_size: "Hanedeki kişi sayısı",
  selfMonthlyIncome: "Aylık geliriniz",
  self_monthly_income: "Aylık geliriniz",
  spouseMonthlyIncome: "Eşinizin aylık geliri",
  spouse_monthly_income: "Eşinizin aylık geliri",
  hasSpouse: "Eş durumu",
  has_spouse: "Eş durumu",
  hasSocialSecurity: "Sosyal güvence durumu",
  has_social_security: "Sosyal güvence durumu",
  hasActiveInsurance: "Aktif sigorta durumu",
  has_active_insurance: "Aktif sigorta durumu",
  isCoveredAsDependent: "Yakın üzerinden sağlık kapsamı",
  is_covered_as_dependent: "Yakın üzerinden sağlık kapsamı",
  receivesPension: "Emekli aylığı durumu",
  receives_pension: "Emekli aylığı durumu",
};

export function fieldErrorDescriptionId(field: string): string {
  return `assessment-error-${field.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function safeFieldErrors(details?: Record<string, string[]>): SafeFieldError[] {
  if (!details) {
    return [];
  }

  return Object.keys(details)
    .filter((field) => field in FIELD_LABELS)
    .sort()
    .map((field) => ({
      field,
      label: FIELD_LABELS[field],
      message: "Bu alan için girilen bilgiyi kontrol edin.",
      descriptionId: fieldErrorDescriptionId(field),
    }));
}

export function buildAssessmentErrorViewModel(error: unknown): AssessmentErrorViewModel {
  if (error instanceof ApiClientError) {
    const fieldErrors = safeFieldErrors(error.details);
    if (error.status === 400 || error.status === 422 || fieldErrors.length > 0) {
      return {
        kind: "VALIDATION",
        title: "Bilgileri kontrol edin",
        message:
          fieldErrors.length > 0
            ? "Bazı bilgiler değerlendirilemedi. İşaretlenen alanları kontrol edip yeniden deneyin."
            : "Bazı bilgiler değerlendirilemedi. Girdiğiniz bilgileri kontrol edip yeniden deneyin.",
        fieldErrors,
      };
    }

    return {
      kind: "API",
      title: "İstek tamamlanamadı",
      message: "Değerlendirme sistemi şu anda yanıt veremiyor. Lütfen daha sonra tekrar deneyin.",
      fieldErrors: [],
    };
  }

  return {
    kind: "UNEXPECTED",
    title: "İstek tamamlanamadı",
    message: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    fieldErrors: [],
  };
}

export function findFieldError(
  model: AssessmentErrorViewModel | null,
  ...fieldNames: string[]
): SafeFieldError | null {
  if (!model) {
    return null;
  }

  return model.fieldErrors.find((item) => fieldNames.includes(item.field)) ?? null;
}
