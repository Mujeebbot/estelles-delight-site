import Reveal from './Reveal.jsx'

// New real customer photos
import cateringBox1   from '../assets/images/IMG-20260927-WA0267.jpg' // full small chops box
import cateringBox2   from '../assets/images/IMG-20260927-WA0270.jpg' // grazing box with grills
import piesBoxes      from '../assets/images/IMG-20260927-WA0266.jpg' // pies + puffpuff boxes
import smallchopsPack from '../assets/images/IMG-20260927-WA0275.jpg' // small chops event pack
import chinchinTub    from '../assets/images/IMG-20260927-WA0268.jpg' // chin-chin tub & bags
import eventPack      from '../assets/images/IMG-20260927-WA0272.jpg' // chin-chin in bowl
import catering3      from '../assets/images/catering-boxes-multi.webp'
import catering4      from '../assets/images/catering-spread.webp'

export default function Catering({ onImageClick }) {
  const gallery = [
    { src: cateringBox1,   alt: "Full small chops catering box — pies, puff-puff, wings, samosas" },
    { src: cateringBox2,   alt: "Estelle's Delight grazing event box — grills and finger foods" },
    { src: piesBoxes,      alt: "Estelle's Delight catering boxes — pies and puff-puff assorted" },
    { src: smallchopsPack, alt: "Estelle's Delight small chops event pack — chicken wings and skewers" },
    { src: chinchinTub,    alt: "Estelle's Delight Crunchy Chin-Chin bulk tub and packets" },
    { src: catering3,      alt: "Multiple catering boxes ready for event delivery" },
  ]

  return (
    <section id="catering" className="section doodled">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="wrap">
        <div className="catering-inner">
          <Reveal>
            <p className="kicker">For your next event</p>
            <h2>Planning something special?</h2>
            <p style={{ marginTop: 18, fontSize: 16, color: 'rgba(59,26,8,0.75)', maxWidth: 420, lineHeight: 1.75, fontFamily: 'Fredoka, sans-serif' }}>
              From intimate gatherings to full celebrations, let Estelle's Delight
              bring the flavour: trays of grilled chicken, pies and small chops,
              personalised favours for your guests, and Chin-Chin by the bucket.
            </p>
            <a href="https://wa.me/61426921991" target="_blank" rel="noreferrer" className="btn btn-solid" style={{ marginTop: 28, display: 'inline-flex' }}>
              Enquire About Catering
            </a>
          </Reveal>

          <Reveal className="catering-gallery" delay={0.1}>
            {gallery.map((img) => (
              <a
                key={img.src}
                href="#"
                onClick={(e) => { e.preventDefault(); onImageClick(img.src) }}
                aria-label={img.alt}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
