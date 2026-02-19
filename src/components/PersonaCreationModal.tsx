import { useState } from 'react';
import { Modal } from './ui/Modal';
import { MagicButton } from './ui/MagicButton';
import { Input } from './ui/Input';
import { X, Plus } from 'lucide-react';

interface PersonaCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (personaData: PersonaFormData) => Promise<void>;
    isLoading?: boolean;
}

export interface CustomAttribute {
    key: string;
    value: string;
}

export interface PersonaFormData {
    occupation: string;
    age: number;
    location: string;
    short_description: string;
    personality_traits: string[];
    motivations: string[];
    pain_points: string[];
    custom_attributes: CustomAttribute[];
}

export default function PersonaCreationModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}: PersonaCreationModalProps) {
    const [formData, setFormData] = useState<PersonaFormData>({
        occupation: '',
        age: 0,
        location: '',
        short_description: '',
        personality_traits: [],
        motivations: [],
        pain_points: [],
        custom_attributes: [],
    });

    const [currentTrait, setCurrentTrait] = useState('');
    const [currentMotivation, setCurrentMotivation] = useState('');
    const [currentPainPoint, setCurrentPainPoint] = useState('');
    const [currentAttrKey, setCurrentAttrKey] = useState('');
    const [currentAttrValue, setCurrentAttrValue] = useState('');
    const [errors, setErrors] = useState<
        Partial<Record<keyof PersonaFormData, string>>
    >({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PersonaFormData, string>> = {};

        if (!formData.occupation.trim()) {
            newErrors.occupation = 'Occupation is required';
        }
        if (!formData.age || formData.age < 1 || formData.age > 120) {
            newErrors.age = 'Please enter a valid age (1-120)';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }
        if (!formData.short_description.trim()) {
            newErrors.short_description = 'Description is required';
        }
        if (formData.short_description.length > 200) {
            newErrors.short_description =
                'Description must be 200 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onSubmit(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            occupation: '',
            age: 0,
            location: '',
            short_description: '',
            personality_traits: [],
            motivations: [],
            pain_points: [],
            custom_attributes: [],
        });
        setCurrentTrait('');
        setCurrentMotivation('');
        setCurrentPainPoint('');
        setCurrentAttrKey('');
        setCurrentAttrValue('');
        setErrors({});
        onClose();
    };

    const addTrait = () => {
        if (
            currentTrait.trim() &&
            !formData.personality_traits.includes(currentTrait.trim())
        ) {
            setFormData({
                ...formData,
                personality_traits: [
                    ...formData.personality_traits,
                    currentTrait.trim(),
                ],
            });
            setCurrentTrait('');
        }
    };

    const removeTrait = (trait: string) => {
        setFormData({
            ...formData,
            personality_traits: formData.personality_traits.filter(
                (t) => t !== trait,
            ),
        });
    };

    const addMotivation = () => {
        if (
            currentMotivation.trim() &&
            !formData.motivations.includes(currentMotivation.trim())
        ) {
            setFormData({
                ...formData,
                motivations: [
                    ...formData.motivations,
                    currentMotivation.trim(),
                ],
            });
            setCurrentMotivation('');
        }
    };

    const removeMotivation = (motivation: string) => {
        setFormData({
            ...formData,
            motivations: formData.motivations.filter((m) => m !== motivation),
        });
    };

    const addPainPoint = () => {
        if (
            currentPainPoint.trim() &&
            !formData.pain_points.includes(currentPainPoint.trim())
        ) {
            setFormData({
                ...formData,
                pain_points: [...formData.pain_points, currentPainPoint.trim()],
            });
            setCurrentPainPoint('');
        }
    };

    const removePainPoint = (painPoint: string) => {
        setFormData({
            ...formData,
            pain_points: formData.pain_points.filter((p) => p !== painPoint),
        });
    };

    const addCustomAttribute = () => {
        if (currentAttrKey.trim() && currentAttrValue.trim()) {
            const exists = formData.custom_attributes.some(
                (attr) =>
                    attr.key.toLowerCase() ===
                    currentAttrKey.trim().toLowerCase(),
            );
            if (!exists) {
                setFormData({
                    ...formData,
                    custom_attributes: [
                        ...formData.custom_attributes,
                        {
                            key: currentAttrKey.trim(),
                            value: currentAttrValue.trim(),
                        },
                    ],
                });
                setCurrentAttrKey('');
                setCurrentAttrValue('');
            }
        }
    };

    const removeCustomAttribute = (key: string) => {
        setFormData({
            ...formData,
            custom_attributes: formData.custom_attributes.filter(
                (attr) => attr.key !== key,
            ),
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size='lg'
            title='Create New Customer'
            footer={
                <div className='flex gap-4 w-full justify-end'>
                    <MagicButton
                        type='button'
                        variant='secondary'
                        onClick={handleClose}
                        disabled={isLoading}
                        className='w-auto px-8 bg-white/[0.03] border-white/10'
                    >
                        Cancel
                    </MagicButton>
                    <MagicButton
                        type='submit'
                        variant='primary'
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className='w-auto px-10'
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Customer'}
                    </MagicButton>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-400 mb-2 ml-1'>
                            Occupation *
                        </label>
                        <Input
                            type='text'
                            value={formData.occupation}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    occupation: e.target.value,
                                })
                            }
                            placeholder='e.g., Business Traveler'
                            error={errors.occupation}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-400 mb-2 ml-1'>
                            Age *
                        </label>
                        <Input
                            type='number'
                            value={formData.age || ''}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    age: parseInt(e.target.value) || 0,
                                })
                            }
                            placeholder='e.g., 35'
                            error={errors.age}
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-gray-400 mb-2 ml-1'>
                        Location *
                    </label>
                    <Input
                        type='text'
                        value={formData.location}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                location: e.target.value,
                            })
                        }
                        placeholder='e.g., Munich, Germany'
                        error={errors.location}
                    />
                </div>

                <div>
                    <label className='block text-sm font-semibold text-gray-400 mb-2 ml-1'>
                        Short Description *
                    </label>
                    <textarea
                        value={formData.short_description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                short_description: e.target.value,
                            })
                        }
                        placeholder='Brief description of this customer persona...'
                        rows={3}
                        className={`w-full px-4 py-2 bg-white/[0.03] border rounded-xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 outline-none transition-all text-sm text-white placeholder-gray-600 ${
                            errors.short_description
                                ? 'border-red-500/50'
                                : 'border-white/10'
                        }`}
                    />
                    <div className='flex justify-between items-center mt-1'>
                        {errors.short_description && (
                            <p className='text-xs text-red-600'>
                                {errors.short_description}
                            </p>
                        )}
                        <p className='text-xs text-gray-500 ml-auto'>
                            {formData.short_description.length}/200
                        </p>
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-gray-400 mb-3 ml-1'>
                        Personality Traits
                    </label>
                    <div className='flex gap-2 mb-2'>
                        <Input
                            type='text'
                            value={currentTrait}
                            onChange={(e) => setCurrentTrait(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTrait();
                                }
                            }}
                            placeholder='Add a trait...'
                        />
                        <MagicButton
                            type='button'
                            variant='secondary'
                            className='w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-white/[0.03] border-white/10'
                            onClick={addTrait}
                        >
                            <Plus className='w-5 h-5' />
                        </MagicButton>
                    </div>
                    {formData.personality_traits.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                            {formData.personality_traits.map((trait, index) => (
                                <span
                                    key={index}
                                    className='inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-full text-sm font-medium group'
                                >
                                    {trait}
                                    <button
                                        type='button'
                                        onClick={() => removeTrait(trait)}
                                        className='hover:text-blue-900 cursor-pointer'
                                    >
                                        <X className='w-3 h-3' />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className='block text-sm font-semibold text-gray-400 mb-3 ml-1'>
                        Motivations
                    </label>
                    <div className='flex gap-2 mb-2'>
                        <Input
                            type='text'
                            value={currentMotivation}
                            onChange={(e) =>
                                setCurrentMotivation(e.target.value)
                            }
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addMotivation();
                                }
                            }}
                            placeholder='Add a motivation...'
                        />
                        <MagicButton
                            type='button'
                            variant='secondary'
                            className='w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-white/[0.03] border-white/10'
                            onClick={addMotivation}
                        >
                            <Plus className='w-5 h-5' />
                        </MagicButton>
                    </div>
                    {formData.motivations.length > 0 && (
                        <ul className='space-y-2'>
                            {formData.motivations.map((motivation, index) => (
                                <li
                                    key={index}
                                    className='flex items-start gap-3 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-xl group'
                                >
                                    <span className='text-blue-600 mt-0.5'>
                                        •
                                    </span>
                                    <span className='flex-1'>{motivation}</span>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            removeMotivation(motivation)
                                        }
                                        className='text-gray-400 hover:text-gray-600 cursor-pointer'
                                    >
                                        <X className='w-4 h-4' />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className='block text-sm font-semibold text-gray-400 mb-3 ml-1'>
                        Custom Attributes
                        <span className='text-xs text-gray-500 ml-2 font-normal'>
                            (Add any domain-specific fields)
                        </span>
                    </label>
                    <div className='grid grid-cols-2 gap-2 mb-2'>
                        <Input
                            type='text'
                            value={currentAttrKey}
                            onChange={(e) => setCurrentAttrKey(e.target.value)}
                            placeholder='Field name (e.g., BahnCard)'
                        />
                        <div className='flex gap-2'>
                            <Input
                                type='text'
                                value={currentAttrValue}
                                onChange={(e) =>
                                    setCurrentAttrValue(e.target.value)
                                }
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addCustomAttribute();
                                    }
                                }}
                                placeholder='Value'
                            />
                            <MagicButton
                                type='button'
                                variant='secondary'
                                className='w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-white/[0.03] border-white/10'
                                onClick={addCustomAttribute}
                            >
                                <Plus className='w-5 h-5' />
                            </MagicButton>
                        </div>
                    </div>
                    {formData.custom_attributes.length > 0 && (
                        <div className='space-y-2'>
                            {formData.custom_attributes.map((attr, index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-3 text-sm bg-white/[0.02] border border-white/5 p-2 rounded-xl group'
                                >
                                    <span className='font-bold text-primary-400'>
                                        {attr.key}:
                                    </span>
                                    <span className='flex-1 text-gray-900'>
                                        {attr.value}
                                    </span>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            removeCustomAttribute(attr.key)
                                        }
                                        className='text-gray-400 hover:text-gray-600 cursor-pointer'
                                    >
                                        <X className='w-4 h-4' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className='block text-sm font-semibold text-gray-400 mb-3 ml-1'>
                        Pain Points
                    </label>
                    <div className='flex gap-2 mb-2'>
                        <Input
                            type='text'
                            value={currentPainPoint}
                            onChange={(e) =>
                                setCurrentPainPoint(e.target.value)
                            }
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addPainPoint();
                                }
                            }}
                            placeholder='Add a pain point...'
                        />
                        <MagicButton
                            type='button'
                            variant='secondary'
                            className='w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-white/[0.03] border-white/10'
                            onClick={addPainPoint}
                        >
                            <Plus className='w-5 h-5' />
                        </MagicButton>
                    </div>
                    {formData.pain_points.length > 0 && (
                        <ul className='space-y-2'>
                            {formData.pain_points.map((painPoint, index) => (
                                <li
                                    key={index}
                                    className='flex items-start gap-3 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-xl group'
                                >
                                    <span className='text-blue-600 mt-0.5'>
                                        •
                                    </span>
                                    <span className='flex-1'>{painPoint}</span>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            removePainPoint(painPoint)
                                        }
                                        className='text-gray-400 hover:text-gray-600 cursor-pointer'
                                    >
                                        <X className='w-4 h-4' />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
        </Modal>
    );
}
