/**
 * Scroll-based Animation Variants and Utilities
 * Animations triggered by scroll position and viewport intersection
 */

import { Variants } from 'framer-motion';

// Fade in on scroll
export const fadeInOnScroll: Variants = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

// Slide in from left on scroll
export const slideInLeftOnScroll: Variants = {
    hidden: {
        opacity: 0,
        x: -100,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

// Slide in from right on scroll
export const slideInRightOnScroll: Variants = {
    hidden: {
        opacity: 0,
        x: 100,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

// Scale up on scroll
export const scaleUpOnScroll: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Parallax layer variants
export const parallaxLayerVariants = {
    slow: {
        y: (scrollY: number) => scrollY * 0.2,
    },
    medium: {
        y: (scrollY: number) => scrollY * 0.5,
    },
    fast: {
        y: (scrollY: number) => scrollY * 0.8,
    },
};

// Sticky header shrink animation
export const stickyHeaderVariants: Variants = {
    top: {
        height: 80,
        paddingTop: 16,
        paddingBottom: 16,
        transition: {
            duration: 0.3,
            ease: 'easeInOut',
        },
    },
    scrolled: {
        height: 60,
        paddingTop: 8,
        paddingBottom: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: {
            duration: 0.3,
            ease: 'easeInOut',
        },
    },
};

// Progress bar on scroll
export const scrollProgressVariants = {
    initial: {
        scaleX: 0,
        originX: 0,
    },
    animate: (progress: number) => ({
        scaleX: progress,
        transition: {
            duration: 0.1,
            ease: 'linear',
        },
    }),
};

// Back to top button
export const backToTopVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.8,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// Section transition on scroll
export const sectionTransitionVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 100,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -100,
        transition: {
            duration: 0.5,
        },
    },
};

// Horizontal scroll indicator
export const horizontalScrollIndicatorVariants: Variants = {
    initial: {
        x: 0,
    },
    animate: (progress: number) => ({
        x: progress,
        transition: {
            duration: 0.1,
            ease: 'linear',
        },
    }),
};

// Reveal on scroll with stagger
export const revealStaggerVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: 'easeOut',
        },
    }),
};

// Infinite scroll loading indicator
export const infiniteScrollLoadingVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

// Viewport threshold configurations
export const viewportConfig = {
    once: {
        once: true,
        amount: 0.3,
    },
    repeat: {
        once: false,
        amount: 0.3,
    },
    full: {
        once: true,
        amount: 0.8,
    },
};

// Scroll direction variants
export const scrollDirectionVariants: Variants = {
    up: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    down: {
        y: -100,
        opacity: 0,
        transition: {
            duration: 0.3,
        },
    },
};

// Zoom in on scroll
export const zoomInOnScroll: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.5,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

// Rotate in on scroll
export const rotateInOnScroll: Variants = {
    hidden: {
        opacity: 0,
        rotate: -45,
        scale: 0.8,
    },
    visible: {
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: 'easeOut',
        },
    },
};
