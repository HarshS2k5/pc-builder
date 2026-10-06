import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { AnalyticsEvent, AnalyticsEventType } from '@/types/pc-builder'

const DATA_FILE = path.join(process.cwd(), '.data', 'analytics.json')
const ADMIN_KEY = process.env.ADMIN_REPORTS_KEY || 'gamerank-admin-2026'

interface AnalyticsStore {
  summary: Record<AnalyticsEventType, number>
  retailerClicks: Record<string, number>
  recentEvents: AnalyticsEvent[]
}

function getStore(): AnalyticsStore {
  const dir = path.join(process.cwd(), '.data')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    } catch {
      // Fallback below
    }
  }

  return {
    summary: {
      check_price_clicked: 0,
      build_created: 0,
      build_completed: 0,
      comparison_viewed: 0,
      recommendation_generated: 0,
      preset_loaded: 0,
      report_exported: 0,
    },
    retailerClicks: {},
    recentEvents: [],
  }
}

function saveStore(store: AnalyticsStore) {
  try {
    const dir = path.join(process.cwd(), '.data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed writing analytics.json:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, metadata } = body

    const validTypes: AnalyticsEventType[] = [
      'check_price_clicked',
      'build_created',
      'build_completed',
      'comparison_viewed',
      'recommendation_generated',
      'preset_loaded',
      'report_exported',
    ]

    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ success: false, message: 'Invalid event type' }, { status: 400 })
    }

    const eventType = type as AnalyticsEventType
    const store = getStore()
    store.summary[eventType] = (store.summary[eventType] || 0) + 1

    if (eventType === 'check_price_clicked' && metadata?.retailer) {
      const r = String(metadata.retailer)
      store.retailerClicks[r] = (store.retailerClicks[r] || 0) + 1
    }

    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: eventType,
      timestamp: new Date().toISOString(),
      metadata: typeof metadata === 'object' && metadata !== null ? metadata : {},
    }

    // Keep only last 200 events in memory/disk
    store.recentEvents.unshift(event)
    if (store.recentEvents.length > 200) {
      store.recentEvents = store.recentEvents.slice(0, 200)
    }

    saveStore(store)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const key =
    request.nextUrl.searchParams.get('key') ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const store = getStore()
  return NextResponse.json({
    success: true,
    data: store,
  })
}
