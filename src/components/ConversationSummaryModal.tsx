import { useState, useEffect } from 'react';
import {
    X,
    Lightbulb,
    AlertCircle,
    Layout,
    Loader2,
    Sparkles,
    Copy,
    Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, fadeIn, slideUp } from '@/lib/animations';
import type { SummaryData } from '@/types';
import clsx from 'clsx';

interface ConversationSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: SummaryData | null;
    isLoading: boolean;
}

const loadingMessages = [
    'Analyzing conversation structure...',
    'Identifying unique consumer insights...',
    'Extracting hidden objections...',
    'Digitalising executive takeaways...',
    'Finalizing digital customer report...',
];

function LoadingAnimation() {
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const message = loadingMessages[currentLoadingMessage];

        if (charIndex < message.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + message[charIndex]);
                setCharIndex((prev) => prev + 1);
            }, 25);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                const nextIndex =
                    (currentLoadingMessage + 1) % loadingMessages.length;
                setCurrentLoadingMessage(nextIndex);
                setDisplayedText('');
                setCharIndex(0);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [currentLoadingMessage, charIndex]);

    return (
        <div className='flex flex-col items-center justify-center py-20 px-8 relative overflow-hidden'>
            {/* Background elements */}
            <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full animate-pulse' />
            </div>

            <div className='relative z-10 max-w-md w-full text-center'>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='relative mb-12 mx-auto w-24 h-24'
                >
                    <div className='absolute inset-0 bg-primary-500/20 blur-2xl rounded-full animate-pulse' />
                    <div className='relative w-full h-full bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl'>
                        <Loader2 className='w-10 h-10 text-primary-400 animate-spin' />
                    </div>
                </motion.div>

                <motion.div 
                    variants={slideUp}
                    initial="hidden"
                    animate="visible"
                    className='space-y-6'
                >
                    <div className='space-y-2'>
                        <h3 className='text-2xl font-bold text-white tracking-tight'>
                            Digitalising Insights
                        </h3>
                        <p className='text-white/40 font-medium'>
                            Digital AI is processing your interaction
                        </p>
                    </div>

                    <div className='bg-white/[0.02] backdrop-blur-2xl rounded-2xl p-6 border border-white/5 relative group overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                        <p className='text-lg text-white/90 font-medium min-h-[28px] relative'>
                            {displayedText}
                            <span className='inline-block w-1 h-5 bg-primary-500 ml-2 animate-pulse rounded-full align-middle' />
                        </p>
                    </div>

                    <div className='flex justify-center gap-2'>
                        {loadingMessages.map((_, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    'h-1 rounded-full transition-all duration-500',
                                    i === currentLoadingMessage ? 'bg-primary-500 w-8' : 'bg-white/10 w-2'
                                )}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ConversationSummaryModal({
    isOpen,
    onClose,
    summary,
    isLoading,
}: ConversationSummaryModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopySummary = () => {
        if (!summary) return;

        let summaryText = '📊 CONVERSATION SUMMARY\n\n';

        if (summary.key_insights && summary.key_insights.length > 0) {
            summaryText += '💡 KEY INSIGHTS:\n';
            summary.key_insights.forEach((insight, index) => {
                summaryText += `${index + 1}. ${insight}\n`;
            });
            summaryText += '\n';
        }

        if (summary.top_objections && summary.top_objections.length > 0) {
            summaryText += '⚠️ TOP OBJECTIONS:\n';
            summary.top_objections.forEach((objection, index) => {
                summaryText += `${index + 1}. ${objection}\n`;
            });
            summaryText += '\n';
        }

        if (summary.executive_summary && summary.executive_summary.length > 0) {
            summaryText += '📋 EXECUTIVE SUMMARY:\n';
            summary.executive_summary.forEach((point, index) => {
                summaryText += `${index + 1}. ${point}\n`;
            });
        }

        navigator.clipboard.writeText(summaryText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='absolute inset-0 bg-black/80 backdrop-blur-xl'
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className='relative bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_32px_120px_rgba(0,0,0,0.8)] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10'
                    >
                        {/* Header */}
                        <div className='relative px-8 py-6 border-b border-white/5 bg-white/[0.01]'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-5'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-primary-600 rounded-xl flex items-center justify-center shadow-2xl border border-white/20 transform -rotate-2 hover:rotate-0 transition-transform duration-500'>
                                        <Sparkles className='w-6 h-6 text-white' />
                                    </div>
                                    <div className='space-y-0.5'>
                                        <h2 className='text-2xl font-bold text-white tracking-tight'>
                                            Conversation Summary
                                        </h2>
                                        <p className='text-white/40 text-sm font-medium'>
                                            Digitalised insights from your interaction
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {!isLoading && summary && (
                                        <button
                                            onClick={handleCopySummary}
                                            className=' cursor-pointer h-10 px-5 bg-white/[0.03] hover:bg-white/[0.08] text-white rounded-xl transition-all duration-300 border border-white/10 flex items-center gap-2 font-bold text-xs uppercase tracking-widest'
                                        >
                                            {copied ? (
                                                <Check className='w-3.5 h-3.5 text-emerald-400' />
                                            ) : (
                                                <Copy className='w-3.5 h-3.5' />
                                            )}
                                            {copied ? 'Captured' : 'Copy'}
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className='cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/40 hover:text-white transition-all duration-300 border border-white/10'
                                    >
                                        <X className='w-5 h-5' />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className='flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#060606]'>
                            {isLoading ? (
                                <LoadingAnimation />
                            ) : summary ? (
                                <motion.div 
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    className='grid grid-cols-1 gap-6 max-w-5xl mx-auto'
                                >
                                    {/* Key Insights */}
                                    {summary.key_insights?.length > 0 && (
                                        <motion.div variants={staggerItem} className='relative group'>
                                            <div className='absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-primary-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000' />
                                            <div className='relative bg-white/[0.02] rounded-[1.5rem] border border-white/5 overflow-hidden backdrop-blur-3xl'>
                                                <div className='px-6 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between'>
                                                    <div className='flex items-center gap-4'>
                                                        <div className='w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30'>
                                                            <Lightbulb className='w-5 h-5 text-indigo-400' />
                                                        </div>
                                                        <h3 className='text-lg font-bold text-white tracking-tight'>Key Insights</h3>
                                                    </div>
                                                    <span className='px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold uppercase tracking-widest border border-indigo-500/20'>
                                                        Strategic
                                                    </span>
                                                </div>
                                                <div className='p-6 space-y-3'>
                                                    {summary.key_insights.map((insight, index) => (
                                                        <div key={index} className='flex items-start gap-4 group/item'>
                                                            <div className='flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-xs font-bold text-indigo-400 mt-0.5 group-hover/item:border-indigo-500/30 transition-colors'>
                                                                {index + 1}
                                                            </div>
                                                            <p className='text-sm leading-relaxed text-white/70 group-hover/item:text-white/90 transition-colors'>
                                                                {insight}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        {/* Top Objections */}
                                        {summary.top_objections?.length > 0 && (
                                            <motion.div variants={staggerItem} className='relative group'>
                                                <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-500/20 to-red-500/20 rounded-[1.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000' />
                                                <div className='relative bg-white/[0.02] h-full rounded-[1.5rem] border border-white/5 overflow-hidden backdrop-blur-3xl'>
                                                    <div className='px-6 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between'>
                                                        <div className='flex items-center gap-4'>
                                                            <div className='w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/30'>
                                                                <AlertCircle className='w-5 h-5 text-rose-400' />
                                                            </div>
                                                            <h3 className='text-lg font-bold text-white tracking-tight'>Points of Friction</h3>
                                                        </div>
                                                    </div>
                                                    <div className='p-6 space-y-3.5'>
                                                        {summary.top_objections.map((objection, index) => (
                                                            <div key={index} className='flex items-start gap-3 p-3.5 bg-rose-500/[0.02] rounded-xl border border-rose-500/10 hover:border-rose-500/30 transition-all'>
                                                                <div className='flex-shrink-0 mt-1'>
                                                                    <div className='w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]' />
                                                                </div>
                                                                <p className='text-[13px] leading-relaxed text-white/60 hover:text-white/90 transition-colors'>
                                                                    {objection}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Executive Summary */}
                                        {summary.executive_summary?.length > 0 && (
                                            <motion.div variants={staggerItem} className='relative group'>
                                                <div className='absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[1.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000' />
                                                <div className='relative bg-white/[0.02] h-full rounded-[1.5rem] border border-white/5 overflow-hidden backdrop-blur-3xl'>
                                                    <div className='px-6 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between'>
                                                        <div className='flex items-center gap-4'>
                                                            <div className='w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30'>
                                                                <Layout className='w-5 h-5 text-emerald-400' />
                                                            </div>
                                                            <h3 className='text-lg font-bold text-white tracking-tight'>Synthesis</h3>
                                                        </div>
                                                    </div>
                                                    <div className='p-6 space-y-4'>
                                                        {summary.executive_summary.map((point, index) => (
                                                            <div key={index} className='flex items-start gap-4'>
                                                                <span className='flex-shrink-0 text-lg font-black text-emerald-500/20'>
                                                                    {(index + 1).toString().padStart(2, '0')}
                                                                </span>
                                                                <p className='text-[13px] leading-relaxed text-white/60 hover:text-white/90 transition-colors'>
                                                                    {point}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className='flex flex-col items-center justify-center py-24'>
                                    <div className='w-24 h-24 bg-white/[0.02] rounded-3xl flex items-center justify-center mb-8 border border-white/5 transition-transform hover:scale-110 duration-500'>
                                        <AlertCircle className='w-12 h-12 text-white/20' />
                                    </div>
                                    <h3 className='text-2xl font-bold text-white mb-2'>No Intelligence Captured</h3>
                                    <p className='text-white/40 font-medium'>Generate a summary to extract persona insights</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
