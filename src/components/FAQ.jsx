import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from './Reveal.jsx'

const faqs = [
  {
    q: 'What is Chin-Chin?',
    a: 'Chin-Chin is a beloved West African crunchy snack made from deep-fried dough. Traditionally flavoured with nutmeg, Estelle\'s Delight has reinvented it across 30 bold flavours in 4 categories: Nuts and Seeds, Fruity, Creamy, and Relish Spices.',
  },
  {
    q: 'How much does Chin-Chin cost?',
    a: 'Every flavour is the same price: 100g $10 (minimum 5 packs per flavour), 800g $60, 2L jar $70, 3.5L bucket $135 and 5.1L bucket $185. Mix and match across all four categories. Baileys carries a small extra charge.',
  },
  {
    q: 'Do you offer delivery?',
    a: 'We offer delivery or pickup from Perth, Western Australia. A delivery fee applies and depends on your location. Message us on WhatsApp or email and we will confirm the details with your order.',
  },
  {
    q: 'What sizes do the meat pies come in?',
    a: 'We offer Mini (from $4), Medium (from $5), and Large pies (from $8). Fillings include Beef, Fish, and Chicken. Minimum order: 12 to 15 pieces depending on size.',
  },
  {
    q: 'Can I order for an event or party?',
    a: 'Absolutely! We cater for corporate events, birthdays, weddings, and market stalls. Our small chops, grills, and grazing boxes are designed for events of any size. Reach out early for bulk orders.',
  },
  {
    q: 'How do I order?',
    a: 'Tap Order Now on the site to browse our full menu and send your order directly via WhatsApp or Email. We respond quickly and confirm all orders within 24 hours.',
  },
  {
    q: 'Are the mocktails and Zobo drinks available in cans?',
    a: 'Yes. Our mocktails come in 350ml cans and our signature Tropical Citrus Zobo in 500ml cans, both at $10 per can. Minimum order of 6 cans. Perfect for events and parties.',
  },
  {
    q: 'Do you offer training or workshops?',
    a: 'Yes! Estelle\'s Delight offers hands-on Chin-Chin making workshops. Whether you\'re curious about the craft or want to start your own snack business, reach out to us to find out about upcoming sessions.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <section id="faq" className="faq-section section">
      <div className="wrap">

        {/* Centred heading */}
        <Reveal>
          <div className="faq-heading">
            <p className="kicker">Got questions?</p>
            <h2>We've Got Answers.</h2>
          </div>
        </Reveal>

        {/* Full-width accordion */}
        <div className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <Reveal key={i} delay={0.04 * i}>
                <div className={`faq-item${isOpen ? ' open' : ''}`}>
                  <button
                    className="faq-q"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <motion.span
                      className="faq-icon"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-a"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>

      </div>
    </section>
  )
}
