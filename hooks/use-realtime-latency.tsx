'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export const useRealtimeLatency = () => {
  const [latency, setLatency] = useState<number>(0)
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('connected')

  useEffect(() => {
    // Set up the heartbeat callback
    supabase.realtime.onHeartbeat((heartbeatStatus: string, heartbeatLatency?: number) => {
      if (heartbeatStatus === 'ok' && heartbeatLatency !== undefined) {
        setLatency(heartbeatLatency)
        setStatus('connected')
      } else if (heartbeatStatus === 'error') {
        setStatus('error')
      } else if (heartbeatStatus === 'timeout') {
        setStatus('error')
      } else if (heartbeatStatus === 'disconnected') {
        setStatus('disconnected')
        setLatency(0)
      }
    })


    // Cleanup: reset callback to noop on unmount
    return () => {
      supabase.realtime.onHeartbeat(() => {})
    }
  }, [])

  return { latency, status }
}

// LatencyIndicator.tsx
