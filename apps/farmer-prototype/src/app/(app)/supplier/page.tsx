/**
 * The supplier base screen. Like `/farmer`, it sits inside the authenticated `(app)` group, so the
 * layout's `requireAuth()` guard runs before it renders: with `MOCK_DATA=true` that resolves to the
 * seeded demo user, and with `MOCK_DATA=false` it redirects to login like every other page here.
 *
 * The static `supplier` segment takes precedence over the sibling `[projectId]` route, so the
 * project sidebar never wraps this screen. The supplier screen brings its own top chrome.
 */
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/server";
import { SupplierScreen } from "@/components/supplier";

export const metadata: Metadata = {
  title: "Supplier overview",
  description: "The supplier view of the prototype. No screens are built here yet.",
};

export default async function SupplierPage() {
  const user = await requireAuth();

  // Accounts created by invite may not have a name yet; the address is the next best label.
  return <SupplierScreen userName={user.name?.trim() || user.email} />;
}
