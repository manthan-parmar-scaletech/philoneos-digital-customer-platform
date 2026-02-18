import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import Image from 'next/image';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fallback?: string;
    color?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    (
        {
            src,
            alt,
            size = 'md',
            fallback,
            color = '#3b82f6',
            className,
            ...props
        },
        ref,
    ) => {
        const sizes = {
            sm: 'w-8 h-8 text-xs',
            md: 'w-10 h-10 text-sm',
            lg: 'w-12 h-12 text-base',
            xl: 'w-16 h-16 text-lg',
        };

        const displayFallback =
            fallback || alt.charAt(0).toUpperCase() || '?';

        return (
            <div
                ref={ref}
                className={clsx(
                    'rounded-full flex items-center justify-center font-semibold overflow-hidden',
                    sizes[size],
                    className,
                )}
                {...props}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        width={size === 'xl' ? 64 : size === 'lg' ? 48 : size === 'md' ? 40 : 32}
                        height={size === 'xl' ? 64 : size === 'lg' ? 48 : size === 'md' ? 40 : 32}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div
                        className='w-full h-full flex items-center justify-center text-white'
                        style={{ backgroundColor: color }}
                    >
                        {displayFallback}
                    </div>
                )}
            </div>
        );
    },
);

Avatar.displayName = 'Avatar';
