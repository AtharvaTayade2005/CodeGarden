import { notFound } from 'next/navigation';
import { initialExercises } from '@/lib/curriculumData';
import LearnWorkspaceClient from '@/components/LearnWorkspaceClient';

interface LearnPageProps {
  params: Promise<{
    exerciseId: string;
  }>;
}

export async function generateStaticParams() {
  return initialExercises.map((ex) => ({
    exerciseId: ex.id,
  }));
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { exerciseId } = await params;
  const exercise = initialExercises.find((ex) => ex.id === exerciseId);

  if (!exercise) {
    notFound();
  }

  return <LearnWorkspaceClient exercise={exercise} />;
}
