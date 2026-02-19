/**
 * Animation Constants
 * Centralized timing and easing values for consistent animations
 */

// ============================================================================
// TIMING
// ============================================================================

export const TIMING = {
    // Ultra fast - for micro-interactions
    instant: 0.1,
    
    // Fast - for simple transitions
    fast: 0.2,
    
    // Normal - default animation speed
    normal: 0.3,
    
    // Moderate - for complex animations
    moderate: 0.4,
    
    // Slow - for dramatic effects
    slow: 0.6,
    
    // Very slow - for loading states
    verySlow: 1.0,
} as const;

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const EASING = {
    // Standard easing (most common)
    standard: [0.4, 0, 0.2, 1] as const,
    
    // Deceleration (ease-out)
    decelerate: [0, 0, 0.2, 1] as const,
    
    // Acceleration (ease-in)
    accelerate: [0.4, 0, 1, 1] as const,
    
    // Sharp (quick start and end)
    sharp: [0.4, 0, 0.6, 1] as const,
    
    // Spring-like bounce
    spring: [0.34, 1.56, 0.64, 1] as const,
    
    // Smooth elastic
    elastic: [0.68, -0.55, 0.265, 1.55] as const,
} as const;

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

export const SPRING = {
    // Gentle spring
    gentle: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
    },
    
    // Bouncy spring
    bouncy: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 20,
    },
    
    // Stiff spring (quick response)
    stiff: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 30,
    },
    
    // Smooth spring
    smooth: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 25,
    },
} as const;

// ============================================================================
// STAGGER DELAYS
// ============================================================================

export const STAGGER = {
    // Very fast stagger
    fast: 0.05,
    
    // Normal stagger
    normal: 0.1,
    
    // Slow stagger
    slow: 0.15,
    
    // Very slow stagger
    verySlow: 0.2,
} as const;

// ============================================================================
// ANIMATION DISTANCES
// ============================================================================

export const DISTANCE = {
    // Small movement
    small: 10,
    
    // Medium movement
    medium: 20,
    
    // Large movement
    large: 40,
    
    // Extra large movement
    extraLarge: 60,
} as const;

// ============================================================================
// SCALE VALUES
// ============================================================================

export const SCALE = {
    // Subtle scale
    subtle: 1.02,
    
    // Small scale
    small: 1.05,
    
    // Medium scale
    medium: 1.1,
    
    // Large scale
    large: 1.15,
    
    // Press effect
    press: 0.95,
    
    // Strong press
    strongPress: 0.9,
} as const;

// ============================================================================
// BLUR VALUES
// ============================================================================

export const BLUR = {
    // Light blur
    light: 8,
    
    // Medium blur
    medium: 16,
    
    // Strong blur
    strong: 24,
    
    // Extra strong blur
    extraStrong: 40,
} as const;

// ============================================================================
// ROTATION VALUES
// ============================================================================

export const ROTATION = {
    // Subtle tilt
    subtle: 2,
    
    // Small tilt
    small: 5,
    
    // Medium tilt
    medium: 10,
    
    // Large tilt
    large: 15,
    
    // Full rotation
    full: 360,
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const Z_INDEX = {
    // Base layer
    base: 0,
    
    // Dropdown/popover
    dropdown: 1000,
    
    // Sticky elements
    sticky: 1100,
    
    // Fixed elements
    fixed: 1200,
    
    // Modal backdrop
    modalBackdrop: 1300,
    
    // Modal content
    modal: 1400,
    
    // Toast notifications
    toast: 1500,
    
    // Tooltip
    tooltip: 1600,
} as const;

// ============================================================================
// VIEWPORT THRESHOLDS
// ============================================================================

export const VIEWPORT_THRESHOLD = {
    // Trigger when any part is visible
    any: 0,
    
    // Trigger when 10% is visible
    small: 0.1,
    
    // Trigger when 25% is visible
    quarter: 0.25,
    
    // Trigger when 50% is visible
    half: 0.5,
    
    // Trigger when 75% is visible
    most: 0.75,
    
    // Trigger when fully visible
    full: 1,
} as const;

// ============================================================================
// GESTURE THRESHOLDS
// ============================================================================

export const GESTURE = {
    // Swipe distance threshold
    swipeThreshold: 50,
    
    // Swipe velocity threshold
    swipeVelocity: 500,
    
    // Drag threshold
    dragThreshold: 10,
    
    // Long press duration (ms)
    longPressDuration: 500,
} as const;
