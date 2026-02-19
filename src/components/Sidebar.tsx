'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import SignOutModal from './SignOutModal';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
    companyName?: string;
    companyLogo?: string;
}

export default function Sidebar({ companyName, companyLogo }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsSigningOut(false);
            setShowSignOutModal(false);
        }
    };

    const menuItems = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard',
            active: pathname === '/dashboard',
        },
    ];

    return (
        <>
            <aside className='fixed left-0 top-0 h-screen w-60 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col z-40'>
                {/* Logo/Brand */}
                <div className='p-6 border-b border-[var(--sidebar-border)]'>
                    <div className='flex items-center gap-3'>
                        <img
                            src={companyLogo}
                            alt={companyName}
                            className='w-10 h-10 rounded-lg object-cover'
                        />
                        <div>
                            <h1 className='text-[var(--sidebar-text)] font-semibold text-sm'>
                                {companyName}
                            </h1>
                            <p className='text-[var(--sidebar-text-muted)] text-xs'>
                                Synthia{' '}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className='flex-1 p-3'>
                    <ul className='space-y-1'>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <button
                                        onClick={() => router.push(item.path)}
                                        className={clsx(
                                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium',
                                            item.active
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]',
                                        )}
                                    >
                                        <Icon className='w-5 h-5' />
                                        <span>{item.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Sign Out */}
                <div className='p-3 border-t border-[var(--sidebar-border)]'>
                    <button
                        onClick={() => setShowSignOutModal(true)}
                        className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-red-400 cursor-pointer'
                    >
                        <LogOut className='w-5 h-5' />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Sign Out Modal */}
            <SignOutModal
                isOpen={showSignOutModal}
                onClose={() => setShowSignOutModal(false)}
                onConfirm={handleSignOut}
                isLoading={isSigningOut}
            />
        </>
    );
}
