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
    <div className="flex min-h-screen bg-surface-page">
      <Sidebar projectId={projectId} />
      <main className="mx-auto w-full max-w-[1080px] flex-1 px-24 py-32">
        {children}
      </main>
    </div>
  );
}
