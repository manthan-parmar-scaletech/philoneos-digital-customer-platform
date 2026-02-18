'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { MessageSquare, Sparkles, TrendingUp } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

            const { data: sessionData } = await supabase.auth.getSession();
            console.log('Session after login:', sessionData);

            window.location.href = '/dashboard';
        } catch (error: unknown) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex'>
            {/* Left Side - Login Form */}
            <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white'>
                <div className='w-full max-w-md space-y-8 animate-fade-in'>
                    {/* Logo/Brand */}
                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg'>
                            <MessageSquare className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                            Welcome to Philoneos
                        </h1>
                        <p className='text-gray-600'>
                            Digital Customer Intelligence Platform
                        </p>
                    </div>

                    {/* Login Form */}
                    <Card padding='lg' className='shadow-xl border-gray-200'>
                        <form onSubmit={handleLogin} className='space-y-6'>
                            <div className='space-y-4'>
                                <Input
                                    label='Email address'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    placeholder='you@company.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={
                                        error && email === ''
                                            ? 'Email is required'
                                            : undefined
                                    }
                                />

                                <Input
                                    label='Password'
                                    type='password'
                                    autoComplete='current-password'
                                    required
                                    placeholder='••••••••'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    error={
                                        error && password === ''
                                            ? 'Password is required'
                                            : undefined
                                    }
                                />
                            </div>

                            {error && (
                                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-slide-down'>
                                    <p className='font-medium'>
                                        Authentication failed
                                    </p>
                                    <p className='text-red-600'>{error}</p>
                                </div>
                            )}

                            <Button
                                type='submit'
                                variant='primary'
                                size='lg'
                                className='w-full'
                                isLoading={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </Card>

                    {/* Footer */}
                    <p className='text-center text-sm text-gray-500'>
                        Secure authentication powered by Supabase
                    </p>
                </div>
            </div>

            {/* Right Side - Branding/Features */}
            <div className='hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 items-center justify-center relative overflow-hidden'>
                {/* Background Pattern */}
                <div className='absolute inset-0 opacity-10'>
                    <div
                        className='absolute inset-0'
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                        }}
                    ></div>
                </div>

                <div className='relative z-10 max-w-lg text-white space-y-8 animate-fade-in'>
                    <div>
                        <h2 className='text-4xl font-bold mb-4 leading-tight'>
                            Transform Customer Insights with AI
                        </h2>
                        <p className='text-blue-100 text-lg'>
                            Create synthetic customer personas and engage in
                            realistic conversations to understand your audience
                            better.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className='space-y-4'>
                        <div className='flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20'>
                            <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                                <Sparkles className='w-5 h-5' />
                            </div>
                            <div>
                                <h3 className='font-semibold mb-1'>
                                    AI-Powered Personas
                                </h3>
                                <p className='text-sm text-blue-100'>
                                    Generate realistic customer personas with
                                    detailed backgrounds and motivations
                                </p>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20'>
                            <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                                <MessageSquare className='w-5 h-5' />
                            </div>
                            <div>
                                <h3 className='font-semibold mb-1'>
                                    Natural Conversations
                                </h3>
                                <p className='text-sm text-blue-100'>
                                    Chat with synthetic customers to test
                                    messaging and gather insights
                                </p>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20'>
                            <div className='flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                                <TrendingUp className='w-5 h-5' />
                            </div>
                            <div>
                                <h3 className='font-semibold mb-1'>
                                    Data-Driven Decisions
                                </h3>
                                <p className='text-sm text-blue-100'>
                                    Make informed product and marketing
                                    decisions based on customer feedback
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className='grid grid-cols-3 gap-4 pt-8 border-t border-white/20'>
                        <div>
                            <div className='text-3xl font-bold'>10K+</div>
                            <div className='text-sm text-blue-100'>
                                Conversations
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold'>500+</div>
                            <div className='text-sm text-blue-100'>
                                Personas
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold'>98%</div>
                            <div className='text-sm text-blue-100'>
                                Accuracy
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
