import { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Plus,
    MessageSquare,
    User,
    MapPin,
    Briefcase,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Persona, Conversation } from '@/types';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

interface PersonaDetailsPanelProps {
    persona: Persona;
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    onConversationSelect: (conversation: Conversation) => void;
    onNewConversation: () => void;
    primaryColor?: string;
}

export default function PersonaDetailsPanel({
    persona,
    conversations,
    selectedConversation,
    onConversationSelect,
    onNewConversation,
    primaryColor,
}: PersonaDetailsPanelProps) {
    const [showDetails, setShowDetails] = useState(true);

    const personaData = persona.persona_parameters_json as {
        age?: number;
        occupation?: string;
        location?: string;
        personality_traits?: string[];
        communication_style?: string;
        goals?: string[];
    };

    return (
        <div className='w-80 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden'>
            {/* Persona Details Section */}
            <div className='border-b border-gray-200'>
                {/* Persona Header */}
                <div className='p-6 border-b border-gray-100'>
                    <div className='flex flex-col items-center text-center'>
                        <Avatar
                            src={persona.avatar_url}
                            alt={persona.name}
                            size='lg'
                            fallback={persona.name.charAt(0).toUpperCase()}
                            color={primaryColor || '#3b82f6'}
                            className='mb-3'
                        />
                        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                            {personaData.occupation}
                        </h3>
                        <p className='text-sm text-gray-600 leading-relaxed'>
                            {persona.short_description}
                        </p>
                    </div>
                </div>

                {/* Collapsible Details */}
                <div>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className='w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors'
                    >
                        <span className='text-sm font-semibold text-gray-900'>
                            Customer Details
                        </span>
                        {showDetails ? (
                            <ChevronDown className='w-4 h-4 text-gray-500' />
                        ) : (
                            <ChevronRight className='w-4 h-4 text-gray-500' />
                        )}
                    </button>

                    {showDetails && (
                        <div className='px-6 pb-4 space-y-3 text-sm'>
                            {personaData.age && (
                                <div className='flex items-start gap-2'>
                                    <User className='w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0' />
                                    <div>
                                        <p className='text-gray-500 text-xs'>
                                            Age
                                        </p>
                                        <p className='text-gray-900'>
                                            {personaData.age} years
                                        </p>
                                    </div>
                                </div>
                            )}

                            {personaData.occupation && (
                                <div className='flex items-start gap-2'>
                                    <Briefcase className='w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0' />
                                    <div>
                                        <p className='text-gray-500 text-xs'>
                                            Occupation
                                        </p>
                                        <p className='text-gray-900'>
                                            {personaData.occupation}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {personaData.location && (
                                <div className='flex items-start gap-2'>
                                    <MapPin className='w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0' />
                                    <div>
                                        <p className='text-gray-500 text-xs'>
                                            Location
                                        </p>
                                        <p className='text-gray-900'>
                                            {personaData.location}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {personaData.communication_style && (
                                <div>
                                    <p className='text-gray-500 text-xs mb-1'>
                                        Communication Style
                                    </p>
                                    <p className='text-gray-900'>
                                        {personaData.communication_style}
                                    </p>
                                </div>
                            )}

                            {personaData.personality_traits &&
                                personaData.personality_traits.length > 0 && (
                                    <div>
                                        <p className='text-gray-500 text-xs mb-1'>
                                            Personality Traits
                                        </p>
                                        <div className='flex flex-wrap gap-1.5'>
                                            {personaData.personality_traits.map(
                                                (trait, index) => (
                                                    <span
                                                        key={index}
                                                        className='px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs'
                                                    >
                                                        {trait}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {personaData.goals &&
                                personaData.goals.length > 0 && (
                                    <div>
                                        <p className='text-gray-500 text-xs mb-1'>
                                            Goals
                                        </p>
                                        <ul className='space-y-1'>
                                            {personaData.goals.map(
                                                (goal, index) => (
                                                    <li
                                                        key={index}
                                                        className='text-gray-900 text-xs flex items-start gap-1.5'
                                                    >
                                                        <span className='text-blue-600 mt-0.5'>
                                                            •
                                                        </span>
                                                        <span>{goal}</span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>

            {/* Conversations Section */}
            <div className='flex-1 flex flex-col overflow-hidden'>
                <div className='p-4 border-b border-gray-100'>
                    <Button
                        variant='primary'
                        size='sm'
                        className='w-full'
                        onClick={onNewConversation}
                    >
                        <Plus className='w-4 h-4 mr-2' />
                        New Chat
                    </Button>
                </div>

                <div className='flex-1 overflow-y-auto p-2'>
                    <div className='space-y-1'>
                        {conversations.length === 0 ? (
                            <div className='text-center py-8 px-4'>
                                <MessageSquare className='w-8 h-8 text-gray-300 mx-auto mb-2' />
                                <p className='text-sm text-gray-500'>
                                    No conversations yet
                                </p>
                            </div>
                        ) : (
                            conversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() =>
                                        onConversationSelect(conversation)
                                    }
                                    className={clsx(
                                        'w-full text-left p-3 rounded-lg transition-all duration-200',
                                        selectedConversation?.id ===
                                            conversation.id
                                            ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                            : 'hover:bg-gray-50 border border-transparent',
                                    )}
                                >
                                    <div className='flex items-start gap-2'>
                                        <MessageSquare
                                            className={clsx(
                                                'w-4 h-4 mt-0.5 flex-shrink-0',
                                                selectedConversation?.id ===
                                                    conversation.id
                                                    ? 'text-blue-600'
                                                    : 'text-gray-400',
                                            )}
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <p
                                                className={clsx(
                                                    'text-sm font-medium truncate',
                                                    selectedConversation?.id ===
                                                        conversation.id
                                                        ? 'text-blue-900'
                                                        : 'text-gray-900',
                                                )}
                                            >
                                                {conversation.title}
                                            </p>
                                            <p className='text-xs text-gray-500 mt-0.5'>
                                                {new Date(
                                                    conversation.created_at,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    },
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
