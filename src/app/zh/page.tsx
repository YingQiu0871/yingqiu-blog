import Link from 'next/link';
import { formatPostDate, getPosts, postPath, readingTimeLabel } from '@/lib/blog';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return createPageMetadata('zh', '/zh/', {
    en: {
      title: 'Home',
      description:
        'Notes, letters and fragments by Yingqiu — on pharmaceutical sciences, research practice, and life between labs.',
    },
    zh: {
      title: '首页',
      description: '来自 Yingqiu 的笔记、信笺与片段，记录药物科学、科研方法与学习生活的思考。',
    },
  });
}

const SLOGAN = '人面不知何处去，桃花依旧笑春风';

export default function ChineseIndexPage() {
  const posts = getPosts('zh');
  const tagCount = new Set(posts.flatMap((post) => post.tags)).size;

  return (
    <>
      <section className="hero-banner">
        <div className="hero-petals" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span className="petal" key={index} />
          ))}
        </div>
      </section>
      <section className="hero">
        <div className="hero-avatar">
          <img src="/images/avatar.jpg" alt="" width={460} height={460} />
        </div>
        <h1>秋水有信</h1>
        <p className="site-tagline">Notes, letters and fragments by Yingqiu.</p>
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
