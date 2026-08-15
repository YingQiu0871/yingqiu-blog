// Syncs the NetEase Cloud Music playlist into the 流声 (Music) posts and a public JSON.
// Runs in the prebuild hook, so every deploy re-syncs the playlist automatically.
// The playlist must be public. On any failure the script logs a warning and keeps
// the previously synced data (exit 0) so a build never breaks because of NetEase.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const PLAYLIST_ID = process.env.WANGYI_PLAYLIST_ID || '106894690';
const TRACK_LIMIT = Number(process.env.WANGYI_TRACK_LIMIT || 120);
const DETAIL_API = `https://music.163.com/api/v6/playlist/detail?id=${PLAYLIST_ID}`;
const SONG_API = 'https://music.163.com/api/v3/song/detail?c=';

const HEADERS = {
  Referer: 'https://music.163.com/',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

const POSTS = [
  { file: 'content/blog/zh/wangyi-playlist.mdx' },
  { file: 'content/blog/en/wangyi-playlist.mdx' },
];

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url.slice(0, 80)}`);
  return res.json();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const detail = await getJson(DETAIL_API);
  const playlist = detail?.playlist;
  if (!playlist || detail.code !== 200) {
    throw new Error('playlist detail failed (is the playlist public?)');
  }

  const ids = (playlist.trackIds || []).map((item) => Number(item.id)).filter(Boolean);
  const wanted = ids.slice(0, TRACK_LIMIT);
  if (wanted.length === 0) throw new Error('no track ids returned');

  const songs = [];
  for (let i = 0; i < wanted.length; i += 100) {
    const chunk = wanted.slice(i, i + 100);
    const c = JSON.stringify(chunk.map((id) => ({ id })));
    const data = await getJson(SONG_API + encodeURIComponent(c));
    if (Array.isArray(data.songs)) songs.push(...data.songs);
  }
  if (songs.length === 0) throw new Error('no song details returned');

  const tracks = songs.map((song) => ({
    title: typeof song.name === 'string' ? song.name : `#${song.id}`,
    artist: (song.ar || []).map((a) => a.name).filter(Boolean).join(' / '),
    url: `https://music.163.com/#/song?id=${song.id}`,
  }));

  // Public JSON snapshot (full list served from /music/wangyi-playlist.json).
  const outDir = 'public/music';
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, 'wangyi-playlist.json'),
    JSON.stringify(
      {
        id: Number(playlist.id),
        name: typeof playlist.name === 'string' ? playlist.name : '',
        coverImgUrl: typeof playlist.coverImgUrl === 'string' ? playlist.coverImgUrl : '',
        trackCount: playlist.trackCount ?? ids.length,
        updatedAt: new Date().toISOString(),
        tracks,
      },
      null,
      2,
    ),
    'utf8',
  );

  // Update the front matter of the 流声 posts (music list + updated date).
  for (const { file } of POSTS) {
    let raw;
    try {
      raw = await fs.readFile(file, 'utf8');
    } catch {
      continue; // post not created yet — skip
    }
    const { data, content } = matter(raw);
    data.music = tracks;
    data.updated = today();
    await fs.writeFile(file, matter.stringify(content, data), 'utf8');
  }

  console.log(`wangyi playlist synced (${tracks.length} tracks, ${ids.length} total in playlist)`);
}

main().catch((err) => {
  console.warn(`wangyi sync skipped: ${err.message}`);
});
