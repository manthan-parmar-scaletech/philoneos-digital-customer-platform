import { PenTool } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className='min-h-screen bg-white flex items-center justify-center'>
            <div className='text-center animate-fade-in'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg animate-pulse'>
                    <PenTool className='w-8 h-8 text-white' />
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <div
                        className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                        style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                        className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                        style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                        className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                        style={{ animationDelay: '300ms' }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
