export function shouldFailClosedHomeCareFallback(
  routeKey: string,
  method: string,
  benefitCode: string | null | undefined,
): boolean {
  return (
    method === "POST" &&
    routeKey === "v1/eligibility-check" &&
    benefitCode === "TR_HOME_CARE_ALLOWANCE"
  );
}
