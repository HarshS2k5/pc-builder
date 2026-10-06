'use client'

import React, { useState } from 'react'
import {
  Currency,
  BuildParts,
} from '@/types/pc-builder'
import { generateSmartBuild, BuildPurpose } from '@/lib/pc-builder/smart-wizard'
import { formatCurrency } from '@/lib/pc-builder/price-calculator'
import {
  Sparkles,
  X,
  Gamepad2,
  Video,
  Brain,
  Code,
  Palette,
  GraduationCap,
  Coins,
  ArrowRight,
  Monitor,
  Check,
} from 'lucide-react'

interface SmartWizardModalProps {
  isOpen: boolean
  onClose: () => void
  currency: Currency
  onApplyBuild: (parts: BuildParts) => void
}

const PURPOSES: { id: BuildPurpose; title: string; subtitle: string; icon: any }[] = [
  { id: 'gaming', title: 'High-FPS Gaming', subtitle: 'Optimized for AAA graphics and low input latency', icon: Gamepad2 },
  { id: 'video-editing', title: 'Video Editing & VFX', subtitle: 'Multicore encoding, Premiere & DaVinci Resolve', icon: Video },
  { id: 'ai-ml', title: 'AI & Machine Learning', subtitle: 'Large VRAM for local LLMs, CUDA & PyTorch', icon: Brain },
  { id: 'programming', title: 'Software Dev & Compiling', subtitle: 'Fast compilation, containerization & RAM', icon: Code },
  { id: '3d-rendering', title: '3D Modeling & CAD', subtitle: 'Blender, Maya, Unreal Engine & ray tracing', icon: Palette },
  { id: 'general', title: 'School & Productivity', subtitle: 'Silent, power-efficient daily workhorse', icon: GraduationCap },
  { id: 'budget', title: 'Pure Budget King', subtitle: 'Maximum price-to-performance ratio', icon: Coins },
]

const INR_BUDGETS = [50000, 75000, 100000, 150000, 200000, 300000]
const USD_BUDGETS = [600, 900, 1200, 1800, 2400, 3500]

export function SmartWizardModal({
  isOpen,
  onClose,
  currency,
  onApplyBuild,
}: SmartWizardModalProps) {
  const [purpose, setPurpose] = useState<BuildPurpose>('gaming')
  const [budget, setBudget] = useState<number>(currency === 'INR' ? 100000 : 1200)
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4k'>('1440p')

  if (!isOpen) return null

  const presetBudgets = currency === 'INR' ? INR_BUDGETS : USD_BUDGETS

  const handleGenerate = () => {
    const recommendedParts = generateSmartBuild({
      purpose,
      budget,
      currency,
      resolution,
    })
    onApplyBuild(recommendedParts)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center text-black font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Smart Build Architect</h2>
              <p className="text-xs text-gray-400">
                Algorithmically curates 100% compatible components for your exact budget & goal
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Purpose */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center justify-between">
              <span>1. What are you building for?</span>
              <span className="text-[10px] text-[#00ff88] font-mono">Select Primary Goal</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PURPOSES.map((p) => {
                const isSelected = purpose === p.id
                const Icon = p.icon
                return (
                  <button
                    key={p.id}
                    onClick={() => setPurpose(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#00ff88]/15 border-[#00ff88] text-white shadow-lg shadow-[#00ff88]/10'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#00ff88] text-black' : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{p.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{p.subtitle}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Target Budget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                2. Target Budget
              </label>
              <div className="text-base font-bold font-mono text-[#00ff88]">
                {formatCurrency(budget, currency)}
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetBudgets.map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all font-mono ${
                    budget === b
                      ? 'bg-[#00ff88] text-black border-[#00ff88] shadow-md shadow-[#00ff88]/20'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {formatCurrency(b, currency)}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Screen Resolution Target */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-[#00d4ff]" /> 3. Primary Display Resolution
            </label>
            <div className="grid grid-cols-3 gap-3">
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
                  <span className="block text-[10px] text-gray-500 font-normal mt-0.5">
                    {r === '1080p' ? 'Full HD High Refresh' : r === '1440p' ? 'Quad HD Sweetspot' : '4K Ultra High-End'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Action */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#1a1a1a] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#00ff88] hover:bg-[#00e87a] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00ff88]/25 transition-all hover:scale-[1.02]"
          >
            <span>Generate Synergized Build</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
