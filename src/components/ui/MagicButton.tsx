'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MagicButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
}

export const MagicButton = React.forwardRef<HTMLButtonElement, MagicButtonProps>(
    ({ children, isLoading, variant = 'primary', className, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={!disabled && !isLoading ? { 
                    scale: 1.01,
                    boxShadow: "0 10px 20px -10px rgba(124, 58, 237, 0.5)"
                } : {}}
                whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
                disabled={disabled || isLoading}
                className={cn(
                    'w-full py-2.5 px-5 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer disabled:cursor-not-allowed disabled:opacity-70',
                    variant === 'primary' 
                        ? 'bg-[#7c3aed] border border-[#8b5cf6]/30' 
                        : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10',
                    className
                )}
                {...props}
            >
                {/* Subtle Shimmer */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] pointer-events-none' />
                
                {/* Interactive Inner Glow (not persistent) */}
                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-[#8b5cf6]/10 via-transparent to-white/5 pointer-events-none' />
                
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className='w-5 h-5 animate-spin text-white/80' />
                        <span className="text-white/80">Processing...</span>
                    </div>
                ) : (
                    <div className='flex items-center gap-2 relative z-10'>
                        {children}
                    </div>
                )}
            </motion.button>
        );
    }
);

MagicButton.displayName = 'MagicButton';
