'use client'

import { EMOJIS } from '@/lib/emojis'
import type { Reaction } from '@/hooks/use-realtime-chat'

interface FloatingReactionsProps {
  reactions: Reaction[]
}

const horizontalPercent = (id: string) => {
  let sum = 0
  for (let i = 0; i < id.length; i++) sum = (sum + id.charCodeAt(i)) % 1000
  return 10 + (sum % 80)
}

export const FloatingReactions = ({ reactions }: FloatingReactionsProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {reactions.map((reaction) => {
        const emoji = EMOJIS[reaction.index]
        if (!emoji) return null
        return (
          <span
            key={reaction.id}
            style={{ left: `${horizontalPercent(reaction.id)}%`, bottom: '8px' }}
            className="animate-reaction-float absolute select-none text-2xl"
          >
            {emoji}
          </span>
        )
      })}
    </div>
  )
}
