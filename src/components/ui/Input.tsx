import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className, ...props }, ref) => {
        return (
            <div className='w-full'>
                {label && (
                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        'w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200',
                        'text-gray-900 placeholder-gray-500 bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-0',
                        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200',
                        error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 hover:border-gray-400',
                        className,
                    )}
                    {...props}
                />
                {error && (
                    <p className='mt-1.5 text-sm text-red-600'>{error}</p>
                )}
                {helperText && !error && (
                    <p className='mt-1.5 text-sm text-gray-500'>{helperText}</p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';
