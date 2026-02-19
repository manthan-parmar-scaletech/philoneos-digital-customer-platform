'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    LogOut,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import { clsx } from 'clsx';
import SignOutModal from './SignOutModal';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
    companyName?: string;
    companyLogo?: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function Sidebar({
    companyName,
    companyLogo,
    isCollapsed,
    onToggleCollapse,
}: SidebarProps) {
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
            <aside
                className={clsx(
                    'fixed left-0 top-0 h-screen bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col z-40 transition-all duration-300',
                    isCollapsed ? 'w-16' : 'w-60',
                )}
            >
                {/* Toggle Button */}
                <button
                    onClick={onToggleCollapse}
                    className='cursor-pointer absolute -right-3 top-6 z-50 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md'
                    aria-label={
                        isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                >
                    {isCollapsed ? (
                        <ChevronRight className='w-4 h-4 text-gray-600' />
                    ) : (
                        <ChevronLeft className='w-4 h-4 text-gray-600' />
                    )}
                </button>

                <div className={clsx('flex flex-col h-full')}>
                    {/* Logo/Brand */}
                    <div
                        className={clsx(
                            'border-b border-[var(--sidebar-border)] transition-all duration-300',
                            isCollapsed ? 'p-3' : 'p-6',
                        )}
                    >
                        <div className='flex items-center gap-3'>
                            <img
                                src={companyLogo}
                                alt={companyName}
                                className={clsx(
                                    'rounded-lg object-cover transition-all duration-300',
                                    isCollapsed ? 'w-10 h-10' : 'w-10 h-10',
                                )}
                            />
                            {!isCollapsed && (
                                <div>
                                    <h1 className='text-[var(--sidebar-text)] font-semibold text-sm'>
                                        {companyName}
                                    </h1>
                                    <p className='text-[var(--sidebar-text-muted)] text-xs'>
                                        Synthia{' '}
                                    </p>
                                </div>
                            )}
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
                                            onClick={() =>
                                                router.push(item.path)
                                            }
                                            className={clsx(
                                                'w-full flex items-center gap-3 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer',
                                                isCollapsed
                                                    ? 'px-2 py-2.5 justify-center'
                                                    : 'px-3 py-2.5',
                                                item.active
                                                    ? 'bg-gray-800 text-white border-l-4 border-blue-500 shadow-sm'
                                                    : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]',
                                            )}
                                            title={
                                                isCollapsed
                                                    ? item.name
                                                    : undefined
                                            }
                                        >
                                            <Icon className='w-5 h-5 shrink-0' />
                                            {!isCollapsed && (
                                                <span>{item.name}</span>
                                            )}
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
                            className={clsx(
                                'w-full flex items-center gap-3 rounded-lg transition-all duration-200 text-sm font-medium text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-red-400 cursor-pointer',
                                isCollapsed
                                    ? 'px-2 py-2.5 justify-center'
                                    : 'px-3 py-2.5',
                            )}
                            title={isCollapsed ? 'Sign Out' : undefined}
                        >
                            <LogOut className='w-5 h-5 shrink-0' />
                            {!isCollapsed && <span>Sign Out</span>}
                        </button>
                    </div>
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
