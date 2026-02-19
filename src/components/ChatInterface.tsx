import { useState, useEffect, useRef } from 'react';
import type { Persona, Conversation, Message, Company } from '@/types';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import PersonaDetailsPanel from './PersonaDetailsPanel';
import { useRouter } from 'next/navigation';

interface ChatInterfaceProps {
    persona: Persona;
    company: Company;
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    onNewConversation: () => void;
    onConversationSelect: (conversation: Conversation) => void;
    onConversationUpdate: (conversation: Conversation) => void;
}

export default function ChatInterface({
    persona,
    company,
    conversations,
    selectedConversation,
    onNewConversation,
    onConversationSelect,
    onConversationUpdate,
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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
        } else {
            setMessages([]);
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
            {/* Main Chat Area */}
            <div className='flex-1 flex flex-col h-screen'>
                {/* Header */}
                <div className='border-b border-gray-200 bg-white px-6 py-4'>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer'
                        >
                            <ArrowLeft className='w-5 h-5' />
                            <span className='font-medium'>Back</span>
                        </button>
                        <div className='h-6 w-px bg-gray-300'></div>
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                                <svg
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    className='w-4 h-4 text-white'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                                </svg>
                            </div>
                            <div>
                                <h1 className='text-sm font-semibold text-gray-900'>
                                    {personaData.occupation}
                                </h1>
                                <p className='text-xs text-gray-500'>
                                    {persona.short_description.substring(0, 60)}
                                    ...
                                </p>
                            </div>
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
                                    {messages.map((message) => (
                                        <MessageBubble
                                            key={message.id}
                                            role={message.role}
                                            content={message.content}
                                            timestamp={message.created_at}
                                            personaName={personaData.occupation}
                                            personaAvatar={persona.avatar_url}
                                            personaColor={company.primary_color}
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
                                right
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Panel - Persona Details & Conversations */}
            <PersonaDetailsPanel
                persona={persona}
                conversations={conversations}
                selectedConversation={selectedConversation}
                onConversationSelect={onConversationSelect}
                onNewConversation={onNewConversation}
                primaryColor={company.primary_color}
            />
        </div>
    );
}
