'use client'

import React from 'react'
import { BuildParts } from '@/types/pc-builder'
import { calculateBuildScore } from '@/lib/pc-builder/build-scorer'
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Zap,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

interface BuildScorecardViewProps {
  currentBuild: BuildParts
}

export function BuildScorecardView({ currentBuild }: BuildScorecardViewProps) {
  const scorecard = calculateBuildScore(currentBuild)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-[#00ff88] font-semibold">
              Holistic System Evaluation
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">System Scorecard & Build Health</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Multi-dimensional audit assessing gaming performance, upgrade path longevity, component synergy, and electrical safety.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center text-black font-black text-2xl font-mono shadow-lg shadow-[#00ff88]/20">
            {scorecard.overall}
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-mono">
              Overall Rating
            </span>
            <span className="text-base font-bold text-white">
              {scorecard.overall >= 8.5
                ? 'Enthusiast Grade'
                : scorecard.overall >= 7.0
                ? 'Highly Balanced'
                : 'Needs Tuning'}
            </span>
          </div>
        </div>
      </div>

      {/* 5-Metric Score Radar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <ScoreCard
          label="Compatibility"
          score={scorecard.compatibility}
          icon={ShieldCheck}
          accentColor="#00ff88"
          description="Socket matching & mechanical clearance"
        />
        <ScoreCard
          label="Performance"
          score={scorecard.performance}
          icon={TrendingUp}
          accentColor="#00d4ff"
          description="Rasterization compute & IPC capability"
        />
        <ScoreCard
          label="Upgradeability"
          score={scorecard.upgradeability}
          icon={Sparkles}
          accentColor="#b347ff"
          description="Socket lifespan, DDR5 & PCIe headroom"
        />
        <ScoreCard
          label="Power Balance"
          score={scorecard.powerBalance}
          icon={Zap}
          accentColor="#ffb703"
          description="PSU load curves & transient protection"
        />
        <ScoreCard
          label="Value for Money"
          score={scorecard.value}
          icon={DollarSign}
          accentColor="#06d6a0"
          description="Performance yield per dollar spent"
        />
      </div>

      {/* Strengths & Improvements Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
            Key Architecture Strengths
          </h3>
          {scorecard.strengths.length > 0 ? (
            <ul className="space-y-2.5">
              {scorecard.strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5"
                >
                  <span className="text-[#00ff88] font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">Select components to reveal system strengths.</p>
          )}
        </div>

        {/* Improvements & Advice */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Recommended Adjustments
          </h3>
          {scorecard.improvements.length > 0 ? (
            <ul className="space-y-2.5">
              {scorecard.improvements.map((imp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-gray-300 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20"
                >
                  <span className="text-yellow-400 font-bold">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
              No glaring bottlenecks or configuration issues detected.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ScoreCard({
  label,
  score,
  icon: Icon,
  accentColor,
  description,
}: {
  label: string
  score: number
  icon: any
  accentColor: string
  description: string
}) {
  return (
    <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xl font-bold font-mono text-white">
          {score}
          <span className="text-xs text-gray-500 font-normal">/10</span>
        </span>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-200">{label}</h4>
        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{description}</p>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(10, score * 10))}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>
    </div>
  )
}
