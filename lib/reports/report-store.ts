// ─────────────────────────────────────────────────────────────────────────────
// GameRank & TechForge – Report & Feedback Storage Engine
// Handles persistent JSON file storage, XSS sanitization, rate-limiting, and status tracking
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import { IssueReport, CreateReportInput, IssueStatus, ProblemCategory, CATEGORY_LABELS } from '@/types/report'

export { CATEGORY_LABELS }

const DATA_DIR = path.join(process.cwd(), '.data')
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json')

// In-memory rate limiting map: ipOrSession -> timestamp
const RATE_LIMIT_MAP = new Map<string, number>()
const RATE_LIMIT_COOLDOWN_MS = 8000 // 8 seconds cooldown

// ---------------------------------------------------------------------------
// Security: Sanitization & Spam Filtering
// ---------------------------------------------------------------------------

export function sanitizeText(text: string): string {
  if (!text) return ''
  // Strip all HTML tags, script blocks, and dangerous attributes
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '')
    .trim()
}

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const lastTime = RATE_LIMIT_MAP.get(identifier)
  if (lastTime && now - lastTime < RATE_LIMIT_COOLDOWN_MS) {
    return false // Rate limited
  }
  RATE_LIMIT_MAP.set(identifier, now)
  return true
}

// ---------------------------------------------------------------------------
// File-based Storage
// ---------------------------------------------------------------------------

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(REPORTS_FILE)) {
      fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2), 'utf-8')
    }
  } catch (err) {
    console.error('Error initializing reports storage file:', err)
  }
}

export function getAllReports(): IssueReport[] {
  ensureDataFile()
  try {
    const raw = fs.readFileSync(REPORTS_FILE, 'utf-8')
    if (!raw.trim()) return []
    const parsed = JSON.parse(raw) as IssueReport[]
    // Sort descending by created date
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (err) {
    console.error('Failed to read reports file:', err)
    return []
  }
}

export function saveReports(reports: IssueReport[]): boolean {
  ensureDataFile()
  try {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Failed to write reports file:', err)
    return false
  }
}

export function createReport(input: CreateReportInput, clientIdentifier = 'anonymous'): { report?: IssueReport; error?: string } {
  // Rate limiting check
  if (!checkRateLimit(clientIdentifier)) {
    return { error: 'Please wait a few seconds before submitting another report.' }
  }

  // Description validation & sanitization
  const cleanedDesc = sanitizeText(input.description)
  if (!cleanedDesc || cleanedDesc.length < 10) {
    return { error: 'Description must be at least 10 characters describing the issue.' }
  }
  if (cleanedDesc.length > 3000) {
    return { error: 'Description exceeds maximum allowed length of 3,000 characters.' }
  }

  // Email validation if provided (optional)
  let cleanedEmail: string | undefined = undefined
  if (input.email && input.email.trim()) {
    const emailCandidate = input.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailCandidate)) {
      return { error: 'Please enter a valid email address or leave it blank.' }
    }
    cleanedEmail = sanitizeText(emailCandidate)
  }

  // Screenshot validation if provided
  let validScreenshot: string | undefined = undefined
  if (input.screenshot && typeof input.screenshot === 'string') {
    if (input.screenshot.startsWith('data:image/')) {
      // Limit base64 image payload to ~4MB
      if (input.screenshot.length < 6 * 1024 * 1024) {
        validScreenshot = input.screenshot
      }
    }
  }

  const randomNum = Math.floor(10000 + Math.random() * 90000)
  const now = new Date().toISOString()

  const newReport: IssueReport = {
    id: `ISSUE-${randomNum}`,
    kind: input.kind || 'problem',
    category: input.category || 'bug',
    categoryLabel: CATEGORY_LABELS[input.category] || '🐛 Bug / Website Error',
    description: cleanedDesc,
    relatedComponent: input.relatedComponent ? sanitizeText(input.relatedComponent) : undefined,
    relatedGame: input.relatedGame ? sanitizeText(input.relatedGame) : undefined,
    page: sanitizeText(input.page) || '/pc-builder',
    screenshot: validScreenshot,
    email: cleanedEmail,
    status: 'Submitted',
    createdAt: now,
    updatedAt: now,
  }

  const reports = getAllReports()
  reports.unshift(newReport)
  const saved = saveReports(reports)

  if (!saved) {
    return { error: 'Server could not persist the report. Please try again later.' }
  }

  return { report: newReport }
}

export function updateReportStatus(
  id: string,
  newStatus: IssueStatus,
  adminNotes?: string
): IssueReport | null {
  const reports = getAllReports()
  const index = reports.findIndex((r) => r.id === id)
  if (index === -1) return null

  reports[index].status = newStatus
  if (adminNotes !== undefined) {
    reports[index].adminNotes = sanitizeText(adminNotes)
  }
  reports[index].updatedAt = new Date().toISOString()

  saveReports(reports)
  return reports[index]
}

export function deleteReport(id: string): boolean {
  const reports = getAllReports()
  const filtered = reports.filter((r) => r.id !== id)
  if (filtered.length === reports.length) return false
  return saveReports(filtered)
}
