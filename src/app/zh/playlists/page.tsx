import { createPageMetadata } from '@/lib/metadata';
import PlaylistIndex from '@/components/PlaylistIndex';

export const dynamic = 'force-static';

export function generateMetadata() {
  return createPageMetadata('zh', '/zh/playlists/', {
    en: {
      title: 'Playlists',
      description: 'My NetEase Cloud Music playlists — favourites, created and collected, auto-synced.',
    },
    zh: {
      title: '歌单',
      description: '我的网易云音乐歌单——喜欢的音乐、创建与收藏的歌单，自动同步。',
    },
  });
}

export default function ChinesePlaylistsPage() {
  return <PlaylistIndex lang="zh" />;
}
