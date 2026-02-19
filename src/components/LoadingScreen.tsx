import { PenTool } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center'>
            <div className='text-center animate-fade-in'>
                <div className='relative inline-block mb-6'>
                    <div className='absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-3xl blur-2xl opacity-40 animate-pulse'></div>
                    <div className='relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl shadow-xl border border-white/20'>
                        <PenTool className='w-10 h-10 text-white' />
                    </div>
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <div
                        className='w-2.5 h-2.5 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full animate-bounce shadow-sm'
                        style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                        className='w-2.5 h-2.5 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full animate-bounce shadow-sm'
                        style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                        className='w-2.5 h-2.5 bg-gradient-to-br from-cyan-600 to-indigo-600 rounded-full animate-bounce shadow-sm'
                        style={{ animationDelay: '300ms' }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
