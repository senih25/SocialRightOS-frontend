import type {
  RightsGuidanceAtomicBudgetStore,
  RightsGuidanceInput,
  RightsGuidanceProvider,
  RightsGuidanceProviderResult,
} from "./rights-guidance.ts";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-luna";
const DEFAULT_MAX_OUTPUT_TOKENS = 256;
const DEFAULT_TIMEOUT_MS = 15_000;

type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type OpenAIResponsePayload = {
  status?: unknown;
  model?: unknown;
  output?: unknown;
  usage?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertPositiveSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Invalid ${label}`);
  }
}

function evidenceArraySchema(evidenceIds: readonly string[]) {
  return {
    type: "array",
    minItems: evidenceIds.length,
    maxItems: evidenceIds.length,
    items: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidenceId: evidenceIds.length
          ? { type: "string", enum: [...evidenceIds] }
          : { type: "string" },
        plainLanguageText: { type: "string", minLength: 1, maxLength: 500 },
      },
      required: ["evidenceId", "plainLanguageText"],
    },
  };
}

function buildResponseSchema(input: RightsGuidanceInput) {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      reasonExplanations: evidenceArraySchema(
        input.approvedReasons.map((item) => item.evidenceId),
      ),
      nextStepExplanations: evidenceArraySchema(
        input.approvedNextSteps.map((item) => item.evidenceId),
      ),
    },
    required: ["reasonExplanations", "nextStepExplanations"],
  };
}

function buildProviderInput(input: RightsGuidanceInput): string {
  return JSON.stringify({
    approvedReasons: input.approvedReasons.map((item) => ({
      evidenceId: item.evidenceId,
      approvedText: item.approvedText,
    })),
    approvedNextSteps: input.approvedNextSteps.map((item) => ({
      evidenceId: item.evidenceId,
      approvedText: item.approvedText,
    })),
  });
}

function parseUsage(value: unknown): RightsGuidanceProviderResult["usage"] {
  if (!isRecord(value)) throw new Error("OpenAI usage unavailable");
  const inputTokens = value.input_tokens;
  const outputTokens = value.output_tokens;
  if (
    !Number.isSafeInteger(inputTokens) ||
    (inputTokens as number) < 0 ||
    !Number.isSafeInteger(outputTokens) ||
    (outputTokens as number) < 0
  ) {
    throw new Error("OpenAI usage unavailable");
  }
  return { inputTokens: inputTokens as number, outputTokens: outputTokens as number };
}

function parseOutputText(value: unknown): unknown {
  if (!Array.isArray(value)) throw new Error("OpenAI output unavailable");
  const content = value.flatMap((item) =>
    isRecord(item) && Array.isArray(item.content) ? item.content : [],
  );
  if (content.some((item) => isRecord(item) && item.type === "refusal")) {
    throw new Error("OpenAI output unavailable");
  }
  const outputTexts = content.filter(
    (item) => isRecord(item) && item.type === "output_text" && typeof item.text === "string",
  );
  if (outputTexts.length !== 1) throw new Error("OpenAI output unavailable");
  try {
    return JSON.parse(outputTexts[0].text as string);
  } catch {
    throw new Error("OpenAI output unavailable");
  }
}

export class OpenAIRightsGuidanceProvider implements RightsGuidanceProvider {
  readonly mode = "LIVE" as const;
  readonly #apiKey: string;
  private readonly model: string;
  private readonly maxOutputTokens: number;
  private readonly timeoutMs: number;
  private readonly fetchImplementation: FetchLike;

  constructor(
    apiKey: string,
    options: {
      model?: string;
      maxOutputTokens?: number;
      timeoutMs?: number;
      fetchImplementation?: FetchLike;
      safetyIdentifier?: string;
    } = {},
  ) {
    if (!apiKey.trim()) throw new Error("OpenAI API key is required");
    this.#apiKey = apiKey;
    this.model = options.model ?? DEFAULT_MODEL;
    if (this.model !== DEFAULT_MODEL) throw new Error("Unsupported guidance model");
    this.maxOutputTokens = options.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    assertPositiveSafeInteger(this.maxOutputTokens, "maximum output tokens");
    assertPositiveSafeInteger(this.timeoutMs, "OpenAI timeout");
    if (
      options.safetyIdentifier !== undefined &&
      !/^[A-Za-z0-9_-]{8,64}$/u.test(options.safetyIdentifier)
    ) {
      throw new Error("Invalid safety identifier");
    }
    this.safetyIdentifier = options.safetyIdentifier;
    this.fetchImplementation = options.fetchImplementation ?? fetch;
  }

  private readonly safetyIdentifier: string | undefined;

  async generate(input: RightsGuidanceInput): Promise<RightsGuidanceProviderResult> {
    if (typeof window !== "undefined") {
      throw new Error("Live guidance provider is server-only");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchImplementation(OPENAI_RESPONSES_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.#apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          store: false,
          max_output_tokens: this.maxOutputTokens,
          reasoning: { effort: "low" },
          instructions:
            "Yalnız verilen onaylı kanıt metinlerini sadeleştir. Kanıt kimliklerini ve anlamı koru. Yeni olgu, resmî uygunluk kararı, hak kararı, garanti, kesinlik veya yeni sonraki adım üretme.",
          input: buildProviderInput(input),
          text: {
            verbosity: "low",
            format: {
              type: "json_schema",
              name: "rights_guidance_explanation",
              strict: true,
              schema: buildResponseSchema(input),
            },
          },
          ...(this.safetyIdentifier
            ? { safety_identifier: this.safetyIdentifier }
            : {}),
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("OpenAI guidance unavailable");
      const payload = (await response.json()) as OpenAIResponsePayload;
      if (payload.status !== "completed" || payload.model !== this.model) {
        throw new Error("OpenAI guidance unavailable");
      }

      return {
        output: parseOutputText(payload.output),
        usage: parseUsage(payload.usage),
      };
    } catch {
      throw new Error("OpenAI guidance unavailable");
    } finally {
      clearTimeout(timeout);
    }
  }
}

export class BudgetedRightsGuidanceLiveProvider implements RightsGuidanceProvider {
  readonly mode = "LIVE" as const;
  readonly budgetGuarded = true as const;
  private readonly delegate: RightsGuidanceProvider;
  private readonly budgetStore: RightsGuidanceAtomicBudgetStore;
  private readonly maximumRequestCostMicros: number;
  private readonly isEnabled: () => boolean;

  constructor(
    delegate: RightsGuidanceProvider,
    budgetStore: RightsGuidanceAtomicBudgetStore,
    maximumRequestCostMicros: number,
    isEnabled: () => boolean,
  ) {
    if (delegate.mode !== "LIVE") throw new Error("Live provider required");
    assertPositiveSafeInteger(maximumRequestCostMicros, "request cost reservation");
    this.delegate = delegate;
    this.budgetStore = budgetStore;
    this.maximumRequestCostMicros = maximumRequestCostMicros;
    this.isEnabled = isEnabled;
  }

  async generate(input: RightsGuidanceInput): Promise<RightsGuidanceProviderResult> {
    if (!this.isEnabled()) throw new Error("AI guidance is disabled");
    const reservation = await this.budgetStore.reserve(this.maximumRequestCostMicros);
    if (!reservation) throw new Error("AI guidance budget unavailable");

    try {
      const result = await this.delegate.generate(input);
      await this.budgetStore.settle(reservation.reservationId, result.usage);
      return result;
    } catch {
      await this.budgetStore.release(reservation.reservationId).catch(() => undefined);
      throw new Error("AI guidance unavailable");
    }
  }
}
