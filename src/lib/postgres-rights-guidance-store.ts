import { randomUUID } from "node:crypto";
import type { RightsGuidanceUsageCostCalculator } from "./rights-guidance-budget.ts";
import type {
  RightsGuidanceAtomicRequestGuard,
  RightsGuidanceRequestScope,
} from "./rights-guidance-request-guard.ts";
import type {
  RightsGuidanceAtomicBudgetStore,
  RightsGuidanceProviderResult,
} from "./rights-guidance.ts";

type QueryRow = Record<string, unknown>;

export type RightsGuidancePostgresQuery = <Row extends QueryRow>(
  text: string,
  values: readonly unknown[],
) => Promise<{ rows: Row[] }>;

const HMAC_SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/u;

function assertSafeNonNegativeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid ${label}`);
  }
}

function assertPositiveSafeInteger(value: number, label: string): void {
  assertSafeNonNegativeInteger(value, label);
  if (value === 0) throw new Error(`Invalid ${label}`);
}

function firstBoolean(rows: QueryRow[], field: string): boolean {
  return rows.length === 1 && rows[0][field] === true;
}

export class PostgresRightsGuidanceBudgetStore
  implements RightsGuidanceAtomicBudgetStore
{
  private readonly query: RightsGuidancePostgresQuery;
  private readonly calculateCostMicros: RightsGuidanceUsageCostCalculator;
  private readonly hardLimitMicros: number;

  constructor(options: {
    query: RightsGuidancePostgresQuery;
    calculateCostMicros: RightsGuidanceUsageCostCalculator;
    hardLimitMicros: number;
  }) {
    assertSafeNonNegativeInteger(options.hardLimitMicros, "hard budget limit");
    this.query = options.query;
    this.calculateCostMicros = options.calculateCostMicros;
    this.hardLimitMicros = options.hardLimitMicros;
  }

  async reserve(maximumCostMicros: number): Promise<{ reservationId: string } | null> {
    assertPositiveSafeInteger(maximumCostMicros, "request cost reservation");
    const reservationId = randomUUID();
    const result = await this.query<{ acquired: boolean }>(
      "SELECT socialright.reserve_guidance_budget($1::uuid, $2::bigint, $3::bigint) AS acquired",
      [reservationId, maximumCostMicros, this.hardLimitMicros],
    );
    return firstBoolean(result.rows, "acquired") ? { reservationId } : null;
  }

  async settle(
    reservationId: string,
    usage: RightsGuidanceProviderResult["usage"],
  ): Promise<void> {
    const actualCostMicros = this.calculateCostMicros(usage);
    assertSafeNonNegativeInteger(actualCostMicros, "actual request cost");
    const result = await this.query<{
      found: boolean;
      exceeded_reservation: boolean;
    }>(
      "SELECT * FROM socialright.settle_guidance_budget($1::uuid, $2::bigint)",
      [reservationId, actualCostMicros],
    );
    if (result.rows.length !== 1 || result.rows[0].found !== true) {
      throw new Error("Unknown budget reservation");
    }
    if (result.rows[0].exceeded_reservation === true) {
      throw new Error("Actual request cost exceeded its reservation");
    }
  }

  async release(reservationId: string): Promise<void> {
    await this.query<{ released: boolean }>(
      "SELECT socialright.release_guidance_budget($1::uuid) AS released",
      [reservationId],
    );
  }
}

export class PostgresRightsGuidanceRequestGuard
  implements RightsGuidanceAtomicRequestGuard
{
  private readonly query: RightsGuidancePostgresQuery;
  private readonly maximumAttemptsPerClient: number;
  private readonly windowMs: number;

  constructor(options: {
    query: RightsGuidancePostgresQuery;
    maximumAttemptsPerClient: number;
    windowMs: number;
  }) {
    assertPositiveSafeInteger(options.maximumAttemptsPerClient, "per-client attempt limit");
    assertPositiveSafeInteger(options.windowMs, "request-guard window");
    if (options.maximumAttemptsPerClient > 1000 || options.windowMs > 31_536_000_000) {
      throw new Error("Request-guard configuration exceeds database bounds");
    }
    this.query = options.query;
    this.maximumAttemptsPerClient = options.maximumAttemptsPerClient;
    this.windowMs = options.windowMs;
  }

  async acquire(scope: RightsGuidanceRequestScope): Promise<{ leaseId: string } | null> {
    if (
      !HMAC_SHA256_HEX_PATTERN.test(scope.clientKeyHash) ||
      !HMAC_SHA256_HEX_PATTERN.test(scope.assessmentVersionKeyHash)
    ) {
      return null;
    }
    const leaseId = randomUUID();
    const attemptId = randomUUID();
    const result = await this.query<{ acquired: boolean }>(
      "SELECT socialright.acquire_guidance_request($1::uuid, $2::uuid, $3::text, $4::text, $5::integer, $6::bigint) AS acquired",
      [
        leaseId,
        attemptId,
        scope.clientKeyHash,
        scope.assessmentVersionKeyHash,
        this.maximumAttemptsPerClient,
        this.windowMs,
      ],
    );
    return firstBoolean(result.rows, "acquired") ? { leaseId } : null;
  }

  async complete(leaseId: string): Promise<void> {
    const result = await this.query<{ completed: boolean }>(
      "SELECT socialright.complete_guidance_request($1::uuid) AS completed",
      [leaseId],
    );
    if (!firstBoolean(result.rows, "completed")) {
      throw new Error("Unknown request-guard lease");
    }
  }

  async release(leaseId: string): Promise<void> {
    await this.query<{ released: boolean }>(
      "SELECT socialright.release_guidance_request($1::uuid) AS released",
      [leaseId],
    );
  }
}
