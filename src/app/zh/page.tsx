import Link from 'next/link';
import { formatPostDate, getPosts, postPath, readingTimeLabel } from '@/lib/blog';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return createPageMetadata('zh', '/zh/', {
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

const SLOGAN = '人面不知何处去，桃花依旧笑春风';

export default function ChineseIndexPage() {
  const posts = getPosts('zh');
  const tagCount = new Set(posts.flatMap((post) => post.tags)).size;

  return (
    <>
      <section className="hero">
        <div className="hero-avatar" aria-hidden="true">
          🌸
        </div>
        <h1>谷昱宁的博客</h1>
        <p className="slogan">{SLOGAN}</p>
        <div className="hero-stats">
          <div>
            <strong>{posts.length}</strong>
            <span>文章</span>
          </div>
          <span className="hero-divider" aria-hidden="true" />
          <div>
            <strong>{tagCount}</strong>
            <span>标签</span>
          </div>
          <span className="hero-divider" aria-hidden="true" />
          <a href="/feed.xml">
            <strong>RSS</strong>
            <span>订阅</span>
          </a>
        </div>
      </section>

      <header className="blog-heading">
        <p className="eyebrow">随笔与笔记</p>
        <h1>最新文章</h1>
        <p>记录药物科学、科研方法与学习生活中的思考。文章以 Markdown / MDX 撰写，支持 RSS 订阅。</p>
      </header>

      <div className="stack-list">
        {posts.map((post) => (
          <article className="content-card" key={post.slug}>
            <Link className="blog-card-link" href={postPath('zh', post.slug)}>
              <h2>{post.title}</h2>
              <span className="meta">
                <time dateTime={post.date}>{formatPostDate(post.date, 'zh')}</time>
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
