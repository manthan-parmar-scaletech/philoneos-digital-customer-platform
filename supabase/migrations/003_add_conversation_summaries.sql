-- Create conversation_summaries table
CREATE TABLE conversation_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    summary_json JSONB NOT NULL,
    message_count_at_generation INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(conversation_id)
);

-- Enable RLS on conversation_summaries
ALTER TABLE conversation_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for conversation_summaries
CREATE POLICY "Companies can only access their own conversation summaries" ON conversation_summaries
    FOR ALL USING (
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE company_id = auth.uid()
        )
    );

-- Create index for better performance
CREATE INDEX idx_conversation_summaries_conversation_id ON conversation_summaries(conversation_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_conversation_summaries_updated_at
    BEFORE UPDATE ON conversation_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
