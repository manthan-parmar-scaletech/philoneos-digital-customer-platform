/**
 * Custom Animation Hooks
 * Reusable hooks for common animation patterns
 */

import { useEffect, useRef, useState } from 'react';
import {
    useInView,
    useAnimation,
    useMotionValue,
    useTransform,
} from 'framer-motion';

/**
 * Hook to trigger animation when element enters viewport
 * @param threshold - Percentage of element that must be visible (0-1)
 * @param triggerOnce - Whether to trigger animation only once
 */
export function useScrollAnimation(threshold = 0.1, triggerOnce = true) {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, {
        once: triggerOnce,
        amount: threshold,
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else if (!triggerOnce) {
            controls.start('hidden');
        }
    }, [inView, controls, triggerOnce]);

    return { ref, controls, inView };
}

/**
 * Hook for stagger animation on list items
 */
export function useStaggerAnimation() {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.1 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [inView, controls]);

    return { ref, controls };
}

/**
 * Hook for parallax scroll effect
 * @param offset - How much to offset the parallax (default: 50)
 */
export function useParallax(offset = 50) {
    const y = useMotionValue(0);
    const yRange = useTransform(y, [0, 1], [0, offset]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            y.set(scrollY / 1000);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [y]);

    return yRange;
}

/**
 * Hook for mouse position tracking (for magnetic effects)
 */
export function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return mousePosition;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-reduced-motion: reduce)')
                .matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
}

/**
 * Hook for element hover state with animation controls
 */
export function useHoverAnimation() {
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();

    const handleHoverStart = () => {
        setIsHovered(true);
        controls.start('hover');
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
        controls.start('rest');
    };

    return {
        isHovered,
        controls,
        hoverProps: {
            onHoverStart: handleHoverStart,
            onHoverEnd: handleHoverEnd,
        },
    };
}

/**
 * Hook for ripple effect on click
 */
export function useRipple() {
    const [ripples, setRipples] = useState<
        Array<{ x: number; y: number; id: number }>
    >([]);

    const addRipple = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples((prev) => [...prev, { x, y, id }]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
        }, 600);
    };

    return { ripples, addRipple };
}

/**
 * Hook for count-up animation
 * @param end - Target number
 * @param duration - Animation duration in seconds
 */
export function useCountUp(end: number, duration = 2) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min(
                (currentTime - startTime) / (duration * 1000),
                1,
            );

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, inView]);

    return { count, ref };
}

/**
 * Hook for 3D tilt effect on mouse move
 * @param maxTilt - Maximum tilt angle in degrees
 */
export function useTilt(maxTilt = 10) {
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        setTilt({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0 });
    };

    return {
        ref,
        tilt,
        tiltProps: {
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
        },
    };
}

/**
 * Hook for magnetic button effect
 * @param strength - Magnetic pull strength (0-1)
 */
export function useMagneticEffect(strength = 0.3) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return {
        ref,
        position,
        magneticProps: {
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
        },
    };
}
