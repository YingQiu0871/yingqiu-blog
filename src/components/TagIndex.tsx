import type { Locale } from '@/lib/i18n/config';
import { getPostsByTag } from '@/lib/blog';
import PostCard from '@/components/PostCard';

export default function TagIndex({ lang, tag }: { lang: Locale; tag: string }) {
  const posts = getPostsByTag(lang, tag);

  return (
    <>
      <header className="blog-heading">
        <p className="eyebrow">{lang === 'zh' ? '标签' : 'Tag'}</p>
        <h1>#{tag}</h1>
        <p>
          {lang === 'zh'
            ? `共 ${posts.length} 篇`
            : `${posts.length} ${posts.length === 1 ? 'entry' : 'entries'}`}
        </p>
      </header>

      {posts.length > 0 && (
        <div className="stack-list">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} showCategory />
          ))}
        </div>
      )}
    </>
  );
}
