import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useTilt } from '@/lib/animations';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, className, hover = false, padding = 'md', ...props }, ref) => {
        const { ref: tiltRef, tilt, tiltProps } = useTilt(5);

        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        };

        return (
            <motion.div
                ref={(node) => {
                    tiltRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                className={clsx(
                    'bg-white rounded-2xl border border-slate-200 shadow-md transition-all duration-300',
                    'relative overflow-hidden',
                    paddings[padding],
                    className,
                )}
                style={{
                    transformStyle: 'preserve-3d',
                }}
                animate={
                    hover
                        ? {
                              rotateX: tilt.rotateX,
                              rotateY: tilt.rotateY,
                          }
                        : {}
                }
                whileHover={
                    hover
                        ? {
                              scale: 1.02,
                              y: -4,
                              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                          }
                        : {}
                }
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                }}
                onMouseMove={hover ? tiltProps.onMouseMove : undefined}
                onMouseLeave={hover ? tiltProps.onMouseLeave : undefined}
            >
                {children}
            </motion.div>
        );
    },
);

Card.displayName = 'Card';
