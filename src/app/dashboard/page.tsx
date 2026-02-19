'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Company, Persona } from '@/types';
import PersonaCard from '@/components/PersonaCard';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import Sidebar from '@/components/Sidebar';
import { MessageSquare, Users, LogOut, Plus, Sparkles } from 'lucide-react';

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

            if (!session) {
                router.push('/login');
                return;
            }

            try {
                const { data: companyData, error: companyError } =
                    await supabase
                        .from('companies')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                if (companyError) throw companyError;
                setCompany(companyData);

                const { data: personasData, error: personasError } =
                    await supabase
                        .from('personas')
                        .select('*')
                        .eq('company_id', session.user.id)
                        .order('created_at', { ascending: false });

                if (personasError) throw personasError;
                setPersonas(personasData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex animate-fade-in'>
                {/* Sidebar */}
                <Sidebar companyName='Philoneos' />

                {/* Main Content */}
                <main className='flex-1 ml-60 p-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[1, 2, 3].map((i) => (
                            <Card
                                key={i}
                                padding='none'
                                className='animate-fade-in'
                                style={{ animationDelay: `${(i + 3) * 100}ms` }}
                            >
                                <Skeleton variant='rectangular' height={96} />
                                <div className='p-6 space-y-4'>
                                    <div className='flex items-center gap-4'>
                                        <Skeleton
                                            variant='circular'
                                            width={64}
                                            height={64}
                                        />
                                        <div className='flex-1 space-y-2'>
                                            <Skeleton
                                                variant='text'
                                                width={150}
                                                height={20}
                                            />
                                            <Skeleton
                                                variant='text'
                                                width={100}
                                                height={16}
                                            />
                                        </div>
                                    </div>
                                    <Skeleton variant='text' height={40} />
                                    <Skeleton
                                        variant='text'
                                        height={16}
                                        width={80}
                                    />
                                    <Skeleton
                                        variant='rectangular'
                                        height={36}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 flex animate-fade-in'>
            {/* Sidebar */}
            <Sidebar
                companyName={company?.name}
                companyLogo={company?.logo_url}
            />

            {/* Main Content */}
            <main className='flex-1 ml-60 p-8'>
                {/* Stats Cards */}

                {/* Section Header */}
                <div className='flex justify-between items-center mb-6'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 mb-1'>
                            Your Personas
                        </h2>
                        <p className='text-gray-600'>
                            Select a persona to start a conversation
                        </p>
                    </div>
                    {personas.length > 0 && (
                        <Button variant='primary' size='md'>
                            <Plus className='w-4 h-4 mr-2' />
                            Add Persona
                        </Button>
                    )}
                </div>

                {/* Persona Grid */}
                {personas.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {personas.map((persona, index) => (
                            <div
                                key={persona.id}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <PersonaCard
                                    persona={persona}
                                    primaryColor={company?.primary_color}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card
                        padding='lg'
                        className='text-center py-12 animate-fade-in'
                    >
                        <div className='max-w-md mx-auto'>
                            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <Sparkles className='w-8 h-8 text-blue-600' />
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                No personas yet
                            </h3>
                            <p className='text-gray-600 mb-6'>
                                Create your first synthetic customer persona to
                                start gathering insights and testing your
                                messaging.
                            </p>
                            <Button variant='primary' size='lg'>
                                <Plus className='w-5 h-5 mr-2' />
                                Create Your First Persona
                            </Button>
                        </div>
                    </Card>
                )}
            </main>
        </div>
    );
}
