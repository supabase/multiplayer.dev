'use client'

import { createClient } from '@/lib/supabase/client'
import { EMOJIS } from '@/lib/emojis'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseRealtimeChatProps {
  roomName: string
  username: string
}

export interface ChatMessage {
  id: string
  content: string
  username: string
  createdAt: string
  replayed: boolean
}

export interface Reaction {
  id: string
  index: number
  createdAt: number
}

const EVENT_MESSAGE_TYPE = 'message'
const EVENT_EMOJI_TYPE = 'emoji'
const REACTION_TTL_MS = 2500

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)

  const twelveHours = 12 * 60 * 60 * 1000
  const twelveHoursAgo = Date.now() - twelveHours

 const [isConnected, setIsConnected] = useState(false)

  const reactionTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const pushReaction = useCallback((reaction: Reaction) => {
    setReactions((current) => [...current, reaction])
    const timeout = setTimeout(() => {
      setReactions((current) => current.filter((r) => r.id !== reaction.id))
      reactionTimeouts.current.delete(reaction.id)
    }, REACTION_TTL_MS)
    reactionTimeouts.current.set(reaction.id, timeout)
  }, [])

  useEffect(() => {
    const config = { private: true, broadcast: { replay: { since: twelveHoursAgo, limit: 10 } } }
    const newChannel = supabase.channel(roomName, { config })

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const chatMessage = payload.payload as ChatMessage
        chatMessage.replayed = payload?.meta?.replayed ?? false
        setMessages((current) => [...current, chatMessage])
      })
      .on('broadcast', { event: EVENT_EMOJI_TYPE }, (payload) => {
        const buf = payload.payload as ArrayBuffer
        if (!(buf instanceof ArrayBuffer) || buf.byteLength < 1) return
        const index = new Uint8Array(buf)[0]
        if (index >= EMOJIS.length) return
        pushReaction({ id: crypto.randomUUID(), index, createdAt: Date.now() })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
      setIsConnected(false)
      reactionTimeouts.current.forEach((t) => clearTimeout(t))
      reactionTimeouts.current.clear()
    }
  }, [roomName, username, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        username,
        createdAt: new Date().toISOString(),
        replayed: false
      }

      // Update local state immediately for the sender
      setMessages((current) => [...current, message])

      await supabase.from('new_messages').insert([
        {
          id: message.id,
          content,
          username,
          room: roomName
        },
      ])
    },
    [channel, isConnected, username]
  )

  const sendEmoji = useCallback(
    (index: number) => {
      if (!channel || !isConnected) return
      if (index < 0 || index >= EMOJIS.length) return

      channel.send({
        type: 'broadcast',
        event: EVENT_EMOJI_TYPE,
        payload: new Uint8Array([index]).buffer,
      })

      pushReaction({ id: crypto.randomUUID(), index, createdAt: Date.now() })
    },
    [channel, isConnected, pushReaction]
  )

  const isBinaryCapable = supabase.realtime.vsn === '2.0.0'

  return { messages, sendMessage, isConnected, reactions, sendEmoji, isBinaryCapable }
}
