import Link from 'next/link';
import { stagePath } from '@/lib/columns';

export const dynamic = 'force-static';

const target = stagePath('zh', 'crypto-notes', 'course');

export const metadata = { robots: { index: false } };

/** The live course moved into the crypto-notes column; keep the old address working. */
export default function LegacyBitCoursePage() {
  return (
    <div className="content-card blog-fallback">
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <h1>这个专栏搬家了</h1>
      <p>《万倍Bit浪浪直播课》现在在「币圈笔记」专栏的直播课整理分组里。</p>
      <div className="blog-fallback-actions">
        <Link className="button" href={target}>
          前往新地址
        </Link>
      </div>
    </div>
  );
}
