'use client'

import React, { useState } from 'react'
import {
  ComponentCategory,
  AnyComponent,
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
import { formatCurrency, getComponentPrice } from '@/lib/pc-builder/price-calculator'
import {
  Scale,
  X,
  Plus,
  ArrowRight,
  Check,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react'

interface ComponentCompareModalProps {
  isOpen: boolean
  onClose: () => void
  currency: Currency
  onSelectComponentToBuild?: (comp: AnyComponent) => void
}

export function ComponentCompareModal({
  isOpen,
  onClose,
  currency,
  onSelectComponentToBuild,
}: ComponentCompareModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('cpu')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  if (!isOpen) return null

  const categoryItems = ALL_COMPONENTS[selectedCategory] || []

  // Ensure default 2 items are selected on category switch if empty
  const activeSelected = selectedIds.length > 0
    ? selectedIds
    : [categoryItems[0]?.id, categoryItems[1]?.id].filter(Boolean)

  const selectedObjects = activeSelected
    .map((id) => categoryItems.find((c) => c.id === id))
    .filter(Boolean) as AnyComponent[]

  const toggleSelect = (id: string) => {
    if (activeSelected.includes(id)) {
      if (activeSelected.length > 1) {
        setSelectedIds(activeSelected.filter((i) => i !== id))
      }
    } else {
      if (activeSelected.length < 3) {
        setSelectedIds([...activeSelected, id])
      } else {
        // Replace last item
        setSelectedIds([activeSelected[0], activeSelected[1], id])
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Hardware Comparison Lab</h2>
              <p className="text-xs text-gray-400">
                Compare up to 3 components side-by-side with verified specs & pricing
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

        {/* Category Tab Bar */}
        <div className="flex items-center gap-1.5 p-3 px-6 border-b border-white/10 bg-[#111111] overflow-x-auto text-xs">
          {[
            { id: 'cpu', label: 'CPUs' },
            { id: 'gpu', label: 'GPUs' },
            { id: 'motherboard', label: 'Motherboards' },
            { id: 'ram', label: 'RAM' },
            { id: 'storage', label: 'Storage' },
            { id: 'psu', label: 'PSUs' },
            { id: 'case', label: 'Cases' },
            { id: 'cooler', label: 'Coolers' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any)
                setSelectedIds([])
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Part Selection Pills */}
        <div className="p-4 px-6 border-b border-white/5 bg-[#141414] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 font-semibold mr-1">Choose Parts to Compare:</span>
          {categoryItems.map((item) => {
            const isChecked = activeSelected.includes(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs transition-all flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff] font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 text-[#00d4ff]" />}
                <span>{item.name}</span>
              </button>
            )
          })}
        </div>

        {/* Comparison Table Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold w-1/4">
                    Specification
                  </th>
                  {selectedObjects.map((obj) => (
                    <th key={obj.id} className="py-3 px-4 text-sm font-bold text-white w-1/3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-mono">
                          {obj.brand} • {obj.tier} tier
                        </span>
                        <div className="text-base text-[#00ff88] font-bold">{obj.name}</div>
                        <div className="text-lg font-mono font-bold text-white">
                          {formatCurrency(getComponentPrice(obj, currency), currency)}
                        </div>
                        {onSelectComponentToBuild && (
                          <button
                            onClick={() => {
                              onSelectComponentToBuild(obj)
                              onClose()
                            }}
                            className="mt-2 text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-[#00ff88] hover:text-black font-semibold text-gray-200 transition-colors"
                          >
                            Add to My Build
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {renderComparisonRows(selectedCategory, selectedObjects)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#1a1a1a] flex justify-between items-center text-xs text-gray-500">
          <span>Click any pill above to add or replace comparison candidates.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors font-medium"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}

function renderComparisonRows(cat: ComponentCategory, items: AnyComponent[]) {
  if (cat === 'cpu') {
    const cpus = items as CPUComponent[]
    return (
      <>
        <Row label="Socket" values={cpus.map((c) => c.socket)} highlight />
        <Row label="Cores / Threads" values={cpus.map((c) => `${c.cores} Cores / ${c.threads} Threads`)} />
        <Row label="Base Clock" values={cpus.map((c) => `${c.baseClockGhz} GHz`)} />
        <Row label="Boost Clock" values={cpus.map((c) => `${c.boostClockGhz} GHz`)} highlight />
        <Row label="TDP (Base)" values={cpus.map((c) => `${c.tdpWatts} W`)} />
        <Row label="Peak Boost Power" values={cpus.map((c) => `${c.peakPowerWatts} W`)} />
        <Row label="L3 Cache" values={cpus.map((c) => `${c.l3CacheMb} MB`)} highlight />
        <Row label="Supported RAM" values={cpus.map((c) => c.supportedRamGen.join(', '))} />
        <Row label="Integrated GPU" values={cpus.map((c) => (c.integratedGpu ? 'Yes' : 'No'))} />
        <Row label="Single-Thread Rating" values={cpus.map((c) => `${c.singleThreadScore} / 100`)} />
        <Row label="Multi-Thread Rating" values={cpus.map((c) => `${c.multiThreadScore} / 100`)} />
      </>
    )
  }

  if (cat === 'gpu') {
    const gpus = items as GPUComponent[]
    return (
      <>
        <Row label="Chipmaker" values={gpus.map((g) => g.chipmaker)} />
        <Row label="VRAM Capacity" values={gpus.map((g) => `${g.vramGb} GB`)} highlight />
        <Row label="Memory Type" values={gpus.map((g) => g.vramType)} />
        <Row label="Length (Clearance)" values={gpus.map((g) => `${g.lengthMm} mm`)} />
        <Row label="Slot Thickness" values={gpus.map((g) => `${g.slotWidth} Slots`)} />
        <Row label="Rated Power Draw (TDP)" values={gpus.map((g) => `${g.tdpWatts} W`)} />
        <Row label="Recommended PSU" values={gpus.map((g) => `${g.recommendedPsuWatts} W`)} highlight />
        <Row label="1080p Raster Score" values={gpus.map((g) => `${g.rasterScore1080p} / 100`)} />
        <Row label="1440p Raster Score" values={gpus.map((g) => `${g.rasterScore1440p} / 100`)} highlight />
        <Row label="4K Raster Score" values={gpus.map((g) => `${g.rasterScore4k} / 100`)} />
        <Row label="Ray Tracing Score" values={gpus.map((g) => `${g.rayTracingScore} / 100`)} />
      </>
    )
  }

  if (cat === 'motherboard') {
    const mbs = items as MotherboardComponent[]
    return (
      <>
        <Row label="Socket" values={mbs.map((m) => m.socket)} highlight />
        <Row label="Chipset" values={mbs.map((m) => m.chipset)} />
        <Row label="Form Factor" values={mbs.map((m) => m.formFactor)} />
        <Row label="Memory Type" values={mbs.map((m) => m.ramGen)} highlight />
        <Row label="Memory Slots" values={mbs.map((m) => `${m.ramSlots} DIMMs (Max ${m.maxRamGb}GB)`)} />
        <Row label="M.2 NVMe Slots" values={mbs.map((m) => `${m.m2Slots} slots`)} highlight />
        <Row label="SATA Ports" values={mbs.map((m) => `${m.sataPorts} ports`)} />
        <Row label="PCIe Generation" values={mbs.map((m) => `PCIe ${m.pcieGen}.0`)} />
        <Row label="Integrated WiFi" values={mbs.map((m) => (m.wifiIncluded ? 'Yes' : 'No'))} />
      </>
    )
  }

  if (cat === 'ram') {
    const rams = items as RAMComponent[]
    return (
      <>
        <Row label="Generation" values={rams.map((r) => r.gen)} highlight />
        <Row label="Total Capacity" values={rams.map((r) => `${r.capacityGb} GB`)} highlight />
        <Row label="Clock Speed" values={rams.map((r) => `${r.speedMhz} MHz`)} highlight />
        <Row label="Configuration" values={rams.map((r) => `${r.modulesCount} stick(s)`)} />
        <Row label="CAS Latency" values={rams.map((r) => `CL${r.casLatency}`)} />
        <Row label="RGB Illumination" values={rams.map((r) => (r.rgb ? 'Yes' : 'No'))} />
      </>
    )
  }

  if (cat === 'storage') {
    const s = items as StorageComponent[]
    return (
      <>
        <Row label="Type" values={s.map((i) => i.type)} highlight />
        <Row label="Capacity" values={s.map((i) => (i.capacityGb >= 1000 ? `${i.capacityGb / 1000} TB` : `${i.capacityGb} GB`))} highlight />
        <Row label="Interface" values={s.map((i) => i.interface)} />
        <Row label="Sequential Read" values={s.map((i) => `${i.readSpeedMbps} MB/s`)} highlight />
        <Row label="Sequential Write" values={s.map((i) => `${i.writeSpeedMbps} MB/s`)} />
        <Row label="Form Factor" values={s.map((i) => (i.isM2 ? 'M.2 2280' : '2.5" / 3.5" Drive'))} />
      </>
    )
  }

  if (cat === 'psu') {
    const psus = items as PSUComponent[]
    return (
      <>
        <Row label="Wattage Rating" values={psus.map((p) => `${p.wattage} W`)} highlight />
        <Row label="Efficiency Rating" values={psus.map((p) => p.efficiency)} highlight />
        <Row label="Modularity" values={psus.map((p) => p.modularity)} />
        <Row label="Form Factor" values={psus.map((p) => p.formFactor)} />
        <Row label="ATX 3.0 Standard" values={psus.map((p) => (p.atx3Compatible ? 'Yes (12VHPWR Ready)' : 'Standard PCIe'))} />
        <Row label="PCIe Connectors" values={psus.map((p) => `${p.pcieConnectorsCount}x 8-pin`)} />
      </>
    )
  }

  if (cat === 'case') {
    const cases = items as CaseComponent[]
    return (
      <>
        <Row label="Form Factor" values={cases.map((c) => c.formFactor)} highlight />
        <Row label="Max GPU Length" values={cases.map((c) => `${c.maxGpuLengthMm} mm`)} highlight />
        <Row label="Max Cooler Height" values={cases.map((c) => `${c.maxCoolerHeightMm} mm`)} />
        <Row label="Radiator Support" values={cases.map((c) => c.radiatorSupportMm.join('mm, ') + 'mm')} />
        <Row label="Motherboard Support" values={cases.map((c) => c.supportedMotherboards.join(', '))} />
        <Row label="Included Fans" values={cases.map((c) => `${c.includedFansCount} Fans`)} />
        <Row label="Side Panel" values={cases.map((c) => c.sidePanel)} />
      </>
    )
  }

  if (cat === 'cooler') {
    const coolers = items as CoolerComponent[]
    return (
      <>
        <Row label="Type" values={coolers.map((c) => c.type)} highlight />
        <Row label="Supported Sockets" values={coolers.map((c) => c.supportedSockets.join(', '))} highlight />
        <Row label="Height / Radiator" values={coolers.map((c) => (c.heightMm > 0 ? `${c.heightMm} mm height` : `${c.radiatorSizeMm} mm radiator`))} />
        <Row label="Rated Max TDP" values={coolers.map((c) => `${c.maxTdpRatingWatts} W`)} highlight />
        <Row label="Noise Level" values={coolers.map((c) => `${c.noiseLevelDb} dBA`)} />
      </>
    )
  }

  return null
}

function Row({ label, values, highlight }: { label: string; values: string[]; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-white/[0.03]' : ''}>
      <td className="py-2.5 px-4 font-semibold text-gray-400">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={`py-2.5 px-4 font-mono ${highlight ? 'text-white font-bold' : 'text-gray-300'}`}>
          {v}
        </td>
      ))}
    </tr>
  )
}
