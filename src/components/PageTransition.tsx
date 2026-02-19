'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { pageTransition } from '@/lib/animations';

interface PageTransitionProps {
    children: React.ReactNode;
}

/**
 * PageTransition Component
 * Wraps page content to provide smooth transitions between routes
 */
export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                variants={pageTransition}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
