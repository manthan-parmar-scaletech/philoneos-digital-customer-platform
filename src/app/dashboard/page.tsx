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
import {
    MessageSquare,
    Users,
    TrendingUp,
    LogOut,
    Plus,
    Sparkles,
} from 'lucide-react';

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <header className='bg-white shadow-sm border-b'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='flex justify-between items-center h-16'>
                            <Skeleton width={200} height={32} />
                            <Skeleton width={100} height={36} />
                        </div>
                    </div>
                </header>
                <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} height={120} />
                        ))}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} height={300} />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b sticky top-0 z-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center space-x-4'>
                            {company?.logo_url ? (
                                <Image
                                    src={company.logo_url}
                                    alt={company.name}
                                    width={40}
                                    height={40}
                                    className='h-10 w-10 rounded-lg'
                                />
                            ) : (
                                <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
                                    <MessageSquare className='w-6 h-6 text-white' />
                                </div>
                            )}
                            <div>
                                <h1 className='text-xl font-bold text-gray-900'>
                                    {company?.name || 'Philoneos'}
                                </h1>
                                <p className='text-xs text-gray-500'>
                                    Digital Customer Intelligence
                                </p>
                            </div>
                        </div>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={handleLogout}
                            className='text-gray-600 hover:text-gray-900'
                        >
                            <LogOut className='w-4 h-4 mr-2' />
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in'>
                    <Card hover padding='md'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm font-medium text-gray-600 mb-1'>
                                    Active Personas
                                </p>
                                <p className='text-3xl font-bold text-gray-900'>
                                    {personas.length}
                                </p>
                            </div>
                            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <Users className='w-6 h-6 text-blue-600' />
                            </div>
                        </div>
                    </Card>

                    <Card hover padding='md'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm font-medium text-gray-600 mb-1'>
                                    Total Conversations
                                </p>
                                <p className='text-3xl font-bold text-gray-900'>
                                    0
                                </p>
                            </div>
                            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                                <MessageSquare className='w-6 h-6 text-green-600' />
                            </div>
                        </div>
                    </Card>

                    <Card hover padding='md'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm font-medium text-gray-600 mb-1'>
                                    Insights Generated
                                </p>
                                <p className='text-3xl font-bold text-gray-900'>
                                    0
                                </p>
                            </div>
                            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                                <TrendingUp className='w-6 h-6 text-purple-600' />
                            </div>
                        </div>
                    </Card>
                </div>

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
