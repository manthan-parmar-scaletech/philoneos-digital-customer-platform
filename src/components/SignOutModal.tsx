import { Button } from './ui/Button';
import { LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideUp } from '@/lib/animations';

interface SignOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function SignOutModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: SignOutModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6'>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='absolute inset-0 bg-black/80 backdrop-blur-xl'
                    />
                    
                    {/* Modal Content */}
                    <motion.div
                        variants={slideUp}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className='relative bg-[#0a0a0a] rounded-[2rem] shadow-[0_32px_120px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden flex flex-col border border-white/10'
                    >
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-10 flex flex-col items-center text-center">
                            {/* Icon Wrapper */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-red-500/20 blur-[30px] rounded-full" />
                                <div className="relative w-20 h-20 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center">
                                    <LogOut className="w-10 h-10 text-red-500" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                                Sign Out
                            </h2>
                            
                            <p className="text-white/50 text-[15px] leading-relaxed mb-10 max-w-[280px]">
                                Are you sure you want to end your session? You'll need to sign back in to access your dashboard.
                            </p>

                            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5"
                                >
                                    Go Back
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={onConfirm}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                    className="flex-[1.5] h-14 rounded-2xl shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                                >
                                    End Session
                                </Button>
                            </div>
                        </div>

                        {/* Bottom decorative bar */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
