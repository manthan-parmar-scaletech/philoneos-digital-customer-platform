import { useState, useEffect, useRef } from 'react';
import type {
    Persona,
    Conversation,
    Message,
    Company,
    ConversationSummary,
    SummaryData,
} from '@/types';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import PersonaDetailsPanel from './PersonaDetailsPanel';
import ConversationHistoryPanel from './ConversationHistoryPanel';
import ConversationSummaryModal from './ConversationSummaryModal';
import { useRouter } from 'next/navigation';

interface ChatInterfaceProps {
    persona: Persona;
    company: Company;
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    onNewConversation: () => void;
    onConversationSelect: (conversation: Conversation) => void;
    onConversationUpdate: (conversation: Conversation) => void;
    prefilledMessage?: string;
    onPrefilledMessageChange?: (message: string) => void;
}

export default function ChatInterface({
    persona,
    company,
    conversations,
    selectedConversation,
    onNewConversation,
    onConversationSelect,
    onConversationUpdate,
    prefilledMessage,
    onPrefilledMessageChange,
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState<ConversationSummary | null>(
        null,
    );
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const personaData = persona.persona_parameters_json as {
        occupation?: string;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
            fetchSummary(selectedConversation.id);
        } else {
            setMessages([]);
            setSummaryData(null);
        }
    }, [selectedConversation]);

    const fetchMessages = async (conversationId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            return;
        }

        setMessages(data || []);
    };

    const fetchSummary = async (conversationId: string) => {
        try {
            const response = await fetch(
                `/api/summary?conversationId=${conversationId}`,
            );
            if (response.ok) {
                const data = await response.json();
                setSummaryData(data.summary);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const handleGenerateSummary = async () => {
        if (!selectedConversation) return;

        setIsSummaryLoading(true);
        setShowSummaryModal(true);

        try {
            const response = await fetch('/api/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationId: selectedConversation.id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSummaryData(data.summary);
                await new Promise((resolve) => setTimeout(resolve, 1500));
            } else {
                console.error('Failed to generate summary');
            }
        } catch (error) {
            console.error('Error generating summary:', error);
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const handleViewSummary = () => {
        setShowSummaryModal(true);
    };

    const generateAIResponse = async (
        userMessage: string,
        conversationHistory: Message[],
    ) => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    personaId: persona.id,
                    message: userMessage,
                    conversationHistory: conversationHistory.map((msg) => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate response');
            }

            const data = await response.json();
            return (
                data.response ||
                'I apologize, but I cannot respond at the moment.'
            );
        } catch (error) {
            console.error('Error generating AI response:', error);
            return 'I apologize, but I encountered an error processing your message.';
        }
    };

    const handleSendMessage = async (userMessage: string) => {
        if (!selectedConversation || isLoading) return;

        setIsLoading(true);

        const tempUserMessage: Message = {
            id: `temp-${Date.now()}`,
            conversation_id: selectedConversation.id,
            role: 'user',
            content: userMessage,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMessage]);

        try {
            const { data: savedUserMessage, error: userError } = await supabase
                .from('messages')
                .insert({
                    conversation_id: selectedConversation.id,
                    role: 'user',
                    content: userMessage,
                })
                .select()
                .single();

            if (userError) throw userError;

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempUserMessage.id ? savedUserMessage : msg,
                ),
            );

            const aiResponse = await generateAIResponse(userMessage, messages);

            const { data: savedAiMessage, error: aiError } = await supabase
                .from('messages')
                .insert({
                    conversation_id: selectedConversation.id,
                    role: 'assistant',
                    content: aiResponse,
                })
                .select()
                .single();

            if (aiError) throw aiError;

            setMessages((prev) => [...prev, savedAiMessage]);
            setTypingMessageId(savedAiMessage.id);

            if (messages.length === 0) {
                const { data: updatedConversation } = await supabase
                    .from('conversations')
                    .update({
                        title:
                            userMessage.substring(0, 50) +
                            (userMessage.length > 50 ? '...' : ''),
                    })
                    .eq('id', selectedConversation.id)
                    .select()
                    .single();

                if (updatedConversation) {
                    onConversationUpdate(updatedConversation);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== tempUserMessage.id),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex h-screen bg-white'>
            {/* Left Panel - Conversation History */}
            <ConversationHistoryPanel
                conversations={conversations}
                selectedConversation={selectedConversation}
                onConversationSelect={onConversationSelect}
                onNewConversation={onNewConversation}
            />

            {/* Main Chat Area */}
            <div className='flex-1 flex flex-col h-screen'>
                {/* Header */}
                <div className='border-b border-gray-200 bg-white px-6 py-4 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className='flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1.5 rounded-lg transition-colors cursor-pointer'
                            >
                                <ArrowLeft className='w-4 h-4' />
                                <span className='font-medium text-sm'>
                                    Back
                                </span>
                            </button>
                            <div className='h-6 w-px bg-gray-300'></div>
                            <div className='flex items-center gap-3'>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-base font-bold text-gray-900'>
                                            {personaData.occupation}
                                        </h1>
                                        <span className='px-2 py-0.5 bg-blue-100 rounded-md text-xs font-medium text-blue-700'>
                                            AI Customer
                                        </span>
                                    </div>
                                    <p className='text-xs text-gray-600 mt-0.5'>
                                        {persona.short_description.substring(
                                            0,
                                            60,
                                        )}
                                        ...
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200'>
                            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                            <span className='text-xs font-medium text-green-700'>
                                Active
                            </span>
                        </div>
                    </div>
                </div>
                {selectedConversation ? (
                    <>
                        {/* Messages */}
                        <div
                            className='flex-1 overflow-y-auto'
                            style={{ height: 'calc(100vh - 180px)' }}
                        >
                            {messages.length === 0 ? (
                                <div className='h-full flex items-center justify-center'>
                                    <div className='text-center max-w-md px-4'>
                                        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <MessageSquare className='w-8 h-8 text-blue-600' />
                                        </div>
                                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                            Start a conversation with{' '}
                                            {personaData.occupation}
                                        </h3>
                                        <p className='text-gray-600 mb-4'>
                                            {persona.short_description}
                                        </p>
                                        <p className='text-sm text-gray-500'>
                                            Ask questions, test messaging, or
                                            explore their perspective
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {messages.map((message, index) => (
                                        <MessageBubble
                                            key={message.id}
                                            role={message.role}
                                            content={message.content}
                                            timestamp={message.created_at}
                                            personaName={personaData.occupation}
                                            personaAvatar={persona.avatar_url}
                                            personaColor={company.primary_color}
                                            isTyping={
                                                message.role === 'assistant' &&
                                                message.id === typingMessageId
                                            }
                                        />
                                    ))}
                                    {isLoading && (
                                        <div className='bg-gray-50 py-4'>
                                            <div className='max-w-3xl mx-auto px-4'>
                                                <TypingIndicator />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <ChatInput
                            onSend={handleSendMessage}
                            disabled={isLoading}
                            placeholder={`Message ${personaData.occupation}...`}
                            value={prefilledMessage}
                            onChange={onPrefilledMessageChange}
                            summaryButton={{
                                show: messages.length > 0,
                                disabled:
                                    messages.filter((m) => m.role === 'user')
                                        .length < 3,
                                label:
                                    summaryData &&
                                    summaryData.message_count_at_generation ===
                                        messages.length
                                        ? 'View Summary'
                                        : 'Generate Summary',
                                onClick:
                                    summaryData &&
                                    summaryData.message_count_at_generation ===
                                        messages.length
                                        ? handleViewSummary
                                        : handleGenerateSummary,
                                isViewMode:
                                    summaryData !== null &&
                                    summaryData.message_count_at_generation ===
                                        messages.length,
                            }}
                        />
                    </>
                ) : (
                    <div className='h-full flex items-center justify-center'>
                        <div className='text-center max-w-md px-4'>
                            <MessageSquare className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                No conversation selected
                            </h3>
                            <p className='text-gray-600 mb-6'>
                                Start a new conversation from the panel on the
                                left
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Panel - Persona Details */}
            <PersonaDetailsPanel
                persona={persona}
                primaryColor={company.primary_color}
            />

            {/* Summary Modal */}
            <ConversationSummaryModal
                isOpen={showSummaryModal}
                onClose={() => setShowSummaryModal(false)}
                summary={summaryData?.summary_json || null}
                isLoading={isSummaryLoading}
            />
        </div>
    );
}
