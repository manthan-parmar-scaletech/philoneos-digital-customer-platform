'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Company } from '@/types';
import Sidebar from './Sidebar';

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);

    // Pages that should not show the sidebar
    const noSidebarPages = ['/login', '/'];

    const shouldShowSidebar = !noSidebarPages.includes(pathname);

    // Sidebar should be collapsed on chat pages, expanded on dashboard
    const isChatPage = pathname?.startsWith('/chat');
    const [isCollapsed, setIsCollapsed] = useState(isChatPage);

    // Collapse sidebar when navigating to chat page, expand when leaving
    useEffect(() => {
        if (isChatPage) {
            setIsCollapsed(true);
        } else if (shouldShowSidebar) {
            setIsCollapsed(false);
        }
    }, [isChatPage, shouldShowSidebar]);

    useEffect(() => {
        if (!shouldShowSidebar) {
            return;
        }

        const fetchCompanyData = async () => {
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
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
        };

        fetchCompanyData();
    }, [shouldShowSidebar, router]);

    if (!shouldShowSidebar) {
        return <>{children}</>;
    }

    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar
                companyName={company?.name}
                companyLogo={company?.logo_url}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
            <main
                className={`flex-1 overflow-auto transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-60'}`}
            >
                {children}
            </main>
        </div>
    );
}
