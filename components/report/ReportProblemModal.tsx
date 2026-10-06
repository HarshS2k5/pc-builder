'use client'

import React, { useState, useEffect } from 'react'
import {
  ProblemCategory,
  CreateReportInput,
  ReportSubmitResult,
  CATEGORY_LABELS,
} from '@/types/report'
import { SEED_GAMES } from '@/lib/database'
import {
  AlertTriangle,
  X,
  Bug,
  Lightbulb,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Mail,
  Cpu,
  Gamepad2,
  Send,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

interface ReportProblemModalProps {
  isOpen: boolean
  onClose: () => void
  defaultCategory?: ProblemCategory
  defaultComponent?: string
  defaultGame?: string
  contextPage?: string
}

const COMPONENT_OPTIONS = [
  'None / General',
  'Processor (CPU)',
  'Graphics Card (GPU)',
  'Motherboard',
  'Memory (RAM)',
  'Storage (SSD/HDD)',
  'Power Supply (PSU)',
  'PC Case (Chassis)',
  'CPU Cooler',
  'Other Hardware',
]

export function ReportProblemModal({
  isOpen,
  onClose,
  defaultCategory = 'bug',
  defaultComponent,
  defaultGame,
  contextPage,
}: ReportProblemModalProps) {
  const [kind, setKind] = useState<'problem' | 'suggestion'>(
    defaultCategory === 'suggestion' ? 'suggestion' : 'problem'
  )
  const [category, setCategory] = useState<ProblemCategory>(defaultCategory)
  const [description, setDescription] = useState('')
  const [relatedComponent, setRelatedComponent] = useState(defaultComponent || 'None / General')
  const [relatedGame, setRelatedGame] = useState(defaultGame || '')
  const [email, setEmail] = useState('')
  const [detectedPage, setDetectedPage] = useState('')
  const [screenshotData, setScreenshotData] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState<string | null>(null)

  // Status submission states
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<ReportSubmitResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Detect current page automatically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname + window.location.search
      setDetectedPage(contextPage || path || '/pc-builder')
    }
  }, [contextPage, isOpen])

  // Reset when re-opened
  useEffect(() => {
    if (isOpen) {
      setSubmitResult(null)
      setErrorMessage(null)
      setDescription('')
      setScreenshotData(null)
      setScreenshotName(null)
      if (defaultCategory === 'suggestion') {
        setKind('suggestion')
        setCategory('suggestion')
      } else {
        setKind('problem')
        setCategory(defaultCategory)
      }
    }
  }, [isOpen, defaultCategory])

  if (!isOpen) return null

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to image types under 4MB
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('Screenshot size must be under 4MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setScreenshotData(reader.result as string)
      setScreenshotName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (description.trim().length < 10) {
      setErrorMessage('Please provide at least 10 characters describing the issue or feedback.')
      return
    }

    setSubmitting(true)

    const payload: CreateReportInput = {
      kind,
      category,
      description: description.trim(),
      relatedComponent: relatedComponent !== 'None / General' ? relatedComponent : undefined,
      relatedGame: relatedGame ? relatedGame : undefined,
      page: detectedPage || '/pc-builder',
      screenshot: screenshotData || undefined,
      email: email.trim() || undefined,
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setSubmitResult({
          success: false,
          message: data.message || "We couldn't submit your report. Please try again later.",
        })
      } else {
        setSubmitResult({
          success: true,
          reportId: data.reportId,
          message: 'Your report has been recorded successfully.',
        })
      }
    } catch (err) {
      console.error('Submission error:', err)
      setSubmitResult({
        success: false,
        message: "We couldn't submit your report. Please try again later.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                kind === 'suggestion'
                  ? 'bg-[#00d4ff]/10 border-[#00d4ff]/30 text-[#00d4ff]'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}
            >
              {kind === 'suggestion' ? <Lightbulb className="w-5 h-5" /> : <Bug className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {kind === 'suggestion' ? 'Suggest a Feature / Improvement' : 'Report a Problem'}
              </h2>
              <p className="text-xs text-gray-400">
                Help improve the PC Builder and game accuracy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success or Error Confirmation Screen */}
        {submitResult ? (
          <div className="p-8 space-y-6 text-center my-auto">
            {submitResult.success ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/40 text-[#00ff88] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    Thanks for helping improve the PC Builder!
                  </h3>
                  <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto leading-relaxed">
                    Your report has been recorded successfully.
                  </p>
                  {submitResult.reportId && (
                    <div className="inline-block mt-3 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-[#00ff88]">
                      Reference ID: {submitResult.reportId} (Status: Submitted)
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#00ff88] hover:bg-[#00e87a] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00ff88]/20 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    We couldn't submit your report. Please try again later.
                  </h3>
                  <p className="text-sm text-red-300 mt-2 max-w-md mx-auto">
                    {submitResult.message}
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setSubmitResult(null)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Kind Toggle: Problem vs Suggestion */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setKind('problem')
                  if (category === 'suggestion') setCategory('bug')
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  kind === 'problem'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Report a Problem</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setKind('suggestion')
                  setCategory('suggestion')
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  kind === 'suggestion'
                    ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Suggest an Improvement</span>
              </button>
            </div>

            {/* Detected Page Banner */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-gray-400">
              <span>
                Reported from:{' '}
                <strong className="text-gray-200 font-mono">{detectedPage || '/pc-builder'}</strong>
              </span>
              <span className="text-[10px] text-[#00ff88] flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" /> Auto-detected
              </span>
            </div>

            {/* Problem Type Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                {kind === 'problem' ? 'Problem Category' : 'Suggestion Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProblemCategory)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00ff88]/50 cursor-pointer"
              >
                {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                  <option key={catKey} value={catKey} className="bg-[#1a1a1a]">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea (Required) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  Description <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-gray-500 font-mono">
                  {description.length} / 2500 characters
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us what went wrong or what you think should be improved..."
                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50 transition-all resize-y leading-relaxed"
              />
            </div>

            {/* Optional Hardware Component & Game Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Related Component */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Related Component (Optional)
                </label>
                <select
                  value={relatedComponent}
                  onChange={(e) => setRelatedComponent(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#00ff88]/50 cursor-pointer"
                >
                  {COMPONENT_OPTIONS.map((c) => (
                    <option key={c} value={c} className="bg-[#1a1a1a]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Related Game */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3" /> Related Game (Optional)
                </label>
                <select
                  value={relatedGame}
                  onChange={(e) => setRelatedGame(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#00ff88]/50 cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a1a]">None / Not Game Specific</option>
                  {SEED_GAMES.map((g) => (
                    <option key={g.id} value={g.name} className="bg-[#1a1a1a]">
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Screenshot Attachment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Attach Screenshot (Optional)
              </label>

              {screenshotData ? (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={screenshotData}
                      alt="Screenshot thumbnail"
                      className="w-12 h-12 object-cover rounded-lg border border-white/10"
                    />
                    <div className="text-xs">
                      <span className="text-gray-200 font-medium block truncate max-w-[200px]">
                        {screenshotName || 'Screenshot attached'}
                      </span>
                      <span className="text-[10px] text-[#00ff88]">Ready to submit</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshotData(null)
                      setScreenshotName(null)
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-white/20 hover:border-[#00ff88]/40 hover:bg-white/[0.02] rounded-xl cursor-pointer transition-all">
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-300 font-medium">
                    Click to select screenshot image (Max 4MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Privacy Warning on Screenshots */}
              <p className="text-[11px] text-gray-400 bg-white/5 p-2 rounded-lg border border-white/5 leading-relaxed">
                ⚠️ <strong>Privacy reminder:</strong> Please don't upload screenshots containing passwords, addresses, phone numbers, or other private information.
              </p>
            </div>

            {/* Optional Contact Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com (only if you want follow-up regarding your report)"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50"
              />
              <p className="text-[10px] text-gray-500">
                Email is strictly optional. We will never share or spam your address.
              </p>
            </div>

            {/* Error Message if local validation fails */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Modal Form Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || description.trim().length < 10}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#00ff88] disabled:opacity-40 disabled:hover:scale-100 hover:bg-[#00e87a] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00ff88]/20 transition-all hover:scale-[1.02]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
