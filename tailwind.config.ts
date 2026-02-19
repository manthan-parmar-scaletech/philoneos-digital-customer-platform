import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                glass: {
                    light: 'rgba(255, 255, 255, 0.1)',
                    medium: 'rgba(255, 255, 255, 0.15)',
                    dark: 'rgba(0, 0, 0, 0.1)',
                },
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                accent: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9f1239',
                    900: '#831843',
                },
                sidebar: {
                    DEFAULT: '#5b21b6',
                    dark: '#4c1d95',
                    light: '#7c3aed',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-mesh':
                    'radial-gradient(at 40% 20%, hsla(260, 100%, 97%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(270, 100%, 56%, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(300, 100%, 93%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(280, 100%, 76%, 0.15) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(290, 100%, 77%, 0.2) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(270, 100%, 70%, 0.15) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(310, 100%, 76%, 0.2) 0px, transparent 50%)',
                'gradient-glass':
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                glass: '0 8px 32px 0 rgba(76, 29, 149, 0.15)',
                'glass-lg': '0 12px 48px 0 rgba(76, 29, 149, 0.2)',
                glow: '0 0 20px rgba(139, 92, 246, 0.5)',
                'glow-lg': '0 0 40px rgba(139, 92, 246, 0.6)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-in-left': 'slideInFromLeft 0.3s ease-out',
                shimmer: 'shimmer 2s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                float: 'float 6s ease-in-out infinite',
                glow: 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInFromLeft: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
