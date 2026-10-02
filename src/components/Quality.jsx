import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import piesBox    from '../assets/images/IMG-20260927-WA0273.jpg'
import drinksImg  from '../assets/images/IMG-20260927-WA0271.jpg'
import platterImg from '../assets/images/IMG-20260927-WA0279.jpg'
import chinImg    from '../assets/images/IMG-20260927-WA0292.jpg'

const items = [
  { icon: 'chef',  title: 'Made fresh, by hand', desc: 'Pies baked, puff-puff fried and skewers grilled in small batches, never sitting on a shelf.' },
  { icon: 'leaf',  title: 'Honest ingredients',  desc: 'Full cream milk, real butter, whole nuts and fruit. No shortcuts, in a snack or in a platter.' },
  { icon: 'gift',  title: 'Made for moments',    desc: 'Gift boxes, party platters, favours and corporate orders, packed to look as good as they taste.' },
  { icon: 'truck', title: 'Delivery or pickup',  desc: 'Order online, we confirm within 24 hours and bring it to your door or have it ready for you.' },
]

export default function Quality() {
  return (
    <section id="quality" className="section">
      <div className="bg-blob bg-blob-1" />
      <div className="wrap">
        <div className="quality-grid">
          <Reveal className="qg-mosaic">
            <img className="m1" src={piesBox} alt="Gift-boxed pastries with a ribbon" loading="lazy" decoding="async" />
            <img className="m2" src={drinksImg} alt="Cans of fresh mocktails" loading="lazy" decoding="async" />
            <img className="m3" src={platterImg} alt="Box of spring rolls, samosas and grilled chicken" loading="lazy" decoding="async" />
            <img className="m4" src={chinImg} alt="Chin-Chin jars and pouches" loading="lazy" decoding="async" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="kicker">Why Estelle's</p>
            <h2>Made fresh. Packed with care.</h2>
            <p className="quality-lede">Whether it is a bucket of chin-chin, a tray of pies or a drinks table for fifty, every order gets the same attention.</p>
            <div className="quality-list">
              {items.map((it) => (
                <div className="quality-item" key={it.title}>
                  <span className="qi-ico"><Icon name={it.icon} size={22} /></span>
                  <div><h4>{it.title}</h4><p>{it.desc}</p></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
