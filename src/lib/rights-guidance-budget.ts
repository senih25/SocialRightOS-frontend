import {
  canReserveRightsGuidanceCost,
  type RightsGuidanceAtomicBudgetStore,
  type RightsGuidanceBudgetSnapshot,
  type RightsGuidanceProviderResult,
} from "./rights-guidance.ts";

export type RightsGuidanceUsageCostCalculator = (
  usage: RightsGuidanceProviderResult["usage"],
) => number;

type Reservation = {
  maximumCostMicros: number;
};

function assertSafeNonNegativeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid ${label}`);
  }
}

export function buildTokenUsageCostCalculator(options: {
  inputMicrosPerMillionTokens: number;
  outputMicrosPerMillionTokens: number;
}): RightsGuidanceUsageCostCalculator {
  assertSafeNonNegativeInteger(
    options.inputMicrosPerMillionTokens,
    "input token price",
  );
  assertSafeNonNegativeInteger(
    options.outputMicrosPerMillionTokens,
    "output token price",
  );

  return (usage) => {
    assertSafeNonNegativeInteger(usage.inputTokens, "input token usage");
    assertSafeNonNegativeInteger(usage.outputTokens, "output token usage");

    const numerator =
      usage.inputTokens * options.inputMicrosPerMillionTokens +
      usage.outputTokens * options.outputMicrosPerMillionTokens;
    if (!Number.isSafeInteger(numerator)) {
      throw new Error("Token cost exceeds safe integer range");
    }
    return Math.ceil(numerator / 1_000_000);
  };
}

export class InMemoryRightsGuidanceAtomicBudgetStore
  implements RightsGuidanceAtomicBudgetStore
{
  private readonly hardLimitMicros: number;
  private readonly calculateCostMicros: RightsGuidanceUsageCostCalculator;
  private committedMicros = 0;
  private reservedMicros = 0;
  private nextReservationId = 1;
  private readonly reservations = new Map<string, Reservation>();
  private queue: Promise<void> = Promise.resolve();

  constructor(
    hardLimitMicros: number,
    calculateCostMicros: RightsGuidanceUsageCostCalculator,
  ) {
    assertSafeNonNegativeInteger(hardLimitMicros, "hard budget limit");
    this.hardLimitMicros = hardLimitMicros;
    this.calculateCostMicros = calculateCostMicros;
  }

  private async exclusively<T>(operation: () => T): Promise<T> {
    const previous = this.queue;
    let release: (() => void) | undefined;
    this.queue = new Promise<void>((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      return operation();
    } finally {
      release?.();
    }
  }

  async reserve(maximumCostMicros: number): Promise<{ reservationId: string } | null> {
    return this.exclusively(() => {
      if (
        maximumCostMicros <= 0 ||
        !canReserveRightsGuidanceCost(this.snapshotUnsafe(), maximumCostMicros)
      ) {
        return null;
      }

      const reservationId = `rights-guidance-${this.nextReservationId}`;
      this.nextReservationId += 1;
      this.reservations.set(reservationId, { maximumCostMicros });
      this.reservedMicros += maximumCostMicros;
      return { reservationId };
    });
  }

  async settle(
    reservationId: string,
    usage: RightsGuidanceProviderResult["usage"],
  ): Promise<void> {
    await this.exclusively(() => {
      const reservation = this.reservations.get(reservationId);
      if (!reservation) {
        throw new Error("Unknown budget reservation");
      }

      const actualCostMicros = this.calculateCostMicros(usage);
      assertSafeNonNegativeInteger(actualCostMicros, "actual request cost");
      this.reservations.delete(reservationId);
      this.reservedMicros -= reservation.maximumCostMicros;

      if (actualCostMicros > reservation.maximumCostMicros) {
        this.committedMicros += reservation.maximumCostMicros;
        throw new Error("Actual request cost exceeded its reservation");
      }

      this.committedMicros += actualCostMicros;
    });
  }

  async release(reservationId: string): Promise<void> {
    await this.exclusively(() => {
      const reservation = this.reservations.get(reservationId);
      if (!reservation) return;
      this.reservations.delete(reservationId);
      this.reservedMicros -= reservation.maximumCostMicros;
    });
  }

  async snapshot(): Promise<RightsGuidanceBudgetSnapshot> {
    return this.exclusively(() => ({ ...this.snapshotUnsafe() }));
  }

  private snapshotUnsafe(): RightsGuidanceBudgetSnapshot {
    return {
      hardLimitMicros: this.hardLimitMicros,
      committedMicros: this.committedMicros,
      reservedMicros: this.reservedMicros,
    };
  }
}
