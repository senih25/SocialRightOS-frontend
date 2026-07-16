export type RuntimeEnvironment = "development" | "preview" | "production" | "test" | "unknown";

export type RuntimeMarker = {
  release: string;
  environment: RuntimeEnvironment;
  provider: "disabled";
};

export type SafeErrorSignal = {
  code: "GLOBAL_RENDER_ERROR" | "ASSESSMENT_API_ERROR" | "ASSESSMENT_VALIDATION_ERROR";
  release: string;
  environment: RuntimeEnvironment;
};

const SAFE_MARKER = /^[a-zA-Z0-9._-]{1,64}$/;

function safeMarker(value: string | undefined, fallback: string): string {
  return value && SAFE_MARKER.test(value) ? value : fallback;
}

export function getRuntimeMarker(
  env: Record<string, string | undefined> = process.env,
): RuntimeMarker {
  const rawEnvironment = safeMarker(
    env.NEXT_PUBLIC_APP_ENV ?? env.VERCEL_ENV ?? env.NODE_ENV,
    "unknown",
  );
  const environment: RuntimeEnvironment = [
    "development",
    "preview",
    "production",
    "test",
  ].includes(rawEnvironment)
    ? (rawEnvironment as RuntimeEnvironment)
    : "unknown";

  return {
    release: safeMarker(env.NEXT_PUBLIC_RELEASE_SHA ?? env.VERCEL_GIT_COMMIT_SHA, "local"),
    environment,
    provider: "disabled",
  };
}

export function buildSafeErrorSignal(
  code: SafeErrorSignal["code"],
  env?: Record<string, string | undefined>,
): SafeErrorSignal {
  const marker = getRuntimeMarker(env);
  return { code, release: marker.release, environment: marker.environment };
}

export function reportSafeError(code: SafeErrorSignal["code"]): void {
  const signal = buildSafeErrorSignal(code);
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent<SafeErrorSignal>("shr:observability", { detail: signal }));
}
