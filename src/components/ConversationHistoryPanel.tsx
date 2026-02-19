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
        <div className='w-80 border-r border-gray-200 bg-white flex flex-col h-full overflow-hidden'>
            {/* Header */}
            <div className='p-4 border-b border-gray-100'>
                <h2 className='text-sm font-semibold text-gray-900 mb-3'>
                    Your Chats
                </h2>
                <Button
                    variant='primary'
                    size='sm'
                    className='w-full'
                    onClick={onNewConversation}
                >
                    <Plus className='w-4 h-4 mr-2' />
                    New Chat
                </Button>
            </div>

            {/* Conversations List */}
            <div className='flex-1 overflow-y-auto p-2'>
                <div className='space-y-1'>
                    {conversations.length === 0 ? (
                        <div className='text-center py-8 px-4'>
                            <MessageSquare className='w-8 h-8 text-gray-300 mx-auto mb-2' />
                            <p className='text-sm text-gray-500'>
                                No conversations yet
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
                                    'w-full text-left p-3 rounded-lg transition-all duration-200',
                                    selectedConversation?.id === conversation.id
                                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                        : 'hover:bg-gray-50 border border-transparent',
                                )}
                            >
                                <div className='flex items-start gap-2'>
                                    <MessageSquare
                                        className={clsx(
                                            'w-4 h-4 mt-0.5 shrink-0',
                                            selectedConversation?.id ===
                                                conversation.id
                                                ? 'text-blue-600'
                                                : 'text-gray-400',
                                        )}
                                    />
                                    <div className='flex-1 min-w-0'>
                                        <p
                                            className={clsx(
                                                'text-sm font-medium truncate',
                                                selectedConversation?.id ===
                                                    conversation.id
                                                    ? 'text-blue-900'
                                                    : 'text-gray-900',
                                            )}
                                        >
                                            {conversation.title}
                                        </p>
                                        <p className='text-xs text-gray-500 mt-0.5'>
                                            {new Date(
                                                conversation.created_at,
                                            ).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
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
