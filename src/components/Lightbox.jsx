import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Lightbox({ src, onClose }) {
  useEffect(() => {
    document.body.classList.toggle('lightbox-open', Boolean(src))
    if (src) document.body.style.overflow = 'hidden'
    else if (!document.body.classList.contains('order-open')) document.body.style.overflow = ''
    return () => {
      document.body.classList.remove('lightbox-open')
      if (!document.body.classList.contains('order-open')) document.body.style.overflow = ''
    }
  }, [src])

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          id="lightbox"
          onClick={(e) => { if (e.target.id === 'lightbox') onClose() }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="lb-close" onClick={onClose}>Close ×</span>
          <img src={src} alt="" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
