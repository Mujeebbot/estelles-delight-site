import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import { flavours } from '../data/flavours.js'
import Icon from './Icon.jsx'
import sizeA from '../assets/images/IMG-20260927-WA0300.jpg'
import sizeB from '../assets/images/IMG-20260927-WA0295.jpg'
import sizeC from '../assets/images/IMG-20260927-WA0299.jpg'
import { CHINCHIN_SIZES, money } from '../data/menu.js'

export default function Flavours() {
  const [activeKey, setActiveKey] = useState(flavours[0].key)
  const active = flavours.find((f) => f.key === activeKey)

  return (
    <section id="flavours" className="section">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />

      <div className="wrap">
        <Reveal className="section-head">
          <p className="kicker">Crunchy Chin-Chin</p>
          <h2>30 ways to find your favourite.</h2>
          <p>
            Four families of flavour, each one mixed, cut and fried in-house.
            Pick a category below to explore what's inside.
          </p>
        </Reveal>

        <div className="flavour-grid">
          {/* ── Tabs ── */}
          <Reveal className="flavour-tabs">
            {flavours.map((f) => (
              <div
                key={f.key}
                className={`flavour-tab${f.key === activeKey ? ' active' : ''}`}
                onClick={() => setActiveKey(f.key)}
                role="button"
                aria-expanded={f.key === activeKey}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveKey(f.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <span className="ft-icon"><Icon name={f.icon === 'nut' ? 'sparkle' : f.icon} size={20} /></span>
                  <h3>{f.name}</h3>
                </div>
                <span className="ft-count">{f.count}</span>
                <div className="ft-thumb"><img src={f.image} alt={f.alt} loading="lazy" decoding="async" /></div>
                <div className="ft-list">{f.items.join(' · ')}</div>
              </div>
            ))}

            {/* Price badge — shows price for active category */}
            <div className="flavour-price-badge">
              <span>{active.name}</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <strong>from $10</strong>
            </div>
          </Reveal>

          {/* ── Visual ── */}
          <Reveal>
            <div className="flavour-visual">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active.key}
                  src={active.image}
                  alt={active.alt}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
                />
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <Reveal className="size-strip">
          <div className="size-photos">
            <img src={sizeA} alt="Three Chin-Chin tubs" loading="lazy" decoding="async" />
            <img src={sizeB} alt="Chin-Chin pouches with a bowl of chin-chin" loading="lazy" decoding="async" />
            <img src={sizeC} alt="Chin-Chin pouch with scattered chin-chin and spices" loading="lazy" decoding="async" />
          </div>
          <h3>Pick your size</h3>
          <ul>
            {CHINCHIN_SIZES.map(s => (
              <li key={s.key}><span>{s.label}</span><b>{money(s.price)}</b></li>
            ))}
          </ul>
          <p>Mix any flavours. 100g packs have a minimum of 5 per flavour. Baileys carries a small extra charge.</p>
          <a href="#/shop/chinchin" className="btn btn-solid">Shop Chin-Chin</a>
        </Reveal>
      </div>
    </section>
  )
}
