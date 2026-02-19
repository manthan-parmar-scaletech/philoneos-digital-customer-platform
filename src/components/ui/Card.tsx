import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, className, hover = false, padding = 'md', ...props }, ref) => {
        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        };

        return (
            <div
                ref={ref}
                className={clsx(
                    'bg-white rounded-xl border border-gray-200/60 shadow-sm transition-all duration-300',
                    'backdrop-blur-sm',
                    hover &&
                        'hover:shadow-lg hover:border-gray-300 hover:shadow-blue-500/5',
                    paddings[padding],
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        );
    },
);

Card.displayName = 'Card';
