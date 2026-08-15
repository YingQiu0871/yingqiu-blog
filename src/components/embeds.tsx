import type { MusicTrack } from '@/lib/blog';

/**
 * Embeds an external player iframe (Spotify / Apple Music / 网易云 etc.).
 * Use inside MDX: <Embed src="https://open.spotify.com/embed/track/…" height="152" />
 */
export function Embed({ src, title, height = 152 }: { src?: string; title?: string; height?: number }) {
  if (!src) return null;
  return (
    <div className="embed-frame">
      <iframe
        src={src}
        title={title ?? 'Embedded player'}
        height={height}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

/** Renders the `music` frontmatter list as a quiet glass track list. */
export function MusicList({ tracks, lang }: { tracks: MusicTrack[]; lang: string }) {
  return (
    <section className="music-list">
      <h2 className="music-list-title">{lang === 'zh' ? '曲目' : 'Tracks'}</h2>
      <ol>
        {tracks.map((track, index) => (
          <li className="track" key={`${track.title}-${index}`}>
            <span className="track-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="track-main">
              <span className="track-title">{track.title}</span>
              {track.artist && <span className="track-artist">{track.artist}</span>}
            </span>
            {track.note && <span className="track-note">{track.note}</span>}
            {track.url && (
              <a
                className="track-link"
                href={track.url}
                target="_blank"
                rel="noreferrer"
                aria-label={lang === 'zh' ? `打开 ${track.title}` : `Open ${track.title}`}
              >
                ↗
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
