'use client'

import React, { useState } from 'react'
import {
  BuildParts,
  Currency,
} from '@/types/pc-builder'
import {
  encodeBuildToShareCode,
  exportBuildToMarkdown,
} from '@/lib/pc-builder/build-storage'
import { calculateBuildPrice } from '@/lib/pc-builder/price-calculator'
import { calculatePower } from '@/lib/pc-builder/power-calculator'
import { checkCompatibility } from '@/lib/pc-builder/compatibility'
import {
  Share2,
  X,
  Copy,
  Check,
  FileText,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react'

interface ShareBuildModalProps {
  isOpen: boolean
  onClose: () => void
  currentBuild: BuildParts
  currency: Currency
}

export function ShareBuildModal({
  isOpen,
  onClose,
  currentBuild,
  currency,
}: ShareBuildModalProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedMd, setCopiedMd] = useState(false)

  if (!isOpen) return null

  const shareCode = encodeBuildToShareCode(currentBuild)
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/pc-builder?config=${shareCode}`
    : `/pc-builder?config=${shareCode}`

  const pricing = calculateBuildPrice(currentBuild, currency)
  const power = calculatePower(currentBuild)
  const compat = checkCompatibility(currentBuild)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const handleCopyMarkdown = () => {
    const md = exportBuildToMarkdown(currentBuild, currency)
    navigator.clipboard.writeText(md)
    setCopiedMd(true)
    setTimeout(() => setCopiedMd(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Share Your PC Build</h2>
              <p className="text-xs text-gray-400">
                Generate an encoded permalink or formatted forum table
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Build Snapshot Card */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-[#00ff88] uppercase tracking-wider font-mono">
                TECHFORGE BUILD #{Math.abs(shareCode.length * 317) % 90000 + 10000}
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {pricing.formattedTotal}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
                <span>
                  {compat.status === 'compatible' ? '🟢 100% Compatible' : '⚠️ Has Notes'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>
                  Load: ~{power.totalEstimatedWatts}W (Rec. {power.recommendedPsuWatts}W)
                </span>
              </div>
            </div>
          </div>

          {/* Share URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Direct Configuration Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 font-mono focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-[#00ff88] hover:bg-[#00e87a] text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Forum / Reddit Markdown Export */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Reddit / Forum Markdown Table
            </label>
            <button
              onClick={handleCopyMarkdown}
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between text-xs text-gray-200"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00d4ff]" />
                <span>Copy formatted Markdown table for Reddit / Discord / Forums</span>
              </div>
              <span className="font-bold text-[#00d4ff] flex items-center gap-1">
                {copiedMd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMd ? 'Copied Table!' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#1a1a1a] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
