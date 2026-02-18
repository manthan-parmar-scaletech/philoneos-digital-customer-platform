import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
        baseURL: 'https://api.openai.com/v1',
    });
    try {
        const { personaId, message, conversationHistory } =
            await request.json();

        // Verify authentication
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set() {},
                    remove() {},
                },
            },
        );

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        // Fetch persona and company data
        const { data: persona } = await supabase
            .from('personas')
            .select('*')
            .eq('id', personaId)
            .eq('company_id', session.user.id)
            .single();

        if (!persona) {
            return NextResponse.json(
                { error: 'Persona not found' },
                { status: 404 },
            );
        }

        const { data: company } = await supabase
            .from('companies')
            .select('*')
            .eq('id', session.user.id)
            .single();

        // Build system prompt
        const systemPrompt = `You are ${persona.name}, a synthetic customer persona.

Persona Details:
${JSON.stringify(persona.persona_parameters_json, null, 2)}

Company Context:
${company?.public_context_text || 'No specific company context provided.'}

Conversation History:
${conversationHistory.map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`).join('\n')}

Instructions:
- Stay in character as ${persona.name}
- Respond based on your persona motivations and fears
- Only use information that would be publicly known or provided in this conversation
- Do not assume access to internal company information
- Maintain consistent behavior throughout the conversation
- Be helpful but authentic to your persona

Current message from company representative: ${message}

Respond as ${persona.name}:`;

        // Generate AI response
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message },
                ],
                temperature: 0.7,
                max_tokens: 500,
            });

            const aiResponse =
                completion.choices[0]?.message?.content ||
                'I apologize, but I cannot respond at the moment.';

            return NextResponse.json({ response: aiResponse });
        } catch (openaiError: unknown) {
            // If OpenAI quota exceeded, return a mock response for testing
            if (
                openaiError &&
                typeof openaiError === 'object' &&
                'status' in openaiError &&
                openaiError.status === 429
            ) {
                const mockResponse = `[MOCK RESPONSE - OpenAI quota exceeded] 

Hello! I'm ${persona.name}. ${persona.short_description}

I understand you're reaching out from ${company?.name}. While I'd love to have a detailed conversation, it seems there's a technical issue preventing me from responding fully right now.

To enable real AI responses, please add credits to your OpenAI account at: https://platform.openai.com/account/billing

For now, this is a mock response to help you test the application flow.`;

                return NextResponse.json({ response: mockResponse });
            }
            throw openaiError;
        }
    } catch (error) {
        console.error('Error generating AI response:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 },
        );
    }
}
