'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Persona, Conversation, Company } from '@/types';
import ChatInterface from '@/components/ChatInterface';
import GuidedEntryModal from '@/components/GuidedEntryModal';
import { PenTool } from 'lucide-react';
import {
    generatePromptFromIntent,
    type ConversationIntent,
} from '@/lib/promptTemplates';

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const personaId = params.personaId as string;

    const [persona, setPersona] = useState<Persona | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [showGuidedEntry, setShowGuidedEntry] = useState(false);
    const [prefilledMessage, setPrefilledMessage] = useState<
        string | undefined
    >(undefined);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            try {
                // Fetch company data
                const { data: companyData, error: companyError } =
                    await supabase
                        .from('companies')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                if (companyError) throw companyError;
                setCompany(companyData);

                // Fetch persona
                const { data: personaData, error: personaError } =
                    await supabase
                        .from('personas')
                        .select('*')
                        .eq('id', personaId)
                        .eq('company_id', session.user.id)
                        .single();

                if (personaError) throw personaError;
                setPersona(personaData);

                // Fetch conversations for this persona
                const { data: conversationsData, error: conversationsError } =
                    await supabase
                        .from('conversations')
                        .select('*')
                        .eq('persona_id', personaId)
                        .eq('company_id', session.user.id)
                        .order('created_at', { ascending: false });

                if (conversationsError) throw conversationsError;
                const fetchedConversations = conversationsData || [];
                setConversations(fetchedConversations);

                // Select the most recent conversation if available, otherwise show guided entry
                if (fetchedConversations.length > 0) {
                    setSelectedConversation(fetchedConversations[0]);
                } else {
                    setShowGuidedEntry(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [personaId, router]);

    const handleNewConversation = async () => {
        setShowGuidedEntry(true);
        setPrefilledMessage(undefined);
    };

    const createConversation = async (message?: string) => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (!session || !persona) return null;

        const { data: newConversation, error } = await supabase
            .from('conversations')
            .insert({
                company_id: session.user.id,
                persona_id: persona.id,
                title: message
                    ? message.substring(0, 50) +
                      (message.length > 50 ? '...' : '')
                    : `Conversation with ${persona.name}`,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating conversation:', error);
            return null;
        }

        setConversations([newConversation, ...conversations]);
        return newConversation;
    };

    const handleIntentSelect = async (
        intent: ConversationIntent,
        userInput?: string,
    ) => {
        if (!persona) return;
console.log(intent)
console.log(userInput)
        setIsCreatingConversation(true);

        try {
            if (intent === 'free_chat') {
                const newConversation = await createConversation();
                if (newConversation) {
                    setSelectedConversation(newConversation);
                    setShowGuidedEntry(false);
                    setPrefilledMessage(undefined);
                }
            } else if (userInput) {
                const prompt = generatePromptFromIntent(intent, userInput);
                console.log(prompt)
                const newConversation = await createConversation(prompt);
                console.log(newConversation)
                if (newConversation) {
                    setPrefilledMessage(prompt);
                    setSelectedConversation(newConversation);
                    setShowGuidedEntry(false);
                }
            }
        } finally {
            setIsCreatingConversation(false);
        }
    };

    const handlePrefilledMessageChange = useCallback((message: string) => {
        setPrefilledMessage(message);
    }, []);

    if (!persona || !company) {
        if (loading) {
            return (
                <div className='h-screen bg-[#060606] flex items-center justify-center overflow-hidden'>
                    <div className='text-center animate-fade-in'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl mb-8'>
                            <PenTool className='w-8 h-8 text-primary-400' />
                        </div>
                        <div className='flex items-center justify-center gap-2'>
                            <div
                                className='w-2 h-2 bg-primary-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(124,58,237,0.5)]'
                                style={{ animationDelay: '0ms' }}
                            ></div>
                            <div
                                className='w-2 h-2 bg-primary-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(124,58,237,0.5)]'
                                style={{ animationDelay: '150ms' }}
                            ></div>
                            <div
                                className='w-2 h-2 bg-primary-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(124,58,237,0.5)]'
                                style={{ animationDelay: '300ms' }}
                            ></div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className='h-screen bg-[#060606] flex items-center justify-center overflow-hidden'>
                <div className='text-lg text-white/50'>Persona not found</div>
            </div>
        );
    }

    const personaData = persona.persona_parameters_json as {
        occupation?: string;
    };

    return (
        <div className='h-screen bg-[#060606] animate-fade-in overflow-hidden'>
            {/* Guided Entry Modal */}
            {showGuidedEntry && (
                <GuidedEntryModal
                    personaName={personaData.occupation || persona.name}
                    onSelectIntent={handleIntentSelect}
                    onClose={() => setShowGuidedEntry(false)}
                    isLoading={isCreatingConversation}
                />
            )}

            {/* Chat Interface */}
            <div className='h-screen'>
                <ChatInterface
                    persona={persona}
                    company={company}
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onNewConversation={handleNewConversation}
                    onConversationSelect={setSelectedConversation}
                    onConversationUpdate={(
                        updatedConversation: Conversation,
                    ) => {
                        setConversations((prev) =>
                            prev.map((c) =>
                                c.id === updatedConversation.id
                                    ? updatedConversation
                                    : c,
                            ),
                        );
                        setSelectedConversation(updatedConversation);
                    }}
                    prefilledMessage={prefilledMessage}
                    onPrefilledMessageChange={handlePrefilledMessageChange}
                />
            </div>
        </div>
    );
}
