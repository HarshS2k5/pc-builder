'use client'

import React, { useState } from 'react'
import { BuildParts } from '@/types/pc-builder'
import { analyzeBottleneck } from '@/lib/pc-builder/bottleneck'
import {
  Scale,
  Cpu,
  Tv,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Flame,
} from 'lucide-react'

interface BottleneckPanelProps {
  currentBuild: BuildParts
}

export function BottleneckPanel({ currentBuild }: BottleneckPanelProps) {
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4k'>('1440p')
  const [workload, setWorkload] = useState<'esports-1080p' | 'aaa-1440p' | 'cinematic-4k' | 'workstation'>('aaa-1440p')

  const analysis = analyzeBottleneck(currentBuild, resolution, workload)
  const hasBoth = Boolean(currentBuild.cpu && currentBuild.gpu)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-[#00ff88] font-semibold">
              Hardware Balance Analyzer
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">System Bottleneck & Synergy Evaluator</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Understand how processing loads shift dynamically between your CPU and GPU based on rendering resolution and gameplay complexity.
          </p>
        </div>

        {/* Educational Note Callout */}
        <div className="text-xs text-gray-400 bg-white/5 border border-white/10 p-3 rounded-xl max-w-sm flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
          <span>
            <strong>Engineering Reality:</strong> No PC is bottleneck-free. The limiter naturally shifts between the GPU and CPU depending on the game engine and screen resolution.
          </span>
        </div>
      </div>

      {/* Workload and Resolution Selectors */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Workload Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#00ff88]" /> Target Workload
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'esports-1080p', label: 'Esports (High FPS)' },
                { id: 'aaa-1440p', label: 'AAA Gaming (1440p)' },
                { id: 'cinematic-4k', label: '4K Ultra & Ray Tracing' },
                { id: 'workstation', label: 'Rendering / 3D' },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWorkload(w.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                    workload === w.id
                      ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-[#00d4ff]" /> Screen Resolution
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['1080p', '1440p', '4k'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    resolution === r
                      ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Card */}
      {hasBoth ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                System Limiter Status
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                    analysis.primaryLimiter === 'GPU'
                      ? 'text-[#00ff88]'
                      : analysis.primaryLimiter === 'CPU'
                      ? 'text-yellow-400'
                      : 'text-[#00d4ff]'
                  }`}
                >
                  {analysis.primaryLimiter === 'GPU' && 'GPU BOUND (Ideal for Gaming)'}
                  {analysis.primaryLimiter === 'CPU' && 'CPU LIMIT (High-FPS Bottleneck)'}
                  {analysis.primaryLimiter === 'BALANCED' && 'HIGH HARDWARE SYNERGY'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-right">
              <span className="text-[11px] text-gray-400 block font-mono">Hardware Synergy Index</span>
              <div className="text-2xl font-bold text-white font-mono">
                {analysis.balanceScore}
                <span className="text-xs text-gray-400 font-normal"> / 100</span>
              </div>
            </div>
          </div>

          {/* Educational Explanation Box */}
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              Engineering Diagnostic
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed">
              {analysis.explanation}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-2">
              {analysis.educationalNote}
            </p>
          </div>

          {/* Visual Shift Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* CPU Component Status */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1.5 font-semibold">
                  <Cpu className="w-4 h-4 text-cyan-400" /> CPU: {currentBuild.cpu?.name}
                </span>
                <span className="text-[11px] font-mono text-gray-300">
                  {resolution === '1080p' ? 'High Load' : resolution === '4k' ? 'Light Draw-Calls' : 'Balanced Load'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                At {resolution.toUpperCase()}, the CPU handles game physics, logic scripts, and passes geometric draw-calls to the GPU.
              </p>
            </div>

            {/* GPU Component Status */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1.5 font-semibold">
                  <Tv className="w-4 h-4 text-[#00ff88]" /> GPU: {currentBuild.gpu?.name}
                </span>
                <span className="text-[11px] font-mono text-gray-300">
                  {resolution === '4k' ? '99% Max Saturation' : resolution === '1080p' ? 'Moderate Saturation' : 'Optimal Saturation'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                At {resolution.toUpperCase()}, the GPU rasterizes textures, ray tracing lighting passes, and anti-aliasing buffers.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center bg-[#141414] rounded-2xl border border-white/10">
          <Scale className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Select Both CPU and GPU to Analyze Synergy</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
            Choose a processor and graphics card in the PC Builder to visualize bottlenecks and workload distribution.
          </p>
        </div>
      )}
    </div>
  )
}
