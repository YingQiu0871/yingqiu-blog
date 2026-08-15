import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import type { Locale } from '@/lib/i18n/config';
import {
  formatOriginalDate,
  formatPostDate,
  originalYearLabel,
  readingTimeLabel,
  type BlogPost,
} from '@/lib/blog';
import { categoryName, categoryPath, getCategory, tagPath } from '@/lib/categories';
import { Embed, MusicList } from '@/components/embeds';

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeHighlight],
  },
};

export default function PostView({ lang, post }: { lang: Locale; post: BlogPost }) {
  const category = getCategory(post.category);
  const originalYear = originalYearLabel(post);
  const isOldLetter = post.category === 'jiujian' && !!originalYear;
  const homeHref = lang === 'zh' ? '/zh/' : '/';

  return (
    <article>
      <header className="blog-post-header">
        {category && (
          <p className="eyebrow">
            <Link href={categoryPath(lang, post.category)}>{categoryName(category, lang)}</Link>
          </p>
        )}
        <h1>{post.title}</h1>
        <div className="blog-post-meta">
          <time dateTime={post.date}>{formatPostDate(post.date, lang)}</time>
          <span>{readingTimeLabel(post)}</span>
          {post.updated ? (
            <span>
              {lang === 'zh'
                ? `更新于 ${formatPostDate(post.updated, lang)}`
                : `Updated ${formatPostDate(post.updated, lang)}`}
            </span>
          ) : null}
        </div>
        {isOldLetter && post.originalDate && (
          <p className="original-date-line">
            {lang === 'zh'
              ? `原作于 ${formatOriginalDate(post.originalDate, lang)}，此处保存原貌。`
              : `Originally written ${formatOriginalDate(post.originalDate, lang)}; kept here as it was.`}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="tag-list">
            {post.tags.map((tag) => (
              <Link className="tag" key={tag} href={tagPath(lang, tag)}>
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.rereadNote && (
        <aside className="reread-note">
          <span className="reread-label">
            {lang === 'zh' ? '多年后重读' : 'Rereading it years later'}
          </span>
          <p>{post.rereadNote}</p>
        </aside>
      )}

      {post.quote && (
        <figure className="post-quote">
          <blockquote>{post.quote}</blockquote>
          {post.quoteSource && <figcaption>— {post.quoteSource}</figcaption>}
        </figure>
      )}

      {post.music && <MusicList tracks={post.music} lang={lang} />}

      <div className="blog-article">
        <MDXRemote source={post.source} options={mdxOptions} components={{ Embed }} />
      </div>

      <footer className="blog-post-footer">
        {category && (
          <Link className="text-link" href={categoryPath(lang, post.category)}>
            ← {categoryName(category, lang)}
          </Link>
        )}
        <Link className="text-link" href={homeHref}>
          {lang === 'zh' ? '回到首页' : 'Back to home'}
        </Link>
      </footer>
    </article>
  );
}
