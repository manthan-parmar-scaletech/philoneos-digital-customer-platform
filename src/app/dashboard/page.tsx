'use client';

import Image from 'next/image';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Company, Persona } from '@/types';
import PersonaCard from '@/components/PersonaCard';

export default function DashboardPage() {
    const [company, setCompany] = useState<Company | null>(null);
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            console.log('Dashboard session:', session);

            if (!session) {
                console.log('No session found, redirecting to login');
                router.push('/login');
                return;
            }

            try {
                console.log('Fetching company data for user:', session.user.id);

                // Fetch company data
                const { data: companyData, error: companyError } =
                    await supabase
                        .from('companies')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                console.log('Company data:', { companyData, companyError });

                if (companyError) {
                    console.error('Company fetch error:', companyError);
                    throw companyError;
                }
                setCompany(companyData);

                // Fetch personas
                const { data: personasData, error: personasError } =
                    await supabase
                        .from('personas')
                        .select('*')
                        .eq('company_id', session.user.id)
                        .order('created_at', { ascending: false });

                console.log('Personas data:', { personasData, personasError });

                if (personasError) {
                    console.error('Personas fetch error:', personasError);
                    throw personasError;
                }
                setPersonas(personasData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-lg'>Loading...</div>
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
                            {company?.logo_url && (
                                <Image
                                    src={company.logo_url}
                                    alt={company.name}
                                    width={32}
                                    height={32}
                                    className='h-8 w-8 mr-3 rounded'
                                />
                            )}
                            <h1
                                className='text-xl font-semibold'
                                style={{
                                    color: company?.primary_color || '#1f2937',
                                }}
                            >
                                {company?.name || 'Synthia'}
                            </h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className='text-gray-500 hover:text-gray-700'
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='mb-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                        Synthetic Customers
                    </h2>
                    <p className='text-gray-600'>
                        Select a persona to start a conversation
                    </p>
                </div>

                {/* Persona Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {personas.map((persona) => (
                        <PersonaCard
                            key={persona.id}
                            persona={persona}
                            primaryColor={company?.primary_color}
                        />
                    ))}

                    {/* Add Persona Button (if less than 3) */}
                    {personas.length < 3 && (
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center min-h-[200px]'>
                            <button className='text-gray-500 hover:text-gray-700 text-center'>
                                <div className='text-4xl mb-2'>+</div>
                                <div>Add Persona</div>
                            </button>
                        </div>
                    )}
                </div>

                {personas.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='text-gray-500 text-lg mb-4'>
                            No personas yet
                        </div>
                        <p className='text-gray-400'>
                            Create your first synthetic customer persona to get
                            started
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
