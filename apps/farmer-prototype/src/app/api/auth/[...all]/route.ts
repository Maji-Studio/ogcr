/**
 * Better Auth API routes
 * Handles all authentication endpoints
 */
import { NextResponse } from "next/server";
import { env } from "@/config/env";

function mockModeResponse() {
  return NextResponse.json(
    { error: "Authentication endpoints are disabled in mock mode" },
    { status: 404 }
  );
}

async function getAuthHandlers() {
  const [{ auth }, { toNextJsHandler }] = await Promise.all([
    import("@/lib/auth/better-auth"),
    import("better-auth/next-js"),
  ]);
  return toNextJsHandler(auth);
}

export async function GET(request: Request) {
  if (env.MOCK_DATA) return mockModeResponse();
  const handlers = await getAuthHandlers();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  if (env.MOCK_DATA) return mockModeResponse();
  const handlers = await getAuthHandlers();
  return handlers.POST(request);
}
