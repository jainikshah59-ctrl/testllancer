/**
 * prerender.js — Disabled prerender
 *
 * The SSR prerender was injecting corrupted HTML into #root due to React's
 * renderToString HTML-escaping CSS strings and SVG/base64 content, causing
 * "Unexpected token '<'" SyntaxErrors that crashed all JS on the page.
 *
 * SEO is fully handled by:
 *   1. The <head> meta tags, structured data (JSON-LD), and canonical links
 *   2. The aria-hidden SEO content div in index.html (full text content for Googlebot)
 *   3. The <noscript> section with H1, H2, and internal links
 *
 * Googlebot crawls JS-rendered pages fine — prerendering is not needed.
 */

console.log('ℹ️  Prerender disabled — SEO handled via static meta tags and noscript content.');
console.log('✅  Build complete.');