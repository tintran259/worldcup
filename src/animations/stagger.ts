import type { Variants } from 'framer-motion'

/**
 * Stagger container variants.
 *
 * Wrap a list with a stagger container to have children
 * animate in one after another instead of all at once.
 *
 * Usage:
 *   <motion.ul variants={staggerContainer()} initial="hidden" animate="visible">
 *     {items.map(item => (
 *       <motion.li key={item.id} variants={staggerItem}>...</motion.li>
 *     ))}
 *   </motion.ul>
 */

/**
 * Creates a stagger container variant.
 * @param staggerChildren - delay between each child animation (seconds)
 * @param delayChildren   - delay before the first child starts (seconds)
 */
export function staggerContainer(
  staggerChildren = 0.07,
  delayChildren   = 0,
): Variants {
  return {
    hidden:  {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

/** Default stagger item — used as children of staggerContainer. */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.30, ease: [0.16, 1, 0.3, 1] } },
}

/** Fast stagger — for small items like table rows. */
export const staggerItemFast: Variants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
}

/** Slow stagger — for large cards that need breathing room. */
export function staggerContainerSlow(): Variants {
  return staggerContainer(0.12, 0.10)
}
