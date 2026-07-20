import {
  buildUnavailableRightsGuidanceExplanation,
  type RightsGuidanceRenderModel,
} from "./rights-guidance.ts";

const endpoint = "/api/build-week/rights-guidance";
const reasonEvidenceId = "EVIDENCE_SYNTHETIC_GSS_REASON";
const nextStepEvidenceId = "SOURCE_SYNTHETIC_GSS_CHANNEL";

type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return (
    actual.length === sortedExpected.length &&
    actual.every((key, index) => key === sortedExpected[index])
  );
}

function parseExplanation(
  value: unknown,
  expectedEvidenceId: string,
): { evidenceId: string; plainLanguageText: string } | null {
  if (!Array.isArray(value) || value.length !== 1 || !isRecord(value[0])) return null;
  const item = value[0];
  if (
    !hasExactKeys(item, ["evidenceId", "plainLanguageText"]) ||
    item.evidenceId !== expectedEvidenceId ||
    typeof item.plainLanguageText !== "string" ||
    item.plainLanguageText.trim().length === 0 ||
    item.plainLanguageText.length > 500
  ) {
    return null;
  }
  return {
    evidenceId: item.evidenceId,
    plainLanguageText: item.plainLanguageText,
  };
}

export function parseBuildWeekGuidanceResponse(value: unknown): RightsGuidanceRenderModel {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      "overallStatus",
      "reasonExplanations",
      "nextStepExplanations",
    ])
  ) {
    return buildUnavailableRightsGuidanceExplanation();
  }
  if (
    value.overallStatus === "UNAVAILABLE" &&
    Array.isArray(value.reasonExplanations) &&
    value.reasonExplanations.length === 0 &&
    Array.isArray(value.nextStepExplanations) &&
    value.nextStepExplanations.length === 0
  ) {
    return buildUnavailableRightsGuidanceExplanation();
  }
  if (value.overallStatus !== "EXPLANATION_AVAILABLE") {
    return buildUnavailableRightsGuidanceExplanation();
  }
  const reason = parseExplanation(value.reasonExplanations, reasonEvidenceId);
  const nextStep = parseExplanation(value.nextStepExplanations, nextStepEvidenceId);
  if (!reason || !nextStep) return buildUnavailableRightsGuidanceExplanation();
  return {
    overallStatus: "EXPLANATION_AVAILABLE",
    reasonExplanations: [reason],
    nextStepExplanations: [nextStep],
  };
}

export async function requestSyntheticBuildWeekGuidance(
  clientNonce: string,
  fetchImplementation: FetchLike = fetch,
): Promise<RightsGuidanceRenderModel> {
  try {
    const response = await fetchImplementation(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario: "GSS_SYNTHETIC_ELIGIBLE",
        clientNonce,
      }),
    });
    if (!response.ok) return buildUnavailableRightsGuidanceExplanation();
    return parseBuildWeekGuidanceResponse(await response.json());
  } catch {
    return buildUnavailableRightsGuidanceExplanation();
  }
}
