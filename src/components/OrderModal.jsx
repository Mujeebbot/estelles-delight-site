import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon.jsx'
import { ItemPicker, CartSummary } from './OrderParts.jsx'
import { OCCASIONS, WHATSAPP, EMAIL, money } from '../data/menu.js'

// Optional: set VITE_ORDER_ENDPOINT (e.g. a Formspree form URL) so orders also reach the shop
// directly, even if the customer never presses Send in WhatsApp or their email app.
const ORDER_ENDPOINT = import.meta.env.VITE_ORDER_ENDPOINT

const DRAFT_KEY = 'ed-order-draft-v1'
const loadDraft = () => {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
    return d && typeof d === 'object' && Date.now() - (d.t || 0) < 7 * 864e5 ? d : {}
  } catch { return {} }
}

const STEPS = ['Occasion', 'Items', 'Schedule', 'Confirm']
const TIMES = ['Morning', 'Midday', 'Afternoon', 'Evening']

const tomorrow = () => {
  const d = new Date(); d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export default function OrderModal({ open, onClose, cart, step = 1, onStep }) {
  // The step lives in the address bar (/order/items ...); this just asks to change it.
  const setStep = (v) => onStep(Math.max(1, Math.min(4, typeof v === 'function' ? v(step) : v)))
  const D = useMemo(loadDraft, [])          // details typed earlier, kept across refreshes
  const today = new Date().toISOString().slice(0, 10)
  const [occasion, setOccasion] = useState(D.occasion || '')
  const [date, setDate] = useState(D.date && D.date >= today ? D.date : '')
  const [time, setTime] = useState(D.time || '')
  const [fulfil, setFulfil] = useState(D.fulfil || 'delivery')
  const [address, setAddress] = useState(D.address || '')
  const [guests, setGuests] = useState(D.guests || '')
  const [name, setName] = useState(D.name || '')
  const [phone, setPhone] = useState(D.phone || '')
  const [email, setEmail] = useState(D.email || '')
  const [notes, setNotes] = useState(D.notes || '')
  const [touched, setTouched] = useState(false)
  const bodyRef = useRef(null)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [done, setDone] = useState(false)
  const [doneKind, setDoneKind] = useState('link')   // 'link' = opened WhatsApp/email, 'form' = delivered to us
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const d = { occasion, date, time, fulfil, address, guests, name, phone, email, notes }
      if (Object.entries(d).some(([k, v]) => v && !(k === 'fulfil' && v === 'delivery'))) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ t: Date.now(), ...d }))
      } else localStorage.removeItem(DRAFT_KEY)
    } catch { /* storage unavailable */ }
  }, [occasion, date, time, fulfil, address, guests, name, phone, email, notes])

  const dirty = cart.list.length > 0 || !!(occasion || date || time || guests || address || name || phone || email || notes)
  const resetAll = () => {
    cart.clear(); setOccasion(''); setDate(''); setTime(''); setFulfil('delivery'); setAddress('')
    setGuests(''); setName(''); setPhone(''); setEmail(''); setNotes(''); setTouched(false)
    setDone(false); setConfirmLeave(false)
  }
  // X / Esc: leave quietly if nothing was entered, otherwise ask what to do with the order.
  const requestClose = () => { if (done) { if (doneKind === 'form') resetAll(); else setDone(false); onClose() } else if (dirty) setConfirmLeave(true); else onClose() }
  const cancelOrder = () => { resetAll(); onClose() }
  const closeRef = useRef(requestClose)
  closeRef.current = requestClose

  useEffect(() => { if (open) setTouched(false) }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') closeRef.current() }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.classList.add('order-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
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

  const guard = (e) => { if (!canSend) { e.preventDefault(); setTouched(true); return } setTimeout(() => { setDoneKind('link'); setDone(true) }, 500) }

  const copyOrder = async () => {
    try { await navigator.clipboard.writeText(text) } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      t.remove()
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const submitRequest = async () => {
    if (!canSend) { setTouched(true); return }
    setSending(true); setSendError(false)
    try {
      const r = await fetch(ORDER_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name, phone, email, occasion: occasionLabel || '', date, time, fulfilment: fulfil, address, guests, notes,
          items: cart.list.map(l => ({ name: l.name, qty: l.qty, price: l.price, total: l.qty * l.price })),
          total: cart.total, message: text, source: 'website',
        }),
      })
      if (!r.ok) throw new Error('bad status')
      setDoneKind('form'); setDone(true)
    } catch { setSendError(true) } finally { setSending(false) }
  }
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
                  {doneKind === 'form' ? (
                    <>
                      <h2 className="ow-title">Order request sent{name ? `, ${name.split(' ')[0]}` : ''}!</h2>
                      <p className="ow-sub">We have your order. We will reply within 24 hours to confirm pricing, delivery and payment.</p>
                      <div className="ow-done-actions">
                        <button type="button" className="ow-next" onClick={() => { resetAll(); onClose() }}>Done</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="ow-title">Did your order send{name ? `, ${name.split(' ')[0]}` : ''}?</h2>
                      <p className="ow-sub">Your order is open in WhatsApp or your email app, and it only reaches us once you press <b>Send</b> there. Once it has, we will reply within 24 hours to confirm.</p>
                      <div className="ow-done-actions">
                        <button type="button" className="ow-next" onClick={() => { resetAll(); onClose() }}>Yes, it sent</button>
                        <button type="button" className="ow-back" onClick={() => setDone(false)}>Not yet, take me back</button>
                        <button type="button" className="ow-back" onClick={copyOrder}>{copied ? 'Copied!' : 'Copy my order'}</button>
                      </div>
                    </>
                  )}
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
                          {ORDER_ENDPOINT && (
                            <button type="button" className="send req" onClick={submitRequest} disabled={sending}>
                              <Icon name="send" size={20} /> {sending ? 'Sending...' : 'Send order request'}
                            </button>
                          )}
                          <a className="send wa" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" onClick={guard}>
                            <Icon name="whatsapp" size={20} /> Send on WhatsApp
                          </a>
                          <a className="send em" href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Order from ${name || 'a customer'}`)}&body=${encodeURIComponent(text)}`} onClick={guard}>
                            <Icon name="mail" size={20} /> Send by Email
                          </a>
                        </div>
                        {sendError && <p className="form-error">That did not go through. Please send it by WhatsApp or email instead.</p>}
                        <button type="button" className="copy-order" onClick={copyOrder}>{copied ? 'Copied!' : 'Copy order text'}</button>
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
