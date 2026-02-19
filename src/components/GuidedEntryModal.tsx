import { useState } from 'react';
import {
    MessageCircle,
    Lightbulb,
    Target,
    TrendingUp,
    AlertCircle,
    Sparkles,
    X,
    ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { intentOptions, type ConversationIntent } from '@/lib/promptTemplates';
import { staggerContainer, staggerItem, slideUp } from '@/lib/animations';
import IntentInputForm from './IntentInputForm';
import clsx from 'clsx';

interface GuidedEntryModalProps {
    personaName: string;
    onSelectIntent: (intent: ConversationIntent, userInput?: string) => void;
    onClose: () => void;
    isLoading?: boolean;
}

const iconMap = {
    MessageCircle,
    Lightbulb,
    Target,
    TrendingUp,
    AlertCircle,
    Sparkles,
};

export default function GuidedEntryModal({
    personaName,
    onSelectIntent,
    onClose,
    isLoading = false,
}: GuidedEntryModalProps) {
    const [selectedIntent, setSelectedIntent] = useState<
        (typeof intentOptions)[number] | null
    >(null);

    const handleOptionClick = (option: (typeof intentOptions)[number]) => {
        if (option.id === 'free_chat') {
            onSelectIntent('free_chat');
        } else {
            setSelectedIntent(option);
        }
    };

    const handleInputSubmit = (input: string) => {
        if (selectedIntent) {
            onSelectIntent(selectedIntent.id, input);
        }
    };

    const handleBack = () => {
        setSelectedIntent(null);
    };

    return (
        <AnimatePresence>
            <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'>
                {/* Backdrop with Blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className='absolute inset-0 bg-black/80 backdrop-blur-xl'
                />
                
                {/* Modal Container */}
                <motion.div
                    variants={slideUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='relative bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_32px_120px_rgba(0,0,0,0.8)] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10'
                >
                    {/* Header Section */}
                    <div className='relative px-10 py-8 border-b border-white/5 bg-white/[0.01]'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-6'>
                                <div className='w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500'>
                                    {selectedIntent ? (
                                        (() => {
                                            const Icon = iconMap[selectedIntent.icon as keyof typeof iconMap];
                                            return <Icon className='w-7 h-7 text-white' />;
                                        })()
                                    ) : (
                                        <Sparkles className='w-7 h-7 text-white' />
                                    )}
                                </div>
                                <div className='space-y-1'>
                                    <h2 className='text-3xl font-bold text-white tracking-tight'>
                                        {selectedIntent ? selectedIntent.title : 'Initiate Interaction'}
                                    </h2>
                                    <p className='text-white/40 text-[15px] font-medium'>
                                        {selectedIntent 
                                            ? `Guiding your dialogue with ${personaName}`
                                            : `Strategic vectors for your conversation with ${personaName}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className='cursor-pointer w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-white/40 hover:text-white transition-all duration-300 border border-white/10'
                            >
                                <X className='w-6 h-6' />
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className='flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#060606]'>
                        {selectedIntent ? (
                            <IntentInputForm
                                intent={selectedIntent}
                                onSubmit={handleInputSubmit}
                                onBack={handleBack}
                                isLoading={isLoading}
                                personaName={personaName}
                            />
                        ) : (
                            <motion.div 
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className='grid grid-cols-1 md:grid-cols-2 gap-6'
                            >
                                {intentOptions.map((option) => {
                                    const IconComponent = iconMap[option.icon as keyof typeof iconMap];
                                    const isFreeChat = option.id === 'free_chat';

                                    return (
                                        <motion.button
                                            key={option.id}
                                            variants={staggerItem}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={isLoading}
                                            className={clsx(
                                                'group relative p-8 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden',
                                                isFreeChat 
                                                    ? 'bg-primary-500/10 border-primary-500/20 hover:border-primary-500/40' 
                                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]',
                                                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            )}
                                        >
                                            {/* Hover Glow Effect */}
                                            <div className={clsx(
                                                'absolute -inset-0.5 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000',
                                                isFreeChat ? 'bg-primary-500/20' : 'bg-white/5'
                                            )} />

                                            <div className='relative z-10 flex items-start gap-6'>
                                                <div className={clsx(
                                                    'shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border',
                                                    isFreeChat
                                                        ? 'bg-primary-500 text-white border-white/20 group-hover:scale-110'
                                                        : 'bg-white/[0.03] text-white/60 border-white/5 group-hover:text-white group-hover:bg-white/[0.1] group-hover:border-white/20'
                                                )}>
                                                    <IconComponent className='w-7 h-7' />
                                                </div>
                                                <div className='flex-1 space-y-2'>
                                                    <div className='flex items-center justify-between'>
                                                        <h3 className={clsx(
                                                            'text-xl font-bold tracking-tight transition-colors',
                                                            isFreeChat ? 'text-primary-400' : 'text-white group-hover:text-primary-400'
                                                        )}>
                                                            {option.title}
                                                        </h3>
                                                        <ChevronRight className={clsx(
                                                            'w-5 h-5 transition-all duration-500 transform group-hover:translate-x-1',
                                                            isFreeChat ? 'text-primary-500' : 'text-white/20 group-hover:text-primary-400'
                                                        )} />
                                                    </div>
                                                    <p className='text-[15px] leading-relaxed text-white/40 group-hover:text-white/60 transition-colors'>
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {isFreeChat && (
                                                <div className='absolute top-4 right-4'>
                                                    <div className='flex items-center gap-1.5 px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full'>
                                                        <div className='w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse' />
                                                        <span className='text-[10px] font-black uppercase tracking-widest text-primary-400'>
                                                            Quick Start
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
