'use client'

import { Badge } from '@/components/ui/badge'
import { useRealtimeLatency } from '@/hooks/use-realtime-latency'

export const LatencyIndicator = () => {
  const { latency, status } = useRealtimeLatency()

  const variant = status === 'connected' ? 'default' : status === 'error' ? 'destructive' : 'secondary'
  const latencyDisplay = latency > 0 ? `${latency.toFixed(0)}ms` : '...'

  return (
    <Badge variant={variant}>
      {status === 'connected' ? `Latency: ${latencyDisplay}` : status}
    </Badge>
  )
}
