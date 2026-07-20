import { handleBuildWeekGuidanceRequest } from "@/lib/build-week-guidance-route.ts";
import { getBuildWeekGuidanceRuntime } from "@/lib/build-week-guidance-runtime.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleBuildWeekGuidanceRequest(request, getBuildWeekGuidanceRuntime());
}
