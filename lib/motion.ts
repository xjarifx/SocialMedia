/**
 * Motion Configuration
 * 
 * Centralized animation variants and configurations for Framer Motion.
 * All animations are subtle and fast (120-200ms) for professional feel.
 */

import type { Variants } from "framer-motion";

// Duration constants (in seconds)
export const DURATION = {
  fast: 0.12,
  base: 0.15,
  medium: 0.2,
  slow: 0.3,
} as const;

// Easing curves
export const EASING = {
  smooth: [0.4, 0, 0.2, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
} as const;

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.medium,
      ease: EASING.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: DURATION.base,
      ease: EASING.smooth,
    },
  },
};

// Feed item stagger variants
export const feedContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const feedItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.medium,
      ease: EASING.smooth,
    },
  },
};

// Button interactions
export const buttonTapVariants = {
  scale: 0.97,
  transition: { duration: DURATION.fast },
};

export const buttonHoverVariants = {
  scale: 1.02,
  transition: { duration: DURATION.base },
};

// Icon button interactions
export const iconButtonTapVariants = {
  scale: 0.9,
  transition: { duration: DURATION.fast },
};

// Card hover effect
export const cardHoverVariants = {
  y: -2,
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
  transition: { duration: DURATION.base },
};

// Like animation
export const likeAnimationVariants: Variants = {
  liked: {
    scale: [1, 1.2, 1],
    transition: { duration: DURATION.slow },
  },
  unliked: {
    scale: 1,
  },
};

// Modal/Dialog animations
export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.base },
  },
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: "-48%",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: "-50%",
    transition: { duration: DURATION.base },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: "-48%",
    transition: { duration: DURATION.base },
  },
};

// Dropdown menu animations
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATION.base,
      ease: EASING.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    transition: {
      duration: DURATION.fast,
      ease: EASING.smooth,
    },
  },
};

// Fade in animation
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.medium },
  },
};

// Slide up animation
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.medium,
      ease: EASING.smooth,
    },
  },
};

// Number counter animation
export const counterVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: DURATION.base },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: DURATION.base },
  },
};
