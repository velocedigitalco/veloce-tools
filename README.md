# veloce-tools

Free web & SEO tools, served from `tools.velocedigital.co`. A separate Astro
project from the main `velocedigital1` site by design — its own SEO
property, its own visual identity, room to run ads, and it outlinks back
to velocedigital.co (footer and CTA bands link out with UTM tags so
click-throughs are trackable in analytics).

## Local dev

```
npm install
npm run dev
```

## Deploying (Cloudflare Pages)

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Pick the `velocedigitalco/veloce-tools` repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. Cloudflare will give you a `*.pages.dev` URL first — confirm it looks right there.
5. In the Pages project → **Custom domains** → add `tools.velocedigital.co`.
   Since the root domain (`velocedigital.co`) is already on Cloudflare, this
   just needs a CNAME record added automatically or manually:
   - Type: `CNAME`
   - Name: `tools`
   - Target: `<your-project>.pages.dev`
   - Proxy status: Proxied (orange cloud)
6. Wait for DNS + SSL to provision (usually a few minutes), then
   `tools.velocedigital.co` is live.

## Adding a new tool

Two patterns are in use:

1. **Quick client-side utility** (no SEO page needed yet): add it to the
   `tools` object and the tools grid in `src/pages/index.astro`, same as
   the existing 12 (QR, JSON formatter, password generator, etc.).
2. **Dedicated SEO page** (recommended for anything with real search
   volume — "json formatter online", "password generator", etc.): add a
   page under `src/pages/tools/your-tool-name.astro` using the same
   `.tool-hero` / `.field` / `.prose` / `.faq` classes as
   `seo-meta-tag-generator.astro`, link it from the tools grid, and add
   it to `src/pages/sitemap.xml.ts`.

If a tool needs a server-side check (can't be done in browser JS — e.g.
fetching another site, which needs CORS the target won't send), add a
Cloudflare Pages Function under `functions/api/`.

## Ads

Once there's enough regular traffic to be worth it, an ad network
(Google AdSense, Ezoic, etc.) script can go in `BaseLayout.astro`'s
`<head>`. Privacy Policy and Terms pages already exist, which AdSense
requires before approval. Nothing is added yet.
