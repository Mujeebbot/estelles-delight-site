import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon.jsx'
import { CartSummary } from './OrderParts.jsx'
import { money } from '../data/menu.js'

export default function CartDrawer({ open, onClose, cart, onCheckout, onBrowse, onBuild }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="cd-scrim" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.aside className="cd" role="dialog" aria-modal="true" aria-label="Your cart"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 0.68, 0.3, 1] }}>
            <header className="cd-head">
              <h2><Icon name="bag" size={22} /> Your Cart</h2>
              <button type="button" onClick={onClose} aria-label="Close cart"><Icon name="x" size={20} /></button>
            </header>

            {cart.list.length === 0 ? (
              <div className="cd-empty">
                <span className="cd-empty-ico"><Icon name="bag" size={34} stroke={1.6} /></span>
                <h3>Nothing here yet</h3>
                <p>Grab something from the shop, or build a custom pack for your event.</p>
                <div className="cd-empty-actions">
                  <button type="button" className="btn btn-solid" onClick={onBrowse}>Browse the Shop</button>
                  <button type="button" className="btn btn-outline" onClick={onBuild}>Build your pack</button>
                </div>
              </div>
            ) : (
              <>
                <div className="cd-body"><CartSummary cart={cart} /></div>
                <div className="cd-foot">
                  <div className="cd-total"><span>Subtotal</span><b>{money(cart.total)}</b></div>
                  <small>Delivery fee, if any, is confirmed with you at checkout.</small>
                  <button type="button" className="cd-checkout" onClick={onCheckout}>Checkout <Icon name="arrow" size={18} /></button>
                  <button type="button" className="cd-build" onClick={onBuild}>Build your pack</button>
                  <div className="cd-links">
                    <button type="button" onClick={onBrowse}>Keep shopping</button>
                    <button type="button" onClick={cart.clear}>Clear cart</button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
