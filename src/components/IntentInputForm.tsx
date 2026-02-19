import { useState } from 'react';
import { Button } from './ui/Button';
import { ArrowLeft } from 'lucide-react';
import type { IntentOption } from '@/lib/promptTemplates';

interface IntentInputFormProps {
    intent: IntentOption;
    onSubmit: (input: string) => void;
    onBack: () => void;
    isLoading?: boolean;
}

export default function IntentInputForm({
    intent,
    onSubmit,
    onBack,
    isLoading = false,
}: IntentInputFormProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSubmit(input.trim());
        }
    };

    return (
        <div className='animate-fade-in'>
            <button
                onClick={onBack}
                className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6'
                disabled={isLoading}
            >
                <ArrowLeft className='w-4 h-4' />
                <span className='text-sm font-medium'>Back to options</span>
            </button>

            <div className='mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                    {intent.title}
                </h3>
                <p className='text-gray-600'>{intent.description}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className='mb-6'>
                    <label
                        htmlFor='intent-input'
                        className='block text-sm font-medium text-gray-700 mb-2'
                    >
                        {intent.inputLabel}
                    </label>
                    <textarea
                        id='intent-input'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={intent.inputPlaceholder}
                        rows={6}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-gray-900 placeholder-gray-400'
                        disabled={isLoading}
                        autoFocus
                    />
                </div>

                <div className='flex gap-3'>
                    <Button
                        type='button'
                        variant='secondary'
                        size='lg'
                        onClick={onBack}
                        disabled={isLoading}
                        className='flex-1'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        variant='primary'
                        size='lg'
                        disabled={!input.trim() || isLoading}
                        className='flex-1'
                    >
                        {isLoading ? 'Starting conversation...' : 'Continue'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
