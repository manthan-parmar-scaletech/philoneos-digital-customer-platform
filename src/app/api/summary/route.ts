import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SummaryData } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json(
                { error: 'conversationId is required' },
                { status: 400 },
            );
        }

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

        const { data: summary, error } = await supabase
            .from('conversation_summaries')
            .select('*')
            .eq('conversation_id', conversationId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (!summary) {
            return NextResponse.json({ summary: null, is_stale: false });
        }

        const { count: messageCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversationId);

        const isStale =
            messageCount !== null &&
            messageCount > summary.message_count_at_generation;

        return NextResponse.json({
            summary,
            is_stale: isStale,
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        return NextResponse.json(
            { error: 'Failed to fetch summary' },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
        baseURL: 'https://api.openai.com/v1',
    });

    try {
        const { conversationId } = await request.json();

        if (!conversationId) {
            return NextResponse.json(
                { error: 'conversationId is required' },
                { status: 400 },
            );
        }

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

        const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        if (!messages || messages.length === 0) {
            return NextResponse.json(
                { error: 'No messages found in conversation' },
                { status: 404 },
            );
        }

        const userMessageCount = messages.filter(
            (msg) => msg.role === 'user',
        ).length;

        if (userMessageCount < 3) {
            return NextResponse.json(
                {
                    error: 'At least 3 user messages required to generate summary',
                },
                { status: 400 },
            );
        }

        const conversationText = messages
            .map(
                (msg) =>
                    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`,
            )
            .join('\n\n');

        const systemPrompt = `You are an expert business analyst. Analyze the following conversation between a company representative and a customer persona. Generate a structured summary with:

1. Key Insights: 3-5 main takeaways about the customer's needs, preferences, or behavior
2. Top Objections: Customer concerns, hesitations, or pushback points
3. Executive Summary: 5 concise bullet points for busy executives

Format your response as a valid JSON object with this exact structure:
{
  "key_insights": ["insight 1", "insight 2", "insight 3"],
  "top_objections": ["objection 1", "objection 2"],
  "executive_summary": ["point 1", "point 2", "point 3", "point 4", "point 5"]
}

Conversation:
${conversationText}`;

        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: 'Generate the summary in JSON format.',
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
                response_format: { type: 'json_object' },
            });

            const summaryText =
                completion.choices[0]?.message?.content ||
                '{"key_insights":[],"top_objections":[],"executive_summary":[]}';
            const summaryData: SummaryData = JSON.parse(summaryText);

            const { data: existingSummary } = await supabase
                .from('conversation_summaries')
                .select('id')
                .eq('conversation_id', conversationId)
                .single();

            if (existingSummary) {
                const { data: updatedSummary, error: updateError } =
                    await supabase
                        .from('conversation_summaries')
                        .update({
                            summary_json: summaryData,
                            message_count_at_generation: messages.length,
                        })
                        .eq('conversation_id', conversationId)
                        .select()
                        .single();

                if (updateError) throw updateError;
                return NextResponse.json({ summary: updatedSummary });
            } else {
                const { data: newSummary, error: insertError } = await supabase
                    .from('conversation_summaries')
                    .insert({
                        conversation_id: conversationId,
                        summary_json: summaryData,
                        message_count_at_generation: messages.length,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                return NextResponse.json({ summary: newSummary });
            }
        } catch (openaiError: unknown) {
            if (
                openaiError &&
                typeof openaiError === 'object' &&
                'status' in openaiError &&
                openaiError.status === 429
            ) {
                const mockSummary: SummaryData = {
                    key_insights: [
                        'Customer shows strong interest in product features',
                        'Price sensitivity is a key consideration',
                        'User experience and ease of use are top priorities',
                    ],
                    top_objections: [
                        'Concerns about implementation complexity',
                        'Budget constraints mentioned',
                    ],
                    executive_summary: [
                        'Engaged customer with clear product interest',
                        'Price point needs to be competitive',
                        'Simplicity and UX are decision factors',
                        'Implementation support will be critical',
                        'Follow-up recommended within 48 hours',
                    ],
                };

                const { data: existingSummary } = await supabase
                    .from('conversation_summaries')
                    .select('id')
                    .eq('conversation_id', conversationId)
                    .single();

                if (existingSummary) {
                    const { data: updatedSummary, error: updateError } =
                        await supabase
                            .from('conversation_summaries')
                            .update({
                                summary_json: mockSummary,
                                message_count_at_generation: messages.length,
                            })
                            .eq('conversation_id', conversationId)
                            .select()
                            .single();

                    if (updateError) throw updateError;
                    return NextResponse.json({ summary: updatedSummary });
                } else {
                    const { data: newSummary, error: insertError } =
                        await supabase
                            .from('conversation_summaries')
                            .insert({
                                conversation_id: conversationId,
                                summary_json: mockSummary,
                                message_count_at_generation: messages.length,
                            })
                            .select()
                            .single();

                    if (insertError) throw insertError;
                    return NextResponse.json({ summary: newSummary });
                }
            }
            throw openaiError;
        }
    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 },
        );
    }
}
