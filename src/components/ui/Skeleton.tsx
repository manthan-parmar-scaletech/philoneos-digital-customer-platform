import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

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
            <div
                ref={ref}
                className={clsx(
                    'relative overflow-hidden bg-gray-200',
                    'before:absolute before:inset-0 before:-translate-x-full',
                    'before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r',
                    'before:from-transparent before:via-white/20 before:to-transparent',
                    variants[variant],
                    className,
                )}
                style={{
                    width,
                    height: variant === 'text' ? undefined : height,
                    ...style,
                }}
                {...props}
            />
        );
    },
);

Skeleton.displayName = 'Skeleton';
