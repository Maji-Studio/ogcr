/**
 * Internal map playground. It sits in the authenticated `(app)` group like `/farmer`, so with
 * `MOCK_DATA=true` it renders for the demo user with no database and no session. It is not linked
 * from the navigation.
 */
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/server";
import { MapPlayground } from "@/components/map-playground/map-playground";

export const metadata: Metadata = {
  title: "Map playground",
  description: "Every map style in one place.",
  robots: { index: false },
};

export default async function MapPlaygroundPage() {
  await requireAuth();
  return <MapPlayground />;
}
