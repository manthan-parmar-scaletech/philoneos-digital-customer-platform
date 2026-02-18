export interface Company {
    id: string;
    name: string;
    logo_url?: string;
    primary_color?: string;
    public_context_text?: string;
    industry?: string;
    created_at: string;
}

export interface Persona {
    id: string;
    company_id: string;
    name: string;
    avatar_url?: string;
    short_description: string;
    persona_parameters_json: Record<string, unknown>;
    created_at: string;
}

export interface Conversation {
    id: string;
    company_id: string;
    persona_id: string;
    title: string;
    created_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export interface AuthUser {
    id: string;
    company_id: string;
    email?: string;
}
