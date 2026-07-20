import {
  buildUnavailableRightsGuidanceExplanation,
  type RightsGuidanceRenderModel,
} from "./rights-guidance.ts";

export const buildWeekGuidanceScenarios = ["GSS_SYNTHETIC_ELIGIBLE"] as const;

export type BuildWeekGuidanceScenario =
  (typeof buildWeekGuidanceScenarios)[number];

export type BuildWeekGuidanceRequest = {
  scenario: BuildWeekGuidanceScenario;
  clientNonce: string;
};

export interface BuildWeekGuidanceService {
  generate(request: BuildWeekGuidanceRequest): Promise<RightsGuidanceRenderModel>;
}

const MAXIMUM_BODY_BYTES = 1_024;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
} as const;

function unavailable(status: number): Response {
  return new Response(
    JSON.stringify(buildUnavailableRightsGuidanceExplanation()),
    { status, headers: RESPONSE_HEADERS },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRequest(value: unknown): BuildWeekGuidanceRequest | null {
  if (!isRecord(value)) return null;
  const keys = Object.keys(value).sort();
  if (keys.length !== 2 || keys[0] !== "clientNonce" || keys[1] !== "scenario") {
    return null;
  }
  if (
    !buildWeekGuidanceScenarios.includes(value.scenario as BuildWeekGuidanceScenario) ||
    typeof value.clientNonce !== "string" ||
    !UUID_PATTERN.test(value.clientNonce)
  ) {
    return null;
  }
  return {
    scenario: value.scenario as BuildWeekGuidanceScenario,
    clientNonce: value.clientNonce.toLowerCase(),
  };
}

function copySafeRenderModel(value: RightsGuidanceRenderModel): RightsGuidanceRenderModel | null {
  if (value.overallStatus === "UNAVAILABLE") {
    return buildUnavailableRightsGuidanceExplanation();
  }
  const reasonExplanations = value.reasonExplanations.map((item) => ({
    evidenceId: item.evidenceId,
    plainLanguageText: item.plainLanguageText,
  }));
  const nextStepExplanations = value.nextStepExplanations.map((item) => ({
    evidenceId: item.evidenceId,
    plainLanguageText: item.plainLanguageText,
  }));
  if (
    reasonExplanations.length !== 1 ||
    reasonExplanations[0].evidenceId !== "EVIDENCE_SYNTHETIC_GSS_REASON" ||
    nextStepExplanations.length !== 1 ||
    nextStepExplanations[0].evidenceId !== "SOURCE_SYNTHETIC_GSS_CHANNEL" ||
    [...reasonExplanations, ...nextStepExplanations].some(
      (item) =>
        typeof item.plainLanguageText !== "string" ||
        item.plainLanguageText.trim().length === 0 ||
        item.plainLanguageText.length > 500,
    )
  ) {
    return null;
  }
  return {
    overallStatus: "EXPLANATION_AVAILABLE",
    reasonExplanations,
    nextStepExplanations,
  };
}

export async function handleBuildWeekGuidanceRequest(
  request: Request,
  options: { enabled: boolean; service?: BuildWeekGuidanceService },
): Promise<Response> {
  if (!options.enabled || !options.service) return unavailable(503);
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    return unavailable(415);
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (
    request.headers.has("content-length") &&
    (!Number.isSafeInteger(declaredLength) || declaredLength < 0 || declaredLength > MAXIMUM_BODY_BYTES)
  ) {
    return unavailable(413);
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return unavailable(400);
  }
  if (new TextEncoder().encode(body).byteLength > MAXIMUM_BODY_BYTES) {
    return unavailable(413);
  }
  let rawRequest: unknown;
  try {
    rawRequest = JSON.parse(body);
  } catch {
    return unavailable(400);
  }
  const parsed = parseRequest(rawRequest);
  if (!parsed) return unavailable(400);

  try {
    const result = copySafeRenderModel(await options.service.generate(parsed));
    if (!result || result.overallStatus === "UNAVAILABLE") return unavailable(503);
    return new Response(JSON.stringify(result), { status: 200, headers: RESPONSE_HEADERS });
  } catch {
    return unavailable(503);
  }
}
