import { useState } from 'react'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { EMAIL } from '../data/menu.js'

// Set VITE_NEWSLETTER_ENDPOINT (Formspree, Mailchimp proxy, etc.) to collect sign-ups.
// Without it, the form falls back to opening an email to the shop.
const ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | sending | done | mailto | error

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) { setState('error'); return }
    if (!ENDPOINT) {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Newsletter sign-up')}&body=${encodeURIComponent(`Please add me to the Estelle's Delight list: ${email}`)}`
      setState('mailto'); return
    }
    setState('sending')
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email, source: 'website' }) })
      if (!r.ok) throw new Error()
      setState('done'); setEmail('')
    } catch { setState('error') }
  }

  return (
    <section id="newsletter" className="news-section doodled">
      <div className="wrap">
        <Reveal className="news-card">
          <div className="news-copy">
            <span className="news-ico"><Icon name="bell" size={22} /></span>
            <p className="kicker kicker-gold">The Delight list</p>
            <h2>First to know. First to taste.</h2>
            <p>New flavours, seasonal menus, market dates and the occasional offer, straight to your inbox. No spam, unsubscribe any time.</p>
          </div>
          <form className="news-form" onSubmit={submit} noValidate>
            {state === 'mailto' ? (
              <p className="news-ok"><Icon name="mail" size={20} /> Your email app has opened. Press Send to join the list.</p>
            ) : state === 'done' ? (
              <p className="news-ok"><Icon name="check" size={20} stroke={2.6} /> Thank you! You're on the list.</p>
            ) : (
              <>
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <div className="news-field">
                  <input id="nl-email" type="email" inputMode="email" autoComplete="email" placeholder="Your email address"
                         value={email} onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle') }} aria-invalid={state === 'error'} />
                  <button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : 'Subscribe'} <Icon name="arrow" size={16} /></button>
                </div>
                {state === 'error' && <p className="news-err">Please enter a valid email address and try again.</p>}
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
