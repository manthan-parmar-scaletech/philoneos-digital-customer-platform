import { useState } from 'react';
import { Button } from './ui/Button';
import { ArrowLeft, Send } from 'lucide-react';
import type { IntentOption } from '@/lib/promptTemplates';
import { motion } from 'framer-motion';
import { staggerItem } from '@/lib/animations';

interface IntentInputFormProps {
    intent: IntentOption;
    onSubmit: (input: string) => void;
    onBack: () => void;
    isLoading?: boolean;
    personaName?: string;
}

export default function IntentInputForm({
    intent,
    onSubmit,
    onBack,
    isLoading = false,
    personaName,
}: IntentInputFormProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSubmit(input.trim());
        }
    };

    return (
        <motion.div 
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            className='max-w-3xl mx-auto space-y-10'
        >
            <div className='flex items-center gap-10'>
                <button
                    onClick={onBack}
                    className='group flex items-center gap-3 text-white/40 hover:text-white transition-all cursor-pointer'
                    disabled={isLoading}
                >
                    <div className='w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-500/10 transition-all'>
                        <ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                    </div>
                    <span className='text-sm font-bold uppercase tracking-widest'>Back</span>
                </button>

                <div className='h-px flex-1 bg-gradient-to-r from-white/5 to-transparent' />
            </div>

            <div className='space-y-4'>
                <div className='inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full'>
                    <span className='text-[10px] font-black uppercase tracking-widest text-primary-400'>
                        Required Intelligence
                    </span>
                </div>
                <h3 className='text-4xl font-black text-white tracking-tighter'>
                    {intent.title}
                </h3>
                <p className='text-lg text-white/40 font-medium leading-relaxed max-w-2xl'>
                    {intent.description}
                </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-8'>
                <div className='relative group'>
                    {/* Input Glow Effect */}
                    <div className='absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-indigo-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000' />
                    
                    <div className='relative'>
                        <label
                            htmlFor='intent-input'
                            className='absolute -top-3 left-8 px-4 bg-[#060606] text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-focus-within:text-primary-400 transition-colors z-10'
                        >
                            {intent.inputLabel}
                        </label>
                        <textarea
                            id='intent-input'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={intent.inputPlaceholder}
                            rows={6}
                            className='w-full px-8 py-8 bg-white/[0.02] border border-white/5 rounded-[2rem] focus:border-primary-500/50 outline-none transition-all resize-none text-xl text-white placeholder-white/10 custom-scrollbar backdrop-blur-3xl'
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>
                </div>

                <div className='flex items-center gap-4'>
                    <Button
                        type='button'
                        variant='ghost'
                        size='lg'
                        onClick={onBack}
                        disabled={isLoading}
                        className='px-10 h-16 rounded-[1.5rem] uppercase tracking-widest text-xs'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        variant='primary'
                        size='lg'
                        disabled={!input.trim() || isLoading}
                        className='flex-1 h-16 rounded-[1.5rem] uppercase tracking-widest text-xs'
                    >
                        {isLoading ? (
                            'Synchronizing...'
                        ) : (
                            <span className='flex items-center gap-3'>
                                Initiate Interaction
                                <Send className='w-4 h-4' />
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
