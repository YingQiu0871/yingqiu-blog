import { getCategoryCounts, getPosts } from '@/lib/blog';
import { categoryName, categoryPath } from '@/lib/categories';
import { createPageMetadata } from '@/lib/metadata';
import PostCard from '@/components/PostCard';

export function generateMetadata() {
  return createPageMetadata('en', '/', {
    en: {
      title: 'Home',
      description:
        'Notes, letters and fragments by Yingqiu — on life, old writings, music, reading, and the long road of learning.',
    },
    zh: {
      title: '首页',
      description: '来自 Yingqiu 的笔记、信笺与片段：生活、旧文、音乐、阅读，以及求索的长路。',
    },
  });
}

const SLOGAN = '人面不知何处去，桃花依旧笑春风';
const SLOGAN_EN = 'The face I knew is nowhere to be found; the peach blossoms still smile in the spring breeze.';

export default function EnglishIndexPage() {
  const allPosts = getPosts('en');
  const posts = allPosts.slice(0, 8);
  const tagCount = new Set(allPosts.flatMap((post) => post.tags)).size;
  const counts = getCategoryCounts('en');

  return (
    <>
      <section className="hero">
        <div className="hero-avatar">
          <img src="/images/avatar.jpg" alt="" width={460} height={460} />
        </div>
        <h1>Qiushui Youxin</h1>
        <p className="site-tagline">Notes, letters and fragments by Yingqiu.</p>
        <p className="slogan" lang="zh">
          {SLOGAN}
        </p>
        <p className="slogan-en">{SLOGAN_EN}</p>
        <div className="hero-stats">
          <div>
            <strong>{allPosts.length}</strong>
            <span>Entries</span>
          </div>
          <span className="hero-divider" aria-hidden="true" />
          <div>
            <strong>{tagCount}</strong>
            <span>Tags</span>
          </div>
          <span className="hero-divider" aria-hidden="true" />
          <a href="/feed.xml">
            <strong>RSS</strong>
            <span>Subscribe</span>
          </a>
        </div>
      </section>

      <header className="blog-heading">
        <p className="eyebrow">Contents</p>
        <h1>Five sections</h1>
        <p>
          Moments are the self of now, Old Letters the self of then, Music what
          I love, Quest what I seek, and Quotes what I meet in other people&apos;s
          words and keep.
        </p>
      </header>
      <div className="category-grid">
        {counts.map(({ category, count }) => (
          <a className="category-card" key={category.id} href={categoryPath('en', category.id)}>
            <span className="category-dot" style={{ background: category.accent }} aria-hidden="true" />
            <span className="category-card-name">{categoryName(category, 'en')}</span>
            <span className="category-card-line">{category.en.homeLine}</span>
            <span className="category-card-count">
              {count} {count === 1 ? 'entry' : 'entries'}
            </span>
          </a>
        ))}
      </div>

      <header className="blog-heading">
        <p className="eyebrow">Recent</p>
        <h1>Recent writings</h1>
        <p>
          Occasional notes on life, old times, sounds and reading. New pages
          appear slowly — only when there is something worth keeping.
        </p>
      </header>
      <div className="stack-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} lang="en" showCategory />
        ))}
      </div>
    </>
  );
}
