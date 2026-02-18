-- Create companies table
CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    primary_color TEXT,
    public_context_text TEXT,
    industry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create personas table
CREATE TABLE personas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    short_description TEXT NOT NULL,
    persona_parameters_json JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create conversations table
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for companies
CREATE POLICY "Companies can only access their own data" ON companies
    FOR ALL USING (auth.uid() = id);

-- Create RLS policies for personas
CREATE POLICY "Companies can only access their own personas" ON personas
    FOR ALL USING (auth.uid() = company_id);

-- Create RLS policies for conversations
CREATE POLICY "Companies can only access their own conversations" ON conversations
    FOR ALL USING (auth.uid() = company_id);

-- Create RLS policies for messages
CREATE POLICY "Companies can only access their own messages" ON messages
    FOR ALL USING (
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE company_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_personas_company_id ON personas(company_id);
CREATE INDEX idx_conversations_company_id ON conversations(company_id);
CREATE INDEX idx_conversations_persona_id ON conversations(persona_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
