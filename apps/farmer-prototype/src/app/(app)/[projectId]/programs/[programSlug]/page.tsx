import { notFound } from "next/navigation";
import { getProgram, ProgramDossier } from "@/components/programs";

interface ProgramPageProps {
  params: Promise<{ projectId: string; programSlug: string }>;
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { projectId, programSlug } = await params;
  const program = getProgram(programSlug);
  if (!program) notFound();

  return <ProgramDossier projectId={projectId} program={program} />;
}
