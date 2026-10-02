import { useState, useEffect } from 'react'

// Tiny hash router: "#/shop" and "#/shop/pies" are the shop, anything else is the home page.
const parse = () => {
  const h = window.location.hash
  if (h.startsWith('#/shop')) return { page: 'shop', cat: h.split('/')[2] || 'all' }
  return { page: 'home', cat: '' }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  // Reset scroll when the page changes; on the home page honour #section anchors.
  useEffect(() => {
    const h = window.location.hash
    if (route.page === 'shop') {
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else if (h.length <= 2) {
      // Back to the landing page from the shop: start at the top
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else if (h.length > 1 && !h.startsWith('#/')) {
      const go = () => document.getElementById(h.slice(1))?.scrollIntoView()
      requestAnimationFrame(() => requestAnimationFrame(go))
    }
  }, [route.page])

  return route
}

export const goShop = (cat) => { window.location.hash = cat ? `#/shop/${cat}` : '#/shop' }
