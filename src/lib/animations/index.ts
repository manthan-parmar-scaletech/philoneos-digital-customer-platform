/**
 * Animation Library - Central Export
 * Import animations, hooks, and constants from this file
 */

// Export all variants
export * from './variants';

// Central export file for all animation utilities
export * from './variants';
export * from './hooks';
export * from './constants';
export * from './microInteractions';
export * from './scrollAnimations';

// Re-export commonly used Framer Motion utilities
export {
    motion,
    AnimatePresence,
    useAnimation,
    useInView,
} from 'framer-motion';
export type { Variants, Transition } from 'framer-motion';
