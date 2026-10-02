import { useState, useEffect, useRef, useCallback } from 'react'

import { CHINCHIN_CATEGORIES } from '../data/menu.js'
import chinchinImg   from '../assets/images/IMG-20260927-WA0297.jpg'
import piesImg       from '../assets/images/hero-pies.jpg'
import smallChopsImg from '../assets/images/IMG-20260927-WA0281.jpg'
import grillsImg     from '../assets/images/IMG-20260927-WA0267.jpg'
import puffpuffImg   from '../assets/images/IMG-20260927-WA0266.jpg'
import drinksImg     from '../assets/images/IMG-20260927-WA0269.jpg'

const SLIDE_MS = 6000

/**
 * Each slide: copy + photo. `modal: true` makes the main CTA open the order form,
 * otherwise it scrolls to `href`.
 */
const slides = [
  {
    key: 'chinchin', img: chinchinImg, pos: '50% 55%',
    eyebrow: 'Authentic Nigerian treats',
    line1: 'Chin-Chin,', line2: 'Made Different.',
    desc: 'Handcrafted with premium ingredients, our chin-chin comes in 30 bold flavours. Same great taste, always.',
    cta: 'Shop Chin-Chin', href: '#/shop/chinchin',
    tickerLabel: '30 flavours', ticker: CHINCHIN_CATEGORIES.flatMap(c => c.items),
    note: 'Crispy. Buttery. Irresistible.', chip: ['Flavours', '30+'],
  },
  {
    key: 'pies', img: piesImg, pos: '50% 50%',
    eyebrow: 'Meat pies',
    line1: 'Flaky, Juicy,', line2: 'Baked to Order.',
    desc: 'Beef, fish or chicken in mini, medium or large. Golden pastry, baked fresh for every order.',
    cta: 'Order Pies', href: '#/shop/pies',
    tickerLabel: 'Fillings and sizes', ticker: ['Beef', 'Fish', 'Chicken', 'Mini', 'Medium', 'Large', 'Flaky pastry', 'Baked fresh', 'From $4'],
    note: 'One bite and you’re sold.', chip: ['From', '$4'],
  },
  {
    key: 'smallchops', img: smallChopsImg, pos: '50% 50%',
    eyebrow: 'The party platter',
    line1: 'Small Chops,', line2: 'Big Celebrations.',
    desc: 'Spring rolls, samosas, puff-puff, gizzards and more, boxed up and ready for your table.',
    cta: 'Shop Small Chops', href: '#/shop/smallchops',
    tickerLabel: 'On the platter', ticker: ['Spring rolls', 'Samosas', 'Meat pies', 'Puff-puff', 'Gizzard skewers', 'Pepper wings', 'Drumsticks'],
    note: 'Your guests will ask who made it.', chip: ['From', '$200'],
  },
  {
    key: 'grills', img: grillsImg, pos: '50% 45%',
    eyebrow: 'Fresh off the grill',
    line1: 'Bold, Smoky,', line2: 'Perfectly Spiced.',
    desc: 'Juicy grilled chicken and skewers with a kick. Order for one, or feed the whole crowd.',
    cta: 'Shop Grills', href: '#/shop/smallchops',
    tickerLabel: 'From the grill', ticker: ['Pepper drumsticks', 'Pepper wings', 'Pepper turkey', 'Gizzard skewers', 'Smoky', 'Juicy', 'Bold spice'],
    note: 'Suya-style, the right way.', chip: ['From', '$5'],
  },
  {
    key: 'puffpuff', img: puffpuffImg, pos: '50% 50%',
    eyebrow: 'Puff-puff',
    line1: 'Pillowy, Golden,', line2: 'Dangerously Good.',
    desc: 'Soft, warm and lightly sweet, fried to order. You will not stop at one.',
    cta: 'Order Puff-Puff', href: '#/shop/puffpuff',
    tickerLabel: 'Flavours', ticker: ['Nutmeg original', 'Chilly', 'Ginger', 'Coconut', 'Cinnamon', 'Banana', 'Chocolate', 'Chocolate chip', 'Glaze toppings'],
    note: 'Best eaten warm.', chip: ['From', '$1'],
  },
  {
    key: 'drinks', img: drinksImg, pos: '50% 50%',
    eyebrow: 'Mocktails and zobo',
    line1: 'Sip Something', line2: 'Fresh and Fruity.',
    desc: 'Alcohol-free mocktails and hibiscus zobo, canned cold and made for every occasion.',
    cta: 'Shop Drinks', href: '#/shop/drinks',
    tickerLabel: 'On the menu', ticker: ['Classic Mint Mojito', 'Kiwi Mojito', 'Blue Lagoon', 'Ocean Mist', 'Citrus Breeze', 'Golden Sunrise', 'Strawberry Crush', 'Chapman Classic', 'Berry Royale', 'Yuzu Spark', 'Dragon Splash', 'Lavender Dream', 'Tropical Citrus Zobo'],
    note: 'All the flavour, zero alcohol.', chip: ['Per can', '$10'],
  },
]

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
)

export default function Hero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const reduced = useRef(false)
  const touch   = useRef({ x: 0, y: 0 })

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Only run while the hero is actually on screen
  const heroRef = useRef(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = heroRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const go = useCallback((i) => setActive(((i % slides.length) + slides.length) % slides.length), [])
  const next = useCallback(() => setActive(s => (s + 1) % slides.length), [])
  const prev = useCallback(() => setActive(s => (s - 1 + slides.length) % slides.length), [])

  const running = !paused && !hidden && inView && !reduced.current

  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; setPaused(true) }
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)()
    setPaused(false)
  }

  return (
    <section id="hero" ref={heroRef} aria-roledescription="carousel" aria-label="Featured treats">
      {/* Full-bleed product photography, one layer per slide */}
      <div className="hero-photos" aria-hidden="true">
        {slides.map((s, i) => (
          <div key={s.key} className={`hero-photo${i === active ? ' is-active' : ''}`}>
            <img className="bg" src={s.img} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
            <img className="fg" src={s.img} alt="" style={{ objectPosition: s.pos }}
                 loading={i === 0 ? 'eager' : 'lazy'} decoding="async" fetchpriority={i === 0 ? 'high' : 'auto'} />
          </div>
        ))}
        <div className="hero-shade" />
      </div>

      {/* Cream header band with red + yellow swoosh */}
      <svg className="hero-top" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,0 H1440 V62 C1180,112 960,38 700,70 C440,102 220,52 0,86 Z" fill="var(--brand-cream)" />
        <path d="M0,86 C220,52 440,102 700,70 C960,38 1180,112 1440,62" fill="none" stroke="var(--brand-red)" strokeWidth="7" strokeLinecap="round" />
        <path d="M0,98 C230,66 450,112 700,84 C960,56 1190,118 1440,76" fill="none" stroke="var(--brand-yellow)" strokeWidth="4" strokeLinecap="round" opacity=".95" />
      </svg>

      <div
        className="hero-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }}
      >
        <div className="hero-slides">
          {slides.map((s, i) => {
            const on = i === active
            const Heading = i === 0 ? 'h1' : 'h2'
            return (
              <article key={s.key} className={`hero-slide${on ? ' is-active' : ''}`}
                       aria-hidden={!on} inert={!on ? '' : undefined}
                       aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
                <div className="hero-copy">
                  <p className="hero-eyebrow"><span />{s.eyebrow}</p>
                  <Heading className="hero-h1">
                    <span className="l1">{s.line1}</span>
                    <span className="l2">{s.line2}</span>
                  </Heading>
                  <p className="hero-desc">{s.desc}</p>
                  <div className="hero-actions">
                    <a href={s.href} className="hero-cta" tabIndex={on ? undefined : -1}>
                      {s.cta} <Arrow />
                    </a>
                    <a href="#pack" className="hero-cta-ghost" tabIndex={on ? undefined : -1}>Build your pack</a>
                  </div>
                </div>

                <div className="hero-extras">
                  <p className="hero-note">{s.note}</p>
                  <div className="hero-chip"><small>{s.chip[0]}</small><b>{s.chip[1]}</b></div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="hero-dots" role="tablist" aria-label="Choose slide">
          {slides.map((s, i) => (
            <button key={s.key} role="tab" aria-selected={i === active} aria-label={s.line1.replace(',', '')}
                    className={`hero-dot${i === active ? ' is-active' : ''}`} onClick={() => go(i)}>
              {i === active && !reduced.current && (
                <i key={active} className={running ? 'run' : 'idle'}
                   style={{ animationDuration: `${SLIDE_MS}ms` }}
                   onAnimationEnd={next} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Ticker band: changes with the slide */}
      <div className="hero-band" aria-hidden="true">
        <svg className="band-wave band-wave-top" viewBox="0 0 1440 40" preserveAspectRatio="none"><path d="M0,40 C240,0 520,36 760,14 C1000,-6 1240,30 1440,6 V40 Z" fill="var(--brand-yellow)" /></svg>
        <div className="band-body">
          <div className="band-label"><span>{slides[active].tickerLabel}</span></div>
          <div className="band-viewport">
            <div className="band-track" key={slides[active].key}>
              {[0, 1].map(h => Array.from({ length: Math.max(1, Math.ceil(16 / slides[active].ticker.length)) }).map((_, r) =>
                slides[active].ticker.map((f, i) => <span key={`${h}-${r}-${i}`}>{f}<em>•</em></span>)
              ))}
            </div>
          </div>
        </div>
        <svg className="band-wave band-wave-bottom" viewBox="0 0 1440 40" preserveAspectRatio="none"><rect width="1440" height="40" fill="var(--brand-yellow)" /><path d="M0,26 C260,4 540,34 800,16 C1060,0 1260,28 1440,12 V40 H0 Z" fill="var(--brand-cream)" /></svg>
      </div>
    </section>
  )
}
