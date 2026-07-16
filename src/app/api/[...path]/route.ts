import { NextResponse } from "next/server";
import {
  buildLocalApiPayload,
  invalidEligibilityRequestResponse,
  normalizeEligibilityCheckRequest,
} from "@/lib/local-api-fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROXY_TIMEOUT_MS = 4000;

function getConfiguredBackendBaseUrl(): string | null {
  const candidate =
    process.env.BACKEND_BASE_URL ??
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "";

  const normalized = candidate.replace(/\/+$/, "");
  return normalized ? normalized : null;
}

type RouteContext = {
  params: { path?: string[] } | Promise<{ path?: string[] }>;
};

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "connection",
  "content-length",
  "expect",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

async function readRequestBody(request: Request): Promise<{ body?: ArrayBuffer; json: unknown }> {
  if (request.method === "GET" || request.method === "HEAD") {
    return { json: null };
  }

  const body = await request.arrayBuffer();
  if (body.byteLength === 0) {
    return { body, json: null };
  }

  try {
    const text = new TextDecoder().decode(body);
    return { body, json: text ? JSON.parse(text) : null };
  } catch {
    return { body, json: null };
  }
}

function toPathSegments(context: RouteContext): Promise<{ path?: string[] }> | { path?: string[] } {
  return context.params;
}

async function forward(request: Request, context: RouteContext): Promise<Response> {
  const { path = [] } = await toPathSegments(context);
  const backendBaseUrl = getConfiguredBackendBaseUrl();
  const sourceUrl = new URL(request.url);
  const bodyState = await readRequestBody(request);
  const routeKey = path.join("/");

  if (
    request.method === "POST" &&
    routeKey === "v1/eligibility-check" &&
    !normalizeEligibilityCheckRequest(bodyState.json)
  ) {
    return NextResponse.json(invalidEligibilityRequestResponse(), {
      status: 400,
      headers: {
        "X-Local-Fallback": "1",
      },
    });
  }

  if (backendBaseUrl) {
    const targetPath = path.length > 0 ? `/api/${path.join("/")}` : "/api";
    const targetUrl = new URL(targetPath, backendBaseUrl);
    targetUrl.search = sourceUrl.search;

    const headers = new Headers(request.headers);

    for (const headerName of HOP_BY_HOP_REQUEST_HEADERS) {
      headers.delete(headerName);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

    try {
      const backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: bodyState.body,
        cache: "no-store",
        redirect: "manual",
        signal: controller.signal,
      });

      if (backendResponse.ok) {
        const responseHeaders = new Headers(backendResponse.headers);

        for (const headerName of HOP_BY_HOP_RESPONSE_HEADERS) {
          responseHeaders.delete(headerName);
        }

        return new Response(backendResponse.body, {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          headers: responseHeaders,
        });
      }
    } catch {
      // Fall back to the local deterministic engine below.
    } finally {
      clearTimeout(timeout);
    }
  }

  const fallbackPayload = buildLocalApiPayload(path, bodyState.json);
  if (fallbackPayload) {
    const fallbackStatus =
      typeof fallbackPayload === "object" &&
      fallbackPayload !== null &&
      "status" in fallbackPayload &&
      typeof fallbackPayload.status === "number"
        ? fallbackPayload.status
        : 200;

    return NextResponse.json(fallbackPayload, {
      status: fallbackStatus,
      headers: {
        "X-Local-Fallback": "1",
      },
    });
  }

  return NextResponse.json(
    {
      message: "Bu API yolu için yerel geri dönüş tanımlı değil.",
      error: "unsupported_route",
      status: 503,
      correlation_id: "",
    },
    { status: 503 },
  );
}

export async function GET(request: Request, context: RouteContext) {
  return forward(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return forward(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return forward(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return forward(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return forward(request, context);
}

export async function HEAD(request: Request, context: RouteContext) {
  return forward(request, context);
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
    },
  });
}
