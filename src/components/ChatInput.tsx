import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/Button';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function ChatInput({
    onSend,
    disabled = false,
    placeholder = 'Type your message...',
}: ChatInputProps) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            setMessage('');
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
            <div className='max-w-4xl mx-auto p-4'>
                <div className='flex items-end gap-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:shadow-md transition-all duration-200'>
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                <p className='text-xs text-gray-400 mt-2 text-center'>
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </form>
    );
}
