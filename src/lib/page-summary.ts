const MAX_TITLE_LENGTH = 180;
const MAX_DESCRIPTION_LENGTH = 500;

function normalizeText(value: string | null | undefined, maxLength: number): string {
  return (value ?? "").replace(/\s+/gu, " ").trim().slice(0, maxLength);
}

export type AccessiblePageSummary = {
  title: string;
  description: string;
  speechText: string;
};

export function buildAccessiblePageSummary(input: {
  title?: string | null;
  description?: string | null;
}): AccessiblePageSummary | null {
  const title = normalizeText(input.title, MAX_TITLE_LENGTH);
  const description = normalizeText(input.description, MAX_DESCRIPTION_LENGTH);

  if (!title && !description) return null;

  return {
    title: title || "Sayfa özeti",
    description: description || "Bu sayfanın kısa açıklaması henüz yayımlanmamıştır.",
    speechText: [title, description].filter(Boolean).join(". "),
  };
}
