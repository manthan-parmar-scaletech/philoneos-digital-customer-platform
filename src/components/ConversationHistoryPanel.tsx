import { Plus, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import type { Conversation } from '@/types';
import { Button } from './ui/Button';

interface ConversationHistoryPanelProps {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    onConversationSelect: (conversation: Conversation) => void;
    onNewConversation: () => void;
}

export default function ConversationHistoryPanel({
    conversations,
    selectedConversation,
    onConversationSelect,
    onNewConversation,
}: ConversationHistoryPanelProps) {
    return (
        <div className='w-80 border-r border-white/5 bg-white/[0.01] backdrop-blur-3xl flex flex-col h-full overflow-hidden'>
            {/* Header */}
            <div className='p-6 border-b border-white/5'>
                <h2 className='text-[11px] font-bold text-white/40 mb-4 uppercase tracking-[0.2em]'>
                    Your Conversations
                </h2>
                <Button
                    variant='primary'
                    size='sm'
                    className='w-full bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-2.5 font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300'
                    onClick={onNewConversation}
                >
                    <Plus className='w-4 h-4 mr-2' />
                    New Interaction
                </Button>
            </div>

            {/* Conversations List */}
            <div className='flex-1 overflow-y-auto p-3 custom-scrollbar'>
                <div className='space-y-1.5'>
                    {conversations.length === 0 ? (
                        <div className='text-center py-16 px-4'>
                            <div className='w-12 h-12 bg-white/[0.03] backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5'>
                                <MessageSquare className='w-6 h-6 text-white/20' />
                            </div>
                            <p className='text-xs text-white/30 font-bold uppercase tracking-widest'>
                                No history yet
                            </p>
                        </div>
                    ) : (
                        conversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() =>
                                    onConversationSelect(conversation)
                                }
                                className={clsx(
                                    'w-full text-left p-3.5 rounded-xl transition-all duration-500 group relative overflow-hidden cursor-pointer',
                                    selectedConversation?.id === conversation.id
                                        ? 'bg-white/[0.05] border border-white/10 shadow-2xl'
                                        : 'hover:bg-white/[0.02] border border-transparent hover:border-white/5',
                                )}
                            >
                                {/* Active Glow Effect */}
                                {selectedConversation?.id === conversation.id && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-transparent opacity-50" />
                                )}

                                <div className='flex items-start gap-3 relative z-10'>
                                    <div className={clsx(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                                        selectedConversation?.id === conversation.id 
                                            ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" 
                                            : "bg-white/5 text-white/30 group-hover:bg-white/10"
                                    )}>
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p
                                            className={clsx(
                                                'text-[13px] font-bold truncate transition-colors duration-300',
                                                selectedConversation?.id ===
                                                    conversation.id
                                                    ? 'text-white'
                                                    : 'text-white/60 group-hover:text-white',
                                            )}
                                        >
                                            {conversation.title || 'Untitled Chat'}
                                        </p>
                                        <p className='text-[10px] text-white/30 mt-1 font-bold uppercase tracking-wider'>
                                            {new Date(
                                                conversation.created_at,
                                            ).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
