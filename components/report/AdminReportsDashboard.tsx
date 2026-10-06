'use client'

import React, { useState, useEffect } from 'react'
import { IssueReport, IssueStatus, ProblemCategory } from '@/types/report'
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  Edit3,
  Trash2,
  KeyRound,
  RefreshCw,
  Lock,
  ChevronDown,
} from 'lucide-react'

export function AdminReportsDashboard() {
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [reports, setReports] = useState<IssueReport[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null)
  const [editingNotes, setEditingNotes] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Try reading cached admin key from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('gamerank_admin_key')
      if (cached) {
        setAdminKey(cached)
        fetchReports(cached)
      }
    }
  }, [])

  const fetchReports = async (key: string) => {
    setLoading(true)
    setAuthError(null)
    try {
      const res = await fetch(`/api/reports?key=${encodeURIComponent(key)}`)
      const data = await res.json()
      if (!res.ok || !data.success) {
        setIsAuthenticated(false)
        setAuthError(data.error || 'Invalid Admin Key')
      } else {
        setIsAuthenticated(true)
        setReports(data.reports || [])
        sessionStorage.setItem('gamerank_admin_key', key)
      }
    } catch (err) {
      console.error('Error fetching reports:', err)
      setAuthError('Connection to reports server failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminKey.trim()) return
    fetchReports(adminKey.trim())
  }

  const handleUpdateStatus = async (id: string, status: IssueStatus, notes?: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: adminKey,
          id,
          status,
          adminNotes: notes,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status, adminNotes: notes ?? r.adminNotes } : r))
        )
        if (selectedReport?.id === id) {
          setSelectedReport((prev) => (prev ? { ...prev, status, adminNotes: notes ?? prev.adminNotes } : null))
        }
      } else {
        alert(data.error || 'Failed to update report status')
      }
    } catch (err) {
      console.error('Failed to patch status:', err)
      alert('Error updating status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete report #${id}? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/reports?key=${encodeURIComponent(adminKey)}&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setReports((prev) => prev.filter((r) => r.id !== id))
        if (selectedReport?.id === id) setSelectedReport(null)
      }
    } catch (err) {
      console.error('Error deleting report:', err)
    }
  }

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchId = r.id.toLowerCase().includes(q)
      const matchDesc = r.description.toLowerCase().includes(q)
      const matchCat = r.categoryLabel.toLowerCase().includes(q)
      const matchComp = r.relatedComponent?.toLowerCase().includes(q)
      return matchId || matchDesc || matchCat || matchComp
    }
    return true
  })

  // Stats
  const counts = {
    total: reports.length,
    submitted: reports.filter((r) => r.status === 'Submitted').length,
    underReview: reports.filter((r) => r.status === 'Under Review').length,
    confirmed: reports.filter((r) => r.status === 'Confirmed').length,
    fixed: reports.filter((r) => r.status === 'Fixed').length,
    closed: reports.filter((r) => r.status === 'Closed').length,
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-[#141414] border border-white/10 shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Owner / Admin Access</h2>
          <p className="text-xs text-gray-400 mt-1">
            Authenticate to view and triage incoming problem reports and user feedback.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter administrator key..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50"
            />
          </div>

          {authError && (
            <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !adminKey.trim()}
            className="w-full py-2.5 bg-[#00ff88] hover:bg-[#00e87a] disabled:opacity-40 text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00ff88]/20 transition-all"
          >
            {loading ? 'Authenticating...' : 'Unlock Admin Dashboard'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141414] border border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/20">
            Admin Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Issue & Feedback Triage Desk
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Review bug tickets, price discrepancies, and feature suggestions submitted by users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchReports(adminKey)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-xl border border-white/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('gamerank_admin_key')
              setIsAuthenticated(false)
            }}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs rounded-xl border border-red-500/20 transition-colors"
          >
            Lock Out
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatusMetricChip label="Total Reports" count={counts.total} color="#ffffff" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
        <StatusMetricChip label="Submitted" count={counts.submitted} color="#f59e0b" active={statusFilter === 'Submitted'} onClick={() => setStatusFilter('Submitted')} />
        <StatusMetricChip label="Under Review" count={counts.underReview} color="#00d4ff" active={statusFilter === 'Under Review'} onClick={() => setStatusFilter('Under Review')} />
        <StatusMetricChip label="Confirmed" count={counts.confirmed} color="#b347ff" active={statusFilter === 'Confirmed'} onClick={() => setStatusFilter('Confirmed')} />
        <StatusMetricChip label="Fixed" count={counts.fixed} color="#00ff88" active={statusFilter === 'Fixed'} onClick={() => setStatusFilter('Fixed')} />
        <StatusMetricChip label="Closed" count={counts.closed} color="#6b7280" active={statusFilter === 'Closed'} onClick={() => setStatusFilter('Closed')} />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by ID, description, component, or category..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50"
          />
        </div>
      </div>

      {/* Main Reports Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Reports List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredReports.length === 0 ? (
            <div className="p-12 text-center bg-[#141414] rounded-2xl border border-white/10">
              <CheckCircle2 className="w-10 h-10 text-[#00ff88] mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white">No reports found</h3>
              <p className="text-xs text-gray-500 mt-1">
                There are no open reports matching your current filter.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isSelected = selectedReport?.id === report.id
              return (
                <div
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report)
                    setEditingNotes(report.adminNotes || '')
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white/10 border-[#00ff88]/50 shadow-lg'
                      : 'bg-[#141414] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#00ff88]">
                          {report.id}
                        </span>
                        <StatusBadge status={report.status} />
                        <span className="text-[11px] text-gray-400 font-medium">
                          {report.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
                        {report.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 pt-1 font-mono">
                        <span>Page: {report.page}</span>
                        {report.relatedComponent && <span>• Comp: {report.relatedComponent}</span>}
                        <span>• {new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Selected Report Inspector (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedReport ? (
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">
                      {selectedReport.id}
                    </span>
                    <StatusBadge status={selectedReport.status} />
                  </div>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    {selectedReport.categoryLabel}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(selectedReport.id)}
                  title="Delete Report"
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Full Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                  User Description
                </label>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedReport.description}
                </div>
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-gray-500 block">Reported Page</span>
                  <span className="text-gray-200 font-mono text-[11px] truncate block">
                    {selectedReport.page}
                  </span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-gray-500 block">Related Component</span>
                  <span className="text-gray-200 text-[11px] truncate block">
                    {selectedReport.relatedComponent || 'None'}
                  </span>
                </div>
                {selectedReport.relatedGame && (
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-500 block">Related Game</span>
                    <span className="text-gray-200 text-[11px]">{selectedReport.relatedGame}</span>
                  </div>
                )}
                {selectedReport.email && (
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-500 block">Contact Email</span>
                    <span className="text-[#00ff88] font-mono text-[11px]">{selectedReport.email}</span>
                  </div>
                )}
              </div>

              {/* Attached Screenshot Preview if exists */}
              {selectedReport.screenshot && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                    Attached Screenshot
                  </span>
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black max-h-48">
                    <img
                      src={selectedReport.screenshot}
                      alt="User screenshot"
                      className="w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Status Selector Actions */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
                  Change Issue Status
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['Submitted', 'Under Review', 'Confirmed', 'Fixed', 'Closed'] as IssueStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedReport.id, st, editingNotes)}
                        disabled={updatingId === selectedReport.id}
                        className={`py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                          selectedReport.status === st
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Admin Notes Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
                  Internal Admin Notes
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="e.g. Checked Ryzen 7800X3D MSRP, updated catalog in v2.6..."
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00ff88]/50"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, selectedReport.status, editingNotes)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#141414] border border-white/10 text-center text-gray-500 text-xs">
              Select a report from the list to view complete details, attached screenshots, and change resolution status.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusMetricChip({
  label,
  count,
  color,
  active,
  onClick,
}: {
  label: string
  count: number
  color: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl border text-left transition-all ${
        active
          ? 'bg-white/10 border-white shadow-md'
          : 'bg-[#141414] border-white/10 hover:border-white/20'
      }`}
    >
      <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-mono">
        {label}
      </span>
      <span className="text-xl font-bold font-mono" style={{ color }}>
        {count}
      </span>
    </button>
  )
}

function StatusBadge({ status }: { status: IssueStatus }) {
  const styles: Record<IssueStatus, string> = {
    Submitted: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    'Under Review': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    Confirmed: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    Fixed: 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/30',
    Closed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  )
}
