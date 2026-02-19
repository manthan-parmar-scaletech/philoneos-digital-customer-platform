import { Copy, Sparkles, User, Check } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { staggerItem } from '@/lib/animations';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';
import TypingText from './TypingText';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    personaName?: string;
    personaAvatar?: string;
    personaColor?: string;
    isTyping?: boolean;
}

export default function MessageBubble({
    role,
    content,
    timestamp,
    personaName,
    personaAvatar,
    personaColor,
    isTyping = false,
}: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isUser = role === 'user';

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return '';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                'group relative w-full py-8 px-6',
                isUser ? 'bg-primary-500/[0.01]' : 'bg-transparent'
            )}
        >
            <div className={clsx(
                'max-w-4xl mx-auto flex items-start gap-6',
                isUser && 'flex-row-reverse'
            )}>
                {/* Avatar Section */}
                <div className="relative flex-shrink-0">
                    {!isUser && (
                        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
                    )}
                    <div className={clsx(
                        'relative w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl border transition-transform duration-500 group-hover:scale-110',
                        isUser 
                            ? 'bg-gradient-to-br from-indigo-500 to-primary-600 border-white/20' 
                            : 'bg-white/[0.03] border-white/10'
                    )}>
                        {isUser ? (
                            <User className="w-6 h-6 text-white" />
                        ) : personaAvatar ? (
                            <img src={personaAvatar} alt={personaName} className="w-full h-full object-cover" />
                        ) : (
                            <Sparkles className="w-6 h-6 text-primary-400" />
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className={clsx(
                    'flex items-start flex-col gap-2.5 max-w-[85%]',
                    isUser ? 'items-end' : 'items-start'
                )}>
                    {/* Metadata */}
                    <div className={clsx(
                        'flex items-center gap-3 px-1',
                        isUser && 'flex-row-reverse'
                    )}>
                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.15em] opacity-80">
                            {isUser ? 'You' : personaName}
                        </span>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                            {formatTime(timestamp || new Date().toISOString())}
                        </span>
                    </div>

                    {/* Bubble */}
                    <div className={clsx(
                        'relative px-6 py-4 rounded-[2rem] transition-all duration-500',
                        isUser 
                            ? 'bg-gradient-to-br from-primary-500/30 to-primary-700/20 backdrop-blur-3xl border border-white/20 shadow-[0_10px_40px_rgba(124,58,237,0.15)] hover:shadow-[0_15px_50px_rgba(124,58,237,0.25)]'
                            : 'bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-xl hover:bg-white/[0.05]',
                        isUser ? 'rounded-tr-lg' : 'rounded-tl-lg'
                    )}>
                        <div className={clsx(
                            'prose prose-invert max-w-none text-[15px] leading-relaxed font-medium selection:bg-primary-500/30',
                            isUser ? 'prose-p:text-white prose-headings:text-white' : 'prose-p:text-white/90 prose-headings:text-white'
                        )}>
                            {isTyping ? (
                                <TypingText text={content} />
                            ) : (
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <div className='group/code relative my-6'>
                                                    <div className='absolute -inset-2 bg-gradient-to-br from-primary-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-hover/code:opacity-100 transition-opacity duration-500' />
                                                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl">
                                                        <div className='flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/5'>
                                                            <span className='text-[10px] font-bold text-white/40 uppercase tracking-widest'>
                                                                {match[1]}
                                                            </span>
                                                            <button
                                                                onClick={handleCopy}
                                                                className='p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white'
                                                                title='Copy code'
                                                            >
                                                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className='w-3.5 h-3.5' />}
                                                            </button>
                                                        </div>
                                                        <SyntaxHighlighter
                                                            style={oneDark}
                                                            language={match[1]}
                                                            PreTag='div'
                                                            customStyle={{
                                                                margin: 0,
                                                                padding: '1.5rem',
                                                                background: 'transparent',
                                                                fontSize: '13px',
                                                                lineHeight: '1.6',
                                                            }}
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                </div>
                                            ) : (
                                                <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary-300 font-mono text-sm" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={clsx(
                        'flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300',
                        isUser && 'flex-row-reverse'
                    )}>
                        <button
                            onClick={handleCopy}
                            className='text-[10px] font-bold text-white/20 hover:text-white px-2 py-1 rounded-lg transition-colors uppercase tracking-widest'
                        >
                            {copied ? 'Captured' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
