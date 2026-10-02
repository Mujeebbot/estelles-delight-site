import logo from '../assets/images/logo-transparent.png'
import Icon from './Icon.jsx'
import { WHATSAPP, EMAIL } from '../data/menu.js'

const social = [
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/estelles_delight/' },
  { name: 'WhatsApp',  icon: 'whatsapp',  href: `https://wa.me/${WHATSAPP}` },
  { name: 'Facebook',  icon: 'facebook',  href: 'https://www.facebook.com/estelles_delight' },
  { name: 'TikTok',    icon: 'tiktok',    href: 'https://www.tiktok.com/@estelles_delight' },
]

export default function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="Estelle's Delight - tasty and nourishing" width="180" height="72" loading="lazy" />
            <p>West African snacks, pastries and catering, handmade fresh in Perth, Western Australia.</p>
          </div>

          <nav className="footer-col footer-explore" aria-label="Explore">
            <h5>Explore</h5>
            <a href="#menu">Menu</a>
            <a href="#/shop">Shop</a>
            <a href="#flavours">Chin-Chin</a>
            <a href="#story">Our story</a>
            <a href="#catering">Catering</a>
            <a href="#training">Training</a>
          </nav>

          <div className="footer-col footer-order">
            <h5>Order</h5>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={`mailto:${EMAIL}`}>Email</a>
            <a href="#catering">Catering enquiry</a>
            <a href="#/shop" className="footer-order-btn">Place an order <Icon name="arrow" size={15} /></a>
          </div>

          <div className="footer-col footer-contact">
            <h5>Contact</h5>
            <a href="tel:+61426921991"><Icon name="phone" size={15} /> +61 426 921 991</a>
            <a href={`mailto:${EMAIL}`}><Icon name="mail" size={15} /> {EMAIL}</a>
            <p><Icon name="pin" size={15} /> Perth, Western Australia</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-social">
            {social.map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}><Icon name={s.icon} size={20} /></a>
            ))}
          </div>
          <span>© 2026 Estelle's Delight. Quality is our commitment, delight is our guarantee.</span>
        </div>
      </div>
    </footer>
  )
}
