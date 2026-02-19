import { useState, useEffect } from 'react';
import {
    X,
    Lightbulb,
    AlertCircle,
    List,
    Loader2,
    Sparkles,
} from 'lucide-react';
import type { SummaryData } from '@/types';

interface ConversationSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: SummaryData | null;
    isLoading: boolean;
}

const loadingMessages = [
    'Analyzing conversation...',
    'Identifying key insights...',
    'Extracting objections...',
    'Preparing executive summary...',
    'Finalizing report...',
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
            }, 30);
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
        <div className='flex flex-col items-center justify-center py-16 px-6'>
            {/* Animated gradient background */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50' />

            {/* Main loading content */}
            <div className='relative z-10 max-w-md w-full'>
                {/* Spinner with gradient ring */}
                <div className='relative mb-8 flex justify-center'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20 animate-pulse' />
                    </div>
                    <div className='relative w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center'>
                        <Loader2
                            className='w-10 h-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-spin'
                            style={{
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        />
                        <div
                            className='absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 animate-spin'
                            style={{
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'exclude',
                                WebkitMask:
                                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                            }}
                        />
                    </div>
                </div>

                {/* Message card with gradient border */}
                <div className='relative bg-white rounded-2xl shadow-lg overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-10' />
                    <div className='relative p-6'>
                        <div className='flex items-start gap-3 mb-4'>
                            <div className='flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm'>
                                <Sparkles className='w-4 h-4 text-white' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='text-sm font-semibold text-gray-900 mb-1'>
                                    Generating Summary
                                </h3>
                                <p className='text-xs text-gray-500'>
                                    AI is analyzing your conversation
                                </p>
                            </div>
                        </div>

                        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100'>
                            <p className='text-base text-gray-800 font-medium min-h-[24px]'>
                                {displayedText}
                                <span className='inline-block w-0.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 ml-1 animate-pulse' />
                            </p>
                        </div>

                        {/* Progress dots */}
                        <div className='flex justify-center gap-2 mt-6'>
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className='w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500'
                                    style={{
                                        animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom text */}
                <p className='text-center text-sm text-gray-500 mt-6'>
                    This usually takes 10-15 seconds
                </p>
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
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in'>
                <div className='relative bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6'>
                    <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                        <div className='w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
                            <svg
                                className='w-6 h-6 text-white'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                />
                            </svg>
                        </div>
                        Conversation Summary
                    </h2>
                    <p className='text-blue-100 text-sm mt-2'>
                        Key insights and takeaways from your conversation
                    </p>
                    <button
                        onClick={onClose}
                        className='absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-all duration-200'
                        aria-label='Close'
                    >
                        <X className='w-6 h-6 text-white' />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-8 bg-gray-50'>
                    {isLoading ? (
                        <LoadingAnimation />
                    ) : summary ? (
                        <div className='space-y-6 max-w-3xl mx-auto'>
                            {summary.key_insights &&
                                summary.key_insights.length > 0 && (
                                    <div className='bg-white rounded-2xl shadow-sm border border-yellow-100 overflow-hidden'>
                                        <div className='bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-yellow-100'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-sm'>
                                                    <Lightbulb className='w-5 h-5 text-white' />
                                                </div>
                                                <div>
                                                    <h3 className='text-lg font-bold text-gray-900'>
                                                        Key Insights
                                                    </h3>
                                                    <p className='text-xs text-gray-600'>
                                                        Main takeaways from the
                                                        conversation
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className='p-6 space-y-4'>
                                            {summary.key_insights.map(
                                                (insight, index) => (
                                                    <li
                                                        key={index}
                                                        className='flex items-start gap-4 group'
                                                    >
                                                        <div className='flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-yellow-200 transition-colors'>
                                                            <span className='text-yellow-700 font-semibold text-sm'>
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <span className='text-gray-700 leading-relaxed'>
                                                            {insight}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                            {summary.top_objections &&
                                summary.top_objections.length > 0 && (
                                    <div className='bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden'>
                                        <div className='bg-gradient-to-r from-red-50 to-rose-50 px-6 py-4 border-b border-red-100'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-sm'>
                                                    <AlertCircle className='w-5 h-5 text-white' />
                                                </div>
                                                <div>
                                                    <h3 className='text-lg font-bold text-gray-900'>
                                                        Top Objections
                                                    </h3>
                                                    <p className='text-xs text-gray-600'>
                                                        Customer concerns and
                                                        pushback points
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className='p-6 space-y-4'>
                                            {summary.top_objections.map(
                                                (objection, index) => (
                                                    <li
                                                        key={index}
                                                        className='flex items-start gap-4 p-4 bg-red-50/50 rounded-xl border border-red-100 group hover:border-red-200 transition-colors'
                                                    >
                                                        <div className='flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-red-200 transition-colors'>
                                                            <AlertCircle className='w-4 h-4 text-red-600' />
                                                        </div>
                                                        <span className='text-gray-700 leading-relaxed'>
                                                            {objection}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                            {summary.executive_summary &&
                                summary.executive_summary.length > 0 && (
                                    <div className='bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden'>
                                        <div className='bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm'>
                                                    <List className='w-5 h-5 text-white' />
                                                </div>
                                                <div>
                                                    <h3 className='text-lg font-bold text-gray-900'>
                                                        Executive Summary
                                                    </h3>
                                                    <p className='text-xs text-gray-600'>
                                                        Key points from the
                                                        conversation
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <ol className='p-6 space-y-4'>
                                            {summary.executive_summary.map(
                                                (point, index) => (
                                                    <li
                                                        key={index}
                                                        className='flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 group hover:border-blue-200 transition-colors'
                                                    >
                                                        <div className='flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-blue-200 transition-colors'>
                                                            <span className='text-blue-600 font-semibold text-sm'>
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <span className='text-gray-700 leading-relaxed'>
                                                            {point}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ol>
                                    </div>
                                )}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-16'>
                            <div className='w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4'>
                                <AlertCircle className='w-10 h-10 text-gray-400' />
                            </div>
                            <p className='text-gray-600 text-lg font-medium'>
                                No summary available
                            </p>
                            <p className='text-gray-400 text-sm mt-2'>
                                Generate a summary to see insights
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
