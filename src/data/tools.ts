// Single source of truth for the tool list.
// Add a tool here once and it appears in the homepage grid, the header
// "All tools" menu, the footer, the "More tools" strip on every tool page.
// (Also add its URL to src/pages/sitemap.xml.ts.)
//
// Sorted alphabetically on purpose: no tool is "the default" or ranked above another.
// When the list outgrows a simple grid (dozens of tools), add search + categories here.

export interface Tool {
  href: string;
  title: string;
  desc: string;
  icon: string;
}

const list: Tool[] = [
  { href: '/tools/base64-encoder-decoder', icon: '↔', title: 'Base64 Encoder & Decoder', desc: 'Text, files and images. URL-safe mode, data URIs and previews.' },
  { href: '/tools/color-converter', icon: '◉', title: 'Color Converter', desc: 'HEX, RGB, HSL, CMYK, contrast checks, palettes and a screen eyedropper.' },
  { href: '/tools/hash-generator', icon: '#', title: 'Hash Generator', desc: 'MD5 and SHA family at once, HMAC, file hashing and a hash verifier.' },
  { href: '/tools/image-compressor', icon: '◌', title: 'Image Compressor', desc: 'Batch compress with presets, resize and a before/after slider. Download as ZIP.' },
  { href: '/tools/image-converter', icon: '◫', title: 'Image Converter', desc: 'Batch convert PNG, JPEG, WebP and AVIF. Resize, rotate and flip as you go.' },
  { href: '/tools/json-formatter', icon: '{ }', title: 'JSON Formatter', desc: 'Live validation, tree view, sort keys, minify and auto-fix common mistakes.' },
  { href: '/tools/password-generator', icon: '✦', title: 'Password Generator', desc: 'Random passwords, passphrases and PINs with real entropy-based strength.' },
  { href: '/tools/qr-code-generator', icon: '⌁', title: 'QR Code Generator', desc: 'Links, WhatsApp, Wi-Fi and contacts. Style it, then export PNG or SVG.' },
  { href: '/tools/seo-meta-tag-generator', icon: '◎', title: 'SEO Meta Tag Generator', desc: 'Pixel-width meters, Google desktop, mobile and social previews, and copy-ready tags.' },
  { href: '/tools/text-counter', icon: 'Aa', title: 'Text Counter', desc: 'Live counts, platform limits, keyword density and quick text clean-up.' },
  { href: '/tools/timestamp-converter', icon: '◷', title: 'Timestamp Converter', desc: 'Any timezone, auto-detects seconds to nanoseconds, converts whole lists.' },
  { href: '/tools/url-encoder-decoder', icon: '↗', title: 'URL Encoder & Decoder', desc: 'Encode, decode, parse any link into parts, or build a query string.' },
  { href: '/tools/uuid-generator', icon: '#', title: 'UUID Generator', desc: 'v4, time-ordered v7 or nil. Bulk generate, any format, plus a validator.' },
];

export const tools: Tool[] = list.sort((a, b) => a.title.localeCompare(b.title));
