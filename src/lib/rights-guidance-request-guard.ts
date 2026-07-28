import {
  buildUnavailableRightsGuidanceExplanation,
  generateRightsGuidanceExplanation,
  type RightsGuidanceInput,
  type RightsGuidanceProvider,
  type RightsGuidanceRenderModel,
} from "./rights-guidance.ts";

export type RightsGuidanceRequestScope = {
  clientKeyHash: string;
  assessmentVersionKeyHash: string;
};

export interface RightsGuidanceAtomicRequestGuard {
  acquire(scope: RightsGuidanceRequestScope): Promise<{ leaseId: string } | null>;
  complete(leaseId: string): Promise<void>;
  release(leaseId: string): Promise<void>;
}

type Lease = RightsGuidanceRequestScope;

const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/u;

function isSafeScope(scope: RightsGuidanceRequestScope): boolean {
  // Shape validation only. Callers must derive both values with a server-secret HMAC-SHA-256.
  return (
    SHA256_HEX_PATTERN.test(scope.clientKeyHash) &&
    SHA256_HEX_PATTERN.test(scope.assessmentVersionKeyHash)
  );
}

export class InMemoryRightsGuidanceAtomicRequestGuard
  implements RightsGuidanceAtomicRequestGuard
{
  private readonly maximumAttemptsPerClient: number;
  private readonly windowMs: number;
  private readonly now: () => number;
  private readonly clientAttempts = new Map<string, number[]>();
  private readonly assessmentStates = new Map<string, "IN_FLIGHT" | "COMPLETED">();
  private readonly leases = new Map<string, Lease>();
  private nextLeaseId = 1;
  private queue: Promise<void> = Promise.resolve();

  constructor(options: {
    maximumAttemptsPerClient: number;
    windowMs: number;
    now?: () => number;
  }) {
    if (
      !Number.isSafeInteger(options.maximumAttemptsPerClient) ||
      options.maximumAttemptsPerClient <= 0
    ) {
      throw new Error("Invalid per-client attempt limit");
    }
    if (!Number.isSafeInteger(options.windowMs) || options.windowMs <= 0) {
      throw new Error("Invalid request-guard window");
    }
    this.maximumAttemptsPerClient = options.maximumAttemptsPerClient;
    this.windowMs = options.windowMs;
    this.now = options.now ?? Date.now;
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

  async acquire(scope: RightsGuidanceRequestScope): Promise<{ leaseId: string } | null> {
    return this.exclusively(() => {
      if (!isSafeScope(scope)) return null;
      if (this.assessmentStates.has(scope.assessmentVersionKeyHash)) return null;

      const timestamp = this.now();
      if (!Number.isSafeInteger(timestamp) || timestamp < 0) return null;
      const cutoff = timestamp - this.windowMs;
      const attempts = (this.clientAttempts.get(scope.clientKeyHash) ?? []).filter(
        (attempt) => attempt > cutoff,
      );
      if (attempts.length >= this.maximumAttemptsPerClient) {
        this.clientAttempts.set(scope.clientKeyHash, attempts);
        return null;
      }

      attempts.push(timestamp);
      this.clientAttempts.set(scope.clientKeyHash, attempts);
      this.assessmentStates.set(scope.assessmentVersionKeyHash, "IN_FLIGHT");
      const leaseId = `rights-guidance-request-${this.nextLeaseId}`;
      this.nextLeaseId += 1;
      this.leases.set(leaseId, { ...scope });
      return { leaseId };
    });
  }

  async complete(leaseId: string): Promise<void> {
    await this.exclusively(() => {
      const lease = this.leases.get(leaseId);
      if (!lease) throw new Error("Unknown request-guard lease");
      this.leases.delete(leaseId);
      this.assessmentStates.set(lease.assessmentVersionKeyHash, "COMPLETED");
    });
  }

  async release(leaseId: string): Promise<void> {
    await this.exclusively(() => {
      const lease = this.leases.get(leaseId);
      if (!lease) return;
      this.leases.delete(leaseId);
      if (this.assessmentStates.get(lease.assessmentVersionKeyHash) === "IN_FLIGHT") {
        this.assessmentStates.delete(lease.assessmentVersionKeyHash);
      }
    });
  }
}

export async function generateRequestGuardedRightsGuidanceExplanation(
  input: RightsGuidanceInput,
  provider: RightsGuidanceProvider,
  options: {
    enabled: boolean;
    scope: RightsGuidanceRequestScope;
    requestGuard: RightsGuidanceAtomicRequestGuard;
  },
): Promise<RightsGuidanceRenderModel> {
  if (!options.enabled) return buildUnavailableRightsGuidanceExplanation();

  let leaseId: string | undefined;
  try {
    const lease = await options.requestGuard.acquire(options.scope);
    if (!lease) return buildUnavailableRightsGuidanceExplanation();
    leaseId = lease.leaseId;

    const result = await generateRightsGuidanceExplanation(input, provider, { enabled: true });
    if (result.overallStatus !== "EXPLANATION_AVAILABLE") {
      await options.requestGuard.release(leaseId);
      return result;
    }

    await options.requestGuard.complete(leaseId);
    return result;
  } catch {
    if (leaseId) {
      await options.requestGuard.release(leaseId).catch(() => undefined);
    }
    return buildUnavailableRightsGuidanceExplanation();
  }
}
