import { HTMLAttributes, forwardRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdrop, modalContent } from '@/lib/animations';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    showCloseButton?: boolean;
    size?: 'sm' | 'md' | 'lg';
    footer?: React.ReactNode;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            isOpen,
            onClose,
            title,
            showCloseButton = true,
            size = 'md',
            footer,
            children,
            className,
            ...props
        },
        ref,
    ) => {
        useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape' && isOpen) {
                    onClose();
                }
            };

            if (isOpen) {
                document.addEventListener('keydown', handleEscape);
                document.body.style.overflow = 'hidden';
            }

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        }, [isOpen, onClose]);

        const sizes = {
            sm: 'max-w-md',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
        };

        return (
            <AnimatePresence>
                {isOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                        {/* Backdrop */}
                        <motion.div
                            variants={modalBackdrop}
                            initial='hidden'
                            animate='visible'
                            exit='exit'
                            className='absolute inset-0 bg-black/60 backdrop-blur-xl'
                            onClick={onClose}
                        />

                        {/* Modal */}
                        <motion.div
                            ref={ref}
                            variants={modalContent}
                            initial='hidden'
                            animate='visible'
                            exit='exit'
                            className={clsx(
                                'relative bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col border border-white/10',
                                sizes[size],
                                className,
                            )}
                            onClick={(e) => e.stopPropagation()}
                            role='dialog'
                            aria-modal='true'
                            aria-labelledby={title ? 'modal-title' : undefined}
                        >
                            {/* Header */}
                            {(title || showCloseButton) && (
                                <div className='flex items-center justify-between p-5 border-b border-white/10 relative z-10'>
                                    {title && (
                                        <h2
                                            id='modal-title'
                                            className='text-xl font-bold text-white tracking-tight'
                                        >
                                            {title}
                                        </h2>
                                    )}
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className='ml-auto text-gray-500 hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-white/5 cursor-pointer'
                                            aria-label='Close modal'
                                        >
                                            <X className='w-5 h-5' />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className='p-5 overflow-y-auto flex-1 relative z-10'>
                                {children}
                            </div>

                            {/* Footer */}
                            {footer && (
                                <div className='flex items-center justify-end gap-3 p-5 border-t border-white/5 relative z-10'>
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    },
);

Modal.displayName = 'Modal';
