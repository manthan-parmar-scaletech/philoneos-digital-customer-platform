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
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, fadeIn, fadeInUp } from '@/lib/animations';
import clsx from 'clsx';
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
        <div className='w-[400px] border-l border-white/5 bg-white/[0.01] backdrop-blur-3xl flex flex-col h-full overflow-hidden relative'>
            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/[0.02] to-transparent pointer-events-none" />
            
            {/* Persona Details Section */}
            <div className='overflow-y-auto flex-1 custom-scrollbar px-6 relative z-10'>
                {/* Persona Header */}
                <div className='py-10 mb-2'>
                    <div className='flex flex-col items-center text-center'>
                        <div className='relative group mb-8'>
                            <div className='absolute inset-0 bg-primary-500/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000' />
                            <div className='relative p-1 bg-gradient-to-br from-white/10 to-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl'>
                                <Avatar
                                    src={avatarSrc}
                                    alt={persona.name}
                                    size='xl'
                                    fallback={avatarEmoji}
                                    color={primaryColor || '#7c3aed'}
                                    className='ring-4 ring-[#060606] shadow-2xl rounded-[2.3rem]'
                                />
                            </div>
                        </div>
                        <h3 className='text-2xl font-bold text-white mb-2 tracking-tight'>
                            {personaData.occupation || persona.name}
                        </h3>
                        <p className='text-[13px] text-white/40 leading-relaxed font-semibold uppercase tracking-[0.2em] px-4'>
                            {persona.short_description}
                        </p>
                    </div>
                </div>

                {/* Collapsible Details */}
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="pb-10 space-y-8"
                >
                    <motion.div variants={fadeIn} className="flex items-center justify-between px-2">
                        <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                            Detailed Dossier
                        </h4>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className='w-8 h-8 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl transition-all duration-300 group'
                        >
                            {showDetails ? (
                                <ChevronDown className='w-4 h-4 text-white/30 group-hover:text-white transition-colors' />
                            ) : (
                                <ChevronRight className='w-4 h-4 text-white/30 group-hover:text-white transition-colors' />
                            )}
                        </button>
                    </motion.div>

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div 
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className='space-y-5'
                            >
                                {/* Core Info Grid */}
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { icon: User, label: 'Age', value: personaData.age ? `${personaData.age} Years` : null, color: 'primary' },
                                        { icon: Briefcase, label: 'Sector', value: personaData.occupation, color: 'emerald' },
                                        { icon: MapPin, label: 'Locale', value: personaData.location, color: 'rose' },
                                    ].map((item, i) => item.value && (
                                        <motion.div 
                                            key={i} 
                                            variants={staggerItem}
                                            className="group p-4 bg-white/[0.02] border border-white/5 rounded-3xl transition-all duration-500 hover:bg-white/[0.05] hover:border-white/15 hover:translate-y-[-2px] shadow-xl"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg",
                                                    item.color === 'primary' && 'bg-primary-500/10 border-primary-500/20 text-primary-400 group-hover:bg-primary-500/20',
                                                    item.color === 'emerald' && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20',
                                                    item.color === 'rose' && 'bg-rose-500/10 border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20'
                                                )}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-0.5">{item.label}</p>
                                                    <p className="text-[14px] font-bold text-white/90">{item.value}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Traits */}
                                {personaData.personality_traits && personaData.personality_traits.length > 0 && (
                                    <motion.div variants={staggerItem} className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] shadow-xl">
                                        <p className='text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                                            <Sparkles className="w-4 h-4 text-primary-400/50" />
                                            Behavioral DNA
                                        </p>
                                        <div className='flex flex-wrap gap-2'>
                                            {personaData.personality_traits.map((trait, index) => (
                                                <span
                                                    key={index}
                                                    className='px-3 py-1.5 bg-primary-500/5 hover:bg-primary-500/10 text-primary-400 rounded-xl text-[10px] font-bold border border-primary-500/10 uppercase tracking-widest transition-colors duration-300'
                                                >
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Goals & Motivations - Combined Visual Style */}
                                {[
                                    { items: personaData.goals, icon: Target, label: 'Strategic Goals', color: 'primary' },
                                    { items: personaData.motivations, icon: Heart, label: 'Core Motivations', color: 'emerald' },
                                    { items: personaData.pain_points, icon: AlertCircle, label: 'Critical Friction', color: 'rose' }
                                ].map((section, idx) => section.items && section.items.length > 0 && (
                                    <motion.div key={idx} variants={staggerItem} className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] shadow-xl group/section">
                                        <p className={clsx(
                                            'text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2.5',
                                            section.color === 'primary' && 'text-primary-400/80',
                                            section.color === 'emerald' && 'text-emerald-400/80',
                                            section.color === 'rose' && 'text-rose-400/80'
                                        )}>
                                            <section.icon className='w-4 h-4' />
                                            {section.label}
                                        </p>
                                        <ul className='space-y-3'>
                                            {section.items.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className='text-white/50 text-[12px] font-medium flex items-start gap-3 leading-relaxed group-hover/section:text-white/70 transition-colors duration-300'
                                                >
                                                    <span className={clsx(
                                                        'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 shadow-[0_0_10px_currentColor]',
                                                        section.color === 'primary' && 'bg-primary-500',
                                                        section.color === 'emerald' && 'bg-emerald-500',
                                                        section.color === 'rose' && 'bg-rose-500'
                                                    )} />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
