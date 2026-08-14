import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { formatPostDate, getAllSlugs, getPost, postPath, readingTimeLabel } from '@/lib/blog';
import { createPageMetadata } from '@/lib/metadata';

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

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeHighlight],
  },
};

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

  return (
    <article>
      <header className="blog-post-header">
        <p className="eyebrow">Blog</p>
        <h1>{post.title}</h1>
        <div className="blog-post-meta">
          <time dateTime={post.date}>{formatPostDate(post.date, 'en')}</time>
          <span>{readingTimeLabel(post)}</span>
          {post.updated ? <span>Updated {formatPostDate(post.updated, 'en')}</span> : null}
        </div>
        {post.tags.length > 0 && (
          <div className="tag-list">
            {post.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="blog-article">
        <MDXRemote source={post.source} options={mdxOptions} />
      </div>

      <footer className="blog-post-footer">
        <Link className="text-link" href="/">
          ← Back to blog
        </Link>
      </footer>
    </article>
  );
}
