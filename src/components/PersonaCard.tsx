import Image from 'next/image'
import type { Persona } from '@/types'
import { MessageCircle } from 'lucide-react'

interface PersonaCardProps {
  persona: Persona
  primaryColor?: string
}

export default function PersonaCard({ persona, primaryColor }: PersonaCardProps) {
  const handleStartConversation = () => {
    window.location.href = `/chat/${persona.id}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start mb-4">
        {persona.avatar_url ? (
          <Image
            src={persona.avatar_url}
            alt={persona.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mr-3"
          />
        ) : (
          <div 
            className="w-12 h-12 rounded-full mr-3 flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: primaryColor || '#6366f1' }}
          >
            {persona.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{persona.name}</h3>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {persona.short_description}
      </p>
      
      <button
        onClick={handleStartConversation}
        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white transition-colors"
        style={{ backgroundColor: primaryColor || '#6366f1' }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = '0.9'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Start Conversation
      </button>
    </div>
  )
}
