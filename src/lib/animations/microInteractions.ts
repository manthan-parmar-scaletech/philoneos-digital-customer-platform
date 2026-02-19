/**
 * Micro-interactions Animation Variants
 * Small, delightful animations for UI elements
 */

import { Variants } from 'framer-motion';

// Checkbox checkmark draw animation
export const checkboxVariants: Variants = {
    unchecked: {
        pathLength: 0,
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
    checked: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// Radio button ripple effect
export const radioRippleVariants: Variants = {
    initial: {
        scale: 0,
        opacity: 0.6,
    },
    animate: {
        scale: 2,
        opacity: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

// Toggle switch slide animation
export const toggleSwitchVariants: Variants = {
    off: {
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
        },
    },
    on: {
        x: 20,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
        },
    },
};

// Toggle background color
export const toggleBackgroundVariants: Variants = {
    off: {
        backgroundColor: '#cbd5e1',
        transition: {
            duration: 0.2,
        },
    },
    on: {
        backgroundColor: '#2563eb',
        transition: {
            duration: 0.2,
        },
    },
};

// Link underline slide animation
export const linkUnderlineVariants: Variants = {
    initial: {
        scaleX: 0,
        originX: 0,
    },
    hover: {
        scaleX: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// Tab indicator slide
export const tabIndicatorVariants = {
    initial: {
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
        },
    },
};

// Button glow effect
export const buttonGlowVariants: Variants = {
    initial: {
        boxShadow: '0 0 0px rgba(37, 99, 235, 0)',
    },
    hover: {
        boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)',
        transition: {
            duration: 0.3,
        },
    },
    tap: {
        boxShadow: '0 0 10px rgba(37, 99, 235, 0.3)',
        transition: {
            duration: 0.1,
        },
    },
};

// Range slider thumb bounce
export const sliderThumbVariants: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.2,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10,
        },
    },
    drag: {
        scale: 1.3,
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10,
        },
    },
};

// Breadcrumb separator animation
export const breadcrumbSeparatorVariants: Variants = {
    initial: {
        opacity: 0,
        x: -10,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// Success feedback animation
export const successFeedbackVariants: Variants = {
    initial: {
        scale: 0,
        rotate: -180,
    },
    animate: {
        scale: 1,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 15,
        },
    },
};

// Error shake animation
export const errorShakeVariants: Variants = {
    initial: {
        x: 0,
    },
    shake: {
        x: [-10, 10, -10, 10, -5, 5, 0],
        transition: {
            duration: 0.5,
        },
    },
};

// Tooltip fade and slide
export const tooltipVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 10,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
};

// Badge pulse animation
export const badgePulseVariants: Variants = {
    initial: {
        scale: 1,
    },
    pulse: {
        scale: [1, 1.1, 1],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2,
        },
    },
};

// Notification dot pulse
export const notificationDotVariants: Variants = {
    initial: {
        scale: 1,
        opacity: 1,
    },
    pulse: {
        scale: [1, 1.3, 1],
        opacity: [1, 0.7, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// Dropdown menu item hover
export const menuItemVariants: Variants = {
    initial: {
        backgroundColor: 'transparent',
        x: 0,
    },
    hover: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        x: 4,
        transition: {
            duration: 0.2,
        },
    },
};

// Progress bar fill animation
export const progressBarVariants = {
    initial: {
        scaleX: 0,
        originX: 0,
    },
    animate: (progress: number) => ({
        scaleX: progress / 100,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    }),
};

// Skeleton shimmer effect
export const skeletonShimmerVariants: Variants = {
    initial: {
        backgroundPosition: '-200% 0',
    },
    animate: {
        backgroundPosition: '200% 0',
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};
