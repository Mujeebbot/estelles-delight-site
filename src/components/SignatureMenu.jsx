import { useEffect, useRef } from 'react'
import Reveal from './Reveal.jsx'

import chinchinImg   from '../assets/images/IMG-20260927-WA0287.jpg'
import piesImg       from '../assets/images/pies-tray-3.webp'
import smallChopsImg from '../assets/images/IMG-20260927-WA0270.jpg'
import grillsImg     from '../assets/images/IMG-20260927-WA0277.jpg'
import puffpuffImg   from '../assets/images/puffpuff-strawberry.webp'
import drinksImg     from '../assets/images/drinks-refresh-cans.webp'
import eventsImg     from '../assets/images/IMG-20260927-WA0279.jpg'

const items = [
  { key: 'chinchin',   img: chinchinImg,   name: 'Chin Chin',         sub: '30+ bold flavours',      price: 'From $10',  href: '#/shop/chinchin' },
  { key: 'pies',       img: piesImg,       name: 'Meat Pies',         sub: 'Flaky, juicy, fresh',    price: 'From $4', href: '#/shop/pies' },
  { key: 'smallchops', img: smallChopsImg, name: 'Party Platters',     sub: 'Small chops for a crowd', price: 'From $200', href: '#/shop/platters' },
  { key: 'grills',     img: grillsImg,     name: 'Grills',            sub: 'Bold, smoky, spiced',    price: 'From $5', href: '#/shop/smallchops' },
  { key: 'puffpuff',   img: puffpuffImg,   name: 'Puff Puff',         sub: 'Pillowy and golden',     price: 'From $1', href: '#/shop/puffpuff' },
  { key: 'drinks',     img: drinksImg,     name: 'Mocktails & Zobo',  sub: 'Fresh, alcohol-free',    price: '$10 / can', href: '#/shop/drinks' },
  { key: 'events',     img: eventsImg,     name: 'Event Packs',       sub: 'Your event, handled',    price: 'From $15', href: '#/shop/platters' },
]


function Card({ it, hidden }) {
  return (
    <li className="dl-item" aria-hidden={hidden || undefined}>
      <a className="dl-card" href={it.href} tabIndex={hidden ? -1 : undefined}>
        <span className="dl-photo"><img src={it.img} alt="" loading="lazy" decoding="async" /></span>
        <span className="dl-body">
          <span className="dl-text"><strong>{it.name}</strong><small>{it.sub}</small></span>
          <span className="dl-price">{it.price}</span>
        </span>
      </a>
    </li>
  )
}

/**
 * Auto-drifting, user-scrollable rail.
 * - Drifts left on its own; swipe / drag / trackpad / wheel scrolls it by hand.
 * - Pauses while the person interacts, resumes a couple of seconds after they let go.
 * - Three identical copies of the cards keep it looping in both directions.
 * - Vertical swipes on the cards still scroll the page (touch-action: pan-x pan-y).
 */
function useDrift(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const SPEED = 38            // px per second
    const RESUME_MS = 2200
    let raf = 0, last = 0, pos = 0, lastSet = -1
    let paused = false, visible = true, timer = 0
    let drag = null, moved = false

    const setW = () => {
      const kids = el.firstElementChild?.children
      if (!kids || kids.length < 3) return 0
      const n = kids.length / 3
      return kids[n].offsetLeft - kids[0].offsetLeft
    }
    let W = 0
    const measure = () => {
      const was = W
      W = setW()
      if (W && !was) { el.scrollLeft = W; pos = W; lastSet = W }
    }
    const wrap = () => {
      if (!W) return
      let sl = el.scrollLeft
      if (sl >= 2 * W) sl -= W
      else if (sl < W * 0.5) sl += W
      else return
      el.scrollLeft = sl; pos = sl; lastSet = sl
    }

    const pause = () => { paused = true; clearTimeout(timer) }
    const resumeSoon = (ms = RESUME_MS) => {
      clearTimeout(timer)
      timer = setTimeout(() => { paused = false; pos = el.scrollLeft; last = 0 }, ms)
    }

    const tick = (t) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? Math.min(64, t - last) : 16
      last = t
      if (paused || !visible || reduce || !W) return
      pos += (SPEED * dt) / 1000
      if (pos >= 2 * W) pos -= W
      el.scrollLeft = pos
      lastSet = pos
    }

    const onScroll = () => {
      // ignore the scrolls we caused ourselves; anything else is the person
      if (Math.abs(el.scrollLeft - lastSet) > 1.5) {
        paused = true
        pos = el.scrollLeft
        resumeSoon(drag ? 60000 : RESUME_MS)
        wrap()
      }
    }

    const onTouchStart = () => pause()
    const onTouchEnd = () => resumeSoon(2800)
    const onWheel = (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { pause(); resumeSoon() } }
    const onEnter = (e) => { if (e.pointerType === 'mouse') pause() }
    const onLeave = (e) => { if (e.pointerType === 'mouse' && !drag) resumeSoon(600) }
    const onFocusIn = () => pause()
    const onFocusOut = () => resumeSoon()

    // mouse drag-to-scroll (touch already scrolls natively)
    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      drag = { x: e.clientX, left: el.scrollLeft }
      moved = false
      pause()
    }
    const onMove = (e) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (Math.abs(dx) > 5) { moved = true; el.classList.add('is-dragging') }
      if (moved) { el.scrollLeft = drag.left - dx; pos = el.scrollLeft; lastSet = pos; wrap() }
    }
    const onUp = () => {
      if (!drag) return
      drag = null
      el.classList.remove('is-dragging')
      resumeSoon(1200)
    }
    const onClickCapture = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = 0 }, { threshold: 0.05 })
    io.observe(el)
    const ro = new ResizeObserver(() => { measure(); wrap() })
    ro.observe(el)
    // images settle after load; re-measure
    const late = setTimeout(measure, 600)
    measure()
    raf = requestAnimationFrame(tick)

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)
    el.addEventListener('click', onClickCapture, true)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      cancelAnimationFrame(raf); clearTimeout(timer); clearTimeout(late)
      io.disconnect(); ro.disconnect()
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
      el.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [ref])
}

export default function SignatureMenu() {
  const rail = useRef(null)
  useDrift(rail)

  return (
    <section id="menu" className="section menu-section">
      <div className="wrap">
        <Reveal>
          <div className="menu-header">
            <div>
              <p className="kicker">The menu</p>
              <h2 className="menu-title">Shop Our Delights</h2>
            </div>
            <a href="#/shop" className="menu-view-all">Open the shop <span aria-hidden="true">&rarr;</span></a>
          </div>
        </Reveal>
      </div>

      <div className="dl-marquee" ref={rail} aria-label="Menu categories">
        <ul className="dl-track">
          {items.map(it => <Card key={it.key} it={it} hidden />)}
          {items.map(it => <Card key={it.key + '2'} it={it} />)}
          {items.map(it => <Card key={it.key + '3'} it={it} hidden />)}
        </ul>
      </div>
    </section>
  )
}
