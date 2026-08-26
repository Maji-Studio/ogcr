import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { env } from "@/config/env";

const getSessionMock = vi.fn();

vi.mock("@/lib/auth/better-auth", () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

describe("Auth middleware", () => {
  it("returns 401 for unauthenticated protected API routes", async () => {
    getSessionMock.mockResolvedValueOnce(null);

    const { updateSession } = await import("@/lib/auth/middleware");
    const request = new NextRequest("http://localhost:3100/api/projects");

    const response = await updateSession(request);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("allows protected routes without a session in open-access mode", async () => {
    env.DISABLE_AUTH = true;
    getSessionMock.mockClear();

    try {
      const { updateSession } = await import("@/lib/auth/middleware");
      const request = new NextRequest("http://localhost:3100/projects");

      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(getSessionMock).not.toHaveBeenCalled();
    } finally {
      env.DISABLE_AUTH = false;
    }
  });

  it("redirects the login page to projects in open-access mode", async () => {
    env.DISABLE_AUTH = true;

    try {
      const { updateSession } = await import("@/lib/auth/middleware");
      const request = new NextRequest("http://localhost:3100/login");

      const response = await updateSession(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3100/projects"
      );
    } finally {
      env.DISABLE_AUTH = false;
    }
  });
});
