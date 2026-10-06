'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { BuildParts } from '@/types/pc-builder'
import { estimateGamePerformance } from '@/lib/pc-builder/performance-estimator'
import { SEED_GAMES } from '@/lib/database'
import {
  Gamepad2,
  Search,
  Monitor,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Tv,
  Layers,
  HardDrive,
} from 'lucide-react'

interface PerformancePlannerProps {
  currentBuild: BuildParts
}

export function PerformancePlanner({ currentBuild }: PerformancePlannerProps) {
  const [selectedGameSlug, setSelectedGameSlug] = useState('cyberpunk-2077')
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4K'>('1440p')
  const [quality, setQuality] = useState<'Low' | 'Medium' | 'High' | 'Ultra'>('High')
  const [searchFilter, setSearchFilter] = useState('')

  // Filter games from GameRank verified seed list
  const filteredGames = useMemo(() => {
    if (!searchFilter.trim()) return SEED_GAMES
    const q = searchFilter.toLowerCase()
    return SEED_GAMES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.genres.some((genre) => genre.toLowerCase().includes(q))
    )
  }, [searchFilter])

  const selectedGame = useMemo(() => {
    return SEED_GAMES.find((g) => g.slug === selectedGameSlug) || SEED_GAMES[0]
  }, [selectedGameSlug])

  // Calculate FPS estimates
  const perfEstimate = useMemo(() => {
    return estimateGamePerformance(currentBuild, selectedGameSlug, resolution, quality)
  }, [currentBuild, selectedGameSlug, resolution, quality])

  const hasHardware = Boolean(currentBuild.cpu || currentBuild.gpu)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Methodology Note */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141414] border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00d4ff] animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-[#00d4ff] font-semibold">
              Live Hardware Simulation
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">Gaming Performance & FPS Estimator</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Simulate expected framerates across AAA and esports titles in GameRank's database based on GPU compute shaders, VRAM bandwidth, and CPU IPC.
          </p>
        </div>

        {/* Methodology Pill */}
        <div className="text-xs text-gray-400 bg-white/5 border border-white/10 p-3 rounded-xl max-w-sm flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Methodology:</strong> Calculated using architectural rasterization models and resolution pixel volume. Results represent realistic expected performance ranges.
          </span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Game Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-[#00ff88]" /> Select Title ({SEED_GAMES.length})
              </label>
              <span className="text-[11px] text-gray-500 font-mono">GameRank DB</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search GTA V, Cyberpunk, Valorant..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50"
              />
            </div>

            {/* Scrollable Game List */}
            <div className="max-h-[460px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-white/5">
              {filteredGames.map((game) => {
                const isSelected = game.slug === selectedGameSlug
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGameSlug(game.slug)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#00ff88]/15 border border-[#00ff88]/40'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-white/10 shrink-0">
                      <Image
                        src={game.coverImage}
                        alt={game.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          isSelected ? 'text-[#00ff88]' : 'text-gray-200'
                        }`}
                      >
                        {game.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {game.genres.slice(0, 2).join(' • ')}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 font-mono">
                          Score {game.criticScore}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Performance Dashboard & Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Resolution & Quality Selector Controls */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Resolution Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-[#00d4ff]" /> Target Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1080p', '1440p', '4K'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        resolution === res
                          ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff] shadow-lg shadow-[#00d4ff]/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {res}
                      <span className="block text-[9px] font-normal text-gray-500 font-mono mt-0.5">
                        {res === '1080p' ? '1920x1080' : res === '1440p' ? '2560x1440' : '3840x2160'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Preset Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#00ff88]" /> Quality Preset
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Ultra'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        quality === q
                          ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] shadow-lg shadow-[#00ff88]/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FPS Gauge Hero Display */}
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0f0f0f] border border-white/10">
            {/* Background art watermark */}
            {selectedGame && (
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none overflow-hidden">
                <Image
                  src={selectedGame.backgroundImage || selectedGame.coverImage}
                  alt={selectedGame.name}
                  fill
                  className="object-cover object-right"
                  sizes="500px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] to-transparent" />
              </div>
            )}

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    {resolution} • {quality} Settings
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedGame?.name}
                  </h3>
                </div>

                {perfEstimate && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      perfEstimate.estimatedAvgFps >= 144
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : perfEstimate.estimatedAvgFps >= 90
                        ? 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/40'
                        : perfEstimate.estimatedAvgFps >= 60
                        ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/40'
                        : perfEstimate.estimatedAvgFps >= 30
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}
                  >
                    {perfEstimate.smoothnessRating}
                  </span>
                )}
              </div>

              {/* Main FPS Range Numbers */}
              {hasHardware && perfEstimate ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Min / 1% Lows */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-gray-400 block mb-1">1% Lows (Min)</span>
                    <div className="text-3xl font-black text-gray-200 font-mono">
                      ~{perfEstimate.estimatedMinFps}{' '}
                      <span className="text-xs text-gray-400 font-normal">FPS</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Intense combat / explosion drops</span>
                  </div>

                  {/* Average FPS (Hero) */}
                  <div className="p-4 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/40 shadow-xl shadow-[#00ff88]/10">
                    <span className="text-xs text-[#00ff88] font-bold block mb-1">Estimated Average</span>
                    <div className="text-4xl sm:text-5xl font-black text-white font-mono flex items-baseline gap-2">
                      <span>{perfEstimate.estimatedAvgFps}</span>
                      <span className="text-sm font-semibold text-[#00ff88]">FPS</span>
                    </div>
                    <span className="text-[10px] text-gray-300">
                      Typical gameplay framerate
                    </span>
                  </div>

                  {/* Max FPS Peak */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-gray-400 block mb-1">Expected Peak</span>
                    <div className="text-3xl font-black text-gray-200 font-mono">
                      ~{perfEstimate.estimatedMaxFps}{' '}
                      <span className="text-xs text-gray-400 font-normal">FPS</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Indoors / low scene complexity</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-white/5 rounded-xl border border-white/10">
                  <Cpu className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-300">Select CPU and GPU in the builder</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Frame rates are computed dynamically based on your chosen hardware configuration.
                  </p>
                </div>
              )}

              {/* Visual Performance Meter Bar */}
              {perfEstimate && hasHardware && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>30 FPS (Minimum)</span>
                    <span>60 FPS (Console Standard)</span>
                    <span>144 FPS (High Refresh)</span>
                    <span>240+ FPS (Esports)</span>
                  </div>
                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-[#00ff88] to-[#00d4ff] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(5, (perfEstimate.estimatedAvgFps / 200) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* "Can It Run It?" Requirements Checklist */}
          {selectedGame?.systemRequirements && (
            <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                Official System Requirements Check
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Minimum Specs */}
                {selectedGame.systemRequirements.minimum && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="font-bold text-gray-300 uppercase tracking-wider">
                        Minimum Requirements
                      </span>
                      {perfEstimate?.meetsMinimum ? (
                        <span className="text-[#00ff88] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Met
                        </span>
                      ) : (
                        <span className="text-yellow-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">
                      <Cpu className="w-3 h-3 inline mr-1 text-gray-500" />
                      <strong>CPU:</strong> {selectedGame.systemRequirements.minimum.cpu || 'N/A'}
                    </p>
                    <p className="text-gray-400">
                      <Tv className="w-3 h-3 inline mr-1 text-gray-500" />
                      <strong>GPU:</strong> {selectedGame.systemRequirements.minimum.gpu || 'N/A'}
                    </p>
                    <p className="text-gray-400">
                      <Layers className="w-3 h-3 inline mr-1 text-gray-500" />
                      <strong>RAM:</strong> {selectedGame.systemRequirements.minimum.ram || 'N/A'}
                    </p>
                    <p className="text-gray-400">
                      <HardDrive className="w-3 h-3 inline mr-1 text-gray-500" />
                      <strong>Storage:</strong> {selectedGame.systemRequirements.minimum.storage || 'N/A'}
                    </p>
                  </div>
                )}

                {/* Recommended Specs */}
                {selectedGame.systemRequirements.recommended && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="font-bold text-gray-300 uppercase tracking-wider">
                        Recommended (60+ FPS)
                      </span>
                      {perfEstimate?.meetsRecommended ? (
                        <span className="text-[#00ff88] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Met
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Check Parts
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">
                      <Cpu className="w-3 h-3 inline mr-1 text-gray-500" />
                      <strong>CPU:</strong> {selectedGame.systemRequirements.recommended.cpu || 'N/A'}
                    </p>
                    <p className="text-gray-400">
                      <Tv className="w-3 h-3 inline mr-1 text-gray-500" />
                      <strong>GPU:</strong> {selectedGame.systemRequirements.recommended.gpu || 'N/A'}
                    </p>
                    <p className="text-gray-400">
                      <Layers className="w-3 h-3 inline mr-1 text-gray-500" />
                      <strong>RAM:</strong> {selectedGame.systemRequirements.recommended.ram || 'N/A'}
                    </p>
                    <p className="text-gray-400">
                      <HardDrive className="w-3 h-3 inline mr-1 text-gray-500" />
                      <strong>Storage:</strong> {selectedGame.systemRequirements.recommended.storage || 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
