import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { money } from '../data/menu.js'
import posterSnacks from '../assets/images/IMG-20260927-WA0263.jpg'
import posterChops  from '../assets/images/IMG-20260927-WA0265.jpg'
import posterDrinks from '../assets/images/IMG-20260927-WA0264.jpg'
import posterChin   from '../assets/images/IMG-20260927-WA0274.jpg'
import boxImg from '../assets/images/IMG-20260927-WA0270.jpg'

const posters = [
  { src: posterSnacks, alt: 'Snacks and pastry menu' },
  { src: posterChops,  alt: 'Small chops and grills menu' },
  { src: posterDrinks, alt: 'Mocktails and zobo menu' },
  { src: posterChin,   alt: 'Chin-Chin menu, 30 flavours' },
]

export default function BuildPack({ cart, onBuild, onReview, onImageClick }) {
  const ready = cart.list.length > 0
  return (
    <section id="pack" className="pack-section section doodled doodled-dark">
      <div className="pack-glow" aria-hidden="true" />
      <div className="wrap">
        <Reveal className="pack-head">
          <div>
            <p className="kicker kicker-gold">Build your pack</p>
            <h2>Pack it your way.</h2>
            <p>
              Mix small chops, grills, pies, puff-puff and drinks into one order.
              Pick your quantities, watch the total add up, then send it to us in a tap.
            </p>
            <ul className="pack-points">
              <li><Icon name="check" size={16} stroke={2.6} /> Prices straight from our menu</li>
              <li><Icon name="check" size={16} stroke={2.6} /> Minimum quantities shown on every item</li>
              <li><Icon name="check" size={16} stroke={2.6} /> Delivery or pickup, fee confirmed by us</li>
            </ul>

            <div className="pack-actions">
              <button type="button" className="pack-cta pack-cta-main" onClick={onBuild}>
                {ready ? 'Continue building your pack' : 'Start building your pack'} <Icon name="arrow" size={18} />
              </button>
              {ready && (
                <button type="button" className="pack-cta-ghost" onClick={onReview}>
                  Review order ({cart.list.length} {cart.list.length === 1 ? 'item' : 'items'}, {money(cart.total)})
                </button>
              )}
            </div>
          </div>
          <img src={boxImg} alt="A packed box of spring rolls, samosas, chicken and puff-puff" loading="lazy" decoding="async" />
        </Reveal>

        <div className="pack-menus">
          <div>
            <h3>Prefer the printed menu?</h3>
            <p>Tap a card to see the full menu with every price.</p>
          </div>
          <ul>
            {posters.map(p => (
              <li key={p.src}>
                <button type="button" onClick={() => onImageClick(p.src)} aria-label={`View ${p.alt}`}>
                  <img src={p.src} alt="" loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  )
}
