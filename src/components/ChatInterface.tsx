import { useState, useEffect, useRef } from 'react';
import type {
    Persona,
    Conversation,
    Message,
    Company,
    ConversationSummary,
    SummaryData,
} from '@/types';
import { MessageSquare, ArrowLeft, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import PersonaDetailsPanel from './PersonaDetailsPanel';
import ConversationHistoryPanel from './ConversationHistoryPanel';
import ConversationSummaryModal from './ConversationSummaryModal';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp, fadeIn } from '@/lib/animations';

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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const personaData = persona.persona_parameters_json as {
        occupation?: string;
    };

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior
            });
        }
    };

    // Scroll more reliably when messages change or conversation switches
    useEffect(() => {
        const behavior = messages.length <= 1 ? 'instant' : 'smooth';
        const timer = setTimeout(() => {
            scrollToBottom(behavior);
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, isLoading, selectedConversation?.id]);

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
        <div className='flex h-screen bg-[#060606] text-white relative overflow-hidden font-sans font-medium'>
            {/* Mesh Gradient Background Elements - Isolated from events */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden container-background">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-600/5 blur-[100px] rounded-full opacity-50" />
            </div>
            
            <div className="flex w-full h-full relative z-10 backdrop-blur-[1px]">
                {/* Left Panel - Conversation History */}
                <ConversationHistoryPanel
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onConversationSelect={onConversationSelect}
                    onNewConversation={onNewConversation}
                />

                {/* Main Chat Area */}
                <div className='flex-1 flex flex-col h-dvh justify-start relative overflow-hidden bg-white/[0.01]'>
                    {/* Header */}
                    <div className='z-20 border-b border-white/[0.05] bg-white/[0.01] backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-8 py-5'>
                        <div className='max-w-5xl mx-auto flex items-center justify-between'>
                            <div className='flex items-center gap-6'>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className='p-2.5 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl border border-white/5 transition-all duration-300 group'
                                >
                                    <ArrowLeft className='w-5 h-5 text-white/40 group-hover:text-white transition-colors' />
                                </button>
                                <div className='h-10 w-px bg-white/5' />
                                <div className='flex flex-col'>
                                    <div className='flex items-center gap-3'>
                                        <h1 className='text-xl font-bold tracking-tight text-white leading-none'>
                                            {personaData?.occupation || persona?.name || 'Loading...'}
                                        </h1>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-500/10 border border-primary-400/20 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                                            {/* <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" /> */}
                                            <span className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.15em]">AI Customer</span>
                                        </div>
                                    </div>
                                    <p className='text-[13px] text-white/40 font-medium truncate max-w-md mt-1.5'>
                                        {persona?.short_description}
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl'>
                                <div className='w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]' />
                                <span className='text-[11px] font-bold text-emerald-400 uppercase tracking-[0.1em]'>
                                    Active Session
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div 
                        ref={scrollContainerRef}
                        className='flex-1 overflow-y-auto relative custom-scrollbar flex flex-col pt-4'
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-primary-500/[0.03] via-transparent to-transparent pointer-events-none" />
                        
                        {!selectedConversation && messages.length === 0 ? (
                            <div className='flex-1 flex items-center justify-center p-6 relative'>
                                <div className="text-center group">
                                    <div className='relative w-28 h-28 mx-auto mb-8'>
                                        <div className='absolute inset-0 bg-primary-500/20 blur-[50px] rounded-full group-hover:bg-primary-500/30 transition-all duration-1000' />
                                        <div className='relative w-full h-full bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:border-white/20 transition-all duration-500'>
                                            <MessageSquare className='w-12 h-12 text-primary-400' />
                                        </div>
                                    </div>
                                    <h2 className='text-3xl font-bold text-white mb-4 tracking-tight'>
                                        Digital Dialogue
                                    </h2>
                                    <p className='text-white/40 max-w-sm mx-auto text-[15px] leading-relaxed font-medium'>
                                        Explore deep consumer insights through high-fidelity AI interactions.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className='max-w-6xl mx-auto w-full flex-1 px-4 relative z-20'>
                                <AnimatePresence mode="popLayout">
                                    <motion.div 
                                        key={selectedConversation?.id || 'new'}
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col pt-4 min-h-full pb-[80px]"
                                    >
                                        {messages.map((m) => (
                                            <MessageBubble
                                                key={m.id}
                                                role={m.role}
                                                content={m.content}
                                                timestamp={m.created_at}
                                                personaName={personaData?.occupation}
                                                personaAvatar={persona?.avatar_url}
                                                personaColor={company.primary_color}
                                                isTyping={m.id === typingMessageId}
                                            />
                                        ))}
                                        {isLoading && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="px-6 py-4"
                                            >
                                                <TypingIndicator />
                                            </motion.div>
                                        )}
                                        <div ref={messagesEndRef} className="h-1" />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Chat Input Area */}
                    <div className='absolute bottom-0 px-6 left-0 right-0 z-30 pointer-events-none'>
                        <div className="max-w-5xl mx-auto relative z-10 pointer-events-auto">
                            <ChatInput
                                onSend={handleSendMessage}
                                disabled={isLoading}
                                value={prefilledMessage}
                                onChange={onPrefilledMessageChange}
                                placeholder={
                                    persona
                                        ? `Message ${persona.name}...`
                                        : 'Type your message...'
                                }
                                summaryButton={{
                                    show: messages.length > 0,
                                    disabled:
                                        messages.filter((m) => m.role === 'user')
                                            .length < 3,
                                    label:
                                        summaryData?.message_count_at_generation ===
                                            messages.length
                                            ? 'View Summary'
                                            : 'Generate Summary',
                                    onClick:
                                        summaryData?.message_count_at_generation ===
                                            messages.length
                                            ? handleViewSummary
                                            : handleGenerateSummary,
                                    isViewMode:
                                        summaryData !== null &&
                                        summaryData?.message_count_at_generation ===
                                            messages.length,
                                }}
                            />
                        </div>
                    </div> 
                    {/* Summary Modal */}
                    <ConversationSummaryModal
                        isOpen={showSummaryModal}
                        onClose={() => setShowSummaryModal(false)}
                        summary={summaryData?.summary_json || null}
                        isLoading={isSummaryLoading}
                    />

                </div>

                {/* Right Panel - Persona Details */}
                <PersonaDetailsPanel
                    persona={persona}
                    primaryColor={company.primary_color}
                />
            </div>
        </div>
    );
}
