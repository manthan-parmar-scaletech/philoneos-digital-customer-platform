import { useState, useEffect, useRef } from 'react';
import type { Persona, Conversation, Message, Company } from '@/types';
import { MessageSquare, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { Button } from './ui/Button';

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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        <div className='flex h-[calc(100vh-8rem)] bg-white'>
            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? 'w-64' : 'w-0'
                } transition-all duration-300 overflow-hidden border-r border-gray-200 bg-gray-50 flex flex-col`}
            >
                <div className='p-4 border-b border-gray-200'>
                    <Button
                        variant='primary'
                        size='sm'
                        className='w-full'
                        onClick={onNewConversation}
                    >
                        <Plus className='w-4 h-4 mr-2' />
                        New Chat
                    </Button>
                </div>

                <div className='flex-1 overflow-y-auto p-2'>
                    {conversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            onClick={() => onConversationSelect(conversation)}
                            className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                                selectedConversation?.id === conversation.id
                                    ? 'bg-white shadow-sm border border-gray-200'
                                    : 'hover:bg-white/50'
                            }`}
                        >
                            <div className='flex items-center gap-2'>
                                <MessageSquare className='w-4 h-4 text-gray-400 shrink-0' />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium text-gray-900 truncate'>
                                        {conversation.title}
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                        {new Date(
                                            conversation.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className='flex-1 flex flex-col'>
                {/* Toggle Sidebar Button */}
                <div className='absolute left-0 top-1/2 -translate-y-1/2 z-10'>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className='bg-white border border-gray-200 rounded-r-lg p-2 shadow-sm hover:bg-gray-50 transition-colors'
                    >
                        {sidebarOpen ? (
                            <ChevronLeft className='w-4 h-4 text-gray-600' />
                        ) : (
                            <ChevronRight className='w-4 h-4 text-gray-600' />
                        )}
                    </button>
                </div>

                {selectedConversation ? (
                    <>
                        {/* Messages */}
                        <div className='flex-1 overflow-y-auto'>
                            {messages.length === 0 ? (
                                <div className='h-full flex items-center justify-center'>
                                    <div className='text-center max-w-md px-4'>
                                        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <MessageSquare className='w-8 h-8 text-blue-600' />
                                        </div>
                                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                            Start a conversation with {persona.name}
                                        </h3>
                                        <p className='text-gray-600 mb-4'>
                                            {persona.short_description}
                                        </p>
                                        <p className='text-sm text-gray-500'>
                                            Ask questions, test messaging, or explore their perspective
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
                                            personaName={persona.name}
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
                            placeholder={`Message ${persona.name}...`}
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
                                Start a new conversation or select an existing one from the sidebar
                            </p>
                            <Button
                                variant='primary'
                                size='lg'
                                onClick={onNewConversation}
                            >
                                <Plus className='w-5 h-5 mr-2' />
                                Start New Conversation
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
