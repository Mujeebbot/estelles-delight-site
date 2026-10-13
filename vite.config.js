import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Link previews (WhatsApp, Instagram, iMessage) need ABSOLUTE urls for the share image.
// Set VITE_SITE_URL to your live address, e.g. https://www.estellesdelight.com.au
// (in .env.production, or in your host's environment variables). Without it, the
// url-based tags are simply left out instead of being wrong.
function seo(siteUrl) {
  return {
    name: 'seo-tags',
    transformIndexHtml() {
      const tags = []
      const url = siteUrl.replace(/\/+$/, '')
      const business = {
        '@context': 'https://schema.org',
        '@type': 'Bakery',
        name: "Estelle's Delight",
        description: 'West African snacks handmade in Perth: chin-chin, meat pies, puff-puff, small chops, drinks and catering.',
        servesCuisine: 'West African',
        telephone: '+61426921991',
        email: 'estelledelight@gmail.com',
        areaServed: { '@type': 'City', name: 'Perth, Western Australia' },
        priceRange: '$$',
      }
      if (url) {
        business.url = url + '/'
        business.image = url + '/og-image.jpg'
        // canonical + og:url are set per page in src/lib/route.js (they differ for /shop)
        tags.push(
          { tag: 'meta', attrs: { property: 'og:image', content: url + '/og-image.jpg' }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: url + '/og-image.jpg' }, injectTo: 'head' },
        )
      }
      tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(business), injectTo: 'head' })
      return tags
    },
    // robots.txt + sitemap.xml (the sitemap needs the live address)
    generateBundle() {
      const url = siteUrl.replace(/\/+$/, '')
      this.emitFile({ type: 'asset', fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${url ? `\nSitemap: ${url}/sitemap.xml\n` : ''}` })
      if (!url) return
      const paths = ['/', '/shop', ...['chinchin', 'pies', 'smallchops', 'platters', 'puffpuff', 'drinks'].map(c => `/shop/${c}`)]
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p => `  <url><loc>${url}${p}</loc></url>`).join('\n')}\n</urlset>\n` })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || process.env.VITE_SITE_URL || ''
  return { plugins: [react(), seo(siteUrl)] }
})
