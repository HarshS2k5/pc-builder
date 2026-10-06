'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ComponentCategory,
  AnyComponent,
  BuildParts,
  Currency,
  CPUComponent,
  GPUComponent,
  MotherboardComponent,
  RAMComponent,
  StorageComponent,
  PSUComponent,
  CaseComponent,
  CoolerComponent,
} from '@/types/pc-builder'
import { ALL_COMPONENTS, BUILD_PRESETS, findComponentById } from '@/lib/pc-builder/components-data'
import { checkCompatibility } from '@/lib/pc-builder/compatibility'
import { calculatePower } from '@/lib/pc-builder/power-calculator'
import { calculateBuildPrice, formatCurrency, getComponentPrice } from '@/lib/pc-builder/price-calculator'
import { decodeShareCodeToParts } from '@/lib/pc-builder/build-storage'

// Subcomponents & Modals
import { ComponentSelectModal } from './ComponentSelectModal'
import { CompatibilityModal } from './CompatibilityModal'
import { PerformancePlanner } from './PerformancePlanner'
import { BottleneckPanel } from './BottleneckPanel'
import { BuildScorecardView } from './BuildScorecardView'
import { ComponentCompareModal } from './ComponentCompareModal'
import { SmartWizardModal } from './SmartWizardModal'
import { SavedBuildsModal } from './SavedBuildsModal'
import { ShareBuildModal } from './ShareBuildModal'
import { ReportButton } from '@/components/report/ReportButton'

import {
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Zap,
  Box,
  Thermometer,
  ShieldCheck,
  Plus,
  Trash2,
  RefreshCw,
  Share2,
  FolderOpen,
  Sparkles,
  Scale,
  DollarSign,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Gamepad2,
  BarChart3,
  Flame,
} from 'lucide-react'

const CATEGORY_CONFIG: {
  category: ComponentCategory
  label: string
  icon: any
  description: string
}[] = [
  { category: 'cpu', label: 'CPU (Processor)', icon: Cpu, description: 'Core compute unit for gaming physics & application logic' },
  { category: 'gpu', label: 'GPU (Graphics Card)', icon: Tv, description: 'Dedicated rasterization & ray tracing rendering hardware' },
  { category: 'motherboard', label: 'Motherboard', icon: Layers, description: 'System backbone connecting all hardware components' },
  { category: 'ram', label: 'Memory (RAM)', icon: Layers, description: 'High-speed system memory for responsive multitasking' },
  { category: 'storage', label: 'Storage (SSD / HDD)', icon: HardDrive, description: 'High-speed NVMe PCIe solid-state storage' },
  { category: 'psu', label: 'Power Supply (PSU)', icon: Zap, description: 'Clean electrical power delivery with safety protections' },
  { category: 'case', label: 'PC Case (Chassis)', icon: Box, description: 'Enclosure providing structural airflow & component clearance' },
  { category: 'cooler', label: 'CPU Cooler', icon: Thermometer, description: 'Air or AIO liquid thermal dissipation system' },
]

export function PCBuilderMain() {
  const searchParams = useSearchParams()

  // Build state initialized with a balanced default preset (1440p Sweetspot)
  const [currentBuild, setCurrentBuild] = useState<BuildParts>(() => {
    const defaultPreset = BUILD_PRESETS[1] // 1080p / 1440p Sweet Spot
    const parts: BuildParts = {}
    for (const [cat, id] of Object.entries(defaultPreset.partIds)) {
      const comp = findComponentById(id)
      if (comp) (parts as any)[cat] = comp
    }
    return parts
  })

  // Selected Currency: INR (₹) prominently supported, plus USD, EUR, GBP
  const [currency, setCurrency] = useState<Currency>('INR')

  // Active Tab: 'builder' | 'performance' | 'bottleneck' | 'scorecard' | 'presets'
  const [activeTab, setActiveTab] = useState<'builder' | 'performance' | 'bottleneck' | 'scorecard' | 'presets'>('builder')

  // Modal States
  const [modalCategory, setModalCategory] = useState<ComponentCategory | null>(null)
  const [showCompatModal, setShowCompatModal] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [showWizardModal, setShowWizardModal] = useState(false)
  const [showSavedModal, setShowSavedModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

  // URL Config Hydration
  useEffect(() => {
    const configParam = searchParams.get('config') || searchParams.get('share')
    if (configParam) {
      const decoded = decodeShareCodeToParts(configParam)
      if (Object.keys(decoded).length > 0) {
        setCurrentBuild(decoded)
      }
    }
  }, [searchParams])

  // Calculations
  const compatReport = useMemo(() => checkCompatibility(currentBuild), [currentBuild])
  const powerReport = useMemo(() => calculatePower(currentBuild), [currentBuild])
  const priceReport = useMemo(() => calculateBuildPrice(currentBuild, currency), [currentBuild, currency])

  // Component Management Handlers
  const handleSelectComponent = (comp: AnyComponent) => {
    setCurrentBuild((prev) => ({
      ...prev,
      [comp.category]: comp,
    }))
  }

  const handleRemoveComponent = (category: ComponentCategory) => {
    setCurrentBuild((prev) => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  const handleResetBuild = () => {
    if (window.confirm('Reset all components to start fresh?')) {
      setCurrentBuild({})
    }
  }

  const handleLoadPreset = (preset: typeof BUILD_PRESETS[0]) => {
    const parts: BuildParts = {}
    for (const [cat, id] of Object.entries(preset.partIds)) {
      const comp = findComponentById(id)
      if (comp) (parts as any)[cat] = comp
    }
    setCurrentBuild(parts)
    setActiveTab('builder')
  }

  const filledCount = Object.values(currentBuild).filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Top Banner & Header */}
      <div className="relative border-b border-white/10 bg-[#121212]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#00ff88]/15 border border-[#00ff88]/40 text-[#00ff88]">
                  TechForge Lab v2.5
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  Hardware Compatibility & Performance Engine
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>PC Builder & Performance Planner</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
                Design your custom battlestation, inspect socket compatibility in real-time, predict game framerates, and calculate electrical loads.
              </p>
            </div>

            {/* Quick Control Bar: Currency & Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Currency Selector */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currency === cur
                        ? 'bg-[#00ff88] text-black shadow-md shadow-[#00ff88]/20'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {cur === 'INR' ? '₹ INR' : cur === 'USD' ? '$ USD' : cur === 'EUR' ? '€ EUR' : '£ GBP'}
                  </button>
                ))}
              </div>

              {/* Action Modals */}
              <button
                onClick={() => setShowWizardModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] hover:opacity-95 text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00ff88]/20 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Wizard</span>
              </button>

              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/10 transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Parts</span>
              </button>

              <button
                onClick={() => setShowSavedModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/10 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Saved ({getSavedCount()})</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/10 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <ReportButton
                variant="button"
                contextPage="/pc-builder"
                label="Report Issue"
              />
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-8 border-b border-white/10 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'builder', label: 'Hardware Configurator', icon: Cpu, badge: `${filledCount}/8` },
              { id: 'performance', label: 'Game FPS & Database', icon: Gamepad2 },
              { id: 'bottleneck', label: 'Bottleneck & Balance', icon: Scale },
              { id: 'scorecard', label: 'Build Scorecard', icon: BarChart3 },
              { id: 'presets', label: 'Curated Builds', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-[#00ff88] text-[#00ff88] bg-white/[0.02]'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300 font-mono">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Main Hardware Builder */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Component Slots (8 Columns) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold font-mono">
                  Primary Hardware Slots
                </span>
                <button
                  onClick={handleResetBuild}
                  className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Build
                </button>
              </div>

              {/* Slot Cards List */}
              <div className="space-y-3">
                {CATEGORY_CONFIG.map(({ category, label, icon: Icon, description }) => {
                  const item = currentBuild[category]

                  return (
                    <div
                      key={category}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        item
                          ? 'bg-[#141414] border-white/10 hover:border-white/20'
                          : 'bg-white/[0.015] border-dashed border-white/15 hover:border-white/30 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Left: Icon & Info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                              item
                                ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]'
                                : 'bg-white/5 border-white/10 text-gray-500'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                                {label}
                              </span>
                              {item && (
                                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-gray-400 font-mono">
                                  {item.brand}
                                </span>
                              )}
                            </div>

                            {item ? (
                              <>
                                <h3 className="text-base font-bold text-white truncate">
                                  {item.name}
                                </h3>
                                <div className="flex flex-wrap gap-1.5 text-xs text-gray-300 pt-0.5">
                                  {renderSlotDetailChips(item)}
                                </div>
                              </>
                            ) : (
                              <div>
                                <h4 className="text-sm font-medium text-gray-400">
                                  No component selected
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-1">{description}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Price & Buttons */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                          {item ? (
                            <>
                              <div className="text-right">
                                <div className="text-base sm:text-lg font-bold text-white font-mono">
                                  {formatCurrency(getComponentPrice(item, currency), currency)}
                                </div>
                                <span className="text-[10px] text-gray-500 uppercase font-mono block">
                                  Indicative MSRP
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setModalCategory(category)}
                                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                                >
                                  Change
                                </button>
                                <button
                                  onClick={() => handleRemoveComponent(category)}
                                  aria-label={`Remove ${label}`}
                                  className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              onClick={() => setModalCategory(category)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88]/30 text-[#00ff88] text-xs font-bold transition-all hover:scale-[1.02]"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Select {label.split(' ')[0]}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sidebar Summary & Telemetry (4 Columns) */}
            <div className="lg:col-span-4 space-y-6 sticky top-20">
              {/* Build Cost Card */}
              <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-mono block">
                      Estimated Build Price
                    </span>
                    <div className="text-3xl font-black font-mono text-white mt-1">
                      {priceReport.formattedTotal}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-lg border border-[#00ff88]/20">
                    {filledCount} of 8 Chosen
                  </span>
                </div>

                {/* Price Stats */}
                <div className="space-y-2 text-xs">
                  {priceReport.cheapestComponent && (
                    <div className="flex justify-between text-gray-400">
                      <span>Cheapest Part:</span>
                      <span className="font-mono text-gray-200 truncate max-w-[170px]">
                        {priceReport.cheapestComponent.name} ({formatCurrency(priceReport.cheapestComponent.price, currency)})
                      </span>
                    </div>
                  )}
                  {priceReport.mostExpensiveComponent && (
                    <div className="flex justify-between text-gray-400">
                      <span>Highest Investment:</span>
                      <span className="font-mono text-gray-200 truncate max-w-[170px]">
                        {priceReport.mostExpensiveComponent.name} ({formatCurrency(priceReport.mostExpensiveComponent.price, currency)})
                      </span>
                    </div>
                  )}
                </div>

                {/* Compatibility Quick Banner */}
                <div
                  onClick={() => setShowCompatModal(true)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between ${
                    compatReport.status === 'compatible'
                      ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]'
                      : compatReport.status === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {compatReport.status === 'compatible' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                    {compatReport.status === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
                    {compatReport.status === 'incompatible' && <XCircle className="w-5 h-5 shrink-0" />}
                    <div className="text-xs">
                      <span className="font-bold block">
                        {compatReport.status === 'compatible' && '🟢 100% Compatible'}
                        {compatReport.status === 'warning' && '🟡 Clearance / Power Note'}
                        {compatReport.status === 'incompatible' && '🔴 Incompatibility Found'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {compatReport.issues.length === 0
                          ? 'Zero conflicts detected'
                          : `${compatReport.issues.length} check(s) flagged`}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>

                {/* Power & PSU Telemetry Gauge */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-yellow-400" /> Power Requirement
                    </span>
                    <span className="font-mono text-gray-400">
                      ~{powerReport.totalEstimatedWatts}W Load
                    </span>
                  </div>

                  {/* Power progress bar */}
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        powerReport.powerStatus === 'insufficient'
                          ? 'bg-red-500'
                          : powerReport.powerStatus === 'tight'
                          ? 'bg-yellow-500'
                          : 'bg-[#00ff88]'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (powerReport.totalEstimatedWatts / Math.max(powerReport.recommendedPsuWatts, 500)) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Rec. PSU: <strong className="text-white font-mono">{powerReport.recommendedPsuWatts}W</strong></span>
                    {powerReport.installedPsuWatts && (
                      <span>Installed: <strong className="text-[#00ff88] font-mono">{powerReport.installedPsuWatts}W</strong></span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    {powerReport.message}
                  </p>
                </div>
              </div>

              {/* Quick Preset Selector Widget */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold font-mono block">
                  Quick Load Balanced Preset
                </span>
                <div className="space-y-2">
                  {BUILD_PRESETS.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleLoadPreset(p)}
                      className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="font-bold text-gray-200 group-hover:text-[#00ff88] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {formatCurrency(currency === 'INR' ? p.targetBudgetInr : p.targetBudgetUsd, currency)}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Performance Planner */}
        {activeTab === 'performance' && (
          <PerformancePlanner currentBuild={currentBuild} />
        )}

        {/* Tab 3: Bottleneck Estimator */}
        {activeTab === 'bottleneck' && (
          <BottleneckPanel currentBuild={currentBuild} />
        )}

        {/* Tab 4: System Scorecard */}
        {activeTab === 'scorecard' && (
          <BuildScorecardView currentBuild={currentBuild} />
        )}

        {/* Tab 5: Curated Presets */}
        {activeTab === 'presets' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10">
              <h2 className="text-2xl font-bold text-white">Curated Engineering Presets</h2>
              <p className="text-sm text-gray-400 mt-1 max-w-2xl">
                Ready-to-assemble configurations hand-tuned for price-to-performance, component synergy, and zero physical clearance issues.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BUILD_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#00ff88]/40 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#00ff88] font-mono bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/20">
                      {preset.useCase}
                    </span>
                    <h3 className="text-lg font-bold text-white">{preset.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{preset.description}</p>
                    <div className="text-xl font-black font-mono text-white pt-2">
                      {formatCurrency(currency === 'INR' ? preset.targetBudgetInr : preset.targetBudgetUsd, currency)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleLoadPreset(preset)}
                    className="w-full py-2.5 rounded-xl bg-[#00ff88] hover:bg-[#00e87a] text-black font-bold text-xs shadow-lg shadow-[#00ff88]/20 transition-all"
                  >
                    Load This Build
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Build Summary Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-xl border-t border-white/10 p-3 px-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 font-mono block">Total ({currency})</span>
          <span className="text-lg font-black font-mono text-white">
            {priceReport.formattedTotal}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCompatModal(true)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border ${
              compatReport.status === 'compatible'
                ? 'bg-[#00ff88]/15 border-[#00ff88]/40 text-[#00ff88]'
                : 'bg-red-500/15 border-red-500/40 text-red-300'
            }`}
          >
            {compatReport.status === 'compatible' ? '🟢 Pass' : '⚠️ Issue'}
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'performance' ? 'builder' : 'performance')}
            className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-semibold"
          >
            {activeTab === 'performance' ? 'Builder' : 'FPS Test'}
          </button>

          <ReportButton variant="compact" contextPage="/pc-builder" />
        </div>
      </div>

      {/* Component Selection Modal */}
      {modalCategory && (
        <ComponentSelectModal
          category={modalCategory}
          isOpen={Boolean(modalCategory)}
          onClose={() => setModalCategory(null)}
          onSelect={handleSelectComponent}
          currentBuild={currentBuild}
          currency={currency}
        />
      )}

      {/* Deep Compatibility Breakdown Modal */}
      <CompatibilityModal
        isOpen={showCompatModal}
        onClose={() => setShowCompatModal(false)}
        report={compatReport}
      />

      {/* Component Compare Matrix Modal */}
      <ComponentCompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        currency={currency}
        onSelectComponentToBuild={handleSelectComponent}
      />

      {/* Smart Build Wizard Modal */}
      <SmartWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        currency={currency}
        onApplyBuild={(parts) => setCurrentBuild(parts)}
      />

      {/* Saved Builds Modal */}
      <SavedBuildsModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        currentBuild={currentBuild}
        currency={currency}
        onLoadBuild={(parts) => setCurrentBuild(parts)}
      />

      {/* Share Build Modal */}
      <ShareBuildModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        currentBuild={currentBuild}
        currency={currency}
      />
    </div>
  )
}

function getSavedCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem('gamerank_techforge_saved_builds_v1')
    if (!raw) return 0
    return JSON.parse(raw).length
  } catch {
    return 0
  }
}

function renderSlotDetailChips(item: AnyComponent) {
  if (item.category === 'cpu') {
    const cpu = item as CPUComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{cpu.cores}C / {cpu.threads}T</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{cpu.socket}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{cpu.boostClockGhz} GHz Boost</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{cpu.tdpWatts}W TDP</span>
      </>
    )
  }
  if (item.category === 'gpu') {
    const gpu = item as GPUComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{gpu.vramGb}GB {gpu.vramType}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{gpu.lengthMm}mm</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{gpu.tdpWatts}W</span>
      </>
    )
  }
  if (item.category === 'motherboard') {
    const mb = item as MotherboardComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{mb.socket}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{mb.formFactor}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{mb.ramGen}</span>
      </>
    )
  }
  if (item.category === 'ram') {
    const ram = item as RAMComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{ram.capacityGb}GB ({ram.modulesCount} Sticks)</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{ram.gen}-{ram.speedMhz}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">CL{ram.casLatency}</span>
      </>
    )
  }
  if (item.category === 'storage') {
    const s = item as StorageComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{s.capacityGb >= 1000 ? `${s.capacityGb / 1000}TB` : `${s.capacityGb}GB`}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{s.type}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{s.readSpeedMbps} MB/s</span>
      </>
    )
  }
  if (item.category === 'psu') {
    const psu = item as PSUComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{psu.wattage}W</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{psu.efficiency}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{psu.modularity}</span>
      </>
    )
  }
  if (item.category === 'case') {
    const c = item as CaseComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{c.formFactor}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">Max GPU {c.maxGpuLengthMm}mm</span>
      </>
    )
  }
  if (item.category === 'cooler') {
    const col = item as CoolerComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">{col.type}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">Up to {col.maxTdpRatingWatts}W</span>
      </>
    )
  }
  return null
}
