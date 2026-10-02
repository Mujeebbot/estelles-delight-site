import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import Reveal from './Reveal.jsx'

// All images — original webps + new customer photos
import img01 from '../assets/images/chinchin-flatlay.webp'
import img02 from '../assets/images/IMG-20260927-WA0266.jpg'
import img03 from '../assets/images/chinchin-lifestyle-tub.webp'
import img04 from '../assets/images/IMG-20260927-WA0267.jpg'
import img05 from '../assets/images/pies-tray-1.webp'
import img06 from '../assets/images/IMG-20260927-WA0272.jpg'
import img07 from '../assets/images/puffpuff-strawberry.webp'
import img08 from '../assets/images/IMG-20260927-WA0275.jpg'
import img09 from '../assets/images/drinks-zobo-chapman.webp'
import img10 from '../assets/images/chinchin-tubs-group.webp'
import img11 from '../assets/images/catering-box-full.webp'
import img12 from '../assets/images/puffpuff-pies-boxes.webp'
import img13 from '../assets/images/market-table-closeup.webp'
import img14 from '../assets/images/chinchin-strips-lifestyle.webp'
import img15 from '../assets/images/smallchops-handheld.webp'
import img16 from '../assets/images/drinks-refresh-cans.webp'
import img17 from '../assets/images/IMG-20260927-WA0270.jpg'
import img18 from '../assets/images/catering-boxes-rows.webp'
import xtra0 from '../assets/images/IMG-20260927-WA0298.jpg'
import xtra1 from '../assets/images/IMG-20260927-WA0301.jpg'
import xtra2 from '../assets/images/IMG-20260927-WA0305.jpg'
import xtra3 from '../assets/images/IMG-20260927-WA0307.jpg'
import xtra4 from '../assets/images/IMG-20260927-WA0285.jpg'
import xtra5 from '../assets/images/IMG-20260927-WA0273.jpg'

const IMAGES = [
  img01, img02, img03, img04, img05, img06,
  img07, img08, img09, img10, img11, img12,
  img13, img14, img15, img16, img17, img18,
  xtra0, xtra1, xtra2, xtra3, xtra4, xtra5,
]


const MAX_VISIBLE = 7
const AUTO_MS = 3200

// Per-distance-from-centre tables (index = |slot - centre|)
const LIFT  = [0, 21, 64, 117]            // px the card sits below centre
const SCALE = [1, 0.935, 0.85, 0.776]
const ROT   = 7                            // deg per slot

/** All positions are derived from real pixel widths, never from viewport height. */
function slotLayout(slot, n, stageW, cardW) {
  const half = n >> 1
  const k = slot - half
  const a = Math.abs(k)
  const step = Math.min(cardW * 1.02, (stageW / 2 - cardW * 0.62) / half)
  const f = cardW < 130 ? 0.5 : 1   // smaller fan on phones keeps rotated corners inside the stage
  return { x: k * step, y: LIFT[a] * f, rot: k * ROT, scale: SCALE[a], zIndex: 10 - a }
}

export default function FanGallery() {
  const total = IMAGES.length
  const sectionRef   = useRef(null)
  const containerRef = useRef(null)
  const isAnimating  = useRef(false)
  const hasEntered   = useRef(false)
  const directionRef = useRef('right')
  const prevVisible  = useRef(new Set())
  const paused       = useRef(false)
  const inView       = useRef(false)
  const touch        = useRef({ x: 0, y: 0 })
  const reduced      = useRef(false)

  const [centerIndex, setCenterIndex] = useState(3)
  const [maxVisible, setMaxVisible]   = useState(MAX_VISIBLE)
  const [near, setNear]               = useState(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => setMaxVisible(window.innerWidth < 640 ? 5 : MAX_VISIBLE)
    update()
    let w = window.innerWidth
    const onResize = () => { if (window.innerWidth !== w) { w = window.innerWidth; update() } }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const half = maxVisible >> 1

  const getVisibleMap = useCallback((center) => {
    const map = new Map()
    for (let slot = 0; slot < maxVisible; slot++) {
      map.set((((center + slot - half) % total) + total) % total, slot)
    }
    return map
  }, [total, maxVisible, half])

  const cycle = useCallback((direction) => {
    if (isAnimating.current) return
    isAnimating.current = true
    directionRef.current = direction
    setCenterIndex(p => direction === 'right' ? (p + 1) % total : (p - 1 + total) % total)
  }, [total])

  // Auto-rotate: only while on screen, tab visible, not touched/hovered, motion allowed
  useEffect(() => {
    const el = sectionRef.current
    let io
    if (el && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting }, { threshold: 0.35 })
      io.observe(el)
    }
    let ioNear
    if (el && 'IntersectionObserver' in window) {
      ioNear = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); ioNear.disconnect() } }, { rootMargin: '900px 0px' })
      ioNear.observe(el)
    } else setNear(true)
    const timer = setInterval(() => {
      if (reduced.current || document.hidden || paused.current || !inView.current) return
      cycle('right')
    }, AUTO_MS)
    return () => { clearInterval(timer); io && io.disconnect(); ioNear && ioNear.disconnect() }
  }, [cycle])

  // GSAP fan layout
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cards = Array.from(container.querySelectorAll('.fan-card'))
    const visible = getVisibleMap(centerIndex)
    const before = prevVisible.current
    const dir = directionRef.current
    const first = !hasEntered.current

    const stageW = container.clientWidth
    const cardW = cards[0].offsetWidth
    const off = stageW / 2 + cardW
    const cfg = (slot) => slotLayout(slot, maxVisible, stageW, cardW)

    if (first) isAnimating.current = true
    let done = 0
    const onDone = () => {
      if (++done >= visible.size) { isAnimating.current = false; if (first) hasEntered.current = true }
    }

    cards.forEach((card, idx) => {
      const slot = visible.get(idx)
      const was = before.has(idx)
      if (slot !== undefined) {
        const c = cfg(slot)
        const to = { x: c.x, y: c.y, rotation: c.rot, scale: c.scale, autoAlpha: 1, zIndex: c.zIndex, force3D: true }
        if (first) {
          gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 0.6, autoAlpha: 0, zIndex: c.zIndex })
          gsap.to(card, { ...to, duration: reduced.current ? 0.01 : 0.9, ease: 'power3.out', delay: reduced.current ? 0 : 0.05 * Math.abs(slot - half), onComplete: onDone })
        } else if (!was) {
          const sign = dir === 'right' ? 1 : -1
          gsap.set(card, { x: sign * off, y: c.y, rotation: sign * 22, scale: 0.7, autoAlpha: 0, zIndex: c.zIndex })
          gsap.to(card, { ...to, duration: 0.7, ease: 'power2.inOut', onComplete: onDone })
        } else {
          gsap.to(card, { ...to, duration: 0.7, ease: 'power2.inOut', onComplete: onDone })
        }
      } else if (was) {
        const sign = dir === 'right' ? -1 : 1
        gsap.to(card, { x: sign * off, rotation: sign * 22, scale: 0.7, autoAlpha: 0, zIndex: 0, duration: 0.6, ease: 'power2.inOut' })
      } else if (first) {
        gsap.set(card, { autoAlpha: 0, scale: 0.6, x: 0, y: 0, zIndex: 0 })
      }
    })
    prevVisible.current = new Set(visible.keys())

    // Pointer hover spread — mouse only, never on touch
    const entries = cards.map((el, i) => ({ el, slot: visible.get(i) })).filter(e => e.slot !== undefined)
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const spread = (hovered) => {
      entries.forEach(({ el, slot }) => {
        const c = cfg(slot)
        let { x, y, rot, scale } = c
        if (hovered !== null) {
          if (slot === hovered) { y -= 36; scale *= 1.08 }
          else {
            const d = Math.abs(slot - hovered)
            const push = 30 / (1 + d * 0.5)
            x += slot < hovered ? -push : push
            rot += (slot < hovered ? -1 : 1) * (3 / (d + 1))
          }
        }
        gsap.to(el, { x, y, rotation: rot, scale, duration: 0.45, ease: 'power3.out', overwrite: 'auto', force3D: true })
      })
    }
    const cleanups = []
    if (fine) {
      let t
      entries.forEach(({ el, slot }) => {
        const enter = () => { paused.current = true; clearTimeout(t); if (!isAnimating.current) spread(slot) }
        el.addEventListener('mouseenter', enter)
        cleanups.push(() => el.removeEventListener('mouseenter', enter))
      })
      const leave = () => { clearTimeout(t); t = setTimeout(() => { paused.current = false; if (!isAnimating.current) spread(null) }, 60) }
      container.addEventListener('mouseleave', leave)
      cleanups.push(() => { container.removeEventListener('mouseleave', leave); clearTimeout(t) })
    }

    // Re-seat cards when the stage width changes (rotation, window resize)
    let lastW = stageW
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth
      if (w === lastW || isAnimating.current) return
      lastW = w
      entries.forEach(({ el, slot }) => {
        const c = slotLayout(slot, maxVisible, w, cards[0].offsetWidth)
        gsap.set(el, { x: c.x, y: c.y, rotation: c.rot, scale: c.scale })
      })
    })
    ro.observe(container)
    cleanups.push(() => ro.disconnect())

    return () => cleanups.forEach(fn => fn())
  }, [centerIndex, total, getVisibleMap, maxVisible, half])

  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; paused.current = true }
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) cycle(dx < 0 ? 'right' : 'left')
    setTimeout(() => { paused.current = false }, 2500)
  }

  const jumpTo = (i) => {
    if (isAnimating.current || i === centerIndex) return
    directionRef.current = i > centerIndex ? 'right' : 'left'
    isAnimating.current = true
    setCenterIndex(i)
  }

  return (
    <section id="gallery" ref={sectionRef} className="fangallery-section section">
      <div className="wrap">
        <Reveal>
          <div className="fangallery-head">
            <p className="kicker">@estelles_delight</p>
            <h2>Find us out and about.</h2>
            <p className="fangallery-sub">Follow along for behind-the-scenes, new flavours and market updates.</p>
          </div>
        </Reveal>

        <div className="fangallery-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div ref={containerRef} className="fan-layout">
            {IMAGES.map((src, index) => (
              <div key={index} className="fan-card">
                <img src={near ? src : undefined} alt={`Estelle's Delight photo ${index + 1}`} decoding="async" draggable="false" />
              </div>
            ))}
          </div>
        </div>

        <div className="fan-controls">
          <button className="fan-arrow" onClick={() => cycle('left')} aria-label="Previous photo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div className="fan-dots" aria-hidden="true">
            {IMAGES.map((_, i) => (
              <span key={i} className={`fan-dot${i === centerIndex ? ' active' : ''}`} onClick={() => jumpTo(i)} />
            ))}
          </div>
          <p className="fan-count" aria-live="polite">{centerIndex + 1} / {total}</p>

          <button className="fan-arrow" onClick={() => cycle('right')} aria-label="Next photo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <Reveal>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="https://www.instagram.com/estelles_delight/" target="_blank" rel="noreferrer" className="btn btn-outline">
              Follow Along on Instagram
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
