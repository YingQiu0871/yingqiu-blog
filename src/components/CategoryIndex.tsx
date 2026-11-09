import type { Locale } from '@/lib/i18n/config';
import { getColumnPosts, getPosts } from '@/lib/blog';
import { categoryName, type Category } from '@/lib/categories';
import Link from 'next/link';
import { columnCountLabel, columnPath, getColumnsOfCategory, stagePath } from '@/lib/columns';
import PostCard from '@/components/PostCard';
import PlaylistIndex from '@/components/PlaylistIndex';

export default function CategoryIndex({
  lang,
  category,
}: {
  lang: Locale;
  category: Category;
}) {
  const columns = getColumnsOfCategory(category.id);
  // Posts that belong to a column are reached through that column's card, so
  // the section list only shows the remaining posts.
  const posts = getPosts(lang, { category: category.id }).filter((post) => !post.column);
  const copy = lang === 'zh' ? category.zh : category.en;

  return (
    <>
      <header className="blog-heading">
        <p className="eyebrow">{lang === 'zh' ? '栏目' : 'Section'}</p>
        <h1>{categoryName(category, lang)}</h1>
        <p>{copy.description}</p>
      </header>

      {columns.map((column) => {
        const colCopy = lang === 'zh' ? column.zh : column.en;
        const colPosts = getColumnPosts(lang, column.id);
        const total = colPosts.length;
        const hasStages = column.stages.length > 0;
        const meta = hasStages
          ? lang === 'zh'
            ? `${columnCountLabel(column, lang, total)} · ${column.stages.length} 个阶段`
            : `${columnCountLabel(column, lang, total)} · ${column.stages.length} stages`
          : columnCountLabel(column, lang, total);
        return (
          <section key={column.id} className="column-feature" aria-labelledby={`column-${column.id}`}>
            <div className="column-feature-head">
              <div className="column-feature-text">
                <span className="column-feature-label">{lang === 'zh' ? '专栏' : 'Column'}</span>
                <h2 id={`column-${column.id}`}>
                  <Link href={columnPath(lang, column.id)}>{colCopy.name}</Link>
                </h2>
                <p>{colCopy.description}</p>
                <p className="column-feature-meta">{meta}</p>
              </div>
              <Link className="column-feature-cta" href={columnPath(lang, column.id)}>
                {lang === 'zh' ? '进入专栏' : 'Open column'}
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
            {hasStages && (
              <ul className="column-feature-stages">
                {column.stages.map((stage) => {
                  const count = colPosts.filter((post) => post.stage === stage.id).length;
                  return (
                    <li key={stage.id}>
                      <Link href={stagePath(lang, column.id, stage.id)} data-empty={count === 0 || undefined}>
                        <strong>{lang === 'zh' ? stage.zh.name : stage.en.name}</strong>
                        <span>
                          {count === 0
                            ? lang === 'zh'
                              ? '整理中'
                              : 'Soon'
                            : lang === 'zh'
                              ? `${count} 篇`
                              : `${count} ${count === 1 ? 'note' : 'notes'}`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}

      {posts.length === 0 && columns.length > 0 ? null : posts.length === 0 ? (
        <div className="content-card empty-state">
          <p>
            {lang === 'zh'
              ? '这里还空着——第一篇会慢慢到来。'
              : 'Nothing here yet — the first page will come in time.'}
          </p>
        </div>
      ) : (
        <div className="stack-list">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} />
          ))}
        </div>
      )}

      {category.id === 'liusheng' && <PlaylistIndex lang={lang} embedded />}
    </>
  );
}
