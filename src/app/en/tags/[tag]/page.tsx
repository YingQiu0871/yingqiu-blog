import type { Metadata } from 'next';
import { getAllTags } from '@/lib/blog';
import { createPageMetadata } from '@/lib/metadata';
import TagIndex from '@/components/TagIndex';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags('en').map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const copy = {
    en: { title: `#${tag}`, description: `Posts tagged ${tag} — notes, letters and fragments by Yingqiu.` },
    zh: { title: `#${tag}`, description: `标签 ${tag} 下的文章 — 来自 Yingqiu 的笔记与信笺。` },
  };
  return createPageMetadata('en', `/en/tags/${encodeURIComponent(tag)}/`, copy);
}

export default async function EnglishTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return <TagIndex lang="en" tag={tag} />;
}
