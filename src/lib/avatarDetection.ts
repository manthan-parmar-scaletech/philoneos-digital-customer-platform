/**
 * Detects the appropriate avatar type based on persona information
 * Returns avatar emoji or identifier for man, woman, child, etc.
 */

export type AvatarType = 'man' | 'woman' | 'boy' | 'girl' | 'neutral';

interface PersonaInfo {
    name?: string;
    occupation?: string;
    age?: number;
    description?: string;
    gender?: string;
}

// Common name patterns for gender detection
const maleNamePatterns = [
    'john',
    'michael',
    'david',
    'james',
    'robert',
    'william',
    'richard',
    'thomas',
    'charles',
    'daniel',
    'matthew',
    'mark',
    'donald',
    'paul',
    'steven',
    'andrew',
    'kenneth',
    'george',
    'joshua',
    'kevin',
    'brian',
    'edward',
    'ronald',
    'timothy',
    'jason',
    'jeffrey',
    'ryan',
    'jacob',
    'gary',
    'nicholas',
    'eric',
    'jonathan',
    'stephen',
    'larry',
    'justin',
    'scott',
    'brandon',
    'benjamin',
    'samuel',
    'raymond',
    'gregory',
    'frank',
    'alexander',
    'patrick',
    'jack',
    'dennis',
    'jerry',
    'tyler',
    'aaron',
    'jose',
    'adam',
    'henry',
    'nathan',
    'douglas',
    'zachary',
    'peter',
    'kyle',
    'walter',
    'ethan',
    'jeremy',
    'harold',
    'keith',
    'christian',
    'roger',
    'noah',
    'gerald',
    'carl',
    'terry',
    'sean',
    'austin',
    'arthur',
    'lawrence',
    'jesse',
    'dylan',
    'bryan',
    'joe',
    'jordan',
    'billy',
    'bruce',
    'albert',
    'willie',
    'gabriel',
    'logan',
    'alan',
    'juan',
    'wayne',
    'roy',
    'ralph',
    'randy',
    'eugene',
    'vincent',
    'russell',
    'elijah',
    'louis',
    'bobby',
    'philip',
    'johnny',
    'bradley',
    'mr',
    'sir',
    'hans',
    'klaus',
    'ahmed',
    'mohammed',
    'ali',
    'omar',
    'hassan',
    'ibrahim',
    'yusuf',
];

const femaleNamePatterns = [
    'mary',
    'patricia',
    'jennifer',
    'linda',
    'barbara',
    'elizabeth',
    'susan',
    'jessica',
    'sarah',
    'karen',
    'nancy',
    'lisa',
    'betty',
    'margaret',
    'sandra',
    'ashley',
    'kimberly',
    'emily',
    'donna',
    'michelle',
    'dorothy',
    'carol',
    'amanda',
    'melissa',
    'deborah',
    'stephanie',
    'rebecca',
    'sharon',
    'laura',
    'cynthia',
    'kathleen',
    'amy',
    'angela',
    'shirley',
    'anna',
    'brenda',
    'pamela',
    'emma',
    'nicole',
    'helen',
    'samantha',
    'katherine',
    'christine',
    'debra',
    'rachel',
    'carolyn',
    'janet',
    'catherine',
    'maria',
    'heather',
    'diane',
    'ruth',
    'julie',
    'olivia',
    'joyce',
    'virginia',
    'victoria',
    'kelly',
    'lauren',
    'christina',
    'joan',
    'evelyn',
    'judith',
    'megan',
    'andrea',
    'cheryl',
    'hannah',
    'jacqueline',
    'martha',
    'gloria',
    'teresa',
    'ann',
    'sara',
    'madison',
    'frances',
    'kathryn',
    'janice',
    'jean',
    'abigail',
    'sophia',
    'alice',
    'judy',
    'isabella',
    'charlotte',
    'grace',
    'natalie',
    'rose',
    'diana',
    'brittany',
    'danielle',
    'theresa',
    'sophie',
    'marie',
    'mrs',
    'ms',
    'miss',
    'dr',
    'anna',
    'elena',
    'fatima',
    'aisha',
    'zainab',
    'mariam',
];

// Gender indicators in text
const maleIndicators = [
    'he',
    'him',
    'his',
    'himself',
    'man',
    'male',
    'boy',
    'son',
    'father',
    'dad',
    'husband',
    'brother',
    'uncle',
    'grandfather',
    'mr',
    'sir',
    'gentleman',
    'guy',
    'dude',
    'king',
    'prince',
];

const femaleIndicators = [
    'she',
    'her',
    'hers',
    'herself',
    'woman',
    'female',
    'girl',
    'daughter',
    'mother',
    'mom',
    'wife',
    'sister',
    'aunt',
    'grandmother',
    'mrs',
    'ms',
    'miss',
    'lady',
    'gal',
    'queen',
    'princess',
];

// Occupation-based gender hints (not stereotyping, just common patterns)
const maleOccupations = [
    'ceo',
    'cto',
    'engineer',
    'developer',
    'mechanic',
    'construction',
    'firefighter',
    'policeman',
    'businessman',
    'salesman',
];

const femaleOccupations = [
    'nurse',
    'teacher',
    'secretary',
    'receptionist',
    'businesswoman',
    'saleswoman',
    'policewoman',
];

/**
 * Analyzes persona information to detect gender
 */
function detectGender(info: PersonaInfo): 'male' | 'female' | 'unknown' {
    let maleScore = 0;
    let femaleScore = 0;

    // Check explicit gender field
    if (info.gender) {
        const gender = info.gender.toLowerCase();
        if (gender.includes('male') && !gender.includes('female'))
            return 'male';
        if (gender.includes('female')) return 'female';
    }

    // Check name
    if (info.name) {
        const nameLower = info.name.toLowerCase();

        for (const pattern of maleNamePatterns) {
            if (nameLower.includes(pattern)) {
                maleScore += 3;
                break;
            }
        }

        for (const pattern of femaleNamePatterns) {
            if (nameLower.includes(pattern)) {
                femaleScore += 3;
                break;
            }
        }
    }

    // Check occupation
    if (info.occupation) {
        const occupationLower = info.occupation.toLowerCase();

        for (const pattern of maleOccupations) {
            if (occupationLower.includes(pattern)) {
                maleScore += 1;
            }
        }

        for (const pattern of femaleOccupations) {
            if (occupationLower.includes(pattern)) {
                femaleScore += 1;
            }
        }
    }

    // Check description
    if (info.description) {
        const descLower = info.description.toLowerCase();

        for (const indicator of maleIndicators) {
            const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
            const matches = descLower.match(regex);
            if (matches) {
                maleScore += matches.length;
            }
        }

        for (const indicator of femaleIndicators) {
            const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
            const matches = descLower.match(regex);
            if (matches) {
                femaleScore += matches.length;
            }
        }
    }

    // Determine gender based on scores
    if (maleScore > femaleScore && maleScore > 0) return 'male';
    if (femaleScore > maleScore && femaleScore > 0) return 'female';
    return 'unknown';
}

/**
 * Determines the appropriate avatar type for a persona
 */
export function getAvatarType(info: PersonaInfo): AvatarType {
    const gender = detectGender(info);
    const age = info.age || 0;

    // Determine if child (under 18)
    const isChild = age > 0 && age < 18;

    if (gender === 'male') {
        return isChild ? 'boy' : 'man';
    } else if (gender === 'female') {
        return isChild ? 'girl' : 'woman';
    }

    // Default to neutral if gender cannot be determined
    return 'neutral';
}

/**
 * Returns the appropriate avatar emoji for the avatar type
 */
export function getAvatarEmoji(avatarType: AvatarType): string {
    const emojiMap: Record<AvatarType, string> = {
        man: '👨',
        woman: '👩',
        boy: '👦',
        girl: '👧',
        neutral: '👤',
    };

    return emojiMap[avatarType];
}

/**
 * Returns a more diverse set of avatar emojis based on type
 */
export function getRandomAvatarEmoji(avatarType: AvatarType): string {
    const emojiSets: Record<AvatarType, string[]> = {
        man: ['👨', '👨‍💼', '👨‍💻', '👨‍🔧', '👨‍⚕️', '👨‍🎓', '🧔', '👨‍🦰', '👨‍🦱', '👨‍🦳'],
        woman: ['👩', '👩‍💼', '👩‍💻', '👩‍🔧', '👩‍⚕️', '👩‍🎓', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👱‍♀️'],
        boy: ['👦', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿', '🧒'],
        girl: ['👧', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿', '🧒'],
        neutral: ['👤', '🧑', '😊', '🙂', '👥'],
    };

    const emojis = emojiSets[avatarType];
    // Use a deterministic selection based on avatar type for consistency
    return emojis[0];
}

// Premium 3D Animated/Illustrated Avatar Collection (Microsoft Fluent UI style)
const AVATAR_COLLECTION = {
    male: [
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Office%20Worker.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Technologist.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Teacher.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Student.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Mechanic.png',
    ],
    female: [
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Office%20Worker.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Technologist.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Teacher.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Student.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Mechanic.png',
    ],
    neutral: [
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person.png',
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20Office%20Worker.png',
    ]
};

/**
 * Gets avatar URL from our curated collection or fallback to DiceBear
 * Uses a simple hash of the seed to deterministically pick an image
 */
export function getAvatarUrl(info: PersonaInfo): string {
    const avatarType = getAvatarType(info);
    const seed = info.name || info.occupation || 'default';

    // Create a simple numeric hash from the seed string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    hash = Math.abs(hash);

    // Select collection based on type
    let collection = AVATAR_COLLECTION.neutral;
    if (avatarType === 'man' || avatarType === 'boy') {
        collection = AVATAR_COLLECTION.male;
    } else if (avatarType === 'woman' || avatarType === 'girl') {
        collection = AVATAR_COLLECTION.female;
    }

    // Pick image using modulo
    const index = hash % collection.length;
    return collection[index];
}
