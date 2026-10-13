import { useState, useEffect } from 'react'

// Clean-URL router (History API):  /  and  /shop  and  /shop/pies
// The order wizard has its own address too:  /order/occasion  /order/items  /order/schedule  /order/confirm
// It opens on top of whichever page you were on (the home page when you land on it directly).
export const ORDER_STEPS = ['occasion', 'items', 'schedule', 'confirm']
let bg = { page: 'home', cat: '' }
// Old links like  /#/shop/pies  are upgraded to  /shop/pies  automatically.
const HOME_TITLE = typeof document !== 'undefined' ? document.title : "Estelle's Delight"

const cleanPath = () => window.location.pathname.replace(/\/+$/, '') || '/'
const isOrder = (p) => p === '/order' || p.startsWith('/order/')

const parse = () => {
  const p = cleanPath()
  if (isOrder(p)) {
    const seg = p.split('/')[2]
    return { ...bg, order: ORDER_STEPS.includes(seg) ? seg : 'occasion' }
  }
  bg = p === '/shop' || p.startsWith('/shop/') ? { page: 'shop', cat: p.split('/')[2] || 'all' } : { page: 'home', cat: '' }
  return { ...bg, order: null }
}

const bgPath = () => (bg.page === 'shop' ? `/shop${bg.cat && bg.cat !== 'all' ? '/' + bg.cat : ''}` : '/')

function tidyAddress() {
  const h = window.location.hash
  if (h.startsWith('#/')) {                                   // legacy hash link
    window.history.replaceState(null, '', h.startsWith('#/shop') ? h.slice(1) : '/')
  } else if (parse().page === 'home' && !isOrder(cleanPath()) && window.location.pathname !== '/') {
    window.history.replaceState(null, '', '/' + window.location.search + h)   // unknown path -> home
  }
}

/** Go to an in-site address such as '/shop/pies' or '/#menu' without reloading. */
export function navigate(to) {
  const url = new URL(to, window.location.href)
  if (url.origin !== window.location.origin) { window.location.href = to; return }
  if (url.pathname !== window.location.pathname) {
    window.history.pushState({ back: true }, '', url.pathname + url.search + url.hash)
    window.dispatchEvent(new Event('app:navigate'))
  } else if (url.hash && url.hash !== window.location.hash) {
    window.location.hash = url.hash                           // browser scrolls to the section
  } else if (url.hash) {
    document.getElementById(url.hash.slice(1))?.scrollIntoView()
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export const goShop = (cat) => navigate(cat ? `/shop/${cat}` : '/shop')

/** Open the order wizard at step 1-4. */
export const openOrder = (step = 1) => navigate(`/order/${ORDER_STEPS[step - 1] || 'occasion'}`)

/** Move between wizard steps without piling up history entries. */
export function setOrderStep(step) {
  const next = `/order/${ORDER_STEPS[step - 1] || 'occasion'}`
  if (window.location.pathname === next) return
  window.history.replaceState(window.history.state, '', next)
  window.dispatchEvent(new Event('app:navigate'))
}

/** Close the wizard: back to where the person was. */
export function closeOrder() {
  if (window.history.state?.back) { window.history.back(); return }
  window.history.replaceState(null, '', bgPath())
  window.dispatchEvent(new Event('app:navigate'))
}

export function useRoute() {
  const [route, setRoute] = useState(() => { tidyAddress(); return parse() })

  useEffect(() => {
    const on = () => setRoute(prev => {
      const next = parse()
      return prev.page === next.page && prev.cat === next.cat && prev.order === next.order ? prev : next
    })
    // Plain <a href="/shop"> links navigate in-page instead of reloading.
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return
      e.preventDefault()
      navigate(href)
    }
    window.addEventListener('popstate', on)
    window.addEventListener('app:navigate', on)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', on)
      window.removeEventListener('app:navigate', on)
      document.removeEventListener('click', onClick)
    }
  }, [])

  // Scroll: shop pages start at the top; on the home page honour #section anchors.
  useEffect(() => {
    const h = window.location.hash
    if (route.page === 'home' && h.length > 1) {
      const go = () => document.getElementById(h.slice(1))?.scrollIntoView()
      requestAnimationFrame(() => requestAnimationFrame(go))
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [route.page])

  // Tab title + canonical address follow the page (Google runs the JavaScript).
  useEffect(() => {
    document.title = route.order ? "Build your order | Estelle's Delight"
      : route.page === 'shop' ? "Shop | Estelle's Delight, West African Snacks in Perth" : HOME_TITLE
    let robots = document.querySelector('meta[name="robots"]')
    if (route.order) {
      if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
      robots.content = 'noindex'
    } else robots?.remove()
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
    link.href = window.location.origin + (route.order ? `/order/${route.order}` : route.page === 'shop' ? `/shop${route.cat && route.cat !== 'all' ? '/' + route.cat : ''}` : '/')
  }, [route.page, route.cat, route.order])

  return route
}
