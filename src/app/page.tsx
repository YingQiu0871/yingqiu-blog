import { getCategoryCounts, getPosts } from '@/lib/blog';
import { categoryName, categoryPath } from '@/lib/categories';
import { createPageMetadata } from '@/lib/metadata';
import PostCard from '@/components/PostCard';

export function generateMetadata() {
  return createPageMetadata('zh', '/', {
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

export default function ChineseIndexPage() {
  const allPosts = getPosts('zh');
  const posts = allPosts.slice(0, 8);
  const tagCount = new Set(allPosts.flatMap((post) => post.tags)).size;
  const counts = getCategoryCounts('zh');

  return (
    <>
      <section className="hero">
        <div className="hero-avatar">
          <img src="/images/avatar.jpg" alt="" width={460} height={460} />
        </div>
        <h1>秋水有信</h1>
        <p className="site-tagline">Notes, letters and fragments by Yingqiu.</p>
        <p className="slogan">{SLOGAN}</p>
        <div className="hero-stats">
          <div>
            <strong>{allPosts.length}</strong>
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
        <p className="eyebrow">栏目</p>
        <h1>五个栏目</h1>
        <p>
          浮光是现在的我，旧笺是过去的我，流声是我喜欢的，求索是我追寻的，
          拾句是我从他人的文字里遇见并留下的。
        </p>
      </header>
      <div className="category-grid">
        {counts.map(({ category, count }) => (
          <a className="category-card" key={category.id} href={categoryPath('zh', category.id)}>
            <span className="category-dot" style={{ background: category.accent }} aria-hidden="true" />
            <span className="category-card-name">{categoryName(category, 'zh')}</span>
            <span className="category-card-line">{category.zh.homeLine}</span>
            <span className="category-card-count">{count} 篇</span>
          </a>
        ))}
      </div>

      <header className="blog-heading">
        <p className="eyebrow">近作</p>
        <h1>最近书写</h1>
        <p>关于生活、旧时光、声音与阅读的零星记录。写得不多，值得留下的才落笔。</p>
      </header>
      <div className="stack-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} lang="zh" showCategory />
        ))}
      </div>
    </>
  );
}
