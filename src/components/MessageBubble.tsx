import { Avatar } from './ui/Avatar';
import { Copy, User } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    personaName?: string;
    personaAvatar?: string;
    personaColor?: string;
}

export default function MessageBubble({
    role,
    content,
    timestamp,
    personaName,
    personaAvatar,
    personaColor,
}: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isUser = role === 'user';

    return (
        <div
            className={`group relative py-6 px-4 ${
                isUser ? 'bg-white' : 'bg-gray-50/50'
            } hover:bg-gray-50 transition-colors animate-fade-in border-b border-gray-100`}
        >
            <div className={` flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className='flex-shrink-0'>
                    {isUser ? (
                        <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm'>
                            <User className='w-4 h-4 text-white' />
                        </div>
                    ) : (
                        <Avatar
                            src={personaAvatar}
                            alt={personaName || 'AI'}
                            size='sm'
                            fallback={personaName?.charAt(0) || 'AI'}
                            color={personaColor || '#3b82f6'}
                        />
                    )}
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                    <div
                        className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : ''}`}
                    >
                        <span className='font-semibold text-sm text-gray-900'>
                            {isUser ? 'You' : personaName || 'Assistant'}
                        </span>
                        <span className='text-xs text-gray-500'>
                            {new Date(timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    {isUser ? (
                        <div className='text-gray-900 whitespace-pre-wrap text-right'>
                            {content}
                        </div>
                    ) : (
                        <div className='prose prose-sm max-w-none text-gray-900'>
                            <ReactMarkdown
                                components={{
                                    code({
                                        inline,
                                        className,
                                        children,
                                        ...props
                                    }: {
                                        inline?: boolean;
                                        className?: string;
                                        children?: React.ReactNode;
                                    }) {
                                        const match = /language-(\w+)/.exec(
                                            className || '',
                                        );
                                        return !inline && match ? (
                                            <div className='relative group/code'>
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag='div'
                                                    className='rounded-lg text-sm'
                                                    {...props}
                                                >
                                                    {String(children).replace(
                                                        /\n$/,
                                                        '',
                                                    )}
                                                </SyntaxHighlighter>
                                                <button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            String(children),
                                                        )
                                                    }
                                                    className='absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs opacity-0 group-hover/code:opacity-100 transition-opacity'
                                                >
                                                    <Copy className='w-3 h-3' />
                                                </button>
                                            </div>
                                        ) : (
                                            <code
                                                className='bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono'
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Actions */}
                    <div
                        className={`flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'justify-end' : ''}`}
                    >
                        <button
                            onClick={handleCopy}
                            className='text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 transition-colors cursor-pointer'
                        >
                            <Copy className='w-3 h-3' />
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
