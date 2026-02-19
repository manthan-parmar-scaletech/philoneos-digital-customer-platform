import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TypingTextProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export default function TypingText({
    text,
    speed = 20,
    onComplete,
}: TypingTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else if (currentIndex === text.length && onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    return (
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
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className='relative group/code'>
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag='div'
                                    className='rounded-lg text-sm'
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code
                                className='bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono'
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {displayedText}
            </ReactMarkdown>
            {currentIndex < text.length && (
                <span className='inline-block w-1 h-4 bg-blue-600 ml-0.5 animate-pulse' />
            )}
        </div>
    );
}
