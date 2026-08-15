import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { createPageMetadata } from '@/lib/metadata';
import CategoryIndex from '@/components/CategoryIndex';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.zh.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug('zh', slug);
  if (!category) return {};
  return createPageMetadata('zh', `/zh/${category.zh.slug}/`, {
    en: { title: category.en.name, description: category.en.description },
    zh: { title: category.zh.name, description: category.zh.description },
  });
}

export default async function ChineseCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug('zh', slug);
  if (!category) notFound();
  return <CategoryIndex lang="zh" category={category} />;
}
