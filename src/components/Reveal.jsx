import { motion } from 'framer-motion'

/**
 * Scroll-reveal wrapper using Framer Motion whileInView.
 * Supports different animation variants via the `variant` prop.
 */

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
}

export default function Reveal({
  children,
  className = '',
  style,
  as = 'div',
  variant = 'fadeUp',
  delay = 0,
  duration = 0.8,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div
  // On narrow screens never start off to the side: it widens the page and causes sideways wobble
  const narrow = typeof window !== 'undefined' && window.innerWidth < 900
  const key = narrow && (variant === 'slideLeft' || variant === 'slideRight') ? 'fadeUp' : variant
  const chosen = variants[key] || variants.fadeUp

  return (
    <MotionTag
      className={className}
      style={style}
      variants={chosen}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration, delay, ease: [0.22, 0.68, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
