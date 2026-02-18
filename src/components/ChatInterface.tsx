import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Persona, Conversation, Message, Company } from '@/types';
import { Send, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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

    const sendMessage = async () => {
        if (!inputMessage.trim() || !selectedConversation || isLoading) return;

        setIsLoading(true);
        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message immediately for better UX
        const tempUserMessage: Message = {
            id: `temp-${Date.now()}`,
            conversation_id: selectedConversation.id,
            role: 'user',
            content: userMessage,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMessage]);

        try {
            // Save user message to database
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

            // Update messages with the saved message
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempUserMessage.id ? savedUserMessage : msg,
                ),
            );

            // Generate AI response
            const aiResponse = await generateAIResponse(userMessage, messages);

            // Save AI response to database
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

            // Update conversation title if it's the first message
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
            // Remove the temporary message if there was an error
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== tempUserMessage.id),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex gap-6 h-[calc(100vh-12rem)]'>
            {/* Conversations Sidebar */}
            <div className='w-80 bg-white rounded-lg shadow-sm border border-gray-200'>
                <div className='p-4 border-b border-gray-200'>
                    <div className='flex justify-between items-center'>
                        <h3 className='font-semibold text-gray-900'>
                            Conversations
                        </h3>
                        <button
                            onClick={onNewConversation}
                            className='text-sm text-blue-600 hover:text-blue-700'
                        >
                            New Chat
                        </button>
                    </div>
                </div>
                <div className='overflow-y-auto h-full'>
                    {conversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            onClick={() => onConversationSelect(conversation)}
                            className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 ${
                                selectedConversation?.id === conversation.id
                                    ? 'bg-blue-50'
                                    : ''
                            }`}
                        >
                            <div className='flex items-center'>
                                <MessageSquare className='w-4 h-4 mr-2 text-gray-400' />
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

            {/* Chat Window */}
            <div className='flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col'>
                {/* Chat Header */}
                <div className='p-4 border-b border-gray-200'>
                    <div className='flex items-center'>
                        {persona.avatar_url ? (
                            <Image
                                src={persona.avatar_url}
                                alt={persona.name}
                                width={40}
                                height={40}
                                className='w-10 h-10 rounded-full mr-3'
                            />
                        ) : (
                            <div
                                className='w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-semibold'
                                style={{
                                    backgroundColor:
                                        company.primary_color || '#6366f1',
                                }}
                            >
                                {persona.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h3 className='font-semibold text-gray-900'>
                                {persona.name}
                            </h3>
                            <p className='text-sm text-gray-500'>
                                {persona.short_description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                <p className='text-sm'>{message.content}</p>
                                <p
                                    className={`text-xs mt-1 ${
                                        message.role === 'user'
                                            ? 'text-blue-100'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {new Date(
                                        message.created_at,
                                    ).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className='flex justify-start'>
                            <div className='bg-gray-100 text-gray-900 px-4 py-2 rounded-lg'>
                                <p className='text-sm'>Thinking...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {selectedConversation && (
                    <div className='p-4 border-t border-gray-200'>
                        <div className='flex gap-2'>
                            <input
                                type='text'
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                onKeyPress={(e) =>
                                    e.key === 'Enter' && sendMessage()
                                }
                                placeholder='Type your message...'
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <Send className='w-5 h-5' />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
