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

/**
 * Shows a self-contained HTML note from /public (e.g. /notes/tu23.html) as a
 * full-width reading frame, with a link to open it on its own page.
 * Use inside MDX: <NoteFrame src="/notes/tu23.html" title="TU23" lang="zh" />
 */
export function NoteFrame({ src, title, lang = 'zh' }: { src?: string; title?: string; lang?: string }) {
  if (!src) return null;
  return (
    <div className="note-frame">
      <iframe src={src} title={title ?? 'Note'} loading="lazy" />
      <a className="note-frame-open" href={src} target="_blank" rel="noreferrer">
        {lang === 'zh' ? '在新窗口中打开 ↗' : 'Open in a new tab ↗'}
      </a>
    </div>
  );
}
