import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            disabled,
            ...props
        },
        ref,
    ) => {
        const baseStyles =
            'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm relative overflow-hidden';

        const variants = {
            primary:
                'bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-white hover:from-slate-700/90 hover:to-slate-800/90 focus:ring-blue-500 shadow-lg hover:shadow-xl border border-slate-700/50 hover:border-slate-600/50 before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/10 before:to-purple-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
            secondary:
                'bg-gradient-to-br from-gray-100/80 to-gray-200/80 text-gray-900 hover:from-gray-200/90 hover:to-gray-300/90 focus:ring-gray-500 border border-gray-300/50 shadow-md hover:shadow-lg backdrop-blur-md',
            ghost: 'bg-white/5 text-gray-700 hover:bg-white/10 focus:ring-gray-500 backdrop-blur-md border border-gray-200/30 hover:border-gray-300/50',
            danger: 'bg-gradient-to-br from-red-600/90 to-red-700/90 text-white hover:from-red-500/90 hover:to-red-600/90 focus:ring-red-500 shadow-lg hover:shadow-xl border border-red-500/50 hover:border-red-400/50',
            outline:
                'bg-white/5 border-2 border-gray-300/50 text-gray-700 hover:bg-white/10 hover:border-gray-400/60 focus:ring-gray-500 backdrop-blur-md shadow-sm hover:shadow-md',
        };

        const sizes = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2.5 text-sm',
            lg: 'px-6 py-3.5 text-base',
        };

        return (
            <button
                ref={ref}
                className={clsx(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className,
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                    >
                        <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='3'
                        ></circle>
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                    </svg>
                )}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';
