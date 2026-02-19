'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toastSlideIn } from '@/lib/animations';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = { id, message, type, duration };
        
        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <AlertCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5" />;
            case 'info':
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400/50';
            case 'error':
                return 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-400/50';
            case 'warning':
                return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/50';
            case 'info':
                return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            variants={toastSlideIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`
                                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
                                shadow-xl backdrop-blur-lg border min-w-[300px] max-w-md
                                ${getStyles(toast.type)}
                            `}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.x > 100) {
                                    removeToast(toast.id);
                                }
                            }}
                        >
                            <div className="shrink-0">
                                {getIcon(toast.type)}
                            </div>
                            <p className="flex-1 text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors cursor-pointer"
                                aria-label="Close notification"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
