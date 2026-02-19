import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    (
        { variant = 'rectangular', width, height, className, style, ...props },
        ref,
    ) => {
        const variants = {
            text: 'h-4 rounded-md',
            circular: 'rounded-full',
            rectangular: 'rounded-lg',
            card: 'rounded-xl',
            avatar: 'rounded-full',
        };

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className={clsx(
                    'relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200',
                    'before:absolute before:inset-0 before:-translate-x-full',
                    'before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r',
                    'before:from-transparent before:via-white/60 before:to-transparent',
                    variants[variant],
                    className,
                )}
                style={{
                    width,
                    height: variant === 'text' ? undefined : height,
                    backgroundSize: '200% 100%',
                    ...style,
                }}
                {...props}
            />
        );
    },
);

Skeleton.displayName = 'Skeleton';
