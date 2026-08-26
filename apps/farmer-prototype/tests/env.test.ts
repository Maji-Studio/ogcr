import { describe, expect, it } from "vitest";
import { parseEnv } from "@/config/env";

describe("environment configuration", () => {
  it("treats blank Vercel variables as unset in mock mode", () => {
    const environment = parseEnv({
      MOCK_DATA: "",
      DATABASE_URL: "",
      NEXT_PUBLIC_APP_URL: "",
      BETTER_AUTH_SECRET: "",
      RESEND_API_KEY: "",
      RESEND_FROM_EMAIL: "",
      DISABLE_AUTH: "",
      ADMIN_EMAIL: "",
      ALLOW_SELF_SIGNUP: "",
      LOG_LEVEL: "",
    });

    expect(environment.MOCK_DATA).toBe(true);
    expect(environment.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3200");
    expect(environment.DISABLE_AUTH).toBe(false);
    expect(environment.ALLOW_SELF_SIGNUP).toBe(false);
    expect(environment.RESEND_API_KEY).toBeUndefined();
    expect(environment.RESEND_FROM_EMAIL).toBeUndefined();
    expect(environment.ADMIN_EMAIL).toBeUndefined();
    expect(environment.LOG_LEVEL).toBeUndefined();
  });
});
