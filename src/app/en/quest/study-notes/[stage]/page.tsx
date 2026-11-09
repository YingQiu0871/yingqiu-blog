import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getColumn, stagePath } from '@/lib/columns';
import { createPageMetadata } from '@/lib/metadata';
import StageIndex from '@/components/StageIndex';

export const dynamic = 'force-static';
export const dynamicParams = false;

const column = getColumn('study-notes')!;

export function generateStaticParams() {
  return column.stages.map((stage) => ({ stage: stage.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>;
}): Promise<Metadata> {
  const { stage: id } = await params;
  const stage = column.stages.find((item) => item.id === id);
  if (!stage) return {};
  return createPageMetadata('en', stagePath('en', column.id, stage.id), {
    en: { title: `${column.en.name} · ${stage.en.name}`, description: stage.en.note },
    zh: { title: `${column.zh.name} · ${stage.zh.name}`, description: stage.zh.note },
  });
}

export default async function EnglishStagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: id } = await params;
  const stage = column.stages.find((item) => item.id === id);
  if (!stage) notFound();
  return <StageIndex lang="en" column={column} stage={stage} />;
}
