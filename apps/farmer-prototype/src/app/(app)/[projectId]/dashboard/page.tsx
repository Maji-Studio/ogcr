import { DashboardView } from "@/components/dashboard";
import { requireAuth } from "@/lib/auth/server";

interface DashboardPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  // Route is project-scoped for nav parity; farm/KPI data is still prototype
  // fixtures, so projectId isn't consumed here yet.
  await params;
  const user = await requireAuth();

  return <DashboardView userName={user.name ?? "Farmer"} />;
}
