import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

type PlaylistMeta = {
  id: number;
  name: string;
  trackCount: number;
  coverImgUrl: string;
  url: string;
  creator?: string;
};

type PlaylistsData = {
  updatedAt: string;
  favourite: PlaylistMeta;
  created: PlaylistMeta[];
  collected: (PlaylistMeta & { creator: string })[];
};

function loadData(): PlaylistsData | null {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public/music', 'playlists.json'), 'utf8');
    return JSON.parse(raw) as PlaylistsData;
  } catch {
    return null;
  }
}

export default function PlaylistIndex({ lang, embedded = false }: { lang: Locale; embedded?: boolean }) {
  const data = loadData();
  const zh = lang === 'zh';

  if (!data) {
    return (
      <div className="content-card empty-state">
        <p>
          {zh
            ? '歌单数据尚未同步——下次构建时会自动抓取。'
            : 'Playlist data has not been synced yet — it will be fetched on the next build.'}
        </p>
      </div>
    );
  }

  const updated = new Date(data.updatedAt).toLocaleDateString(zh ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const favPostHref = zh ? '/posts/wangyi-playlist/' : '/en/posts/wangyi-playlist/';

  return (
    <>
      {embedded ? (
        <>
          <h2 className="section-title">{zh ? '我的歌单（自动同步）' : 'My playlists (auto-synced)'}</h2>
          <p className="playlist-synced-note">
            {zh
              ? `从网易云自动同步 · 更新于 ${updated}`
              : `Auto-synced from NetEase Cloud Music · updated ${updated}`}
          </p>
        </>
      ) : (
        <header className="blog-heading">
          <p className="eyebrow">{zh ? '歌单' : 'Playlists'}</p>
          <h1>{zh ? '我的歌单' : 'My playlists'}</h1>
          <p>
            {zh
              ? `从我的网易云音乐账号自动同步（更新于 ${updated}），喜欢的音乐、创建的歌单与收藏的歌单都收在这里。`
              : `Auto-synced from my NetEase Cloud Music account (updated ${updated}) — favourites, created playlists and collected playlists.`}
          </p>
        </header>
      )}

      {data.favourite && (
        <div className="content-card playlist-hero">
          {data.favourite.coverImgUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- remote cover from NetEase CDN
            <img src={data.favourite.coverImgUrl} alt="" loading="lazy" />
          )}
          <div className="playlist-hero-copy">
            <p className="eyebrow">{zh ? '我喜欢的音乐' : 'Favourite Songs'}</p>
            <h2>{data.favourite.name}</h2>
            <p>
              {zh
                ? `${data.favourite.trackCount} 首 · 本站收录最近 ${data.created ? '120' : ''} 首曲目`
                : `${data.favourite.trackCount} tracks · the most recent are listed on this blog`}
            </p>
            <div className="playlist-hero-actions">
              <Link className="button" href={favPostHref}>
                {zh ? '本站的曲目列表' : 'Track list on this blog'}
              </Link>
              <a className="text-link" href={data.favourite.url} target="_blank" rel="noreferrer">
                {zh ? '在网易云打开' : 'Open on NetEase'} ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {data.created.length > 0 && (
        <>
          <h2 className="section-title">
            {zh ? `创建的歌单（${data.created.length}）` : `Created playlists (${data.created.length})`}
          </h2>
          <div className="playlist-grid">
            {data.created.map((p) => (
              <a className="playlist-card" key={p.id} href={p.url} target="_blank" rel="noreferrer">
                {p.coverImgUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote cover from NetEase CDN
                  <img src={p.coverImgUrl} alt="" loading="lazy" />
                ) : (
                  <span className="playlist-card-blank" aria-hidden="true">
                    ♪
                  </span>
                )}
                <span className="playlist-card-name">{p.name}</span>
                <span className="playlist-card-count">{p.trackCount} 首</span>
              </a>
            ))}
          </div>
        </>
      )}

      {data.collected.length > 0 && (
        <details className="collected">
          <summary>
            {zh
              ? `收藏的歌单（${data.collected.length}）`
              : `Collected playlists (${data.collected.length})`}
          </summary>
          <ul>
            {data.collected.map((p) => (
              <li key={p.id}>
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.name}
                </a>
                <span className="collected-by">
                  {p.trackCount} 首 · {p.creator}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
