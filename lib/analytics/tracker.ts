import { AnalyticsEventType } from '@/types/pc-builder'

/**
 * Client-side anonymous event dispatcher.
 * Never collects cookies, fingerprints, or personal identifiers.
 */
export function trackAnalyticsEvent(
  type: AnalyticsEventType,
  metadata: Record<string, string | number | boolean | undefined> = {}
): void {
  if (typeof window === 'undefined') return

  try {
    const payload = {
      type,
      metadata,
      timestamp: new Date().toISOString(),
    }

    // Use sendBeacon if available, otherwise fetch
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/events', blob)
    } else {
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    }
  } catch (err) {
    // Fail silently without disrupting user UX
  }
}
