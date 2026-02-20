'use client';

import { supabase } from '@/lib/supabase';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Grid,
    LogOut,
    LucideIcon,
    Menu
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import SignOutModal from './SignOutModal';
import { Tooltip } from './ui/Tooltip';

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

    const menuItems: {
        name: string;
        icon: LucideIcon;
        path: string;
        active: boolean;
        badge: { text: string; color?: string } | null;
    }[] = [
        {
            name: 'Dashboard',
            icon: Grid,
            path: '/dashboard',
            active: pathname === '/dashboard',
            badge: null,
        },
    ];


    return (
        <>
            <aside
                className={clsx(
                    'fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300 overflow-x-hidden',
                    'bg-[#060606]',
                    'border-r border-white/5 shadow-2xl',
                    isCollapsed ? 'w-20' : 'w-64',
                )}
            >

                <div className={clsx('flex flex-col h-full relative z-10 py-4')}>
                    {/* Header: Logo & Toggle */}
                    <div className='px-6 mb-6 flex items-center justify-between'>
                        {!isCollapsed && (
                            <motion.h2 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className='text-xl font-bold text-white tracking-tight'
                            >
                                {companyName || 'Synthia'}
                            </motion.h2>
                        )}
                        <button
                            onClick={onToggleCollapse}
                            className='p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/70 hover:text-white cursor-pointer'
                            title={isCollapsed ? 'Expand' : 'Collapse'}
                        >
                            <Menu className='w-5 h-5' />
                        </button>
                    </div>

                    {/* Search Bar */}
                    {/* {!isCollapsed && (
                        <div className='px-4 mb-6'>
                            <div className='relative group cursor-text'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary-400 transition-colors pointer-events-none' />
                                <input 
                                    type='text' 
                                    placeholder='Search'
                                    className='w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-text'
                                />
                            </div>
                        </div>
                    )} */}

                    {/* Navigation */}
                    <div className='flex-1 overflow-y-auto px-2 custom-scrollbar'>
                        <nav className='mb-8'>
                            <ul className='space-y-1'>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const iconVariants = {
                                        hover: { rotate: 15, scale: 1.2 },
                                        initial: { rotate: 0, scale: 1 }
                                    };

                                    const buttonContent = (
                                        <motion.button
                                            whileHover="hover"
                                            initial="initial"
                                            onClick={() => router.push(item.path)}
                                            className={clsx(
                                                'w-full flex items-center gap-3 rounded-xl transition-all duration-300 text-sm font-medium relative group cursor-pointer overflow-hidden',
                                                isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-2.5',
                                                item.active
                                                    ? 'text-white bg-white/[0.08] shadow-[0_4px_12px_rgba(124,58,237,0.15)] ring-1 ring-white/10'
                                                    : 'text-gray-400 hover:text-white'
                                            )}
                                        >
                                            {/* Hover/Active Glow Effect */}
                                            <AnimatePresence>
                                                {(item.active || isCollapsed) && (
                                                    <motion.div 
                                                        className={clsx(
                                                            "absolute inset-0 bg-gradient-to-r from-[#7c3aed]/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                                            item.active && "opacity-100"
                                                        )}
                                                        layoutId={item.active ? "active-highlight" : undefined}
                                                    />
                                                )}
                                            </AnimatePresence>

                                            <motion.div
                                                variants={iconVariants}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                className="relative z-10"
                                            >
                                                <Icon className={clsx(
                                                    'w-5 h-5 shrink-0 transition-colors',
                                                    item.active ? 'text-primary-400' : 'text-gray-500 group-hover:text-primary-300'
                                                )} />
                                            </motion.div>
                                            
                                            {!isCollapsed && (
                                                <span className='flex-1 text-left relative z-10'>{item.name}</span>
                                            )}

                                            {!isCollapsed && item.badge && (
                                                <span className={clsx(
                                                    'relative z-10 px-1.5 py-0.5 rounded-md text-[10px] font-bold',
                                                    item.badge.color || 'bg-primary-600 text-white'
                                                )}>
                                                    {item.badge.text}
                                                </span>
                                            )}
                                        </motion.button>
                                    );

                                    return (
                                        <li key={item.path}>
                                            {isCollapsed ? (
                                                <Tooltip content={item.name}>
                                                    {buttonContent}
                                                </Tooltip>
                                            ) : (
                                                buttonContent
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                    </div>

                    {/* Footer: User & Sign Out */}
                    <div className='px-4 pt-4 border-t border-white/5'>
                        {isCollapsed ? (
                            <div className='flex flex-col items-center gap-4 py-2'>
                                <Tooltip content="Sign Out">
                                    <button 
                                        onClick={() => setShowSignOutModal(true)}
                                        className='p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/[0.05] transition-all cursor-pointer group'
                                    >
                                        <motion.div
                                            whileHover={{ x: 3, scale: 1.1 }}
                                        >
                                            <LogOut className='w-5 h-5' />
                                        </motion.div>
                                    </button>
                                </Tooltip>
                                <div className='relative shrink-0 group cursor-pointer'>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="relative"
                                    >
                                        <img
                                            src={companyLogo}
                                            alt={companyName}
                                            className='w-8 h-8 rounded-lg object-cover border border-white/10'
                                        />
                                        <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full' />
                                    </motion.div>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setShowSignOutModal(true)}
                                className='w-full p-3 flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl transition-all duration-300 cursor-pointer hover:bg-white/[0.06] hover:border-white/10 group'
                            >
                                <div className='relative shrink-0'>
                                    <img
                                        src={companyLogo}
                                        alt={companyName}
                                        className='w-8 h-8 rounded-lg object-cover border border-white/10'
                                    />
                                    <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs font-bold text-white truncate text-left'>{companyName || 'Admin User'}</p>
                                    <p className='text-[10px] text-gray-500 truncate text-left'>{companyName?.toLowerCase().replace(/\s+/g, '')}@synthia.ai</p>
                                </div>
                                <motion.div 
                                    whileHover={{ x: 3 }}
                                    className='p-1.5 rounded-lg text-gray-500 group-hover:text-red-400 transition-colors'
                                >
                                    <LogOut className='w-4 h-4' />
                                </motion.div>
                            </button>
                        )}
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
