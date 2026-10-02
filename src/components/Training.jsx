import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import smallChopsBox from '../assets/images/IMG-20260927-WA0267.jpg'
import meatPiesTray  from '../assets/images/pies-tray-1.webp'
import chinchinTub   from '../assets/images/chinchin-lifestyle-tub.webp'

const highlights = [
  {
    icon: 'pie',
    label: 'Meat Pies and Flaky Pastries',
    desc: 'Golden flaky shortcrust pastry, savoury beef, chicken, or fish fillings with signature crimping.',
  },
  {
    icon: 'box',
    label: 'Small Chops and Finger Foods',
    desc: 'Golden puff-puff, crispy spring rolls, samosas, and party skewers prepared from scratch.',
  },
  {
    icon: 'cookie',
    label: 'Chin-Chin Craft',
    desc: 'Dough kneading, consistent cutting, temperature control, and flavour formulation.',
  },
  {
    icon: 'cup',
    label: 'Zobo, Mocktails and Beverages',
    desc: 'Brewing authentic spiced hibiscus Zobo, refreshing Chapman, and event drink canning.',
  },
  {
    icon: 'briefcase',
    label: 'Snack Business and Catering Mentorship',
    desc: 'Batch costing, packaging, hygiene standards, and practical guidance to launch your own brand.',
  },
]

export default function Training() {
  return (
    <section id="training" className="training-section section">
      <div className="wrap">
        <div className="training-grid">

          {/* Left: Comprehensive training curriculum */}
          <Reveal className="training-text">
            <p className="kicker">Learn with us</p>
            <h2>Turn your culinary passion into a thriving business.</h2>
            <p className="training-sub">
              Master the full spectrum of West African pastries, small chops, finger foods, and specialty drinks.
              Personalised, hands-on masterclasses designed to take you from amateur to commercial pro.
            </p>

            <div className="training-highlights">
              {highlights.map((h) => (
                <div key={h.label} className="training-highlight">
                  <span className="training-icon"><Icon name={h.icon} size={20} /></span>
                  <div>
                    <p className="training-highlight-title">{h.label}</p>
                    <p className="training-highlight-desc">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="training-actions">
              <a href="#contact" className="btn btn-outline">
                Enquire About Training
              </a>
              <a
                href="https://wa.me/61426921991?text=Hi%20Estelle,%20I'm%20interested%20in%20learning%20more%20about%20your%20training%20workshops!"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>

          {/* Right: Multi-product showcase collage */}
          <Reveal className="training-visual">
            <div className="training-collage">
              <div className="tcol-main">
                <img src={smallChopsBox} alt="Small chops platter including samosas, spring rolls, puff puff and grills" />
                <span className="tcol-tag">Small Chops & Catering</span>
              </div>
              <div className="tcol-stack">
                <div className="tcol-small">
                  <img src={meatPiesTray} alt="Freshly baked West African golden meat pies" />
                  <span className="tcol-tag-small">Pies & Pastries</span>
                </div>
                <div className="tcol-small tcol-red">
                  <div className="tcol-badge">
                    <p className="tcol-badge-num">All-in-1</p>
                    <p className="tcol-badge-label">Pastries, Chops & Drinks</p>
                  </div>
                </div>
                <div className="tcol-small">
                  <img src={chinchinTub} alt="Estelle's Delight gourmet Chin-Chin tubs" />
                  <span className="tcol-tag-small">Gourmet Chin-Chin</span>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}

