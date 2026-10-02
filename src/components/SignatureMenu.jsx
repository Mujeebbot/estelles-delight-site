import Reveal from './Reveal.jsx'

import chinchinImg   from '../assets/images/IMG-20260927-WA0287.jpg'
import piesImg       from '../assets/images/pies-tray-3.webp'
import smallChopsImg from '../assets/images/IMG-20260927-WA0270.jpg'
import grillsImg     from '../assets/images/IMG-20260927-WA0277.jpg'
import puffpuffImg   from '../assets/images/puffpuff-strawberry.webp'
import drinksImg     from '../assets/images/drinks-refresh-cans.webp'
import eventsImg     from '../assets/images/IMG-20260927-WA0279.jpg'

const items = [
  { key: 'chinchin',   img: chinchinImg,   name: 'Chin Chin',         sub: '30+ bold flavours',      price: 'From $10',  href: '#/shop/chinchin' },
  { key: 'pies',       img: piesImg,       name: 'Meat Pies',         sub: 'Flaky, juicy, fresh',    price: 'From $4', href: '#/shop/pies' },
  { key: 'smallchops', img: smallChopsImg, name: 'Party Platters',     sub: 'Small chops for a crowd', price: 'From $200', href: '#/shop/platters' },
  { key: 'grills',     img: grillsImg,     name: 'Grills',            sub: 'Bold, smoky, spiced',    price: 'From $5', href: '#/shop/smallchops' },
  { key: 'puffpuff',   img: puffpuffImg,   name: 'Puff Puff',         sub: 'Pillowy and golden',     price: 'From $1', href: '#/shop/puffpuff' },
  { key: 'drinks',     img: drinksImg,     name: 'Mocktails & Zobo',  sub: 'Fresh, alcohol-free',    price: '$10 / can', href: '#/shop/drinks' },
  { key: 'events',     img: eventsImg,     name: 'Event Packs',       sub: 'Your event, handled',    price: 'From $15', href: '#/shop/platters' },
]


function Card({ it, hidden }) {
  return (
    <li className="dl-item" aria-hidden={hidden || undefined}>
      <a className="dl-card" href={it.href} tabIndex={hidden ? -1 : undefined}>
        <span className="dl-photo"><img src={it.img} alt="" loading="lazy" decoding="async" /></span>
        <span className="dl-body">
          <span className="dl-text"><strong>{it.name}</strong><small>{it.sub}</small></span>
          <span className="dl-price">{it.price}</span>
        </span>
      </a>
    </li>
  )
}

export default function SignatureMenu() {
  return (
    <section id="menu" className="section menu-section">
      <div className="wrap">
        <Reveal>
          <div className="menu-header">
            <div>
              <p className="kicker">The menu</p>
              <h2 className="menu-title">Shop Our Delights</h2>
            </div>
            <a href="#/shop" className="menu-view-all">Open the shop <span aria-hidden="true">&rarr;</span></a>
          </div>
        </Reveal>
      </div>

      <div className="dl-marquee" aria-label="Menu categories">
        <ul className="dl-track">
          {items.map(it => <Card key={it.key} it={it} />)}
          {items.map(it => <Card key={it.key + '2'} it={it} hidden />)}
        </ul>
      </div>
    </section>
  )
}
