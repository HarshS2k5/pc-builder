'use client'

import React from 'react'
import { CompatibilityReport } from '@/types/pc-builder'
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  Box,
  Thermometer,
} from 'lucide-react'

interface CompatibilityModalProps {
  isOpen: boolean
  onClose: () => void
  report: CompatibilityReport
}

export function CompatibilityModal({ isOpen, onClose, report }: CompatibilityModalProps) {
  if (!isOpen) return null

  const isCompatible = report.status === 'compatible'
  const isWarning = report.status === 'warning'
  const isIncompatible = report.status === 'incompatible'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                isIncompatible
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : isWarning
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  : 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">System Compatibility Engine</h2>
              <p className="text-xs text-gray-400">
                Automated multi-factor mechanical and electrical verification
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center gap-4 ${
              isIncompatible
                ? 'bg-red-950/20 border-red-500/40 text-red-200'
                : isWarning
                ? 'bg-yellow-950/20 border-yellow-500/40 text-yellow-200'
                : 'bg-green-950/20 border-green-500/40 text-green-200'
            }`}
          >
            <div className="shrink-0">
              {isIncompatible && <XCircle className="w-8 h-8 text-red-400" />}
              {isWarning && <AlertTriangle className="w-8 h-8 text-yellow-400" />}
              {isCompatible && <CheckCircle2 className="w-8 h-8 text-[#00ff88]" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isIncompatible && '🔴 Incompatibilities Detected'}
                {isWarning && '🟡 Operational Warnings / Notes'}
                {isCompatible && '🟢 100% Compatible Build'}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {isIncompatible &&
                  'Your selected parts have physical, socket, or electrical conflicts that prevent successful assembly.'}
                {isWarning &&
                  'The build can assemble and operate, but has tight clearances or power margins you should review.'}
                {isCompatible &&
                  'All physical clearances, power delivery, memory generation, and socket pins match manufacturer specifications.'}
              </p>
            </div>
          </div>

          {/* Active Issues / Notes List */}
          {report.issues.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Detected Issues & Recommendations ({report.issues.length})
              </h4>
              {report.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 ${
                    issue.severity === 'error'
                      ? 'bg-red-900/15 border-red-500/30'
                      : 'bg-yellow-900/15 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        issue.severity === 'error'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {issue.rule}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {issue.componentA} {issue.componentB ? `↔ ${issue.componentB}` : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 font-medium leading-relaxed">
                    {issue.message}
                  </p>
                  {issue.recommendation && (
                    <div className="text-xs text-[#00ff88] bg-white/5 p-2 rounded-lg border border-white/10 flex items-start gap-2">
                      <span className="font-semibold shrink-0">Recommendation:</span>
                      <span>{issue.recommendation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Automated Check Matrix */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Automated Check Verification Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <CheckRow icon={Cpu} label="CPU ↔ Motherboard Socket" verified={!report.issues.some(i => i.rule.includes('Socket'))} />
              <CheckRow icon={Layers} label="Motherboard ↔ RAM Generation" verified={!report.issues.some(i => i.rule.includes('RAM Generation'))} />
              <CheckRow icon={Layers} label="RAM Sticks ↔ DIMM Slots" verified={!report.issues.some(i => i.rule.includes('DIMM Slot'))} />
              <CheckRow icon={Box} label="GPU ↔ Chassis Length Clearance" verified={!report.issues.some(i => i.rule.includes('GPU Physical'))} />
              <CheckRow icon={Thermometer} label="CPU Cooler ↔ Socket Mounting" verified={!report.issues.some(i => i.rule.includes('Cooler Socket'))} />
              <CheckRow icon={Thermometer} label="CPU Cooler ↔ Chassis Clearance" verified={!report.issues.some(i => i.rule.includes('Cooler Height') || i.rule.includes('Radiator'))} />
              <CheckRow icon={Box} label="Motherboard ↔ Chassis Form Factor" verified={!report.issues.some(i => i.rule.includes('Form Factor'))} />
              <CheckRow icon={Zap} label="PSU Capacity ↔ System Peak Load" verified={!report.issues.some(i => i.rule.includes('Power Supply'))} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#1a1a1a] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  )
}

function CheckRow({ icon: Icon, label, verified }: { icon: any; label: string; verified: boolean }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
      <div className="flex items-center gap-2 text-gray-300">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <span>{label}</span>
      </div>
      {verified ? (
        <span className="text-[#00ff88] flex items-center gap-1 text-[11px] font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> Passed
        </span>
      ) : (
        <span className="text-red-400 flex items-center gap-1 text-[11px] font-medium">
          <XCircle className="w-3.5 h-3.5" /> Failed
        </span>
      )}
    </div>
  )
}
