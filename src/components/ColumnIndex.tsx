import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getColumnPosts } from '@/lib/blog';
import { categoryName, categoryPath, getCategory } from '@/lib/categories';
import { columnCountLabel, stagePath, type Column } from '@/lib/columns';
import PostCard from '@/components/PostCard';

/** Posts of a flat (stage-less) column read in slug order: `bit-course-01`, `bit-course-02`, … */
export function flatColumnPosts(lang: Locale, column: Column) {
  return getColumnPosts(lang, column.id).sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Column landing page. A staged column shows one card per stage, each leading
 * to its own page; a flat column lists its posts in reading order.
 */
export default function ColumnIndex({ lang, column }: { lang: Locale; column: Column }) {
  const posts = getColumnPosts(lang, column.id);
  const copy = lang === 'zh' ? column.zh : column.en;
  const category = getCategory(column.category);
  const isFlat = column.stages.length === 0;

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
        {isFlat && posts.length > 0 && (
          <p className="column-count">{columnCountLabel(column, lang, posts.length)}</p>
        )}
      </header>

      {isFlat ? (
        posts.length === 0 ? (
          <div className="content-card empty-state">
            <p>{lang === 'zh' ? '这个专栏还在整理中。' : 'This column is still being gathered.'}</p>
          </div>
        ) : (
          <div className="stack-list">
            {flatColumnPosts(lang, column).map((post) => (
              <PostCard key={post.slug} post={post} lang={lang} />
            ))}
          </div>
        )
      ) : (
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
                    : columnCountLabel(column, lang, count)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
