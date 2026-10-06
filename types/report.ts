// ─────────────────────────────────────────────────────────────────────────────
// GameRank & TechForge – Report a Problem & Feedback Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

export type ProblemCategory =
  | 'bug'
  | 'compatibility'
  | 'price'
  | 'spec'
  | 'performance'
  | 'broken_link'
  | 'mobile'
  | 'ui'
  | 'suggestion'
  | 'other'

export const CATEGORY_LABELS: Record<ProblemCategory, string> = {
  bug: '🐛 Bug / Website Error',
  compatibility: '🔧 PC Compatibility Problem',
  price: '💰 Incorrect Price',
  spec: '📊 Incorrect Specification',
  performance: '🎮 Incorrect Performance Estimate',
  broken_link: '🔗 Broken Link',
  mobile: '📱 Mobile Problem',
  ui: '🎨 UI / Design Problem',
  suggestion: '💡 Feature Suggestion',
  other: '❓ Other',
}

export type IssueStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Confirmed'
  | 'Fixed'
  | 'Closed'

export interface IssueReport {
  id: string // e.g. "ISSUE-74892"
  kind: 'problem' | 'suggestion'
  category: ProblemCategory
  categoryLabel: string
  description: string
  relatedComponent?: string
  relatedGame?: string
  page: string // URL or feature name
  screenshot?: string // Base64 data URI (optional)
  email?: string // Optional
  status: IssueStatus
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateReportInput {
  kind: 'problem' | 'suggestion'
  category: ProblemCategory
  description: string
  relatedComponent?: string
  relatedGame?: string
  page: string
  screenshot?: string
  email?: string
}

export interface ReportSubmitResult {
  success: boolean
  reportId?: string
  message: string
}
