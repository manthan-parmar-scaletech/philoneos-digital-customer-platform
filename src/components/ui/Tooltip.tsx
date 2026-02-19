'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    delay?: number;
}

export const Tooltip = ({ content, children, delay = 0 }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + rect.height / 2,
                left: rect.right + 12
            });
        }
    };

    useEffect(() => {
        if (isVisible) {
            updateCoords();
            window.addEventListener('scroll', updateCoords);
            window.addEventListener('resize', updateCoords);
        }
        return () => {
            window.removeEventListener('scroll', updateCoords);
            window.removeEventListener('resize', updateCoords);
        };
    }, [isVisible]);

    return (
        <div 
            ref={triggerRef}
            className="flex items-center justify-center w-full"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -10, y: '-50%' }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, x: -10, y: '-50%' }}
                        transition={{ duration: 0.15, delay }}
                        style={{
                            position: 'fixed',
                            top: coords.top,
                            left: coords.left,
                            zIndex: 9999,
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#7c3aed] backdrop-blur-md border border-white/20 rounded-lg shadow-[0_4px_20px_rgba(124,58,237,0.4)] pointer-events-none whitespace-nowrap"
                    >
                        {content}
                        {/* Tooltip Arrow */}
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#7c3aed] rotate-45 border-l border-b border-white/10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
