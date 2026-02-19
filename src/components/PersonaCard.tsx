'use client';

import type { Persona } from '@/types';
import { MessageCircle, User } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { MagicButton } from './ui/MagicButton';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/lib/animations';
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
    const { ref, controls } = useScrollAnimation(0.2);

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
        <motion.div
            ref={ref}
            initial='hidden'
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
        >
            <div
                className='overflow-hidden group cursor-pointer transition-all duration-300 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:border-primary-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_40px_rgba(124,58,237,0.1)] h-full flex flex-col'
                onClick={handleStartConversation}
            >
                {/* Modern Header with Gradient */}
                <div className='h-20 bg-gradient-to-br from-primary-600/20 to-violet-600/20 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-[url("https://grainy-gradients.vercel.app/noise.svg")] opacity-10 mix-blend-overlay' />
                    <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className='absolute -right-4 -top-4 w-20 h-20 bg-primary-500/10 rounded-full blur-2xl' 
                    />
                </div>

                {/* Content */}
                <div className='p-5 flex-1 flex flex-col'>
                    {/* Avatar */}
                    <div className='flex justify-center -mt-12 mb-4'>
                        <div className='bg-[#0a0a0a] p-1.5 rounded-2xl shadow-2xl border border-white/10'>
                            <Avatar
                                src={avatarSrc}
                                alt={`${personaData.occupation || persona.name} - ${avatarType}`}
                                size='lg'
                                fallback={avatarEmoji}
                                color={primaryColor || '#7c3aed'}
                                className='border-4 border-[#0a0a0a] rounded-xl'
                            />
                        </div>
                    </div>

                    {/* Name and Title */}
                    <div className='mb-2 text-center'>
                        <h3 className='text-lg font-bold text-white tracking-tight group-hover:text-primary-400 transition-colors'>
                            {personaData.occupation}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className='text-gray-400 text-xs mb-4 line-clamp-3 leading-relaxed text-center'>
                        {persona.short_description}
                    </p>

                    {/* Meta Info */}
                    <div className='flex items-center justify-center gap-2 mb-6 text-[10px]'>
                        {personaData.age && (
                            <div className='flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-xl text-gray-300'>
                                <User className='w-3 h-3 text-primary-400' />
                                <span className='font-semibold'>
                                    {personaData.age}
                                </span>
                            </div>
                        )}
                        {personaData.location && (
                            <div className='flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-xl text-gray-300'>
                                <span className='text-[10px]'>📍</span>
                                <span className='font-semibold'>
                                    {personaData.location}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className='mt-auto pt-2'>
                        <MagicButton
                            variant='secondary'
                            className='w-full py-2 rounded-xl bg-white/[0.03] hover:bg-primary-600 border-white/10 hover:border-primary-500/50 group/btn'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStartConversation();
                            }}
                        >
                            <MessageCircle className='w-5 h-5 group-hover/btn:scale-110 transition-transform' />
                            <span>Chat Now</span>
                        </MagicButton>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
