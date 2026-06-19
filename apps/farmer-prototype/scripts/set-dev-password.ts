/**
 * Dev-only helper: set a credential password for a seeded user so the local
 * login flow can be exercised without email delivery (Resend) configured.
 *
 * Usage: pnpm tsx scripts/set-dev-password.ts <email> <password>
 * Never run against production.
 */
import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/better-auth";
import { db } from "@/db";
import * as schema from "@/db/schema";

const CREDENTIAL_PROVIDER = "credential";

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    throw new Error("Usage: tsx scripts/set-dev-password.ts <email> <password>");
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));
  if (!user) throw new Error(`No user found for ${email}`);

  // Better Auth's own hasher keeps the credential compatible with sign-in.
  const ctx = await auth.$context;
  const hashed = await ctx.password.hash(password);

  const [existing] = await db
    .select()
    .from(schema.accounts)
    .where(
      and(
        eq(schema.accounts.userId, user.id),
        eq(schema.accounts.providerId, CREDENTIAL_PROVIDER)
      )
    );

  if (existing) {
    await db
      .update(schema.accounts)
      .set({ password: hashed })
      .where(eq(schema.accounts.id, existing.id));
  } else {
    await db.insert(schema.accounts).values({
      id: randomUUID(),
      userId: user.id,
      accountId: user.id,
      providerId: CREDENTIAL_PROVIDER,
      password: hashed,
    });
  }

  // Log userId only — never log email/PII.
  console.log(`Password set for userId=${user.id}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
