import Reveal from './Reveal.jsx'

// Use the new real customer photos for the social strip
import img1 from '../assets/images/IMG-20260927-WA0268.jpg'  // chin-chin lifestyle tub
import img2 from '../assets/images/IMG-20260927-WA0272.jpg'  // chin-chin in bowl
import img3 from '../assets/images/IMG-20260927-WA0275.jpg'  // small chops event pack
import img4 from '../assets/images/IMG-20260927-WA0266.jpg'  // puffpuff + pies boxes
import img5 from '../assets/images/IMG-20260927-WA0267.jpg'  // full small chops box

const images = [
  { src: img1, alt: "Estelle's Delight Crunchy Chin-Chin tub and packet" },
  { src: img2, alt: "Estelle's Delight Chin-Chin in a bowl" },
  { src: img3, alt: "Estelle's Delight catering event box" },
  { src: img4, alt: "Estelle's Delight puff-puff and pies boxes" },
  { src: img5, alt: "Estelle's Delight full small chops catering box" },
]

export default function Social({ onImageClick }) {
  return (
    <section id="social" className="section">
      <div className="bg-blob bg-blob-1" />
      <div className="wrap">
        <Reveal className="section-head">
          <p className="kicker">@estelles_delight</p>
          <h2>Find us out and about.</h2>
          <p>Follow along for behind-the-scenes, new flavours and market updates.</p>
        </Reveal>

        <Reveal className="social-strip" delay={0.1}>
          {images.map((im) => (
            <a
              key={im.src}
              onClick={(e) => { e.preventDefault(); onImageClick(im.src) }}
              href="#"
              aria-label={im.alt}
            >
              <img src={im.src} alt={im.alt} />
            </a>
          ))}
        </Reveal>

        <Reveal style={{ textAlign: 'center', marginTop: 44 }}>
          <a
            href="https://www.instagram.com/estelles_delight/"
            target="_blank"
            rel="noreferrer"
            className="btn-social-follow"
          >
            Follow Along on Instagram
          </a>
        </Reveal>
      </div>
    </section>
  )
}
