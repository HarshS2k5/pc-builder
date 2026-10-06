'use client'

import React, { useState } from 'react'
import {
  Currency,
  BuildParts,
  ComponentCategory,
} from '@/types/pc-builder'
import {
  generateSmartBuildDetailed,
  BuildPurpose,
  SmartRecommendationResult,
} from '@/lib/pc-builder/smart-wizard'
import { formatCurrency, calculateBuildPrice } from '@/lib/pc-builder/price-calculator'
import { CheckPriceButton } from './CheckPriceButton'
import { trackAnalyticsEvent } from '@/lib/analytics/tracker'
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
  Zap,
  ShieldCheck,
  Cpu,
  Tv,
  RotateCcw,
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

const POPULAR_GAMES = [
  'Fortnite',
  'GTA V',
  'Valorant',
  'Counter-Strike 2',
  'Cyberpunk 2077',
  'Black Myth: Wukong',
  'Minecraft',
  'Apex Legends',
  'Call of Duty',
  'Elden Ring',
]

const INR_BUDGETS = [50000, 75000, 100000, 140000, 180000, 250000]
const USD_BUDGETS = [600, 900, 1200, 1700, 2200, 3000]

export function SmartWizardModal({
  isOpen,
  onClose,
  currency,
  onApplyBuild,
}: SmartWizardModalProps) {
  const [purpose, setPurpose] = useState<BuildPurpose>('gaming')
  const [budget, setBudget] = useState<number>(currency === 'INR' ? 75000 : 900)
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4k'>('1080p')
  const [selectedGames, setSelectedGames] = useState<string[]>(['Fortnite', 'GTA V'])
  const [generatedResult, setGeneratedResult] = useState<SmartRecommendationResult | null>(null)

  if (!isOpen) return null

  const presetBudgets = currency === 'INR' ? INR_BUDGETS : USD_BUDGETS

  const toggleGame = (game: string) => {
    setSelectedGames((prev) =>
      prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game]
    )
  }

  const handleGenerate = () => {
    trackAnalyticsEvent('recommendation_generated', {
      purpose,
      budget,
      resolution,
      currency,
      gamesCount: selectedGames.length,
    })

    const result = generateSmartBuildDetailed({
      purpose,
      budget,
      currency,
      resolution,
      games: selectedGames,
    })
    setGeneratedResult(result)
  }

  const handleApply = () => {
    if (generatedResult) {
      onApplyBuild(generatedResult.parts)
      onClose()
      setGeneratedResult(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#10121a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141722]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center text-black font-bold shadow-md shadow-[#00ff88]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Smart "Build My PC" Architect
              </h2>
              <p className="text-xs text-gray-400">
                Algorithmically curates parts tailored to your games and budget with component selection rationale
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose()
              setGeneratedResult(null)
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!generatedResult ? (
            /* QUESTIONNAIRE FLOW */
            <>
              {/* Step 1: Purpose */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-mono tracking-wider text-gray-400 font-bold flex items-center justify-between">
                  <span>1. What is your primary purpose?</span>
                  <span className="text-[10px] text-[#00ff88] font-mono">Select Goal</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PURPOSES.map((p) => {
                    const isSelected = purpose === p.id
                    const Icon = p.icon
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPurpose(p.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#00ff88]/15 border-[#00ff88] text-white shadow-lg shadow-[#00ff88]/10'
                            : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#00ff88] text-black font-bold' : 'bg-white/10 text-gray-400'
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
                  <label className="text-xs uppercase font-mono tracking-wider text-gray-400 font-bold">
                    2. Target Budget
                  </label>
                  <div className="text-base font-bold font-mono text-[#00ff88]">
                    {formatCurrency(budget, currency)}
                  </div>
                </div>

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

              {/* Step 3: Resolution Target */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-mono tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-[#00d4ff]" />
                  <span>3. Target Resolution</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['1080p', '1440p', '4k'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                        resolution === r
                          ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff] shadow-md shadow-[#00d4ff]/15'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {r.toUpperCase()}
                      <span className="block text-[10px] text-gray-500 font-normal mt-0.5">
                        {r === '1080p' ? 'Full HD' : r === '1440p' ? 'Quad HD' : '4K Ultra'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Games Played */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-mono tracking-wider text-gray-400 font-bold flex items-center justify-between">
                  <span>4. Games you plan to play (Optional)</span>
                  <span className="text-[10px] text-[#00ff88] font-mono">
                    {selectedGames.length} selected
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_GAMES.map((game) => {
                    const active = selectedGames.includes(game)
                    return (
                      <button
                        key={game}
                        type="button"
                        onClick={() => toggleGame(game)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium ${
                          active
                            ? 'bg-[#00ff88]/20 border-[#00ff88] text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {game}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            /* RESULTS & RATIONALE VIEW */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/25 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-[#00ff88]">
                    Recommendation Generated
                  </span>
                  <h3 className="text-lg font-black text-white">
                    Optimized for {resolution.toUpperCase()} &bull; {formatCurrency(budget, currency)} Target
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    {generatedResult.estimatedFpsNotes}
                  </p>
                </div>
                <button
                  onClick={() => setGeneratedResult(null)}
                  className="btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Modify Criteria</span>
                </button>
              </div>

              {/* 8 Components with Rationale */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold">
                  Why Each Component Was Selected
                </h4>

                <div className="space-y-2.5">
                  {(
                    [
                      'cpu',
                      'gpu',
                      'motherboard',
                      'ram',
                      'storage',
                      'psu',
                      'case',
                      'cooler',
                    ] as ComponentCategory[]
                  ).map((category) => {
                    const part = generatedResult.parts[category]
                    const reason = generatedResult.rationale[category]
                    if (!part) return null

                    const partPrice = formatCurrency(
                      currency === 'INR' ? part.priceInr : part.priceUsd,
                      currency
                    )

                    return (
                      <div
                        key={category}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase font-bold text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded">
                              {category}
                            </span>
                            <span className="font-bold text-white text-sm">
                              {part.name}
                            </span>
                            <span className="text-gray-400 font-mono text-xs">
                              ({partPrice})
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed pl-1">
                            💡 {reason}
                          </p>
                        </div>

                        <div className="self-end sm:self-center shrink-0">
                          <CheckPriceButton component={part} currency={currency} variant="compact" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Upgrade advice */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300">
                <span className="font-bold text-white block mb-1">
                  Future Upgradeability:
                </span>
                {generatedResult.upgradeAdvice}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#141722] flex items-center justify-between">
          <button
            onClick={() => {
              onClose()
              setGeneratedResult(null)
            }}
            className="text-xs text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          {!generatedResult ? (
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#00ff88] hover:bg-[#00e87a] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00ff88]/25 transition-all hover:scale-[1.02]"
            >
              <span>Generate Synergized Build</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#00ff88] hover:bg-[#00e87a] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00ff88]/25 transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>Apply Build to Configurator</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
