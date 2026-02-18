import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value;
                },
                set(
                    name: string,
                    value: string,
                    options: Record<string, unknown>,
                ) {
                    req.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    res.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: Record<string, unknown>) {
                    req.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    res.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        },
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Redirect to login if accessing protected routes without session
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/login';
        return NextResponse.redirect(redirectUrl);
    }

    // Redirect to dashboard if accessing login/auth routes with session
    if (
        session &&
        (req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname === '/')
    ) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/'],
};
