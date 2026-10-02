import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon.jsx'
import { ItemPicker, CartSummary } from './OrderParts.jsx'
import { OCCASIONS, WHATSAPP, EMAIL, money } from '../data/menu.js'

const STEPS = ['Occasion', 'Items', 'Schedule', 'Confirm']
const TIMES = ['Morning', 'Midday', 'Afternoon', 'Evening']

const tomorrow = () => {
  const d = new Date(); d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export default function OrderModal({ open, onClose, cart, startStep = 1 }) {
  const [step, setStep] = useState(1)
  const [occasion, setOccasion] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [fulfil, setFulfil] = useState('delivery')
  const [address, setAddress] = useState('')
  const [guests, setGuests] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [touched, setTouched] = useState(false)
  const bodyRef = useRef(null)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [done, setDone] = useState(false)

  const dirty = cart.list.length > 0 || !!(occasion || date || time || guests || address || name || phone || email || notes)
  const resetAll = () => {
    cart.clear(); setOccasion(''); setDate(''); setTime(''); setFulfil('delivery'); setAddress('')
    setGuests(''); setName(''); setPhone(''); setEmail(''); setNotes(''); setTouched(false)
    setStep(1); setDone(false); setConfirmLeave(false)
  }
  // X / Esc: leave quietly if nothing was entered, otherwise ask what to do with the order.
  const requestClose = () => { if (done) { resetAll(); onClose() } else if (dirty) setConfirmLeave(true); else onClose() }
  const cancelOrder = () => { resetAll(); onClose() }
  const closeRef = useRef(requestClose)
  closeRef.current = requestClose

  // Open at the right step (e.g. straight to Schedule from the pack builder)
  useEffect(() => { if (open) { setStep(startStep); setTouched(false) } }, [open, startStep])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') closeRef.current() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    document.body.classList.add('order-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.classList.remove('order-open')
    }
  }, [open])

  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }) }, [step])

  const occasionLabel = OCCASIONS.find(o => o.key === occasion)?.label
  const canSend = name.trim() && (phone.trim() || email.trim())

  const text = useMemo(() => {
    const L = ["Hi Estelle's Delight, I'd like to place an order.", '']
    if (occasionLabel) L.push(`Occasion: ${occasionLabel}`)
    if (date) L.push(`Date: ${date}${time ? `, ${time.toLowerCase()}` : ''}`)
    L.push(`Fulfilment: ${fulfil === 'delivery' ? `Delivery${address ? ` to ${address}` : ''}` : 'Pickup'}`)
    if (guests) L.push(`Guests: ${guests}`)
    L.push('', 'Items:')
    cart.list.forEach(l => L.push(`- ${l.name} x${l.qty} = ${money(l.qty * l.price)}`))
    L.push('', `Total: ${money(cart.total)} (before delivery fee)`, '', `Name: ${name}`)
    if (phone) L.push(`Phone: ${phone}`)
    if (email) L.push(`Email: ${email}`)
    if (notes) L.push(`Notes: ${notes}`)
    return L.join('\n')
  }, [cart.list, cart.total, occasionLabel, date, time, fulfil, address, guests, name, phone, email, notes])

  const guard = (e) => { if (!canSend) { e.preventDefault(); setTouched(true); return } setTimeout(() => setDone(true), 500) }
  const goNext = () => setStep(s => Math.min(4, s + 1))
  const goBack = () => setStep(s => Math.max(1, s - 1))

  const heading = [
    ["What's the occasion?", "We'll tailor your order to your event. Pick one, or skip ahead."],
    ['Build your order', 'Add your favourites. Minimum quantities are shown on each item.'],
    ['When and where?', 'Tell us when you need it and how you would like to receive it.'],
    ['Confirm and send', 'Check everything, add your details and send it straight to us.'],
  ][step - 1]

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="order" className="ow" role="dialog" aria-modal="true" aria-label="Place an order"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.38, ease: [0.22, 0.68, 0.3, 1] }}>

          <header className="ow-head">
            <div className="ow-head-in">
              <span className="ow-brand">Estelle's <em>Delight</em></span>
              <ol className="ow-steps" aria-label="Progress">
                {STEPS.map((s, i) => {
                  const n = i + 1
                  const state = n === step ? 'now' : n < step ? 'done' : ''
                  return (
                    <li key={s} className={state}>
                      <button type="button" disabled={n > step} onClick={() => setStep(n)} aria-current={n === step ? 'step' : undefined}>
                        <span className="dot">{n < step ? <Icon name="check" size={14} stroke={3} /> : n}</span>
                        <span className="lbl">{s}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
              <div className="ow-head-r">
                {dirty && !done && <button type="button" className="ow-cancel" onClick={() => setConfirmLeave(true)}>Cancel order</button>}
              <button type="button" className="ow-close" onClick={requestClose} aria-label="Close order form"><Icon name="x" size={20} /></button>
              </div>
            </div>
          </header>

          <div className="ow-body" ref={bodyRef}>
            <div className="ow-inner">
              {done ? (
                <div className="ow-done">
                  <span className="ow-done-ico"><Icon name="check" size={34} stroke={2.4} /></span>
                  <h2 className="ow-title">Almost there{name ? `, ${name.split(' ')[0]}` : ''}!</h2>
                  <p className="ow-sub">Your order is ready in WhatsApp or your email app. Press <b>Send</b> there and we will reply within 24 hours to confirm.</p>
                  <div className="ow-done-actions">
                    <button type="button" className="ow-next" onClick={() => { resetAll(); onClose() }}>Done</button>
                    <button type="button" className="ow-back" onClick={() => setDone(false)}>Back to my order</button>
                  </div>
                </div>
              ) : (<>
              <p className="ow-kicker">Step {step} of 4</p>
              <h2 className="ow-title">{heading[0]}</h2>
              <p className="ow-sub">{heading[1]}</p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                  {step === 1 && (
                    <>
                      <div className="occ-grid">
                        {OCCASIONS.map(o => (
                          <button key={o.key} type="button" className={`occ${occasion === o.key ? ' on' : ''}`}
                                  onClick={() => { if (occasion === o.key) { setOccasion(''); return } setOccasion(o.key); setTimeout(() => setStep(2), 180) }}>
                            <Icon name={o.icon} size={34} stroke={1.5} />
                            <span>{o.label}</span>
                          </button>
                        ))}
                      </div>
                      <p className="ow-hint">
                        Click any option to continue <Icon name="arrow" size={16} />
                        <button type="button" onClick={() => setStep(2)}>or skip this step</button>
                      </p>
                    </>
                  )}

                  {step === 2 && <ItemPicker cart={cart} />}

                  {step === 3 && (
                    <div className="sched">
                      <div className="field-row">
                        <label className="field"><span>Date needed</span>
                          <input type="date" min={tomorrow()} value={date} onChange={e => setDate(e.target.value)} />
                        </label>
                        <label className="field"><span>Guests (optional)</span>
                          <input type="number" min="1" inputMode="numeric" placeholder="e.g. 40" value={guests} onChange={e => setGuests(e.target.value)} />
                        </label>
                      </div>

                      <div className="field"><span>Preferred time</span>
                        <div className="seg">
                          {TIMES.map(t => (
                            <button key={t} type="button" className={time === t ? 'on' : ''} onClick={() => setTime(time === t ? '' : t)}>{t}</button>
                          ))}
                        </div>
                      </div>

                      <div className="field"><span>How would you like it?</span>
                        <div className="fulfil">
                          <button type="button" className={fulfil === 'delivery' ? 'on' : ''} onClick={() => setFulfil('delivery')}>
                            <Icon name="truck" size={24} /><b>Delivery</b><small>Fee applies, we will confirm</small>
                          </button>
                          <button type="button" className={fulfil === 'pickup' ? 'on' : ''} onClick={() => setFulfil('pickup')}>
                            <Icon name="pin" size={24} /><b>Pickup</b><small>Perth, Western Australia</small>
                          </button>
                        </div>
                      </div>

                      {fulfil === 'delivery' && (
                        <label className="field"><span>Delivery address or suburb</span>
                          <input type="text" autoComplete="street-address" placeholder="Street, suburb" value={address} onChange={e => setAddress(e.target.value)} />
                        </label>
                      )}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="confirm">
                      <div className="confirm-card">
                        <h3>Your order</h3>
                        <ul className="meta">
                          {occasionLabel && <li><Icon name="sparkle" size={16} />{occasionLabel}</li>}
                          {date && <li><Icon name="calendar" size={16} />{date}{time && `, ${time.toLowerCase()}`}</li>}
                          <li><Icon name={fulfil === 'delivery' ? 'truck' : 'pin'} size={16} />{fulfil === 'delivery' ? `Delivery${address ? `: ${address}` : ''}` : 'Pickup in Perth'}</li>
                          {guests && <li><Icon name="users" size={16} />{guests} guests</li>}
                        </ul>
                        <CartSummary cart={cart} empty="Your order is empty. Go back to add items." />
                        <div className="confirm-total"><span>Total</span><b>{money(cart.total)}</b></div>
                        <small>Before delivery fee. We confirm final pricing with you.</small>
                      </div>

                      <div className="confirm-form">
                        <label className="field"><span>Your name *</span>
                          <input type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah Johnson" />
                        </label>
                        <div className="field-row">
                          <label className="field"><span>Phone / WhatsApp</span>
                            <input type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+61 400 000 000" />
                          </label>
                          <label className="field"><span>Email</span>
                            <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@example.com" />
                          </label>
                        </div>
                        <label className="field"><span>Notes</span>
                          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Mocktail flavours, glaze toppings, allergies, gift wrapping..." />
                        </label>
                        {touched && !canSend && <p className="form-error">Please add your name and a phone number or email.</p>}

                        <div className="send-row">
                          <a className="send wa" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" onClick={guard}>
                            <Icon name="whatsapp" size={20} /> Send on WhatsApp
                          </a>
                          <a className="send em" href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Order from ${name || 'a customer'}`)}&body=${encodeURIComponent(text)}`} onClick={guard}>
                            <Icon name="mail" size={20} /> Send by Email
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              </>)}
            </div>
          </div>

          <AnimatePresence>
            {confirmLeave && (
              <motion.div className="ow-modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="ow-dialog" role="alertdialog" aria-labelledby="ow-leave-t"
                  initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}>
                  <h3 id="ow-leave-t">Leave your order?</h3>
                  <p>You can keep your basket and pick up where you left off, or cancel the order and start fresh.</p>
                  <div className="ow-dialog-actions">
                    <button type="button" className="ow-next" onClick={() => setConfirmLeave(false)}>Keep editing</button>
                    <button type="button" className="ow-back" onClick={() => { setConfirmLeave(false); onClose() }}>Save for later</button>
                    <button type="button" className="ow-danger" onClick={cancelOrder}>Cancel order</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {step > 1 && !done && (
            <div className="ow-foot">
              <div className="ow-foot-in">
                <button type="button" className="ow-back" onClick={goBack}><Icon name="chevL" size={18} /> Back</button>
                <div className="ow-total">
                  {cart.count > 0 ? <><small>{cart.list.length} {cart.list.length === 1 ? 'item' : 'items'}</small><b>{money(cart.total)}</b></> : <small>No items yet</small>}
                </div>
                {step < 4 && (
                  <button type="button" className="ow-next" onClick={goNext} disabled={step === 2 && cart.count === 0}>
                    Continue <Icon name="arrow" size={18} />
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
