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
  const post = getPost('en', slug);
  if (!post) return {};
  return createPageMetadata('en', postPath('en', slug), {
    en: { title: post.title, description: post.description },
    zh: { title: post.title, description: post.description },
  });
}

export default async function EnglishPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost('en', slug);

  if (!post) {
    const counterpart = getPost('zh', slug);
    if (!counterpart) notFound();

    return (
      <div className="content-card blog-fallback">
        <p className="eyebrow">Blog</p>
        <h1>{counterpart.title}</h1>
        <p>
          This post is not available in English yet. You can read the original,
          or head back to the blog.
        </p>
        <div className="blog-fallback-actions">
          <Link className="button" href={postPath('zh', slug)}>
            Read it in 中文
          </Link>
          <Link className="text-link" href="/">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return <PostView lang="en" post={post} />;
}
