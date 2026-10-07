const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/tools/seo-meta-tag-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/qr-code-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/image-compressor', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/image-converter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/json-formatter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/password-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/text-counter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/uuid-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/base64-encoder-decoder', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/url-encoder-decoder', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/timestamp-converter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/hash-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/color-converter', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

export async function GET() {
  const site = 'https://tools.velocedigital.co';
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${site}${p.path}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
