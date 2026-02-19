import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useRipple, useMagneticEffect } from '@/lib/animations';

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
        const { ripples, addRipple } = useRipple();
        const { position, magneticProps } = useMagneticEffect(0.2);
        const baseStyles =
            'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden backdrop-blur-lg active:scale-[0.98] min-h-[44px]';

        const variants = {
            primary:
                'bg-primary-600 text-white hover:shadow-xl hover:shadow-primary-500/30 focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 border border-white/20 hover:scale-[1.02] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
            secondary:
                'bg-white/10 backdrop-blur-lg text-slate-700 hover:bg-white/20 focus:ring-2 focus:ring-slate-400/50 border border-white/30 shadow-lg hover:shadow-xl hover:scale-[1.02]',
            ghost: 'bg-white/5 text-slate-600 hover:bg-white/10 focus:ring-2 focus:ring-slate-400/30 backdrop-blur-md border border-slate-200/20 hover:border-slate-300/40 hover:scale-[1.02]',
            danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-xl hover:shadow-red-500/30 focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 border border-white/20 hover:scale-[1.02]',
            outline:
                'bg-transparent border-2 border-slate-300/60 text-slate-700 hover:bg-white/10 hover:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02]',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-7 py-3.5 text-base',
        };

        return (
            <motion.button
                ref={ref}
                className={clsx(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className,
                )}
                disabled={disabled || isLoading}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    addRipple(e);
                    props.onClick?.(e);
                }}
                animate={{
                    x: disabled ? 0 : position.x,
                    y: disabled ? 0 : position.y,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
                onMouseMove={magneticProps.onMouseMove}
                onMouseLeave={magneticProps.onMouseLeave}
            >
                {ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        className='absolute rounded-full bg-white/30 pointer-events-none'
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: 0,
                            height: 0,
                        }}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                ))}
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
            </motion.button>
        );
    },
);

Button.displayName = 'Button';
