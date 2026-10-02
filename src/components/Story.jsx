import Reveal from './Reveal.jsx'
import founderMarketStall from '../assets/images/founder-market-stall.webp'
import founderDoughProcess from '../assets/images/founder-dough-process.webp'

export default function Story() {
  return (
    <section id="story" className="section">
      <div className="wrap">
        <div className="story-grid">
          <Reveal className="story-imgs" variant="slideLeft">
            <img className="main-img" src={founderMarketStall} alt="Estelle's Delight founder at a Perth market stall" />
            <img className="float-img" src={founderDoughProcess} alt="Hand-rolling Chin-Chin dough" />
          </Reveal>
          <Reveal className="story-text" variant="slideRight" delay={0.15}>
            <p className="kicker">Our story</p>
            <h2>More than a snack.<br />It's a little taste of home.</h2>
            <p>
              Estelle's Delight started the way most good things do: in a home kitchen,
              with a rolling pin, a pasta machine repurposed for chin-chin dough, and
              a determination to get it exactly right.
            </p>
            <p>
              Today you'll find us behind a market stall most weekends, still baking,
              frying and packing every order ourselves, from thirty chin-chin flavours
              to pies, small chops and grills. Every bite is handcrafted with love and a whole lot of flavour.
            </p>
            <a href="#contact" className="btn btn-solid" style={{ marginTop: 32, alignSelf: 'flex-start' }}>
              Get in Touch
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
