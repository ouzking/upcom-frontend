import type { Variants } from "framer-motion";

/** Courbe signature : départ vif, arrivée très douce. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
