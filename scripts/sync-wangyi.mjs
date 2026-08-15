// Syncs the NetEase Cloud Music account into the blog.
// - 我喜欢的音乐 (favourites): full track list (capped by WANGYI_TRACK_LIMIT) into the 流声 posts.
// - All created + collected playlists: metadata into public/music/playlists.json.
// Runs in the prebuild hook, so every deploy re-syncs automatically.
// On any failure the script logs a warning and keeps the previously synced data (exit 0).
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

const FAVOURITES_POSTS = [
  { file: 'content/blog/zh/wangyi-playlist.mdx' },
  { file: 'content/blog/en/wangyi-playlist.mdx' },
];

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url.slice(0, 80)}`);
  return res.json();
}

function playlistMeta(item) {
  return {
    id: Number(item.id),
    name: typeof item.name === 'string' ? item.name : '',
    trackCount: Number(item.trackCount) || 0,
    coverImgUrl: typeof item.coverImgUrl === 'string' ? item.coverImgUrl : '',
    url: `https://music.163.com/#/playlist?id=${item.id}`,
  };
}

async function main() {
  // 1. Favourites detail (for uid + the track list used by the 流声 post).
  const detail = await getJson(DETAIL_API);
  const playlist = detail?.playlist;
  if (!playlist || detail.code !== 200) throw new Error('favourites detail failed (playlist public?)');
  const uid = Number(playlist.creator?.userId);
  if (!uid) throw new Error('could not resolve user id');

  const ids = (playlist.trackIds || []).map((item) => Number(item.id)).filter(Boolean);
  const wanted = ids.slice(0, TRACK_LIMIT);

  const songs = [];
  for (let i = 0; i < wanted.length; i += 100) {
    const chunk = wanted.slice(i, i + 100);
    const c = JSON.stringify(chunk.map((id) => ({ id })));
    const data = await getJson(SONG_API + encodeURIComponent(c));
    if (Array.isArray(data.songs)) songs.push(...data.songs);
  }
  const tracks = songs.map((song) => ({
    title: typeof song.name === 'string' ? song.name : `#${song.id}`,
    artist: (song.ar || []).map((a) => a.name).filter(Boolean).join(' / '),
    url: `https://music.163.com/#/song?id=${song.id}`,
  }));

  // 2. All user playlists (created + collected), paged.
  const all = [];
  for (let offset = 0; offset < 2000; offset += 200) {
    const data = await getJson(
      `https://music.163.com/api/user/playlist?uid=${uid}&limit=200&offset=${offset}`,
    );
    const list = Array.isArray(data.playlist) ? data.playlist : [];
    all.push(...list);
    if (list.length < 200) break;
  }

  const created = all.filter((p) => Number(p.creator?.userId) === uid).map(playlistMeta);
  const collected = all
    .filter((p) => Number(p.creator?.userId) !== uid)
    .map((p) => ({
      ...playlistMeta(p),
      creator: typeof p.creator?.nickname === 'string' ? p.creator.nickname : '',
    }));

  // 3. Write playlists.json (full account overview).
  const favMeta = created.find((p) => p.id === Number(PLAYLIST_ID)) ?? playlistMeta(playlist);
  await fs.mkdir('public/music', { recursive: true });
  await fs.writeFile(
    path.join('public/music', 'playlists.json'),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        uid,
        favourite: { ...favMeta, trackCount: playlist.trackCount ?? ids.length },
        created: created.filter((p) => p.id !== Number(PLAYLIST_ID)),
        collected,
      },
      null,
      2,
    ),
    'utf8',
  );

  // 4. Keep the favourites JSON snapshot (backward compatible).
  await fs.writeFile(
    path.join('public/music', 'wangyi-playlist.json'),
    JSON.stringify(
      {
        id: Number(playlist.id),
        name: favMeta.name,
        coverImgUrl: favMeta.coverImgUrl,
        trackCount: playlist.trackCount ?? ids.length,
        updatedAt: new Date().toISOString(),
        tracks,
      },
      null,
      2,
    ),
    'utf8',
  );

  // 5. Update the 流声 posts (music list + updated date).
  for (const { file } of FAVOURITES_POSTS) {
    let raw;
    try {
      raw = await fs.readFile(file, 'utf8');
    } catch {
      continue;
    }
    const { data, content } = matter(raw);
    // Keep YAML dates as plain `YYYY-MM-DD` (gray-matter parses them as Date).
    if (data.date instanceof Date) data.date = data.date.toISOString().slice(0, 10);
    data.music = tracks;
    data.updated = new Date().toISOString().slice(0, 10);
    await fs.writeFile(file, matter.stringify(content, data), 'utf8');
  }

  console.log(
    `wangyi sync ok: ${tracks.length} favourite tracks, ${created.length - 1} created + ${collected.length} collected playlists`,
  );
}

main().catch((err) => {
  console.warn(`wangyi sync skipped: ${err.message}`);
});
