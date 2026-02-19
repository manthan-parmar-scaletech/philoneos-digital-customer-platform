export type ConversationIntent =
    | 'free_chat'
    | 'product_feedback'
    | 'marketing_feedback'
    | 'strategic_initiative'
    | 'pain_points'
    | 'brainstorm';

export interface IntentOption {
    id: ConversationIntent;
    title: string;
    description: string;
    icon: string;
    inputLabel?: string;
    inputPlaceholder?: string;
}

export const intentOptions: IntentOption[] = [
    {
        id: 'free_chat',
        title: 'Just chat freely',
        description: 'Start an open conversation without structure',
        icon: 'MessageCircle',
    },
    {
        id: 'product_feedback',
        title: 'Get feedback on a product idea',
        description: 'Test your product concept with this customer',
        icon: 'Lightbulb',
        inputLabel: 'Describe your product idea',
        inputPlaceholder:
            'e.g., A mobile app that helps commuters find the fastest route...',
    },
    {
        id: 'marketing_feedback',
        title: 'Get feedback on marketing idea',
        description: 'Validate your marketing approach and messaging',
        icon: 'Target',
        inputLabel: 'Describe your marketing concept',
        inputPlaceholder:
            'e.g., A campaign focused on sustainability and eco-friendly travel...',
    },
    {
        id: 'strategic_initiative',
        title: 'Discuss strategic initiative',
        description: 'Explore a strategic business initiative',
        icon: 'TrendingUp',
        inputLabel: 'What initiative would you like to discuss?',
        inputPlaceholder:
            'e.g., Expanding our service to include international routes...',
    },
    {
        id: 'pain_points',
        title: 'Explore pain points',
        description: 'Understand customer challenges and frustrations',
        icon: 'AlertCircle',
        inputLabel: 'What area would you like to explore?',
        inputPlaceholder:
            'e.g., Current challenges with booking train tickets online...',
    },
    {
        id: 'brainstorm',
        title: 'Brainstorm ideas',
        description: 'Generate and explore new ideas together',
        icon: 'Sparkles',
        inputLabel: 'What topic would you like to brainstorm?',
        inputPlaceholder:
            'e.g., Ways to improve the customer experience at train stations...',
    },
];

export function generatePromptFromIntent(
    intent: ConversationIntent,
    userInput: string,
): string {
    const templates: Record<ConversationIntent, string> = {
        free_chat: '',
        product_feedback: `I'd like to get your feedback on a product idea. Here's what I'm thinking: ${userInput}\n\nWhat are your thoughts on this? Would this be something that interests you? What concerns or questions do you have?`,
        marketing_feedback: `I'd like your perspective on a marketing concept we're developing. Here's the idea: ${userInput}\n\nHow does this resonate with you? What would make you pay attention to this? What might turn you off?`,
        strategic_initiative: `I'd like to discuss a strategic initiative we're considering: ${userInput}\n\nFrom your perspective, what opportunities or challenges do you see with this? How might this impact you?`,
        pain_points: `I'd like to better understand your experience and challenges in this area: ${userInput}\n\nCan you walk me through what frustrates you most about this? What would make your life easier?`,
        brainstorm: `I'd like to brainstorm with you about: ${userInput}\n\nWhat ideas come to mind? What have you wished existed? What would be your ideal solution?`,
    };

    return templates[intent] || userInput;
}
