const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/tools/seo-meta-tag-generator', priority: '0.8', changefreq: 'monthly' },
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
