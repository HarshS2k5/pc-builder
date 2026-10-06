import { NextRequest, NextResponse } from 'next/server'
import {
  getMonetizationSettings,
  saveMonetizationSettings,
  DEFAULT_MONETIZATION_SETTINGS,
} from '@/lib/pc-builder/monetization-config'
import { SponsoredPlacement, MonetizationSettings } from '@/types/pc-builder'

const ADMIN_KEY = process.env.ADMIN_REPORTS_KEY || 'gamerank-admin-2026'

export async function GET(request: NextRequest) {
  const key =
    request.nextUrl.searchParams.get('key') ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized: Valid admin key required' }, { status: 401 })
  }

  const settings = getMonetizationSettings()
  return NextResponse.json({
    success: true,
    settings,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, settings, sponsored } = body

    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized: Valid admin key required' }, { status: 401 })
    }

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 })
    }

    const success = saveMonetizationSettings(settings, sponsored || [])
    if (!success) {
      return NextResponse.json({ error: 'Failed to persist settings' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Monetization settings updated successfully',
    })
  } catch (err) {
    console.error('Error saving monetization settings:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
