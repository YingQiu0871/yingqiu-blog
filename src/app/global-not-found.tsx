export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="not-found" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
          <p className="code" style={{ margin: '0 0 16px', color: '#174986', fontSize: 72, fontWeight: 760, letterSpacing: '-0.06em', lineHeight: 0.9 }}>
            404
          </p>
          <h1 style={{ margin: '0 0 12px', fontSize: 32, lineHeight: 1.2 }}>Page not found</h1>
          <p style={{ color: '#405674', marginBottom: 24 }}>
            页面不存在。The page you are looking for does not exist.
          </p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain anchor is correct for the global 404 page */}
          <a href="/" style={{ color: '#174986', fontWeight: 700 }}>
            ← Back to the blog
          </a>
        </div>
      </body>
    </html>
  );
}
