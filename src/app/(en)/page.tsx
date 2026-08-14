import Link from 'next/link';
import { formatPostDate, getPosts, postPath, readingTimeLabel } from '@/lib/blog';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return createPageMetadata('en', '/', {
    en: {
      title: 'Blog',
      description:
        'Notes on pharmaceutical sciences, research practice, and life between labs, written by Yuning Gu.',
    },
    zh: {
      title: '博客',
      description: '谷昱宁关于药物科学、科研方法与学习生活的随笔与笔记。',
    },
  });
}

export default function EnglishIndexPage() {
  const posts = getPosts('en');

  return (
    <>
      <header className="blog-heading">
        <p className="eyebrow">Writing &amp; notes</p>
        <h1>Blog</h1>
        <p>
          Notes on pharmaceutical sciences, research practice, and life between
          labs. Posts are written in Markdown / MDX, and an RSS feed is available.
        </p>
      </header>

      <div className="blog-toolbar">
        <span>
          {posts.length === 0
            ? 'No posts yet'
            : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}
        </span>
        <a className="text-link" href="/feed.xml">
          RSS ↗
        </a>
      </div>

      <div className="stack-list">
        {posts.map((post) => (
          <article className="content-card" key={post.slug}>
            <Link className="blog-card-link" href={postPath('en', post.slug)}>
              <h2>{post.title}</h2>
              <span className="meta">
                <time dateTime={post.date}>{formatPostDate(post.date, 'en')}</time>
                {' · '}
                {readingTimeLabel(post)}
              </span>
              <p>{post.description}</p>
            </Link>
            {post.tags.length > 0 && (
              <div className="tag-list">
                {post.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
