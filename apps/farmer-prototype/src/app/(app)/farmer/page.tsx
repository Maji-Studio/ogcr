/**
 * The farmer's base screen. It sits inside the authenticated `(app)` group, so the layout's
 * `requireAuth()` guard still runs: with `MOCK_DATA=true` that resolves to the seeded demo user and
 * the screen renders with no database and no session, and with `MOCK_DATA=false` it redirects to
 * login exactly like every other page in the group.
 *
 * The static `farmer` segment takes precedence over the sibling `[projectId]` route, so the
 * project-scoped sidebar never wraps this screen. The farmer screen brings its own top chrome.
 */
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/server";
import { FarmerScreen } from "@/components/farmer";

export const metadata: Metadata = {
  title: "Farm overview",
  description: "Lindenhof Farm parcels and their illustrative carbon potential.",
};

export default async function FarmerPage() {
  const user = await requireAuth();

  // Accounts created by invite may not have a name yet; the address is the next best label.
  return <FarmerScreen userName={user.name?.trim() || user.email} />;
}
