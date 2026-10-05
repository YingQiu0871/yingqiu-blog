import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getColumnPosts } from '@/lib/blog';
import { categoryName, categoryPath, getCategory } from '@/lib/categories';
import { stagePath, type Column } from '@/lib/columns';

/** Column landing page: one card per stage, each leading to its own page. */
export default function ColumnIndex({ lang, column }: { lang: Locale; column: Column }) {
  const posts = getColumnPosts(lang, column.id);
  const copy = lang === 'zh' ? column.zh : column.en;
  const category = getCategory(column.category);

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

      <div className="stage-grid">
        {column.stages.map((stage) => {
          const count = posts.filter((post) => post.stage === stage.id).length;
          const sc = lang === 'zh' ? stage.zh : stage.en;
          return (
            <Link key={stage.id} className="stage-card" href={stagePath(lang, column.id, stage.id)}>
              <strong>{sc.name}</strong>
              <span>{sc.note}</span>
              <span className="stage-card-count">
                {count === 0
                  ? lang === 'zh'
                    ? '整理中'
                    : 'Coming soon'
                  : lang === 'zh'
                    ? `${count} 篇笔记`
                    : `${count} ${count === 1 ? 'note' : 'notes'}`}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
