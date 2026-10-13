import { useState, useCallback, useRef } from 'react'
import Nav           from './components/Nav.jsx'
import Hero          from './components/Hero.jsx'
import SignatureMenu from './components/SignatureMenu.jsx'
import Highlights    from './components/Highlights.jsx'
import Story         from './components/Story.jsx'
import Quality       from './components/Quality.jsx'
import Flavours      from './components/Flavours.jsx'
import BuildPack     from './components/BuildPack.jsx'
import Catering      from './components/Catering.jsx'
import Training      from './components/Training.jsx'
import FanGallery    from './components/FanGallery.jsx'
import FAQ           from './components/FAQ.jsx'
import Newsletter    from './components/Newsletter.jsx'
import Footer        from './components/Footer.jsx'
import Lightbox      from './components/Lightbox.jsx'
import OrderModal    from './components/OrderModal.jsx'
import CartDrawer    from './components/CartDrawer.jsx'
import Shop          from './components/Shop.jsx'
import { useCart }   from './lib/cart.js'
import { useRoute, goShop, openOrder, closeOrder, setOrderStep, ORDER_STEPS } from './lib/route.js'

export default function App() {
  const route = useRoute()
  const cart = useCart()
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [cartOpen, setCartOpen]       = useState(false)

  // The order wizard lives in the address bar: /order/items etc.
  const orderOpen = !!route.order
  const lastStep = useRef(1)                       // keeps the step steady while the wizard animates out
  if (route.order) lastStep.current = ORDER_STEPS.indexOf(route.order) + 1
  const closeCart  = useCallback(() => setCartOpen(false), [])

  // Every "Order now" goes to the shop; the order form only opens from checkout.
  const toShop = useCallback(() => { setCartOpen(false); goShop() }, [])
  const checkout = useCallback(() => { setCartOpen(false); openOrder(cart.list.length ? 3 : 1) }, [cart.list.length])
  // The pack builder is step 2 of the order form; open at the occasion step when the pack is empty.
  const build = useCallback(() => { setCartOpen(false); openOrder(cart.list.length ? 2 : 1) }, [cart.list.length])

  return (
    <>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      <OrderModal open={orderOpen} onClose={closeOrder} cart={cart} step={lastStep.current} onStep={setOrderStep} />
      <CartDrawer open={cartOpen} onClose={closeCart} cart={cart} onCheckout={checkout} onBrowse={toShop} onBuild={build} />

      <Nav page={route.page} cartCount={cart.list.length} onCartClick={() => setCartOpen(true)} onOrderClick={toShop} />
      <div id="top" style={{ height: 0 }} />

      {route.page === 'shop' ? (
        <Shop cat={route.cat} cart={cart} onCart={() => setCartOpen(true)} />
      ) : (
        <>
          <Hero />
          <SignatureMenu />
          <Highlights />
          <Story />
          <Quality />
          <Flavours />
          <BuildPack cart={cart} onBuild={build} onReview={checkout} onImageClick={setLightboxSrc} />
          <Catering onImageClick={setLightboxSrc} />
          <Training />
          <FanGallery />
          <FAQ />
        </>
      )}
      <Newsletter />
      <Footer />
    </>
  )
}
