'use client'

import React, { useState } from 'react'
import {
  BuildParts,
  Currency,
  CompatibilityReport,
  PowerCalculation,
  BuildScorecard,
} from '@/types/pc-builder'
import { formatCurrency, calculateBuildPrice } from '@/lib/pc-builder/price-calculator'
import { getComponentRetailers } from '@/lib/pc-builder/retailers'
import { trackAnalyticsEvent } from '@/lib/analytics/tracker'
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  ShieldCheck,
  Zap,
  Gauge,
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Box,
  Thermometer,
  ExternalLink,
} from 'lucide-react'

interface BuildReportModalProps {
  isOpen: boolean
  onClose: () => void
  parts: BuildParts
  currency: Currency
  compatibility: CompatibilityReport
  power: PowerCalculation
  scorecard: BuildScorecard
}

export function BuildReportModal({
  isOpen,
  onClose,
  parts,
  currency,
  compatibility,
  power,
  scorecard,
}: BuildReportModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const price = calculateBuildPrice(parts, currency)
  const totalPriceFormatted = price.formattedTotal

  const handlePrint = () => {
    trackAnalyticsEvent('report_exported', { format: 'print_pdf' })
    window.print()
  }

  const handleCopySummary = () => {
    trackAnalyticsEvent('report_exported', { format: 'clipboard' })
    const textLines = [
      `=== RigCraft PC Build Dossier ===`,
      `Total Estimated Price: ${totalPriceFormatted}`,
      `Estimated Load: ${power.totalEstimatedWatts}W | Recommended PSU: ${power.recommendedPsuWatts}W`,
      `Compatibility: ${compatibility.status.toUpperCase()}`,
      `Scorecard: ${scorecard.overall}/10 Overall`,
      ``,
      `--- Components ---`,
      `CPU: ${parts.cpu?.name || 'Not Selected'}`,
      `GPU: ${parts.gpu?.name || 'Not Selected'}`,
      `Motherboard: ${parts.motherboard?.name || 'Not Selected'}`,
      `RAM: ${parts.ram?.name || 'Not Selected'}`,
      `Storage: ${parts.storage?.name || 'Not Selected'}`,
      `Power Supply: ${parts.psu?.name || 'Not Selected'}`,
      `Case: ${parts.case?.name || 'Not Selected'}`,
      `CPU Cooler: ${parts.cooler?.name || 'Not Selected'}`,
      ``,
      `Generated with RigCraft (https://pc-builder-seven-ashen.vercel.app)`,
    ]

    navigator.clipboard.writeText(textLines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const partEntries = [
    { label: 'Processor (CPU)', icon: Cpu, part: parts.cpu },
    { label: 'Graphics Card (GPU)', icon: Tv, part: parts.gpu },
    { label: 'Motherboard', icon: Layers, part: parts.motherboard },
    { label: 'Memory (RAM)', icon: Layers, part: parts.ram },
    { label: 'Storage', icon: HardDrive, part: parts.storage },
    { label: 'Power Supply (PSU)', icon: Zap, part: parts.psu },
    { label: 'PC Case', icon: Box, part: parts.case },
    { label: 'CPU Cooler', icon: Thermometer, part: parts.cooler },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0f1118] border border-white/15 p-6 sm:p-10 shadow-2xl space-y-8 my-8 print:border-none print:shadow-none print:bg-white print:text-black print:p-4">
        {/* Top Actions & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 print:border-black/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-0.5 rounded-full border border-[#00ff88]/20 print:border-black print:text-black">
                Verified Dossier
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase print:text-black">
              RigCraft Build Dossier
            </h2>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleCopySummary}
              className="btn-secondary text-xs font-bold py-2 px-3.5 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00ff88]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary text-xs font-bold py-2 px-4 flex items-center gap-1.5 shadow-md shadow-[#00ff88]/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 print:border-gray-300 print:bg-gray-50">
            <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
              Total Build Cost
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono print:text-black">
              {totalPriceFormatted}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 print:border-gray-300 print:bg-gray-50">
            <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
              Compatibility
            </span>
            <span
              className={`text-base sm:text-lg font-black uppercase ${
                compatibility.status === 'compatible'
                  ? 'text-[#00ff88] print:text-green-700'
                  : compatibility.status === 'warning'
                  ? 'text-yellow-400 print:text-yellow-700'
                  : 'text-red-400 print:text-red-700'
              }`}
            >
              {compatibility.status === 'compatible' ? '100% Certified' : compatibility.status}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 print:border-gray-300 print:bg-gray-50">
            <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
              Power Consumption
            </span>
            <span className="text-xl sm:text-2xl font-black text-yellow-400 font-mono print:text-black">
              {power.totalEstimatedWatts}W
            </span>
            <span className="text-[10px] text-gray-400 block font-mono">
              Rec: {power.recommendedPsuWatts}W
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 print:border-gray-300 print:bg-gray-50">
            <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
              Overall Scorecard
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#00d4ff] font-mono print:text-black">
              {scorecard.overall}/10
            </span>
          </div>
        </div>

        {/* Selected Hardware Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono uppercase tracking-wider text-gray-400 font-bold">
            Hardware Configuration Breakdown
          </h3>

          <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-[#131620] print:border-gray-300 print:bg-white print:divide-gray-200">
            {partEntries.map(({ label, icon: Icon, part }) => {
              const partPrice =
                part &&
                formatCurrency(
                  currency === 'INR' ? part.priceInr : part.priceUsd,
                  currency
                )
              const retailers = part ? getComponentRetailers(part, currency) : []
              const firstRetailer = retailers[0]

              return (
                <div
                  key={label}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 text-[#00ff88] flex items-center justify-center shrink-0 print:border print:border-gray-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">
                        {label}
                      </span>
                      <span className="text-sm font-bold text-white print:text-black">
                        {part ? part.name : <span className="text-gray-500 italic">None Selected</span>}
                      </span>
                    </div>
                  </div>

                  {part && (
                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <span className="font-mono font-bold text-white text-sm print:text-black">
                        {partPrice}
                      </span>
                      {firstRetailer && (
                        <a
                          href={firstRetailer.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-[11px] font-bold text-black bg-[#00ff88] hover:bg-[#00e87a] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors print:hidden"
                        >
                          <span>{firstRetailer.name}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upgrade & Power Advice */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs text-gray-300 print:border-gray-300">
          <span className="font-bold text-white flex items-center gap-1.5 print:text-black">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Hardware Synergy &amp; Upgrade Guidance</span>
          </span>
          <p className="leading-relaxed text-gray-400">
            {power.message}
          </p>
          <div className="pt-2 text-[11px] text-gray-500 font-mono">
            RigCraft Report Engine — Generated without commercial influence on benchmark results.
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
          Printed from RigCraft (https://pc-builder-seven-ashen.vercel.app) — Free PC Builder &amp; Performance Planner
        </div>
      </div>
    </div>
  )
}
