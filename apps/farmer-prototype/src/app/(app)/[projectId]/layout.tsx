import { notFound } from "next/navigation";
import { z } from "zod";
import { Sidebar } from "@/components/navigation";
import { getProjectRole } from "@/data-access/projects";
import { requireAuth } from "@/lib/auth/server";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { projectId } = await params;
  const user = await requireAuth();

  if (!z.string().uuid().safeParse(projectId).success) {
    notFound();
  }

  // 404 only for non-membership (also avoids confirming the project's
  // existence to non-members); transient DB faults propagate to error.tsx
  const role = await getProjectRole(projectId, user.id);
  if (!role) {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar projectId={projectId} />
      <main className="flex-1 p-xl">{children}</main>
    </div>
  );
}
