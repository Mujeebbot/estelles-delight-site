import { useId, useState } from 'react'
import Icon from './Icon.jsx'
import { CATALOGUE, CHINCHIN_SIZES, CHINCHIN_CATEGORIES, money } from '../data/menu.js'

/** Open/close section with a chevron. Shows a small count when something inside is in the cart. */
export function Accordion({ title, meta, count = 0, defaultOpen = true, level = 'h4', className = '', children }) {
  const [open, setOpen] = useState(defaultOpen)
  const Tag = level
  const id = useId()
  return (
    <div className={`acc ${className}${open ? ' open' : ''}`}>
      <Tag className="acc-title">
        <button type="button" className="acc-head" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>
          <span className="acc-name">{title}{meta && <small>{meta}</small>}</span>
          {count > 0 && <em className="acc-count">{count} added</em>}
          <span className="acc-chev" aria-hidden="true"><Icon name="chevD" size={18} stroke={2.4} /></span>
        </button>
      </Tag>
      <div className="acc-body" id={id}><div className="acc-inner">{children}</div></div>
    </div>
  )
}

const isWide = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 621px)').matches
export { isWide }

/** Quantity stepper used for every line. */
export function Stepper({ qty, onDec, onInc, label }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={onDec} aria-label={`Fewer ${label}`}><Icon name="minus" size={14} stroke={2.4} /></button>
      <output>{qty}</output>
      <button type="button" onClick={onInc} aria-label={`More ${label}`}><Icon name="plus" size={14} stroke={2.4} /></button>
    </div>
  )
}

/** Rows of items inside one group (pies, small chops, drinks...). */
export function ItemRows({ group, catTitle, cart }) {
  return (
    <ul className="rows">
      {group.items.map(it => {
        const line = cart.lines[it.id]
        return (
          <li key={it.id} className={line ? 'sel' : ''}>
            <div className="row-text">
              <strong>{it.name}</strong>
              <small>{money(it.price)} each{it.min > 1 ? `, minimum ${it.min}` : ''}</small>
            </div>
            {line ? (
              <Stepper qty={line.qty} label={it.name} onDec={() => cart.dec(it.id)} onInc={() => cart.add(it, catTitle)} />
            ) : (
              <button type="button" className="row-add" onClick={() => cart.add(it, catTitle)}>
                <Icon name="plus" size={14} stroke={2.6} /> Add {it.min > 1 ? it.min : ''}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Chin-Chin: choose a size, then tap flavours. When `photos` is given (shop page)
 * the sizes are shown as photo cards, otherwise as compact buttons.
 */
export function ChinChinPanel({ cart, photos }) {
  const [size, setSize] = useState(CHINCHIN_SIZES[0])
  const line = (f) => cart.lines[`cc-${f}-${size.key}`]
  const add = (f) => cart.add({
    id: `cc-${f}-${size.key}`, name: `${f} Chin-Chin, ${size.label}`,
    price: size.price, min: size.min, step: 1,
  }, 'Chin-Chin')

  return (
    <>
      <p className="picker-blurb">Pick a size, then tap the flavours you want. Mix and match across all four families.</p>

      {photos ? (
        <div className="size-cards" role="radiogroup" aria-label="Chin-Chin size">
          {CHINCHIN_SIZES.map(s => (
            <button key={s.key} type="button" role="radio" aria-checked={size.key === s.key}
                    className={size.key === s.key ? 'on' : ''} onClick={() => setSize(s)}>
              <img src={photos[s.key]} alt="" loading="lazy" decoding="async" />
              <b>{s.label}</b>
              <span>{money(s.price)}</span>
              {size.key === s.key && <i><Icon name="check" size={14} stroke={3} /></i>}
            </button>
          ))}
        </div>
      ) : (
        <div className="size-row" role="radiogroup" aria-label="Chin-Chin size">
          {CHINCHIN_SIZES.map(s => (
            <button key={s.key} type="button" role="radio" aria-checked={size.key === s.key}
                    className={size.key === s.key ? 'on' : ''} onClick={() => setSize(s)}>
              <b>{s.label}</b><span>{money(s.price)}</span>
            </button>
          ))}
        </div>
      )}
      <p className="picker-note">
        {size.note ? `${size.note}. ` : ''}Baileys carries a small extra charge, we will confirm it with you.
      </p>

      {CHINCHIN_CATEGORIES.map((cat, i) => {
        const picked = cat.items.filter(f => line(f)).length
        return (
          <Accordion key={cat.key} className="flavour-block" title={cat.name} meta={`${cat.items.length} flavours`}
                     count={picked} defaultOpen={i === 0 || isWide()}>
            <div className="chips">
              {cat.items.map(f => {
                const l = line(f)
                return (
                  <div key={f} className={`chip${l ? ' sel' : ''}`}>
                    <button type="button" onClick={() => !l && add(f)} aria-pressed={!!l}>
                      {l && <Icon name="check" size={14} stroke={2.6} />}{f}
                    </button>
                    {l && (
                      <span className="chip-qty">
                        <button type="button" onClick={() => cart.dec(l.id)} aria-label={`Fewer ${f}`}><Icon name="minus" size={12} stroke={3} /></button>
                        <output>{l.qty}</output>
                        <button type="button" onClick={() => add(f)} aria-label={`More ${f}`}><Icon name="plus" size={12} stroke={3} /></button>
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </Accordion>
        )
      })}
    </>
  )
}

/** Tabbed picker used in the order wizard and the Build Your Pack section. */
export function ItemPicker({ cart, only, dark = false }) {
  const cats = [{ key: 'chinchin', title: 'Chin-Chin', icon: 'cookie' }, ...CATALOGUE]
    .filter(c => !only || only.includes(c.key))
  const [tab, setTab] = useState(cats[0].key)
  const active = cats.find(c => c.key === tab) || cats[0]

  return (
    <div className={`picker${dark ? ' picker-dark' : ''}`}>
      <div className="picker-tabs" role="tablist">
        {cats.map(c => {
          const n = cart.list.filter(l => l.group === (c.key === 'chinchin' ? 'Chin-Chin' : c.title)).length
          return (
            <button key={c.key} role="tab" aria-selected={tab === c.key}
                    className={tab === c.key ? 'on' : ''} onClick={() => setTab(c.key)} type="button">
              <Icon name={c.icon} size={18} />
              <span>{c.title}</span>
              {n > 0 && <i>{n}</i>}
            </button>
          )
        })}
      </div>

      <div className="picker-panel" key={tab}>
        {active.key === 'chinchin' ? <ChinChinPanel cart={cart} /> : (
          <>
            <p className="picker-blurb">{active.blurb}</p>
            {active.groups.map(g => (
              <div key={g.title} className="flavour-block">
                <h4>{g.title}</h4>
                <ItemRows group={g} catTitle={active.title} cart={cart} />
              </div>
            ))}
            {active.footnote && <p className="picker-note">{active.footnote}</p>}
          </>
        )}
      </div>
    </div>
  )
}

export function CartSummary({ cart, empty = 'Nothing added yet.' }) {
  if (!cart.list.length) return <p className="cart-empty">{empty}</p>
  return (
    <ul className="cart-lines">
      {cart.list.map(l => (
        <li key={l.id}>
          <div className="cl-main">
            <strong>{l.name}</strong>
            <small>{l.qty} × {money(l.price)}</small>
          </div>
          <Stepper qty={l.qty} label={l.name} onDec={() => cart.dec(l.id)} onInc={() => cart.add(l, l.group)} />
          <b className="cl-total">{money(l.qty * l.price)}</b>
          <button type="button" className="cl-x" onClick={() => cart.remove(l.id)} aria-label={`Remove ${l.name}`}><Icon name="x" size={14} /></button>
        </li>
      ))}
    </ul>
  )
}
