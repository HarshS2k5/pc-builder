'use client'

import React, { useState, useMemo } from 'react'
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
import { ALL_COMPONENTS } from '@/lib/pc-builder/components-data'
import { checkCompatibility } from '@/lib/pc-builder/compatibility'
import { formatCurrency, getComponentPrice } from '@/lib/pc-builder/price-calculator'
import { CheckPriceButton } from './CheckPriceButton'
import {
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  Sparkles,
  Zap,
  Layers,
  ArrowUpDown,
  ShieldCheck,
} from 'lucide-react'

interface ComponentSelectModalProps {
  category: ComponentCategory
  isOpen: boolean
  onClose: () => void
  onSelect: (component: AnyComponent) => void
  currentBuild: BuildParts
  currency: Currency
}

const CATEGORY_TITLES: Record<ComponentCategory, string> = {
  cpu: 'Processor (CPU)',
  gpu: 'Graphics Card (GPU)',
  motherboard: 'Motherboard',
  ram: 'Memory (RAM)',
  storage: 'Storage (SSD / HDD)',
  psu: 'Power Supply (PSU)',
  case: 'PC Case (Chassis)',
  cooler: 'CPU Cooler',
}

export function ComponentSelectModal({
  category,
  isOpen,
  onClose,
  onSelect,
  currentBuild,
  currency,
}: ComponentSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyCompatible, setOnlyCompatible] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedSubfilter, setSelectedSubfilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'perf-desc' | 'name-asc'>('price-asc')

  const availableComponents = ALL_COMPONENTS[category] || []

  // Extract unique brands for filters
  const brands = useMemo(() => {
    const set = new Set<string>()
    availableComponents.forEach((c) => set.add(c.brand))
    return ['all', ...Array.from(set)]
  }, [availableComponents])

  // Compute compatibility per component relative to currently selected other parts
  const evaluatedComponents = useMemo(() => {
    return availableComponents.map((comp) => {
      // Mock build with this component slotted in
      const testBuild: BuildParts = {
        ...currentBuild,
        [category]: comp,
      }
      const report = checkCompatibility(testBuild)

      // Find if any issue directly implicates this component
      const componentIssues = report.issues.filter(
        (i) => i.componentA === comp.name || i.componentB === comp.name
      )

      let status: 'compatible' | 'warning' | 'incompatible' = 'compatible'
      if (componentIssues.some((i) => i.severity === 'error')) {
        status = 'incompatible'
      } else if (componentIssues.some((i) => i.severity === 'warning')) {
        status = 'warning'
      }

      return {
        comp,
        status,
        issues: componentIssues,
        price: getComponentPrice(comp, currency),
      }
    })
  }, [availableComponents, currentBuild, category, currency])

  // Filter and sort
  const filteredList = useMemo(() => {
    let result = evaluatedComponents.filter(({ comp, status }) => {
      // Compatibility filter
      if (onlyCompatible && status === 'incompatible') return false

      // Brand filter
      if (selectedBrand !== 'all' && comp.brand !== selectedBrand) return false

      // Category-specific subfilters
      if (selectedSubfilter !== 'all') {
        if (category === 'cpu') {
          const cpu = comp as CPUComponent
          if (selectedSubfilter === 'AM5' && cpu.socket !== 'AM5') return false
          if (selectedSubfilter === 'LGA1700' && cpu.socket !== 'LGA1700') return false
          if (selectedSubfilter === 'AM4' && cpu.socket !== 'AM4') return false
        } else if (category === 'motherboard') {
          const mb = comp as MotherboardComponent
          if (selectedSubfilter === 'DDR5' && mb.ramGen !== 'DDR5') return false
          if (selectedSubfilter === 'DDR4' && mb.ramGen !== 'DDR4') return false
        } else if (category === 'ram') {
          const ram = comp as RAMComponent
          if (selectedSubfilter === 'DDR5' && ram.gen !== 'DDR5') return false
          if (selectedSubfilter === 'DDR4' && ram.gen !== 'DDR4') return false
        } else if (category === 'cooler') {
          const cooler = comp as CoolerComponent
          if (selectedSubfilter === 'Air' && cooler.type !== 'Air') return false
          if (selectedSubfilter === 'AIO' && !cooler.type.includes('AIO')) return false
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = comp.name.toLowerCase().includes(q)
        const matchBrand = comp.brand.toLowerCase().includes(q)
        return matchName || matchBrand
      }

      return true
    })

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'name-asc') return a.comp.name.localeCompare(b.comp.name)
      if (sortBy === 'perf-desc') {
        const tierOrder = { enthusiast: 4, high: 3, mid: 2, entry: 1 }
        return (tierOrder[b.comp.tier] || 0) - (tierOrder[a.comp.tier] || 0)
      }
      return 0
    })

    return result
  }, [
    evaluatedComponents,
    onlyCompatible,
    selectedBrand,
    selectedSubfilter,
    searchQuery,
    sortBy,
    category,
  ])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Select {CATEGORY_TITLES[category]}
              </h2>
              <p className="text-xs text-gray-400">
                Verified hardware specifications • Accurate pricing
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

        {/* Search & Filters Control Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 space-y-3 bg-[#111111]">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${CATEGORY_TITLES[category]}...`}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50 focus:bg-white/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort components"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-[#00ff88]/50 cursor-pointer"
                >
                  <option value="price-asc" className="bg-[#1a1a1a]">Price: Low to High</option>
                  <option value="price-desc" className="bg-[#1a1a1a]">Price: High to Low</option>
                  <option value="perf-desc" className="bg-[#1a1a1a]">Performance Tier</option>
                  <option value="name-asc" className="bg-[#1a1a1a]">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* Compatibility Toggle Button */}
              <button
                type="button"
                onClick={() => setOnlyCompatible(!onlyCompatible)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  onlyCompatible
                    ? 'bg-[#00ff88]/15 border-[#00ff88]/50 text-[#00ff88]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Compatible Only</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-gray-500 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Brand:
            </span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  selectedBrand === b
                    ? 'bg-white/20 border-white text-white font-medium'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
                }`}
              >
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}

            {/* Category specific chips */}
            {category === 'cpu' && (
              <>
                <span className="text-gray-500 ml-2">Socket:</span>
                {['all', 'AM5', 'LGA1700', 'AM4'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubfilter(s)}
                    className={`px-2 py-0.5 rounded-lg border text-xs ${
                      selectedSubfilter === s
                        ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {s === 'all' ? 'All Sockets' : s}
                  </button>
                ))}
              </>
            )}

            {(category === 'motherboard' || category === 'ram') && (
              <>
                <span className="text-gray-500 ml-2">Gen:</span>
                {['all', 'DDR5', 'DDR4'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedSubfilter(g)}
                    className={`px-2 py-0.5 rounded-lg border text-xs ${
                      selectedSubfilter === g
                        ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {g === 'all' ? 'All' : g}
                  </button>
                ))}
              </>
            )}

            {category === 'cooler' && (
              <>
                <span className="text-gray-500 ml-2">Type:</span>
                {['all', 'Air', 'AIO'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedSubfilter(t)}
                    className={`px-2 py-0.5 rounded-lg border text-xs ${
                      selectedSubfilter === t
                        ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {t === 'all' ? 'All' : t}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Component List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-white/5">
          {filteredList.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-gray-500 mb-3">
                <Filter className="w-6 h-6" />
              </div>
              <p className="text-gray-300 font-medium">No matching components found</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try loosening your search query or toggling "Compatible Only" off to inspect incompatible options.
              </p>
              {onlyCompatible && (
                <button
                  onClick={() => setOnlyCompatible(false)}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 text-xs text-white rounded-lg transition-colors"
                >
                  Show Incompatible Parts Too
                </button>
              )}
            </div>
          ) : (
            filteredList.map(({ comp, status, issues, price }) => {
              const isSelected = currentBuild[category]?.id === comp.id

              return (
                <div
                  key={comp.id}
                  className={`pt-3 first:pt-0 group p-3 sm:p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#00ff88]/10 border-[#00ff88]/40'
                      : status === 'incompatible'
                      ? 'bg-red-950/10 border-red-900/30 opacity-75 hover:opacity-100'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Info & Specs */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Chip */}
                        {status === 'compatible' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00ff88] bg-[#00ff88]/15 px-2 py-0.5 rounded-full border border-[#00ff88]/30">
                            <CheckCircle2 className="w-3 h-3" /> Compatible
                          </span>
                        )}
                        {status === 'warning' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-400 bg-yellow-400/15 px-2 py-0.5 rounded-full border border-yellow-400/30">
                            <AlertTriangle className="w-3 h-3" /> Note
                          </span>
                        )}
                        {status === 'incompatible' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-400/15 px-2 py-0.5 rounded-full border border-red-400/30">
                            <XCircle className="w-3 h-3" /> Incompatible
                          </span>
                        )}

                        {/* Tier */}
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono">
                          {comp.tier} tier
                        </span>

                        {comp.releaseYear && (
                          <span className="text-[10px] text-gray-500 font-mono">
                            {comp.releaseYear}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-semibold text-white group-hover:text-[#00ff88] transition-colors">
                        {comp.name}
                      </h3>

                      {/* Technical Spec Summary Chips */}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                        {renderSpecChips(comp)}
                      </div>

                      {/* Warning/Error Explanations if any */}
                      {issues.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {issues.map((iss, idx) => (
                            <div
                              key={idx}
                              className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-start gap-2 ${
                                iss.severity === 'error'
                                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                              }`}
                            >
                              <span className="font-bold shrink-0">
                                {iss.severity === 'error' ? '🔴 Issue:' : '🟡 Warning:'}
                              </span>
                              <span>{iss.message}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Price & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold text-white font-mono">
                          {formatCurrency(price, currency)}
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                          Verified Price
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckPriceButton component={comp} currency={currency} variant="compact" />
                        <button
                          onClick={() => {
                            onSelect(comp)
                            onClose()
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                              : status === 'incompatible'
                              ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                              : 'bg-[#00ff88] text-black hover:bg-[#00e87a] shadow-lg shadow-[#00ff88]/20 hover:scale-[1.02]'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Choose Part'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#141414] flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-300">{filteredList.length}</strong> of{' '}
            {availableComponents.length} {CATEGORY_TITLES[category]} options
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white underline underline-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function renderSpecChips(comp: AnyComponent) {
  if (comp.category === 'cpu') {
    const cpu = comp as CPUComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Socket: {cpu.socket}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{cpu.cores} Cores / {cpu.threads} Threads</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Up to {cpu.boostClockGhz} GHz</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">TDP: {cpu.tdpWatts}W</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{cpu.supportedRamGen.join('/')}</span>
      </>
    )
  }
  if (comp.category === 'gpu') {
    const gpu = comp as GPUComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{gpu.vramGb}GB {gpu.vramType}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Length: {gpu.lengthMm}mm</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">TDP: {gpu.tdpWatts}W</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Rec. PSU: {gpu.recommendedPsuWatts}W</span>
      </>
    )
  }
  if (comp.category === 'motherboard') {
    const mb = comp as MotherboardComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{mb.socket} ({mb.chipset})</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{mb.formFactor}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{mb.ramGen} ({mb.ramSlots} slots)</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{mb.m2Slots}x M.2 Slots</span>
        {mb.wifiIncluded && <span className="text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/20">WiFi Included</span>}
      </>
    )
  }
  if (comp.category === 'ram') {
    const ram = comp as RAMComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{ram.capacityGb}GB ({ram.modulesCount}x{ram.capacityGb / ram.modulesCount}GB)</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{ram.gen}-{ram.speedMhz}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">CL{ram.casLatency}</span>
        {ram.rgb && <span className="text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">RGB</span>}
      </>
    )
  }
  if (comp.category === 'storage') {
    const s = comp as StorageComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{s.capacityGb >= 1000 ? `${s.capacityGb / 1000}TB` : `${s.capacityGb}GB`}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{s.type}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Read: {s.readSpeedMbps} MB/s</span>
      </>
    )
  }
  if (comp.category === 'psu') {
    const psu = comp as PSUComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{psu.wattage}W</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{psu.efficiency}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{psu.modularity} Modular</span>
        {psu.atx3Compatible && <span className="text-[#00d4ff] bg-[#00d4ff]/10 px-2 py-0.5 rounded border border-[#00d4ff]/20">ATX 3.0</span>}
      </>
    )
  }
  if (comp.category === 'case') {
    const c = comp as CaseComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{c.formFactor}</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Max GPU: {c.maxGpuLengthMm}mm</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Max Cooler: {c.maxCoolerHeightMm}mm</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{c.includedFansCount} Fans</span>
      </>
    )
  }
  if (comp.category === 'cooler') {
    const col = comp as CoolerComponent
    return (
      <>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Type: {col.type}</span>
        {col.heightMm > 0 && <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Height: {col.heightMm}mm</span>}
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Rated TDP: {col.maxTdpRatingWatts}W</span>
        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{col.noiseLevelDb} dB</span>
      </>
    )
  }
  return null
}
