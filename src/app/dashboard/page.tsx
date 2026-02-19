'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Company, Persona } from '@/types';
import PersonaCard from '@/components/PersonaCard';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { MagicButton } from '@/components/ui/MagicButton';
import {
    Sparkles,
    Plus,
    LayoutDashboard,
} from 'lucide-react';
import PersonaCreationModal, {
    PersonaFormData,
} from '@/components/PersonaCreationModal';

export default function DashboardPage() {
    const [company, setCompany] = useState<Company | null>(null);
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
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

    const handleCreatePersona = async (formData: PersonaFormData) => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        setIsCreating(true);
        try {
            const { data: newPersona, error } = await supabase
                .from('personas')
                .insert({
                    company_id: session.user.id,
                    name: formData.occupation,
                    short_description: formData.short_description,
                    persona_parameters_json: {
                        age: formData.age,
                        occupation: formData.occupation,
                        location: formData.location,
                        personality_traits: formData.personality_traits,
                        motivations: formData.motivations,
                        pain_points: formData.pain_points,
                        ...formData.custom_attributes.reduce(
                            (acc, attr) => {
                                acc[attr.key] = attr.value;
                                return acc;
                            },
                            {} as Record<string, string>,
                        ),
                    },
                })
                .select()
                .single();

            if (error) throw error;

            setPersonas([newPersona, ...personas]);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating persona:', error);
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col'>
                {/* Background Decoration */}
                <div className='absolute inset-0 z-0'>
                    <div className='absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/10 blur-[120px]' />
                    <div className='absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/10 blur-[120px]' />
                    <div className='absolute inset-0 bg-[url("https://grainy-gradients.vercel.app/noise.svg")] opacity-20 mix-blend-overlay' />
                </div>

                <main className='relative z-10 p-6 lg:p-8 flex-1'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='mb-8'>
                            <Skeleton variant='text' width={300} height={40} className='mb-3 bg-white/5' />
                            <Skeleton variant='text' width={200} height={20} className='bg-white/5' />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className='bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden'>
                                    <div className='h-20 bg-white/5 animate-pulse' />
                                    <div className='p-5'>
                                        <Skeleton variant='circular' width={64} height={64} className='mx-auto -mt-10 mb-4 bg-white/5 border-4 border-[#0a0a0a]' />
                                        <Skeleton variant='text' width='60%' className='mx-auto mb-3 bg-white/5' />
                                        <Skeleton variant='text' width='80%' className='mx-auto mb-6 bg-white/5' />
                                        <Skeleton variant='rectangular' height={40} className='rounded-xl bg-white/5' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col'>
            {/* Background Decoration */}
            <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className='absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary-600/10 blur-[120px]'
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className='absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-500/10 blur-[120px]'
                />
                <div className='absolute inset-0 bg-[url("https://grainy-gradients.vercel.app/noise.svg")] opacity-20 mix-blend-overlay' />
            </div>

            <main className='relative z-10 p-6 lg:p-8 flex-1 flex flex-col'>
                <div className='max-w-7xl mx-auto w-full flex-1 flex flex-col'>
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6'
                    >
                        <div>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20'>
                                    <LayoutDashboard className='w-4 h-4 text-primary-400' />
                                </div>
                                <span className='text-[10px] font-bold text-primary-400 tracking-wider uppercase'>Dashboard</span>
                            </div>
                            <h2 className='text-3xl font-extrabold text-white tracking-tight mb-2'>
                                Your Customers
                            </h2>
                            <p className='text-gray-400 font-medium'>
                                Select a digital customer to start a realistic conversation.
                            </p>
                        </div>
                        {personas.length > 0 && (
                            <MagicButton
                                variant='primary'
                                onClick={() => setShowCreateModal(true)}
                                className='w-full md:w-auto min-w-[200px]'
                            >
                                <Plus className='w-5 h-5 shrink-0' />
                                <span>Create Customer</span>
                            </MagicButton>
                        )}
                    </motion.div>

                    {/* Content Area */}
                    <div className='flex-1'>
                        {personas.length > 0 ? (
                            <motion.div
                                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10'
                                variants={staggerContainer}
                                initial='hidden'
                                animate='visible'
                            >
                                {personas.map((persona) => (
                                    <motion.div
                                        key={persona.id}
                                        variants={staggerItem}
                                        className='h-full'
                                    >
                                        <PersonaCard
                                            persona={persona}
                                            primaryColor={company?.primary_color}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className='flex-1 flex flex-col items-center justify-center min-h-[400px] text-center'
                            >
                                <div className='relative mb-6'>
                                    <div className='absolute inset-0 bg-primary-500/20 rounded-full blur-[60px] animate-pulse' />
                                    <div className='relative w-24 h-24 bg-white/[0.03] backdrop-blur-3xl rounded-[32px] flex items-center justify-center border border-white/10 shadow-2xl'>
                                        <Sparkles className='w-12 h-12 text-primary-400 animate-pulse' />
                                    </div>
                                </div>
                                <div className='max-w-md mx-auto'>
                                    <h3 className='text-2xl font-extrabold text-white mb-3'>
                                        No Customers Yet
                                    </h3>
                                    <p className='text-gray-400 mb-6 leading-relaxed text-sm'>
                                        Kickstart your strategy by creating your first digital customer 
                                        to gather deep insights and test messaging.
                                    </p>
                                    <MagicButton
                                        onClick={() => setShowCreateModal(true)}
                                        className='px-8'
                                    >
                                        <Plus className='w-5 h-5' />
                                        <span>Create Your First Customer</span>
                                    </MagicButton>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showCreateModal && (
                    <PersonaCreationModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreatePersona}
                        isLoading={isCreating}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
