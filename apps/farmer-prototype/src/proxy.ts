/**
 * Next.js 16 Proxy (replaces middleware)
 * Handles authentication and route protection with Node.js runtime
 */
import { updateSession } from "@/lib/auth/middleware";
import { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths (including /api, so the middleware's
     * 401/email-verification guards apply to API routes) except for:
     * - _next/static and _next/image (Next.js internals)
     * - favicon.ico
     * - Static image files (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
