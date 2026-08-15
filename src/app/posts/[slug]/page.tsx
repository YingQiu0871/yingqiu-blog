import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPost, postPath } from '@/lib/blog';
import { createPageMetadata } from '@/lib/metadata';
import PostView from '@/components/PostView';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost('zh', slug);
  if (!post) return {};
  return createPageMetadata('zh', postPath('zh', slug), {
    en: { title: post.title, description: post.description },
    zh: { title: post.title, description: post.description },
  });
}

export default async function ChinesePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost('zh', slug);

  if (!post) {
    const counterpart = getPost('en', slug);
    if (!counterpart) notFound();

    return (
      <div className="content-card blog-fallback">
        <p className="eyebrow">博客</p>
        <h1>{counterpart.title}</h1>
        <p>这篇文章暂时只有英文版。你可以阅读原文，或回到博客列表。</p>
        <div className="blog-fallback-actions">
          <Link className="button" href={postPath('en', slug)}>
            阅读英文版
          </Link>
          <Link className="text-link" href="/">
            返回博客
          </Link>
        </div>
      </div>
    );
  }

  return <PostView lang="zh" post={post} />;
}
