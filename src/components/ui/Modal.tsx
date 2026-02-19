import { HTMLAttributes, forwardRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    showCloseButton?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            isOpen,
            onClose,
            title,
            showCloseButton = true,
            size = 'md',
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

        if (!isOpen) return null;

        const sizes = {
            sm: 'max-w-md',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
        };

        return (
            <div
                className='fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in'
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />

                {/* Modal */}
                <div
                    ref={ref}
                    className={clsx(
                        'relative bg-white rounded-xl shadow-2xl w-full animate-slide-up',
                        sizes[size],
                        className,
                    )}
                    onClick={(e) => e.stopPropagation()}
                    role='dialog'
                    aria-modal='true'
                    aria-labelledby={title ? 'modal-title' : undefined}
                    {...props}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                            {title && (
                                <h2
                                    id='modal-title'
                                    className='text-xl font-semibold text-gray-900'
                                >
                                    {title}
                                </h2>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className='ml-auto text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100'
                                    aria-label='Close modal'
                                >
                                    <X className='w-5 h-5' />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className='p-6'>{children}</div>
                </div>
            </div>
        );
    },
);

Modal.displayName = 'Modal';
