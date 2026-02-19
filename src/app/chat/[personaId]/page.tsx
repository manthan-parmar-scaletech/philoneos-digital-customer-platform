'use client';

import Image from 'next/image';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Persona, Conversation, Company } from '@/types';
import ChatInterface from '@/components/ChatInterface';
import LoadingScreen from '@/components/LoadingScreen';
import Sidebar from '@/components/Sidebar';

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

    if (!persona || !company) {
        if (loading) {
            return (
                <div className='h-screen bg-white flex overflow-hidden'>
                    <Sidebar companyName='Philoneos' />
                    <div className='flex-1 ml-60 h-screen flex items-center justify-center'>
                        <div className='text-center animate-fade-in'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg animate-pulse'>
                                <svg
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    className='w-8 h-8 text-white'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                                </svg>
                            </div>
                            <div className='flex items-center justify-center gap-2'>
                                <div
                                    className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                                    style={{ animationDelay: '0ms' }}
                                ></div>
                                <div
                                    className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                                    style={{ animationDelay: '150ms' }}
                                ></div>
                                <div
                                    className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                                    style={{ animationDelay: '300ms' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className='h-screen bg-white flex overflow-hidden'>
                <Sidebar companyName='Philoneos' />
                <div className='flex-1 ml-60 h-screen flex items-center justify-center'>
                    <div className='text-lg'>Persona not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen bg-white flex animate-fade-in overflow-hidden'>
            {/* Sidebar */}
            <Sidebar
                companyName={company.name}
                companyLogo={company.logo_url}
            />

            {/* Chat Interface */}
            <div className='flex-1 ml-60 h-screen'>
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
