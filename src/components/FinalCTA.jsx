import Reveal from './Reveal.jsx'
import chinchinLifestyleTub from '../assets/images/chinchin-lifestyle-tub.webp'

export default function FinalCTA() {
  return (
    <section id="finalcta">
      <img src={chinchinLifestyleTub} alt="Estelle's Delight Chin-Chin bucket" />
      <div className="fc-overlay"></div>
      <Reveal className="wrap fc-content">
        <h2>Ready for a taste?</h2>
        <p>Message us to place an order, ask about catering, or just say hello.</p>
        <div className="fc-ctas">
          <a href="#contact" className="btn btn-solid-gold">Order Now</a>
          <a href="https://wa.me/61426921991" target="_blank" rel="noreferrer" className="btn btn-ghost-light">
            WhatsApp Us
          </a>
        </div>
      </Reveal>
    </section>
  )
}
