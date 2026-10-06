'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ComponentCategory,
  AnyComponent,
  CPUComponent,
  GPUComponent,
  MotherboardComponent,
  RAMComponent,
  StorageComponent,
  PSUComponent,
  CaseComponent,
  CoolerComponent,
  Currency,
} from '@/types/pc-builder'
import { ALL_COMPONENTS, findComponentById } from '@/lib/pc-builder/components-data'
import { formatCurrency, getComponentPrice } from '@/lib/pc-builder/price-calculator'
import { CheckPriceButton } from '@/components/pc-builder/CheckPriceButton'
import { trackAnalyticsEvent } from '@/lib/analytics/tracker'
import {
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Zap,
  Box,
  Thermometer,
  Scale,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

const CATEGORIES: { id: ComponentCategory; label: string; icon: any }[] = [
  { id: 'cpu', label: 'Processors (CPU)', icon: Cpu },
  { id: 'gpu', label: 'Graphics Cards (GPU)', icon: Tv },
  { id: 'motherboard', label: 'Motherboards', icon: Layers },
  { id: 'ram', label: 'Memory (RAM)', icon: Layers },
  { id: 'storage', label: 'Storage (SSDs)', icon: HardDrive },
  { id: 'psu', label: 'Power Supplies (PSU)', icon: Zap },
  { id: 'case', label: 'PC Cases', icon: Box },
  { id: 'cooler', label: 'CPU Coolers', icon: Thermometer },
]

export function CompareStudio() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('cpu')
  const [currency, setCurrency] = useState<Currency>('INR')

  const availableParts = useMemo(
    () => ALL_COMPONENTS[activeCategory] || [],
    [activeCategory]
  )

  const [partAId, setPartAId] = useState<string>(() => availableParts[0]?.id || '')
  const [partBId, setPartBId] = useState<string>(() => availableParts[1]?.id || '')

  // Hydrate from searchParams
  useEffect(() => {
    const cat = searchParams.get('cat') as ComponentCategory | null
    const a = searchParams.get('a')
    const b = searchParams.get('b')

    if (cat && ALL_COMPONENTS[cat]) {
      setActiveCategory(cat)
      const parts = ALL_COMPONENTS[cat]
      if (a && findComponentById(a)) setPartAId(a)
      else if (parts[0]) setPartAId(parts[0].id)

      if (b && findComponentById(b)) setPartBId(b)
      else if (parts[1]) setPartBId(parts[1].id)
    }
  }, [searchParams])

  // Keep state valid when switching category
  const handleCategoryChange = (cat: ComponentCategory) => {
    setActiveCategory(cat)
    const list = ALL_COMPONENTS[cat] || []
    setPartAId(list[0]?.id || '')
    setPartBId(list[1]?.id || '')

    trackAnalyticsEvent('comparison_viewed', {
      category: cat,
      partA: list[0]?.id,
      partB: list[1]?.id,
    })
  }

  const partA = useMemo(() => findComponentById(partAId), [partAId])
  const partB = useMemo(() => findComponentById(partBId), [partBId])

  const renderSpecsRows = () => {
    if (!partA || !partB) return null

    switch (activeCategory) {
      case 'cpu': {
        const a = partA as CPUComponent
        const b = partB as CPUComponent
        return [
          { label: 'Socket', valA: a.socket, valB: b.socket },
          { label: 'Cores / Threads', valA: `${a.cores}C / ${a.threads}T`, valB: `${b.cores}C / ${b.threads}T` },
          { label: 'Base Clock', valA: `${a.baseClockGhz} GHz`, valB: `${b.baseClockGhz} GHz` },
          { label: 'Boost Clock', valA: `${a.boostClockGhz} GHz`, valB: `${b.boostClockGhz} GHz`, winA: a.boostClockGhz > b.boostClockGhz, winB: b.boostClockGhz > a.boostClockGhz },
          { label: 'L3 Cache', valA: `${a.l3CacheMb} MB`, valB: `${b.l3CacheMb} MB`, winA: a.l3CacheMb > b.l3CacheMb, winB: b.l3CacheMb > a.l3CacheMb },
          { label: 'TDP / Max Power', valA: `${a.tdpWatts}W (${a.peakPowerWatts}W)`, valB: `${b.tdpWatts}W (${b.peakPowerWatts}W)` },
          { label: 'Supported RAM', valA: a.supportedRamGen.join(', '), valB: b.supportedRamGen.join(', ') },
          { label: 'Single-Thread Index', valA: `${a.singleThreadScore} / 100`, valB: `${b.singleThreadScore} / 100`, winA: a.singleThreadScore > b.singleThreadScore, winB: b.singleThreadScore > a.singleThreadScore },
          { label: 'Multi-Thread Index', valA: `${a.multiThreadScore} / 100`, valB: `${b.multiThreadScore} / 100`, winA: a.multiThreadScore > b.multiThreadScore, winB: b.multiThreadScore > a.multiThreadScore },
        ]
      }
      case 'gpu': {
        const a = partA as GPUComponent
        const b = partB as GPUComponent
        return [
          { label: 'Chipmaker', valA: a.chipmaker, valB: b.chipmaker },
          { label: 'VRAM Capacity', valA: `${a.vramGb} GB`, valB: `${b.vramGb} GB`, winA: a.vramGb > b.vramGb, winB: b.vramGb > a.vramGb },
          { label: 'Memory Type', valA: a.vramType, valB: b.vramType },
          { label: 'TDP Power Draw', valA: `${a.tdpWatts} W`, valB: `${b.tdpWatts} W`, winA: a.tdpWatts < b.tdpWatts, winB: b.tdpWatts < a.tdpWatts },
          { label: 'Card Length', valA: `${a.lengthMm} mm`, valB: `${b.lengthMm} mm` },
          { label: '1080p Raster Score', valA: `${a.rasterScore1080p} / 100`, valB: `${b.rasterScore1080p} / 100`, winA: a.rasterScore1080p > b.rasterScore1080p, winB: b.rasterScore1080p > a.rasterScore1080p },
          { label: '1440p Raster Score', valA: `${a.rasterScore1440p} / 100`, valB: `${b.rasterScore1440p} / 100`, winA: a.rasterScore1440p > b.rasterScore1440p, winB: b.rasterScore1440p > a.rasterScore1440p },
          { label: '4K Raster Score', valA: `${a.rasterScore4k} / 100`, valB: `${b.rasterScore4k} / 100`, winA: a.rasterScore4k > b.rasterScore4k, winB: b.rasterScore4k > a.rasterScore4k },
          { label: 'Ray Tracing Index', valA: `${a.rayTracingScore} / 100`, valB: `${b.rayTracingScore} / 100`, winA: a.rayTracingScore > b.rayTracingScore, winB: b.rayTracingScore > a.rayTracingScore },
        ]
      }
      case 'motherboard': {
        const a = partA as MotherboardComponent
        const b = partB as MotherboardComponent
        return [
          { label: 'Socket', valA: a.socket, valB: b.socket },
          { label: 'Chipset', valA: a.chipset, valB: b.chipset },
          { label: 'Form Factor', valA: a.formFactor, valB: b.formFactor },
          { label: 'RAM Generation', valA: a.ramGen, valB: b.ramGen },
          { label: 'RAM Slots', valA: `${a.ramSlots} DIMMs`, valB: `${b.ramSlots} DIMMs` },
          { label: 'M.2 NVMe Slots', valA: `${a.m2Slots} slots`, valB: `${b.m2Slots} slots`, winA: a.m2Slots > b.m2Slots, winB: b.m2Slots > a.m2Slots },
          { label: 'Integrated Wi-Fi', valA: a.wifiIncluded ? 'Yes' : 'No', valB: b.wifiIncluded ? 'Yes' : 'No' },
        ]
      }
      case 'ram': {
        const a = partA as RAMComponent
        const b = partB as RAMComponent
        return [
          { label: 'Generation', valA: a.gen, valB: b.gen },
          { label: 'Capacity', valA: `${a.capacityGb} GB`, valB: `${b.capacityGb} GB`, winA: a.capacityGb > b.capacityGb, winB: b.capacityGb > a.capacityGb },
          { label: 'Speed', valA: `${a.speedMhz} MHz`, valB: `${b.speedMhz} MHz`, winA: a.speedMhz > b.speedMhz, winB: b.speedMhz > a.speedMhz },
          { label: 'Module Count', valA: `${a.modulesCount} Sticks`, valB: `${b.modulesCount} Sticks` },
          { label: 'CAS Latency', valA: `CL${a.casLatency}`, valB: `CL${b.casLatency}`, winA: a.casLatency < b.casLatency, winB: b.casLatency < a.casLatency },
        ]
      }
      case 'storage': {
        const a = partA as StorageComponent
        const b = partB as StorageComponent
        return [
          { label: 'Drive Type', valA: a.type, valB: b.type },
          { label: 'Capacity', valA: `${a.capacityGb} GB`, valB: `${b.capacityGb} GB`, winA: a.capacityGb > b.capacityGb, winB: b.capacityGb > a.capacityGb },
          { label: 'Seq. Read Speed', valA: `${a.readSpeedMbps} MB/s`, valB: `${b.readSpeedMbps} MB/s`, winA: a.readSpeedMbps > b.readSpeedMbps, winB: b.readSpeedMbps > a.readSpeedMbps },
          { label: 'Seq. Write Speed', valA: `${a.writeSpeedMbps} MB/s`, valB: `${b.writeSpeedMbps} MB/s`, winA: a.writeSpeedMbps > b.writeSpeedMbps, winB: b.writeSpeedMbps > a.writeSpeedMbps },
          { label: 'Interface', valA: a.interface, valB: b.interface },
        ]
      }
      default: {
        return [
          { label: 'Brand', valA: partA.brand, valB: partB.brand },
          { label: 'Category', valA: partA.category, valB: partB.category },
          { label: 'Tier', valA: partA.tier, valB: partB.tier },
        ]
      }
    }
  }

  const specRows = renderSpecsRows() || []

  return (
    <div className="space-y-8">
      {/* Category Pills & Currency Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const active = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#00ff88] text-black shadow-md shadow-[#00ff88]/20'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 self-end sm:self-auto">
          {(['INR', 'USD'] as Currency[]).map((cur) => (
            <button
              key={cur}
              onClick={() => setCurrency(cur)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                currency === cur ? 'bg-[#00d4ff] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {cur === 'INR' ? '₹ INR' : '$ USD'}
            </button>
          ))}
        </div>
      </div>

      {/* Component Selectors Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Component A Selector */}
        <div className="p-6 rounded-3xl bg-[#12141a] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-[#00ff88]">
              Option A
            </span>
            {partA && (
              <span className="text-lg font-black font-mono text-white">
                {formatCurrency(getComponentPrice(partA, currency), currency)}
              </span>
            )}
          </div>

          <select
            value={partAId}
            onChange={(e) => setPartAId(e.target.value)}
            className="w-full bg-[#181c26] border border-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-[#00ff88]"
          >
            {availableParts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatCurrency(getComponentPrice(p, currency), currency)}
              </option>
            ))}
          </select>

          {partA && (
            <div className="flex items-center justify-between pt-2">
              <CheckPriceButton component={partA} currency={currency} showAllRetailers={true} />
              <button
                onClick={() => router.push(`/?add=${partA.id}`)}
                className="btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1"
              >
                <span>Add to Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Component B Selector */}
        <div className="p-6 rounded-3xl bg-[#12141a] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-[#00d4ff]">
              Option B
            </span>
            {partB && (
              <span className="text-lg font-black font-mono text-white">
                {formatCurrency(getComponentPrice(partB, currency), currency)}
              </span>
            )}
          </div>

          <select
            value={partBId}
            onChange={(e) => setPartBId(e.target.value)}
            className="w-full bg-[#181c26] border border-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-[#00d4ff]"
          >
            {availableParts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatCurrency(getComponentPrice(p, currency), currency)}
              </option>
            ))}
          </select>

          {partB && (
            <div className="flex items-center justify-between pt-2">
              <CheckPriceButton component={partB} currency={currency} showAllRetailers={true} />
              <button
                onClick={() => router.push(`/?add=${partB.id}`)}
                className="btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1"
              >
                <span>Add to Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-3xl border border-white/10 overflow-hidden bg-[#12141a]">
        <div className="p-4 bg-[#181c26] border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-gray-400">
            Technical Specification Matrix
          </span>
          <span className="text-xs text-gray-500 font-mono">
            {partA?.name} vs {partB?.name}
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {specRows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 text-xs items-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="font-mono text-gray-400 font-bold">
                {row.label}
              </div>

              {/* Option A Value */}
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    row.winA ? 'text-[#00ff88] font-bold text-sm' : 'text-gray-200'
                  }`}
                >
                  {row.valA}
                </span>
                {row.winA && (
                  <span className="text-[10px] font-mono font-bold text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.2 rounded">
                    Lead
                  </span>
                )}
              </div>

              {/* Option B Value */}
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    row.winB ? 'text-[#00d4ff] font-bold text-sm' : 'text-gray-200'
                  }`}
                >
                  {row.valB}
                </span>
                {row.winB && (
                  <span className="text-[10px] font-mono font-bold text-[#00d4ff] bg-[#00d4ff]/10 px-1.5 py-0.2 rounded">
                    Lead
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
