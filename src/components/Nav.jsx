import { useEffect, useState } from 'react'
import logo from '../assets/images/logo-transparent.png'
import Icon from './Icon.jsx'

const links = [
  { href: '#menu',     label: 'Menu',      id: 'menu'     },
  { href: '#story',    label: 'Our Story', id: 'story'    },
  { href: '#flavours', label: 'Chin-Chin', id: 'flavours' },
  { href: '#catering', label: 'Catering',  id: 'catering' },
  { href: '#contact',  label: 'Contact',   id: 'contact'  },
]
// 'pack' has no nav link, but passing it should clear the previous highlight.
const anchors = [...links.filter(l => !l.href.startsWith('#/')), { id: 'pack' }]

export default function Nav({ page, cartCount, onCartClick, onOrderClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (page === 'shop') {
      // Transparent over the shop artwork, solid once the page scrolls
      setActiveId('')
      const on = () => setScrolled(window.scrollY > 24)
      on()
      window.addEventListener('scroll', on, { passive: true })
      return () => window.removeEventListener('scroll', on)
    }
    const onScroll = () => {
      const heroEl = document.getElementById('hero')
      setScrolled(window.scrollY > (heroEl?.offsetHeight ?? 520) - 80)

      // Active = the last section whose top has passed the header line.
      let current = '', best = -Infinity
      for (const { id } of anchors) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= 140 && top > best) { best = top; current = id }
      }
      // At the very bottom the short footer can never reach the line, so call it Contact.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48
      setActiveId(atBottom ? 'contact' : (current === 'pack' ? '' : current))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [page])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const shop = page === 'shop'

  return (
    <nav id="nav" className={`${scrolled ? 'nav-scrolled' : ''}${shop ? ' nav-shop' : ''}`.trim()}>
      <div className="nav-inner">
        <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Estelle's Delight" />
        </a>

        {shop ? (
          <div className="nav-pill nav-pill-home">
            <a href="#/" className="navlink navlink-home" aria-label="Back to home page">
              <Icon name="home" size={16} /> Home
            </a>
          </div>
        ) : (
          <div id="nav-links" className={`nav-pill${menuOpen ? ' open' : ''}`}>
            {links.map((l) => (
              <a key={l.href} href={l.href}
                 className={`navlink${activeId === l.id ? ' active' : ''}`}
                 aria-current={activeId === l.id ? 'true' : undefined}
                 onClick={() => { setMenuOpen(false); setActiveId(l.id) }}>
                {l.label}
              </a>
            ))}
            <button type="button" className="nav-pill-order" onClick={() => { setMenuOpen(false); onOrderClick() }}>
              Order Now
            </button>
          </div>

        )}

        <div className="nav-cta">
          <button type="button" className="nav-cart-btn" aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ''}`} onClick={onCartClick}>
            <Icon name="bag" size={19} />
            {cartCount > 0 && <span className="cart-badge" key={cartCount}>{cartCount}</span>}
          </button>
          {!shop && <button type="button" onClick={onOrderClick} className="nav-order-btn">Order Now</button>}
          {!shop && <button id="menuToggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen} aria-controls="nav-links"
                  className={menuOpen ? 'open' : ''} onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>}
        </div>
      </div>
    </nav>
  )
}
