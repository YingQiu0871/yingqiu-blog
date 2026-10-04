import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getColumnPosts } from '@/lib/blog';
import { categoryName, categoryPath, getCategory } from '@/lib/categories';
import type { Column } from '@/lib/columns';
import PostCard from '@/components/PostCard';

export default function ColumnIndex({ lang, column }: { lang: Locale; column: Column }) {
  const posts = getColumnPosts(lang, column.id);
  const copy = lang === 'zh' ? column.zh : column.en;
  const category = getCategory(column.category);
  // Notes without a valid stage still show up, under a catch-all heading.
  const unstaged = posts.filter((post) => !column.stages.some((s) => s.id === post.stage));

  return (
    <>
      <header className="blog-heading">
        <p className="eyebrow">
          {category && <Link href={categoryPath(lang, category.id)}>{categoryName(category, lang)}</Link>}
          {' › '}
          {lang === 'zh' ? '专栏' : 'Column'}
        </p>
        <h1>{copy.name}</h1>
        <p>{copy.description}</p>
      </header>

      <nav className="stage-nav" aria-label={lang === 'zh' ? '学习阶段' : 'Stages'}>
        {column.stages.map((stage) => {
          const count = posts.filter((post) => post.stage === stage.id).length;
          const name = lang === 'zh' ? stage.zh.name : stage.en.name;
          return (
            <a key={stage.id} href={`#stage-${stage.id}`}>
              {name}
              <span className="stage-count">{count}</span>
            </a>
          );
        })}
      </nav>

      {column.stages.map((stage) => {
        const items = posts.filter((post) => post.stage === stage.id);
        const sc = lang === 'zh' ? stage.zh : stage.en;
        return (
          <section key={stage.id} id={`stage-${stage.id}`} className="stage-section">
            <h2 className="stage-heading">
              {sc.name}
              <small>{sc.note}</small>
            </h2>
            {items.length === 0 ? (
              <p className="stage-empty">
                {lang === 'zh' ? '这一阶段的笔记还在整理中。' : 'Notes for this stage are still being gathered.'}
              </p>
            ) : (
              <div className="stack-list">
                {items.map((post) => (
                  <PostCard key={post.slug} post={post} lang={lang} />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {unstaged.length > 0 && (
        <section className="stage-section">
          <h2 className="stage-heading">{lang === 'zh' ? '其他' : 'Other'}</h2>
          <div className="stack-list">
            {unstaged.map((post) => (
              <PostCard key={post.slug} post={post} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
