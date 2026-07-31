import { ProgramsList } from "@/components/programs";

interface ProgramsPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProgramsPage({ params }: ProgramsPageProps) {
  const { projectId } = await params;

  return <ProgramsList projectId={projectId} />;
}
