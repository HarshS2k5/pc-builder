import { NextRequest, NextResponse } from 'next/server'
import {
  createReport,
  getAllReports,
  updateReportStatus,
  deleteReport,
} from '@/lib/reports/report-store'
import { IssueStatus } from '@/types/report'

// Secret key for admin dashboard access (can be overridden via environment variable)
const ADMIN_KEY = process.env.ADMIN_REPORTS_KEY || 'gamerank-admin-2026'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Determine client identifier for rate-limiting (forwarded IP or fallback)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'client-session'

    const { report, error } = createReport(body, ip)

    if (error) {
      return NextResponse.json(
        { success: false, message: error },
        { status: 400 }
      )
    }

    if (!report) {
      return NextResponse.json(
        { success: false, message: "We couldn't submit your report. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reportId: report.id,
      status: report.status,
      message: 'Your report has been recorded successfully.',
    })
  } catch (err) {
    console.error('Error handling report submission:', err)
    return NextResponse.json(
      { success: false, message: "We couldn't submit your report. Please try again later." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const key =
      request.nextUrl.searchParams.get('key') ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    // Check admin authorization
    if (key !== ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid admin key required' },
        { status: 401 }
      )
    }

    const reports = getAllReports()
    return NextResponse.json({ success: true, count: reports.length, reports })
  } catch (err) {
    console.error('Error retrieving reports:', err)
    return NextResponse.json({ error: 'Failed to retrieve reports' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, id, status, adminNotes } = body

    if (key !== ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid admin key required' },
        { status: 401 }
      )
    }

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required parameters: id and status' },
        { status: 400 }
      )
    }

    const validStatuses: IssueStatus[] = [
      'Submitted',
      'Under Review',
      'Confirmed',
      'Fixed',
      'Closed',
    ]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    const updated = updateReportStatus(id, status, adminNotes)
    if (!updated) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, report: updated })
  } catch (err) {
    console.error('Error updating report status:', err)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get('key')
    const id = request.nextUrl.searchParams.get('id')

    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    const deleted = deleteReport(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Report deleted successfully' })
  } catch (err) {
    console.error('Error deleting report:', err)
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 })
  }
}
