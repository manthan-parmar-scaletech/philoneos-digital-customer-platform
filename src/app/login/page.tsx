'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    ShieldCheck,
    AlertCircle,
    MessageSquare,
    TrendingUp,
} from 'lucide-react';
import { BrandingHeader } from '@/components/BrandingLogos';
import { MagicButton } from '@/components/ui/MagicButton';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            window.location.href = '/dashboard';
        } catch (error: unknown) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className='min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-[#050505] selection:bg-primary-500/30'>
            {/* Left Side - Login Form Panel */}
            <div className='flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10'>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className='w-full max-w-[440px]'
                >
                    {/* Brand Header */}
                    <BrandingHeader />

                    <div className='flex flex-col items-center mb-10'>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className='text-4xl font-extrabold text-white tracking-tight text-center'
                        >
                            Welcome to Synthia
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className='text-primary-400 mt-3 font-semibold text-lg hover:text-primary-300 transition-colors cursor-default'
                        >
                            Digital Customer Experience Platform
                        </motion.p>
                    </div>

                    <form onSubmit={handleLogin} className='space-y-6'>
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className='space-y-2'
                        >
                            <label className='text-sm font-semibold text-gray-300 ml-1'>Email address</label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Mail className='h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors' />
                                </div>
                                <input
                                    type='email'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='you@company.com'
                                    className='w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all duration-300'
                                />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className='space-y-2'
                        >
                            <label className='text-sm font-semibold text-gray-300 ml-1 cursor-pointer'>Password</label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Lock className='h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors' />
                                </div>
                                <input
                                    type='password'
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='••••••••'
                                    className='w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all duration-300'
                                />
                            </div>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className='bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3 text-sm'
                                >
                                    <AlertCircle className='w-5 h-5 shrink-0 mt-0.5' />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <MagicButton
                            type='submit'
                            isLoading={loading}
                            transition={{ delay: 0.6 }}
                        >
                            <span>Sign in</span>
                            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                        </MagicButton>
                    </form>
                </motion.div>
            </div>

            {/* Right Side - Branding/Features Panel */}
            <div className='hidden lg:flex flex-1 relative bg-[#0a0a0a] overflow-hidden p-12 border-l border-white/5'>
                {/* Background Animation */}
                <div className='absolute inset-0 z-0'>
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 45, 0],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className='absolute top-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-primary-600/15 blur-[120px]'
                    />
                    <motion.div
                        animate={{
                            scale: [1.1, 1, 1.1],
                            rotate: [0, -45, 0],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className='absolute bottom-[-10%] left-[10%] w-[70%] h-[70%] rounded-full bg-white/5 blur-[120px]'
                    />
                    <div className='absolute inset-0 bg-[url("https://grainy-gradients.vercel.app/noise.svg")] opacity-20 mix-blend-overlay' />
                </div>

                {/* Content */}
                <div className='relative z-10 flex flex-col justify-between w-full max-w-2xl mx-auto'>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='flex items-center gap-3 mb-12'
                        >
                            <div className='w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl'>
                                <Sparkles className='w-6 h-6 text-primary-400' />
                            </div>
                            <span className='text-2xl font-bold text-white tracking-tighter'>
                                Synthia
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className='space-y-6'
                        >
                            <h2 className='text-5xl font-extrabold text-white leading-[1.1] tracking-tight'>
                                Transform Customer <br />
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400'>
                                    Insights with AI
                                </span>
                            </h2>
                            <p className='text-gray-400 text-lg max-w-lg leading-relaxed font-medium'>
                                Create digital customers and engage in realistic
                                conversations to understand your audience better.
                            </p>
                        </motion.div>

                        <div className='mt-16 space-y-4'>
                            {[
                                {
                                    icon: Sparkles,
                                    title: "AI-Powered Customers",
                                    desc: "Generate realistic customers with detailed backgrounds and motivations."
                                },
                                {
                                    icon: MessageSquare,
                                    title: "Natural Conversations",
                                    desc: "Chat with digital customers to test messaging and gather insights."
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Data-Driven Decisions",
                                    desc: "Make informed product and marketing decisions based on feedback."
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                                    className='flex items-start gap-5 p-5 rounded-3xl border border-white/5 backdrop-blur-sm bg-white/[0.02] transition-colors cursor-pointer'
                                >
                                    <div className='w-12 h-12 shrink-0 bg-primary-500/10 rounded-2xl flex items-center justify-center border border-primary-500/20'>
                                        <feature.icon className='w-6 h-6 text-primary-400' />
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-white text-lg'>{feature.title}</h3>
                                        <p className='text-gray-400 text-sm leading-relaxed mt-1'>{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className='grid grid-cols-3 gap-8 pt-12 border-t border-white/5'
                    >
                        {[
                            { label: "Conversations", value: "10K+" },
                            { label: "Personas", value: "500+" },
                            { label: "Accuracy", value: "98%" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className='text-3xl font-black text-white'>{stat.value}</div>
                                <div className='text-sm font-bold text-gray-500 uppercase tracking-widest mt-1'>{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
