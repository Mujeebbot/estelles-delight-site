import Reveal from './Reveal.jsx'
import graphic4Categories from '../assets/images/graphic-4categories.webp'
import patternSnacks      from '../assets/images/pattern-snacks.webp'

export default function Intro() {
  return (
    <section
      id="intro"
      className="section"
      style={{ '--pattern-bg': `url(${patternSnacks})` }}
    >
      <div className="bg-blob bg-blob-1" />
      <div className="intro-pattern" />
      <div className="wrap">
        <div className="intro-grid">
          <Reveal className="intro-text" variant="slideLeft">
            <p className="kicker">Redefining a classic</p>
            <h2>30 ways to experience Chin-Chin.</h2>
            <p>
              Estelle's Delights Chin-Chin is redefining the way people experience
              this beloved West African snack by offering an impressive 30 unique
              flavours across four exciting categories: <strong>Nuts &amp; Seeds</strong>,{' '}
              <strong>Relish Spices</strong>, <strong>Creamy</strong>, and{' '}
              <strong>Fruity</strong>.
            </p>
            <p style={{ marginTop: 14 }}>
              Traditionally known for its classic nutmeg flavour, Chin-Chin is getting
              a bold makeover — allowing snack lovers to explore new tastes and textures,
              all made fresh and handcrafted with care.
            </p>
          </Reveal>
          <Reveal className="intro-img" variant="scaleUp" delay={0.15}>
            <img src={graphic4Categories} alt="Estelle's Delight — 4 Chin-Chin flavour categories: Nuts & Seeds, Fruity, Creamy, Relish Spices" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
