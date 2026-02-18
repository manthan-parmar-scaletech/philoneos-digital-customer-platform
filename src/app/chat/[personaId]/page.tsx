'use client';

import Image from 'next/image';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Persona, Conversation, Company } from '@/types';
import ChatInterface from '@/components/ChatInterface';

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
                setConversations(conversationsData || []);

                // Select the most recent conversation or create a new one
                if (conversationsData && conversationsData.length > 0) {
                    setSelectedConversation(conversationsData[0]);
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
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (!session || !persona) return;

        const { data: newConversation, error } = await supabase
            .from('conversations')
            .insert({
                company_id: session.user.id,
                persona_id: persona.id,
                title: `Conversation with ${persona.name}`,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating conversation:', error);
            return;
        }

        setConversations([newConversation, ...conversations]);
        setSelectedConversation(newConversation);
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-lg'>Loading...</div>
            </div>
        );
    }

    if (!persona || !company) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-lg'>Persona not found</div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center'>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className='text-gray-500 hover:text-gray-700 mr-4'
                            >
                                ← Back
                            </button>
                            {company.logo_url && (
                                <Image
                                    src={company.logo_url}
                                    alt={company.name}
                                    width={32}
                                    height={32}
                                    className='h-8 w-8 mr-3 rounded'
                                />
                            )}
                            <div>
                                <h1
                                    className='text-xl font-semibold'
                                    style={{
                                        color:
                                            company.primary_color || '#1f2937',
                                    }}
                                >
                                    {company.name || 'Synthia'}
                                </h1>
                                <p className='text-sm text-gray-500'>
                                    Chat with {persona.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Interface */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
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
                />
            </div>
        </div>
    );
}
