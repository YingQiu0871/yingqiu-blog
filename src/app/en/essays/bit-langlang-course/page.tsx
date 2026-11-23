import Link from 'next/link';
import { stagePath } from '@/lib/columns';

export const dynamic = 'force-static';

const target = stagePath('en', 'crypto-notes', 'course');

export const metadata = { robots: { index: false } };

/** The live course moved into the crypto-notes column; keep the old address working. */
export default function LegacyBitCoursePage() {
  return (
    <div className="content-card blog-fallback">
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <h1>This column has moved</h1>
      <p>The Bit Langlang live course now lives under Crypto Notes, in the Course Notes group.</p>
      <div className="blog-fallback-actions">
        <Link className="button" href={target}>
          Go to the new address
        </Link>
      </div>
    </div>
  );
}
