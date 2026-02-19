import { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    User,
    MapPin,
    Briefcase,
    Target,
    AlertCircle,
    Heart,
    Sparkles,
} from 'lucide-react';
import type { Persona } from '@/types';
import { Avatar } from './ui/Avatar';
import {
    getAvatarUrl,
    getAvatarType,
    getAvatarEmoji,
} from '@/lib/avatarDetection';

interface PersonaDetailsPanelProps {
    persona: Persona;
    primaryColor?: string;
}

export default function PersonaDetailsPanel({
    persona,
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
        motivations?: string[];
        pain_points?: string[];
        gender?: string;
        [key: string]: unknown;
    };

    // Generate intelligent avatar based on persona information
    const avatarInfo = {
        name: persona.name,
        occupation: personaData.occupation,
        age: personaData.age,
        description: persona.short_description,
        gender: personaData.gender,
    };

    const avatarType = getAvatarType(avatarInfo);
    const avatarEmoji = getAvatarEmoji(avatarType);
    const generatedAvatarUrl = getAvatarUrl(avatarInfo);

    // Use existing avatar_url if available, otherwise use generated one
    const avatarSrc = persona.avatar_url || generatedAvatarUrl;

    // Extract custom attributes (anything not in the standard fields)
    const standardFields = [
        'age',
        'occupation',
        'location',
        'personality_traits',
        'communication_style',
        'goals',
        'motivations',
        'pain_points',
    ];
    const customAttributes = Object.entries(personaData).filter(
        ([key]) => !standardFields.includes(key),
    );

    return (
        <div className='w-96 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden'>
            {/* Persona Details Section */}
            <div className='overflow-y-auto flex-1'>
                {/* Persona Header */}
                <div className='p-6 border-b border-gray-100'>
                    <div className='flex flex-col items-center text-center'>
                        <div className='inline-block p-2 bg-gray-900 rounded-full mb-3'>
                            <Avatar
                                src={avatarSrc}
                                alt={`${personaData.occupation || persona.name} - ${avatarType}`}
                                size='lg'
                                fallback={avatarEmoji}
                                color={primaryColor || '#3b82f6'}
                                className='ring-4 ring-white shadow-lg'
                            />
                        </div>
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
                                        <p className='text-gray-500 text-xs mb-1.5 flex items-center gap-1.5'>
                                            <Target className='w-3.5 h-3.5' />
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

                            {personaData.motivations &&
                                personaData.motivations.length > 0 && (
                                    <div>
                                        <p className='text-gray-500 text-xs mb-1.5 flex items-center gap-1.5'>
                                            <Heart className='w-3.5 h-3.5' />
                                            Motivations
                                        </p>
                                        <ul className='space-y-1'>
                                            {personaData.motivations.map(
                                                (motivation, index) => (
                                                    <li
                                                        key={index}
                                                        className='text-gray-900 text-xs flex items-start gap-1.5'
                                                    >
                                                        <span className='text-green-600 mt-0.5'>
                                                            •
                                                        </span>
                                                        <span>
                                                            {motivation}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                            {personaData.pain_points &&
                                personaData.pain_points.length > 0 && (
                                    <div>
                                        <p className='text-gray-500 text-xs mb-1.5 flex items-center gap-1.5'>
                                            <AlertCircle className='w-3.5 h-3.5' />
                                            Pain Points
                                        </p>
                                        <ul className='space-y-1'>
                                            {personaData.pain_points.map(
                                                (painPoint, index) => (
                                                    <li
                                                        key={index}
                                                        className='text-gray-900 text-xs flex items-start gap-1.5'
                                                    >
                                                        <span className='text-red-600 mt-0.5'>
                                                            •
                                                        </span>
                                                        <span>{painPoint}</span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                            {customAttributes.length > 0 && (
                                <div>
                                    <p className='text-gray-500 text-xs mb-1.5 flex items-center gap-1.5'>
                                        <Sparkles className='w-3.5 h-3.5' />
                                        Additional Details
                                    </p>
                                    <div className='space-y-2'>
                                        {customAttributes.map(
                                            ([key, value], index) => (
                                                <div key={index}>
                                                    <p className='text-gray-500 text-xs capitalize'>
                                                        {key.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className='text-gray-900 text-xs mt-0.5'>
                                                        {Array.isArray(value)
                                                            ? value.join(', ')
                                                            : String(value)}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
