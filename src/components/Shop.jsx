import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { ItemRows, ChinChinPanel, Accordion, isWide } from './OrderParts.jsx'
import { CATALOGUE, WHATSAPP, money } from '../data/menu.js'
import { goShop } from '../lib/route.js'

// photos
import shopBg from '../assets/images/shop-bg.webp'
import pies1 from '../assets/images/pies-tray-1.webp'
import pies2 from '../assets/images/pies-tray-2.webp'
import pies3 from '../assets/images/pies-tray-3.webp'
import bites from '../assets/images/IMG-20260927-WA0281.jpg'
import grills from '../assets/images/IMG-20260927-WA0277.jpg'
import classic from '../assets/images/IMG-20260927-WA0266.jpg'
import sweet from '../assets/images/puffpuff-strawberry.webp'
import cans from '../assets/images/IMG-20260927-WA0269.jpg'
import platter from '../assets/images/IMG-20260927-WA0267.jpg'
import eventBox from '../assets/images/IMG-20260927-WA0279.jpg'
import giftBox from '../assets/images/IMG-20260927-WA0273.jpg'
import cc100 from '../assets/images/cc-100g-tight.jpg'
import cc800 from '../assets/images/IMG-20260927-WA0308.jpg'
import cc2l from '../assets/images/IMG-20260927-WA0292.jpg'
import cc35 from '../assets/images/IMG-20260927-WA0303.jpg'
import cc51 from '../assets/images/IMG-20260927-WA0287.jpg'

const PHOTO = { p1: pies1, p2: pies2, p3: pies3, bites, grills, classic, sweet, cans }
const CC_PHOTOS = { '100g': cc100, '800g': cc800, '2L': cc2l, '3.5L': cc35, '5.1L': cc51 }

const TABS = [
  { key: 'all',        label: 'All',                icon: 'sparkle' },
  { key: 'chinchin',   label: 'Chin-Chin',          icon: 'cookie' },
  { key: 'pies',       label: 'Meat Pies',          icon: 'pie' },
  { key: 'smallchops', label: 'Small Chops & Grills', icon: 'box' },
  { key: 'puffpuff',   label: 'Puff-Puff',          icon: 'ball' },
  { key: 'drinks',     label: 'Drinks',             icon: 'cup' },
  { key: 'platters',   label: 'Platters & Events',  icon: 'gift' },
]

const ENQUIRE = [
  { img: platter,  title: 'Party platters', text: 'Small chops, grills and sides packed into boxes sized to your guest list.', msg: "Hi Estelle's Delight, I'd like a quote for a party platter." },
  { img: eventBox, title: 'Event packs and favours', text: 'Individually boxed packs with personalised labels, ready to hand out.', msg: "Hi Estelle's Delight, I'd like to order personalised event packs." },
  { img: giftBox,  title: 'Gift boxes', text: 'Ribboned pastry boxes for baptisms, birthdays and thank-yous.', msg: "Hi Estelle's Delight, I'd like to order gift boxes." },
]

const Heart = () => (
  <svg className="shop-heart" width="26" height="24" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20.5C5 15.6 2.2 12.3 2.2 8.4 2.2 5.5 4.4 3.4 7 3.4c2 0 3.8 1.1 5 3.1 1.2-2 3-3.1 5-3.1 2.6 0 4.8 2.1 4.8 5 0 3.9-2.8 7.2-9.8 12.1z" />
  </svg>
)

function Card({ img, title, sub, children, collapsible = false, defaultOpen = true, count = 0 }) {
  return (
    <article className="shop-card picker">
      <div className="shop-photo"><img src={img} alt="" loading="lazy" decoding="async" /></div>
      <div className="shop-card-body">
        {collapsible ? (
          <Accordion level="h3" title={title} count={count} defaultOpen={defaultOpen}>{children}</Accordion>
        ) : (
          <>
            <h3>{title}</h3>
            {sub && <p>{sub}</p>}
            {children}
          </>
        )}
      </div>
    </article>
  )
}

export default function Shop({ cat, cart, onCart }) {
  const show = (k) => cat === 'all' || cat === k || !TABS.some(t => t.key === cat)
  const top = useRef(null)
  const [stuck, setStuck] = useState(false)
  const bgRef = useRef(null)

  // The tab bar sits on the hero artwork; once it pins under the nav it gets a solid backdrop
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      if (top.current) setStuck(top.current.getBoundingClientRect().top <= 70)
      // The artwork softens as the page scrolls over it
      if (bgRef.current) bgRef.current.style.setProperty('--bg-blur', `${Math.min(10, window.scrollY / 45).toFixed(1)}px`)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  // Jump to the products when arriving via a category link
  useEffect(() => {
    if (cat !== 'all' && top.current) {
      const y = top.current.getBoundingClientRect().top + window.scrollY - 76
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [cat])

  return (
    <main className="shop">
      <header className="shop-hero">
        <div className="shop-hero-bg" ref={bgRef} aria-hidden="true">
          <img src={shopBg} alt="" decoding="async" fetchpriority="high" />
        </div>
        <p className="shop-scribble shop-scribble-l" aria-hidden="true">Real Ingredients<br />Better Taste <Heart /></p>
        <p className="shop-scribble shop-scribble-r" aria-hidden="true">Small Bites<br />Big Joy <Heart /></p>
        <div className="wrap shop-hero-in">
          <p className="kicker">The shop</p>
          <h1><span>Fresh from our kitchen.</span></h1>
          <p>Handmade in Perth. Add what you like to your cart, then check out and we will confirm everything within 24 hours.</p>
          <ul className="shop-facts">
            <li><Icon name="clock" size={16} /> Confirmed within 24 hours</li>
            <li><Icon name="truck" size={16} /> Delivery or pickup</li>
            <li><Icon name="leaf" size={16} /> Minimums shown per item</li>
          </ul>
        </div>
      </header>

      <div className={`shop-tabs${stuck ? ' is-stuck' : ''}`} ref={top}>
        <div className="wrap">
          <div className="shop-tabs-row" role="tablist" aria-label="Shop categories">
            {TABS.map(t => (
              <button key={t.key} role="tab" aria-selected={cat === t.key || (t.key === 'all' && !TABS.some(x => x.key === cat))}
                      className={cat === t.key ? 'on' : ''} onClick={() => goShop(t.key === 'all' ? '' : t.key)}>
                <Icon name={t.icon} size={17} /><span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shop-sheet">
      <div className="wrap shop-body">
        {show('chinchin') && (
          <Reveal as="section" className="shop-sec picker">
            <div className="shop-sec-head">
              <h2>Chin-Chin</h2>
              <p>Crunchy, buttery and made in 30 flavours. Same price for every flavour.</p>
            </div>
            <div className="shop-cc"><ChinChinPanel cart={cart} photos={CC_PHOTOS} /></div>
          </Reveal>
        )}

        {CATALOGUE.filter(c => show(c.key)).map(c => (
          <Reveal as="section" key={c.key} className="shop-sec">
            <div className="shop-sec-head"><h2>{c.title}</h2><p>{c.blurb}</p></div>
            <div className="shop-grid">
              {c.groups.map((g, i) => (
                <Card key={g.title} img={PHOTO[g.photo]} title={g.title} collapsible
                      defaultOpen={i === 0 || isWide()}
                      count={g.items.filter(it => cart.lines[it.id]).length}>
                  <ItemRows group={g} catTitle={c.title} cart={cart} />
                </Card>
              ))}
            </div>
            {c.footnote && <p className="shop-note">{c.footnote}</p>}
          </Reveal>
        ))}

        {show('platters') && (
          <Reveal as="section" className="shop-sec">
            <div className="shop-sec-head"><h2>Platters and events</h2><p>Priced to your guest count, so we quote these personally.</p></div>
            <div className="shop-grid">
              {ENQUIRE.map(e => (
                <Card key={e.title} img={e.img} title={e.title} sub={e.text}>
                  <a className="btn btn-solid shop-enq" target="_blank" rel="noreferrer"
                     href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(e.msg)}`}>
                    <Icon name="whatsapp" size={18} /> Ask for a quote
                  </a>
                </Card>
              ))}
            </div>
          </Reveal>
        )}
      </div>
      </div>

      <div className={`shop-bar${cart.list.length ? ' show' : ''}`}>
        <div><small>{cart.list.length} {cart.list.length === 1 ? 'item' : 'items'} in your cart</small><b>{money(cart.total)}</b></div>
        <button type="button" onClick={onCart}>View cart <Icon name="arrow" size={16} /></button>
      </div>
    </main>
  )
}
