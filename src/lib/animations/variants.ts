/**
 * Animation Variants Library
 * Reusable Framer Motion animation variants for consistent motion design
 */

import { Variants } from 'framer-motion';

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1], // cubic-bezier easing
        },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 },
    },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
    },
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInLeft: Variants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        x: -100,
        opacity: 0,
        transition: { duration: 0.3 },
    },
};

export const slideInRight: Variants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        x: 100,
        opacity: 0,
        transition: { duration: 0.3 },
    },
};

export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
    },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        scale: 0.8,
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

export const scaleInCenter: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1], // spring-like easing
        },
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

// ============================================================================
// STAGGER ANIMATIONS (for lists)
// ============================================================================

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 },
    },
};

// ============================================================================
// MODAL/DIALOG ANIMATIONS
// ============================================================================

export const modalBackdrop: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

export const modalContent: Variants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        y: 20,
        transition: { duration: 0.2 },
    },
};

// ============================================================================
// HOVER ANIMATIONS
// ============================================================================

export const hoverLift = {
    rest: { y: 0, scale: 1 },
    hover: {
        y: -4,
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};

export const hoverGlow = {
    rest: { boxShadow: '0 0 0 rgba(99, 102, 241, 0)' },
    hover: {
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
        transition: { duration: 0.3 },
    },
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonPress: Variants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 },
    },
};

export const buttonRipple = {
    initial: { scale: 0, opacity: 0.5 },
    animate: {
        scale: 2,
        opacity: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardHover: Variants = {
    rest: {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: { duration: 0.3 },
    },
};

// ============================================================================
// TOAST/NOTIFICATION ANIMATIONS
// ============================================================================

export const toastSlideIn: Variants = {
    hidden: { x: 400, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        x: 400,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 1, 1],
        },
    },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const pulseAnimation: Variants = {
    initial: { scale: 1, opacity: 1 },
    animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const spinAnimation: Variants = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================

export const scrollReveal: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

// ============================================================================
// SHAKE ANIMATION (for errors)
// ============================================================================

export const shakeAnimation: Variants = {
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
            duration: 0.5,
        },
    },
};

// ============================================================================
// SUCCESS CHECKMARK ANIMATION
// ============================================================================

export const checkmarkDraw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 0.5, ease: 'easeInOut' },
            opacity: { duration: 0.2 },
        },
    },
};

// ============================================================================
// COLLAPSE/EXPAND ANIMATIONS
// ============================================================================

export const collapseVertical: Variants = {
    collapsed: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.2 },
        },
    },
    expanded: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.3, delay: 0.1 },
        },
    },
};

// ============================================================================
// FLOATING ANIMATION
// ============================================================================

export const floatingAnimation: Variants = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};
