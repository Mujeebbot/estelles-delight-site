import Icon from './Icon.jsx'

const items = [
  { icon: 'chef',  title: 'Handmade fresh',     text: 'Baked, fried and packed by hand in Perth' },
  { icon: 'cookie', title: '30 Chin-Chin flavours', text: 'Four families, from nutty to relish spice' },
  { icon: 'box',   title: 'Events and gifting', text: 'Platters, boxes and personalised favours' },
  { icon: 'truck', title: 'Delivery or pickup', text: 'Order online, we confirm within 24 hours' },
]

export default function Highlights() {
  return (
    <section className="highlights" aria-label="Why choose Estelle's Delight">
      <ul className="wrap hl-list">
        {items.map(it => (
          <li key={it.title}>
            <span className="hl-ico"><Icon name={it.icon} size={22} /></span>
            <span><strong>{it.title}</strong><small>{it.text}</small></span>
          </li>
        ))}
      </ul>
    </section>
  )
}
