import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    (
        {
            variant = 'rectangular',
            width,
            height,
            className,
            style,
            ...props
        },
        ref,
    ) => {
        const variants = {
            text: 'h-4 rounded',
            circular: 'rounded-full',
            rectangular: 'rounded-lg',
        };

        return (
            <div
                ref={ref}
                className={clsx(
                    'animate-pulse bg-gray-200',
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
