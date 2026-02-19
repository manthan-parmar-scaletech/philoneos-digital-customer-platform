import { useState, useRef, useEffect } from 'react';
import { Send, FileText, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    summaryButton?: {
        show: boolean;
        disabled: boolean;
        label: string;
        onClick: () => void;
        isViewMode: boolean;
    };
}

export default function ChatInput({
    onSend,
    disabled = false,
    placeholder = 'Type your message...',
    value: controlledValue,
    onChange: controlledOnChange,
    summaryButton,
}: ChatInputProps) {
    const [internalMessage, setInternalMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isControlled = controlledValue !== undefined;
    const message = isControlled ? controlledValue : internalMessage;

    const handleChange = (newValue: string) => {
        if (isControlled && controlledOnChange) {
            controlledOnChange(newValue);
        } else {
            setInternalMessage(newValue);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message.trim());
            handleChange('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className='border-t border-gray-200 bg-white'
        >
            <div className=' mx-auto p-4'>
                <div className='flex items-center justify-between'>
                    <div
                        style={{ width: 'calc(100% - 210px)' }}
                        className='flex items-end gap-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:shadow-md transition-all duration-200'
                    >
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => handleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={disabled}
                            rows={1}
                            className='flex-1 px-4 py-3 bg-transparent border-none outline-none resize-none max-h-40 text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
                        />
                        <div className='pr-3 pb-3'>
                            <Button
                                type='submit'
                                variant='primary'
                                size='sm'
                                disabled={disabled || !message.trim()}
                                className='rounded-lg shadow-sm hover:shadow-md'
                            >
                                <Send className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        {summaryButton?.show && (
                            <button
                                type='button'
                                onClick={summaryButton.onClick}
                                disabled={summaryButton.disabled}
                                className={`
                                    group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm
                                    transition-all duration-300 transform
                                    ${
                                        summaryButton.disabled
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : summaryButton.isViewMode
                                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 cursor-pointer'
                                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 animate-pulse cursor-pointer'
                                    }
                                `}
                                title={
                                    summaryButton.disabled
                                        ? 'Need at least 3 messages'
                                        : summaryButton.label
                                }
                            >
                                {!summaryButton.disabled && (
                                    <div className='absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300' />
                                )}
                                <div
                                    className={`relative ${summaryButton.isViewMode ? 'group-hover:rotate-12 transition-transform duration-300' : 'group-hover:scale-110 transition-transform duration-300'}`}
                                >
                                    {summaryButton.isViewMode ? (
                                        <FileText className='w-5 h-5' />
                                    ) : (
                                        <Sparkles className='w-5 h-5' />
                                    )}
                                </div>
                                <span className='relative'>
                                    {summaryButton.label}
                                </span>
                                {summaryButton.isViewMode &&
                                    !summaryButton.disabled && (
                                        <div className='relative w-2 h-2 bg-green-400 rounded-full animate-pulse'>
                                            <div className='absolute inset-0 bg-green-400 rounded-full animate-ping' />
                                        </div>
                                    )}
                            </button>
                        )}
                    </div>
                </div>
                <p className='text-xs text-gray-400 mt-2 text-center'>
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </form>
    );
}
