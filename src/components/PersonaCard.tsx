import type { Persona } from '@/types';
import { MessageCircle, User } from 'lucide-react';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import {
    getAvatarUrl,
    getAvatarType,
    getAvatarEmoji,
} from '@/lib/avatarDetection';

interface PersonaCardProps {
    persona: Persona;
    primaryColor?: string;
}

export default function PersonaCard({
    persona,
    primaryColor,
}: PersonaCardProps) {
    const router = useRouter();

    const handleStartConversation = () => {
        router.push(`/chat/${persona.id}`);
    };

    const personaData = persona.persona_parameters_json as {
        age?: number;
        occupation?: string;
        location?: string;
        gender?: string;
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

    return (
        <Card
            hover
            padding='none'
            className='overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-in'
            onClick={handleStartConversation}
        >
            {/* Header with gradient */}
            <div
                className='h-24 bg-gradient-to-br from-blue-500 to-blue-600 relative'
                style={{
                    background: primaryColor
                        ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
                        : undefined,
                }}
            >
                <div className='absolute inset-0 bg-black/10'></div>
            </div>

            {/* Content */}
            <div className='p-6 -mt-10 relative'>
                {/* Avatar */}
                <div className='mb-4'>
                    <div className='inline-block p-2 bg-gray-900 rounded-full'>
                        <Avatar
                            src={avatarSrc}
                            alt={`${personaData.occupation || persona.name} - ${avatarType}`}
                            size='xl'
                            fallback={avatarEmoji}
                            color={primaryColor || '#3b82f6'}
                            className='ring-4 ring-white shadow-lg'
                        />
                    </div>
                </div>

                {/* Name and Title */}
                <div className='mb-3'>
                    <h3 className='text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors'>
                        {personaData.occupation}
                    </h3>
                </div>

                {/* Description */}
                <p className='text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed'>
                    {persona.short_description}
                </p>

                {/* Meta Info */}
                <div className='flex items-center gap-4 mb-4 text-xs text-gray-500'>
                    {personaData.age && (
                        <div className='flex items-center gap-1'>
                            <User className='w-3 h-3' />
                            <span>{personaData.age} years</span>
                        </div>
                    )}
                    {personaData.location && (
                        <div className='flex items-center gap-1'>
                            <span>📍</span>
                            <span>{personaData.location}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <Button
                    variant='primary'
                    size='md'
                    className='w-full group-hover:shadow-md transition-shadow'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStartConversation();
                    }}
                >
                    <MessageCircle className='w-4 h-4 mr-2' />
                    Start Conversation
                </Button>
            </div>
        </Card>
    );
}
