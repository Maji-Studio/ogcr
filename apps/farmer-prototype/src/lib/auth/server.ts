/**
 * Server-side authentication utilities
 * For use in Server Components and Server Actions
 */
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { env } from "@/config/env";
import { users } from "@/db/schema";
import { MOCK_USER_ID } from "@/lib/mock-data-store";
import type { AuthUser } from "./providers/better-auth-client";

const MOCK_USER: AuthUser = {
  id: MOCK_USER_ID,
  email: "farmer@example.com",
  name: "Alex Morgan",
  role: "admin",
  emailVerified: true,
  createdAt: new Date("2026-01-15T09:00:00.000Z"),
  updatedAt: new Date("2026-08-18T14:30:00.000Z"),
};

/**
 * Get the current user from server context
 * Returns null if not authenticated
 */
export async function getUser(): Promise<AuthUser | null> {
  if (env.MOCK_DATA) {
    await connection();
    return { ...MOCK_USER };
  }

  if (env.DISABLE_AUTH) {
    // Keep protected pages dynamic in open-access mode. Without a session or
    // headers read, Next.js would otherwise try to query the database while
    // prerendering them during the production build.
    await connection();

    const { db } = await import("@/db");
    const bypassEmail = env.ADMIN_EMAIL ?? "admin@example.com";
    const user = await db.query.users.findFirst({
      where: eq(users.email, bypassEmail),
    });

    if (!user) {
      throw new Error(
        "DISABLE_AUTH requires a seeded admin user. Run `pnpm --filter farmer-prototype db:seed`."
      );
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role === "admin" ? "admin" : "user",
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  const { getBetterAuthSession, mapBetterAuthUser } = await import(
    "./providers/better-auth-server"
  );
  const session = await getBetterAuthSession();

  if (!session?.user) {
    return null;
  }

  return mapBetterAuthUser(session.user);
}

/**
 * Require authentication, redirect to login if not authenticated
 * Use this in page components and layouts
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Require verified email, redirect to verify-email if not verified
 * Use this for routes that require email verification
 */
export async function requireVerifiedAuth(): Promise<AuthUser> {
  const user = await requireAuth();

  if (!user.emailVerified) {
    redirect("/verify-email");
  }

  return user;
}

/**
 * Require admin role, redirect to unauthorized page if not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireVerifiedAuth();

  if (user.role !== "admin") {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.role === "admin";
}

/**
 * Sign out the current user
 * Use this in route handlers or server actions
 */
export async function signOut() {
  if (env.MOCK_DATA) {
    return { success: true } as const;
  }

  const { signOut: providerSignOut } = await import(
    "./providers/better-auth-server"
  );
  return await providerSignOut();
}
