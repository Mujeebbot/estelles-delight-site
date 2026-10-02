import Reveal from './Reveal.jsx'
import { motion } from 'framer-motion'

// Original webp photos
import chinchinFlatlay      from '../assets/images/chinchin-flatlay.webp'
import chinchinLifestyle    from '../assets/images/chinchin-lifestyle-tub.webp'
import chinchinStrips       from '../assets/images/chinchin-strips-lifestyle.webp'
import chinchinTubs         from '../assets/images/chinchin-tubs-group.webp'
import chinchinBulk         from '../assets/images/chinchin-bulk-sizes.webp'
import chinchinBlack        from '../assets/images/chinchin-black-bg.webp'
import chinchinClean        from '../assets/images/chinchin-clean-red.webp'
import piesOne              from '../assets/images/pies-tray-1.webp'
import piesTwo              from '../assets/images/pies-tray-2.webp'
import piesTaste            from '../assets/images/pies-taste-something-good.webp'
import puffpuffStrawberry   from '../assets/images/puffpuff-strawberry.webp'
import puffpuffBoxes        from '../assets/images/puffpuff-pies-boxes.webp'
import smallchopsHandheld   from '../assets/images/smallchops-handheld.webp'
import smallchopsHandheld2  from '../assets/images/smallchops-handheld-2.webp'
import smallchopsBagsBulk   from '../assets/images/smallchops-bags-bulk.webp'
import cateringPlatter      from '../assets/images/catering-platter.webp'
import cateringBoxFull      from '../assets/images/catering-box-full.webp'
import cateringBoxesRows    from '../assets/images/catering-boxes-rows.webp'
import marketTable          from '../assets/images/market-table-closeup.webp'
import founderMarket        from '../assets/images/founder-market-stall.webp'
import founderDough         from '../assets/images/founder-dough-process.webp'
import drinksZobo           from '../assets/images/drinks-zobo-chapman.webp'
import drinksRefresh        from '../assets/images/drinks-refresh-cans.webp'
import eventFavors          from '../assets/images/event-favors.webp'
// New customer photos
import newPies              from '../assets/images/IMG-20260927-WA0266.jpg'
import newGrazingBox        from '../assets/images/IMG-20260927-WA0267.jpg'
import newChinchinBowl      from '../assets/images/IMG-20260927-WA0272.jpg'
import newSmallChops        from '../assets/images/IMG-20260927-WA0275.jpg'

const images = [
  { src: chinchinFlatlay,    alt: 'Chin-Chin flatlay styled with spices' },
  { src: newPies,            alt: 'Estelle\'s Delight pies and puff-puff gift boxes' },
  { src: chinchinLifestyle,  alt: 'Crunchy Chin-Chin lifestyle tub' },
  { src: newGrazingBox,      alt: 'Small chops full event grazing box' },
  { src: piesOne,            alt: 'Tray of golden handcrafted pies' },
  { src: newChinchinBowl,    alt: 'Chin-Chin in a white bowl with packaging' },
  { src: puffpuffStrawberry, alt: 'Puff-Puff with strawberries and glaze toppings' },
  { src: newSmallChops,      alt: 'Small chops catering pack with grilled chicken' },
  { src: drinksZobo,         alt: 'Zobo and Chapman refreshing drinks' },
  { src: chinchinTubs,       alt: 'Group of Chin-Chin tubs by category' },
  { src: cateringBoxFull,    alt: 'Full catering box with chicken, puff-puff and snacks' },
  { src: puffpuffBoxes,      alt: 'Puff-puff and pies presented in boxes' },
  { src: marketTable,        alt: 'Market stall table close-up shot' },
  { src: founderMarket,      alt: 'Founder at a market stall' },
  { src: chinchinStrips,     alt: 'Chin-Chin strips styled with flowers' },
  { src: piesTaste,          alt: 'Pies — taste something good' },
  { src: smallchopsHandheld, alt: 'Small chops held at an event' },
  { src: drinksRefresh,      alt: 'Fresh Mocktails in cans' },
  { src: eventFavors,        alt: 'Personalised event favour cups' },
  { src: cateringBoxesRows,  alt: 'Rows of catering boxes for a large event' },
  { src: founderDough,       alt: 'Founder rolling dough — behind the scenes' },
  { src: chinchinBulk,       alt: 'Chin-Chin in bulk sizes for catering' },
  { src: cateringPlatter,    alt: 'Catering platter with small chops and grilled meat' },
  { src: smallchopsBagsBulk, alt: 'Bulk small chops bags packed for delivery' },
]

export default function Gallery({ onImageClick }) {
  return (
    <section id="gallery" className="section" style={{ background: 'var(--brand-cream-alt)' }}>
      <div className="wrap">
        <Reveal className="section-head" style={{ textAlign: 'center', maxWidth: '100%' }}>
          <p className="kicker">The gallery</p>
          <h2>Made fresh. Every time.</h2>
          <p style={{ marginTop: 12, color: 'rgba(59,26,8,0.65)', fontSize: 15 }}>A glimpse of what we make, photograph, and deliver to your door.</p>
        </Reveal>

        <div className="gallery-grid" style={{ marginTop: 52 }}>
          {images.map((im, i) => (
            <motion.a
              key={im.src}
              onClick={(e) => { e.preventDefault(); onImageClick(im.src) }}
              href="#"
              aria-label={im.alt}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              style={{ display: 'block' }}
            >
              <img src={im.src} alt={im.alt} loading="lazy" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
