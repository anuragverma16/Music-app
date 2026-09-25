import gsap from 'gsap'

/**
 * GSAP Animation helpers for Beatly
 */

// Stagger entrance for cards or list items
export const animateEntrance = (target, options = {}) => {
  if (!target) return
  return gsap.fromTo(
    target,
    {
      opacity: 0,
      y: options.y || 24,
      scale: options.scale || 0.98,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: options.duration || 0.5,
      stagger: options.stagger !== undefined ? options.stagger : 0.06,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      ...options,
    }
  )
}

// Fade in smoothly
export const fadeIn = (target, duration = 0.4) => {
  if (!target) return
  return gsap.fromTo(
    target,
    { opacity: 0 },
    { opacity: 1, duration, ease: 'power2.out', clearProps: 'opacity' }
  )
}

// Like / Heart Pop Animation
export const popHeart = (target) => {
  if (!target) return
  gsap.timeline()
    .to(target, { scale: 1.4, duration: 0.15, ease: 'back.out(2)' })
    .to(target, { scale: 0.85, duration: 0.1 })
    .to(target, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.4)' })
}

// Card scale hover
export const hoverScale = (element, enter = true) => {
  if (!element) return
  gsap.to(element, {
    scale: enter ? 1.04 : 1,
    y: enter ? -4 : 0,
    duration: 0.25,
    ease: 'power2.out',
  })
}

// Button press feedback
export const buttonPress = (target) => {
  if (!target) return
  gsap.timeline()
    .to(target, { scale: 0.92, duration: 0.08, ease: 'power2.out' })
    .to(target, { scale: 1, duration: 0.15, ease: 'back.out(2)' })
}

// Slide in drawer or modal
export const slideUpModal = (target) => {
  if (!target) return
  return gsap.fromTo(
    target,
    { y: '100%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' }
  )
}
