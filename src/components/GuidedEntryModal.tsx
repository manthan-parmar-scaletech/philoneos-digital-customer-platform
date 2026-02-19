import { useState } from 'react';
import {
    MessageCircle,
    Lightbulb,
    Target,
    TrendingUp,
    AlertCircle,
    Sparkles,
    X,
} from 'lucide-react';
import { intentOptions, type ConversationIntent } from '@/lib/promptTemplates';
import IntentInputForm from './IntentInputForm';

interface GuidedEntryModalProps {
    personaName: string;
    onSelectIntent: (intent: ConversationIntent, userInput?: string) => void;
    onClose: () => void;
    isLoading?: boolean;
}

const iconMap = {
    MessageCircle,
    Lightbulb,
    Target,
    TrendingUp,
    AlertCircle,
    Sparkles,
};

export default function GuidedEntryModal({
    personaName,
    onSelectIntent,
    onClose,
    isLoading = false,
}: GuidedEntryModalProps) {
    const [selectedIntent, setSelectedIntent] = useState<
        (typeof intentOptions)[number] | null
    >(null);

    const handleOptionClick = (option: (typeof intentOptions)[number]) => {
        if (option.id === 'free_chat') {
            onSelectIntent('free_chat');
        } else {
            setSelectedIntent(option);
        }
    };

    const handleInputSubmit = (input: string) => {
        if (selectedIntent) {
            onSelectIntent(selectedIntent.id, input);
        }
    };

    const handleBack = () => {
        setSelectedIntent(null);
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in'>
            <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
                <div className='sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            {selectedIntent
                                ? selectedIntent.title
                                : 'What would you like to do?'}
                        </h2>
                        <p className='text-gray-600 mt-1'>
                            {selectedIntent
                                ? `Starting conversation with ${personaName}`
                                : `Choose how you'd like to start your conversation with ${personaName}`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600 transition-colors'
                        disabled={isLoading}
                    >
                        <X className='w-6 h-6' />
                    </button>
                </div>

                <div className='p-8'>
                    {selectedIntent ? (
                        <IntentInputForm
                            intent={selectedIntent}
                            onSubmit={handleInputSubmit}
                            onBack={handleBack}
                            isLoading={isLoading}
                        />
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {intentOptions.map((option) => {
                                const IconComponent =
                                    iconMap[
                                        option.icon as keyof typeof iconMap
                                    ];
                                const isFreeChat = option.id === 'free_chat';

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() =>
                                            handleOptionClick(option)
                                        }
                                        disabled={isLoading}
                                        className={`group relative p-6 rounded-xl border-2 transition-all text-left ${
                                            isFreeChat
                                                ? 'border-blue-500 bg-blue-50 hover:bg-blue-100 hover:border-blue-600'
                                                : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                                        } ${
                                            isLoading
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:shadow-md cursor-pointer'
                                        }`}
                                    >
                                        <div className='flex items-start gap-4'>
                                            <div
                                                className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                                                    isFreeChat
                                                        ? 'bg-blue-500'
                                                        : 'bg-gray-100 group-hover:bg-gray-200'
                                                } transition-colors`}
                                            >
                                                <IconComponent
                                                    className={`w-6 h-6 ${
                                                        isFreeChat
                                                            ? 'text-white'
                                                            : 'text-gray-600'
                                                    }`}
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <h3
                                                    className={`font-semibold mb-1 ${
                                                        isFreeChat
                                                            ? 'text-blue-900'
                                                            : 'text-gray-900'
                                                    }`}
                                                >
                                                    {option.title}
                                                </h3>
                                                <p
                                                    className={`text-sm ${
                                                        isFreeChat
                                                            ? 'text-blue-700'
                                                            : 'text-gray-600'
                                                    }`}
                                                >
                                                    {option.description}
                                                </p>
                                            </div>
                                        </div>
                                        {isFreeChat && (
                                            <div className='absolute top-3 right-3'>
                                                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white'>
                                                    Quick start
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
