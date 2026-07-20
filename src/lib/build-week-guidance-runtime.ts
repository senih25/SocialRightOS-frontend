import { createHmac } from "node:crypto";
import { Pool } from "pg";
import {
  OpenAIRightsGuidanceProvider,
  BudgetedRightsGuidanceLiveProvider,
} from "./openai-rights-guidance.ts";
import {
  PostgresRightsGuidanceBudgetStore,
  PostgresRightsGuidanceRequestGuard,
  type RightsGuidancePostgresQuery,
} from "./postgres-rights-guidance-store.ts";
import { buildTokenUsageCostCalculator } from "./rights-guidance-budget.ts";
import { generateRequestGuardedRightsGuidanceExplanation } from "./rights-guidance-request-guard.ts";
import {
  buildRightsGuidanceInput,
  buildUnavailableRightsGuidanceExplanation,
  type RightsGuidanceApprovedCatalog,
} from "./rights-guidance.ts";
import type {
  BuildWeekGuidanceRequest,
  BuildWeekGuidanceService,
} from "./build-week-guidance-route.ts";

type RuntimeEnvironment = Record<string, string | undefined>;

export type BuildWeekGuidanceRuntimeConfig =
  | { enabled: false }
  | {
      enabled: true;
      apiKey: string;
      databaseUrl: string;
      hmacSecret: string;
      hardLimitMicros: number;
      maximumRequestCostMicros: number;
      inputMicrosPerMillionTokens: number;
      outputMicrosPerMillionTokens: number;
      maximumAttemptsPerClient: number;
      requestWindowMs: number;
    };

const catalog: RightsGuidanceApprovedCatalog = {
  assessmentType: "GSS_PRELIMINARY_GUIDANCE",
  reasons: [
    {
      evidenceId: "EVIDENCE_SYNTHETIC_GSS_REASON",
      approvedText: "Sentetik senaryoda ön koşul sağlanmış görünüyor.",
    },
  ],
  nextSteps: [
    {
      evidenceId: "SOURCE_SYNTHETIC_GSS_CHANNEL",
      approvedText: "Güncel adımı sentetik resmî kanal kaydından doğrulayın.",
    },
  ],
  limitations: ["Bu kayıt yalnız sentetik yarışma doğrulaması içindir."],
};

const selection = {
  assessmentType: "GSS_PRELIMINARY_GUIDANCE",
  coarseDisplayStatus: "CONDITION_APPEARS_SATISFIED",
  reasonEvidenceIds: ["EVIDENCE_SYNTHETIC_GSS_REASON"],
  nextStepEvidenceIds: ["SOURCE_SYNTHETIC_GSS_CHANNEL"],
  validAsOf: "2026-07-20",
  basisVersion: "build-week-synthetic-v1",
} as const;

function readPositiveInteger(environment: RuntimeEnvironment, name: string): number {
  const value = Number(environment[name]);
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error("Invalid guidance configuration");
  return value;
}

function readRequired(environment: RuntimeEnvironment, name: string): string {
  const value = environment[name]?.trim();
  if (!value) throw new Error("Invalid guidance configuration");
  return value;
}

export function readBuildWeekGuidanceRuntimeConfig(
  environment: RuntimeEnvironment,
): BuildWeekGuidanceRuntimeConfig {
  if (environment.AI_GUIDANCE_ENABLED !== "true") return { enabled: false };
  if (environment.AI_GUIDANCE_MODEL !== "gpt-5.6-luna") {
    throw new Error("Invalid guidance configuration");
  }
  const hmacSecret = readRequired(environment, "AI_GUIDANCE_HMAC_SECRET");
  if (hmacSecret.length < 32) throw new Error("Invalid guidance configuration");
  const databaseUrl = readRequired(environment, "DATABASE_URL");
  const protocol = new URL(databaseUrl).protocol;
  if (protocol !== "postgres:" && protocol !== "postgresql:") {
    throw new Error("Invalid guidance configuration");
  }
  const hardLimitMicros = readPositiveInteger(environment, "AI_GUIDANCE_HARD_LIMIT_MICROS");
  const maximumRequestCostMicros = readPositiveInteger(
    environment,
    "AI_GUIDANCE_MAX_REQUEST_COST_MICROS",
  );
  if (maximumRequestCostMicros > hardLimitMicros) {
    throw new Error("Invalid guidance configuration");
  }
  return {
    enabled: true,
    apiKey: readRequired(environment, "OPENAI_API_KEY"),
    databaseUrl,
    hmacSecret,
    hardLimitMicros,
    maximumRequestCostMicros,
    inputMicrosPerMillionTokens: readPositiveInteger(
      environment,
      "AI_GUIDANCE_INPUT_USD_MICROS_PER_MILLION_TOKENS",
    ),
    outputMicrosPerMillionTokens: readPositiveInteger(
      environment,
      "AI_GUIDANCE_OUTPUT_USD_MICROS_PER_MILLION_TOKENS",
    ),
    maximumAttemptsPerClient: readPositiveInteger(
      environment,
      "AI_GUIDANCE_MAX_ATTEMPTS_PER_CLIENT",
    ),
    requestWindowMs: readPositiveInteger(environment, "AI_GUIDANCE_REQUEST_WINDOW_MS"),
  };
}

export function deriveBuildWeekGuidanceScope(
  request: BuildWeekGuidanceRequest,
  hmacSecret: string,
): { clientKeyHash: string; assessmentVersionKeyHash: string; safetyIdentifier: string } {
  if (hmacSecret.length < 32) throw new Error("Invalid guidance configuration");
  const sign = (value: string) =>
    createHmac("sha256", hmacSecret).update(value, "utf8").digest("hex");
  const clientKeyHash = sign(`client:${request.clientNonce}`);
  const assessmentVersionKeyHash = sign(
    `assessment:${request.scenario}:${request.clientNonce}:build-week-synthetic-v1`,
  );
  return {
    clientKeyHash,
    assessmentVersionKeyHash,
    safetyIdentifier: `rg_${clientKeyHash.slice(0, 32)}`,
  };
}

export function createBuildWeekGuidanceService(
  config: Extract<BuildWeekGuidanceRuntimeConfig, { enabled: true }>,
  query: RightsGuidancePostgresQuery,
  dependencies: {
    fetchImplementation?: typeof fetch;
  } = {},
): BuildWeekGuidanceService {
  const calculateCostMicros = buildTokenUsageCostCalculator({
    inputMicrosPerMillionTokens: config.inputMicrosPerMillionTokens,
    outputMicrosPerMillionTokens: config.outputMicrosPerMillionTokens,
  });
  const budgetStore = new PostgresRightsGuidanceBudgetStore({
    query,
    calculateCostMicros,
    hardLimitMicros: config.hardLimitMicros,
  });
  const requestGuard = new PostgresRightsGuidanceRequestGuard({
    query,
    maximumAttemptsPerClient: config.maximumAttemptsPerClient,
    windowMs: config.requestWindowMs,
  });

  return {
    async generate(request) {
      if (request.scenario !== "GSS_SYNTHETIC_ELIGIBLE") {
        return buildUnavailableRightsGuidanceExplanation();
      }
      const scope = deriveBuildWeekGuidanceScope(request, config.hmacSecret);
      const openAIProvider = new OpenAIRightsGuidanceProvider(config.apiKey, {
        safetyIdentifier: scope.safetyIdentifier,
        fetchImplementation: dependencies.fetchImplementation,
      });
      const provider = new BudgetedRightsGuidanceLiveProvider(
        openAIProvider,
        budgetStore,
        config.maximumRequestCostMicros,
        () => true,
      );
      return generateRequestGuardedRightsGuidanceExplanation(
        buildRightsGuidanceInput(selection, catalog),
        provider,
        { enabled: true, scope, requestGuard },
      );
    },
  };
}

let runtime:
  | { enabled: false }
  | { enabled: true; service: BuildWeekGuidanceService }
  | undefined;

export function getBuildWeekGuidanceRuntime(): {
  enabled: boolean;
  service?: BuildWeekGuidanceService;
} {
  if (runtime) return runtime;
  try {
    const config = readBuildWeekGuidanceRuntimeConfig(process.env);
    if (!config.enabled) {
      runtime = { enabled: false };
      return runtime;
    }
    const pool = new Pool({ connectionString: config.databaseUrl, max: 4 });
    pool.on("error", () => undefined);
    const query: RightsGuidancePostgresQuery = async <Row extends Record<string, unknown>>(
      text: string,
      values: readonly unknown[],
    ): Promise<{ rows: Row[] }> => {
      const result = await pool.query(text, [...values]);
      return { rows: result.rows as unknown as Row[] };
    };
    runtime = { enabled: true, service: createBuildWeekGuidanceService(config, query) };
    return runtime;
  } catch {
    runtime = { enabled: false };
    return runtime;
  }
}
