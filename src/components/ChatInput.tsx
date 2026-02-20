import { useState, useRef, useEffect } from 'react';
import { Send, FileText, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import clsx from 'clsx';

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
            className='bg-transparent relative'
        >
            <div className='max-w-4xl mx-auto'>
                <div className='relative group/input'>
                    {/* Shadow & Glow Effects */}
                    <div className='absolute -inset-1 bg-gradient-to-r from-primary-500/10 via-indigo-500/10 to-primary-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000' />
                    
                    <div
                        className='relative flex items-end gap-2 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 focus-within:bg-white/[0.06] focus-within:border-white/20 transition-all duration-500 shadow-2xl'
                    >
                        {/* Summary Button Integrated */}
                        {summaryButton?.show && (
                            <div className="relative">
                                <Tooltip content={summaryButton.disabled ? 'Need 3+ messages' : summaryButton.label}>
                                    <button
                                        type='button'
                                        onClick={summaryButton.onClick}
                                        disabled={summaryButton.disabled}
                                        className={clsx(
                                            'w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer duration-500 border',
                                            summaryButton.disabled
                                                ? 'text-white/10 border-white/5 cursor-not-allowed'
                                                : summaryButton.isViewMode
                                                    ? 'bg-primary-500 text-white border-primary-400/50 shadow-lg shadow-primary-500/20'
                                                    : 'bg-white/[0.05] text-primary-400 border-white/10 hover:bg-white/[0.1] hover:text-primary-300 shadow-glow animate-glow'
                                        )}
                                    >
                                        {summaryButton.isViewMode ? <FileText className='w-5 h-5' /> : <Sparkles className='w-5 h-5' />}
                                    </button>
                                </Tooltip>
                            </div>
                        )}

                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => handleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={disabled}
                            rows={1}
                            className='flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 focus-visible:shadow-none focus-visible:outline-none focus-visible:border-0 outline-none resize-none max-h-40 text-white text-[15px] font-medium placeholder-white/20 disabled:opacity-50 disabled:cursor-not-allowed custom-scrollbar leading-relaxed'
                        />

                        <div className=' flex items-center gap-2'>
                            <Button
                                type='submit'
                                variant='primary'
                                size='sm'
                                disabled={disabled || !message.trim()}
                                className='w-12 h-12 rounded-2xl text-[#060606] shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20'
                            >
                                <Send className='w-5 h-5' />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Hints */}
                <div className='flex items-center justify-center gap-6 mt-4'>
                    <div className='h-px w-12 bg-gradient-to-r from-transparent to-white/5' />
                    <p className='text-[10px] text-white/20 font-bold uppercase tracking-[0.25em]'>
                        Command Bar Active
                    </p>
                    <div className='h-px w-12 bg-gradient-to-l from-transparent to-white/5' />
                </div>
            </div>
        </form>
    );
}
