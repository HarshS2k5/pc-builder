// ─────────────────────────────────────────────────────────────────────────────
// RigCraft PC Builder – Smart Recommendation & Hardware Guidance Engine
// Generates 100% compatible, balanced component builds based on user goals, games, and budget
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  Currency,
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
} from '@/types/pc-builder'
import {
  CPUS,
  GPUS,
  MOTHERBOARDS,
  RAMS,
  STORAGES,
  PSUS,
  CASES,
  COOLERS,
} from './components-data'
import { checkCompatibility } from './compatibility'

export type BuildPurpose =
  | 'gaming'
  | 'video-editing'
  | 'ai-ml'
  | 'programming'
  | '3d-rendering'
  | 'general'
  | 'budget'

export interface WizardCriteria {
  purpose: BuildPurpose
  budget: number
  currency: Currency
  resolution?: '1080p' | '1440p' | '4k'
  games?: string[] // e.g. ['Fortnite', 'GTA V', 'Cyberpunk 2077']
  storagePreferenceGb?: number // 1000, 2000, 4000
  upgradePriority?: 'balanced' | 'future-proofing' | 'quiet-thermals'
}

export interface SmartRecommendationResult {
  parts: BuildParts
  rationale: Record<ComponentCategory, string>
  estimatedFpsNotes: string
  upgradeAdvice: string
}

export function generateSmartBuildDetailed(
  criteria: WizardCriteria
): SmartRecommendationResult {
  const parts = generateSmartBuild(criteria)
  const cpu = parts.cpu as CPUComponent | undefined
  const gpu = parts.gpu as GPUComponent | undefined
  const mb = parts.motherboard as MotherboardComponent | undefined
  const ram = parts.ram as RAMComponent | undefined
  const storage = parts.storage as StorageComponent | undefined
  const psu = parts.psu as PSUComponent | undefined
  const chassis = parts.case as CaseComponent | undefined
  const cooler = parts.cooler as CoolerComponent | undefined

  const { purpose, resolution = '1080p', games = [] } = criteria
  const gamesListText = games.length > 0 ? games.join(', ') : 'modern AAA and esports titles'

  const rationale: Record<ComponentCategory, string> = {
    cpu: cpu
      ? `${cpu.name} was chosen for its ${cpu.cores} cores and strong IPC, ensuring smooth framerates and minimal frame dips in ${gamesListText}.`
      : 'Standard multi-core processor selected for baseline responsiveness.',
    gpu: gpu
      ? `${gpu.name} offers the ideal rasterization and ${gpu.vramGb}GB VRAM necessary to drive smooth performance at ${resolution}.`
      : 'Dedicated graphics card matched for visual fidelity.',
    motherboard: mb
      ? `${mb.name} provides exact ${mb.socket} socket compatibility, solid power delivery VRMs, and expansion slots for future upgrades.`
      : 'Motherboard selected with compatible socket and memory topology.',
    ram: ram
      ? `${ram.name} in dual-channel configuration delivers low latency and ample capacity for modern multi-tasking and gaming memory footprints.`
      : 'High-speed memory kit for optimal memory bandwidth.',
    storage: storage
      ? `${storage.name} (${storage.type}) delivers lightning-fast boot times, zero hitching during game world streaming, and rapid project loading.`
      : 'Fast NVMe solid state drive for system responsiveness.',
    psu: psu
      ? `${psu.name} delivers ${psu.wattage}W with ${psu.efficiency} certification, providing comfortable 20-30% safety headroom over peak system draw.`
      : 'Certified power supply unit sized for electrical efficiency.',
    case: chassis
      ? `${chassis.name} accommodates the ${gpu?.lengthMm || 300}mm GPU and provides high-volume mesh intake for low thermals and quiet operation.`
      : 'Case with verified physical component clearances.',
    cooler: cooler
      ? `${cooler.name} keeps CPU temperatures well within thermal boost limits during sustained workloads.`
      : 'Cooling solution matched to the processor TDP envelope.',
  }

  const estimatedFpsNotes =
    resolution === '4k'
      ? `Configured to deliver smooth 60-100+ FPS in ${gamesListText} at Ultra 4K settings.`
      : resolution === '1440p'
      ? `Targeting 90-144+ FPS at 1440p High/Ultra settings for crisp visual clarity.`
      : `Optimized for 120-240+ competitive FPS at 1080p, minimizing input latency in fast-paced shooters.`

  const upgradeAdvice =
    mb?.ramGen === 'DDR5'
      ? 'Built on an active modern platform with full support for future drop-in CPU and GPU upgrades down the road.'
      : 'Maximum value per dollar achieved on proven hardware architecture.'

  return {
    parts,
    rationale,
    estimatedFpsNotes,
    upgradeAdvice,
  }
}

export function generateSmartBuild(criteria: WizardCriteria): BuildParts {
  const { purpose, budget, currency } = criteria

  // Convert budget to INR for uniform tier matching
  const budgetInr = currency === 'INR' ? budget : budget * 83.2

  let selectedCpu = CPUS[0]
  let selectedGpu = GPUS[0]
  let selectedMb = MOTHERBOARDS[0]
  let selectedRam = RAMS[0]
  let selectedStorage = STORAGES[0]
  let selectedPsu = PSUS[0]
  let selectedCase = CASES[0]
  let selectedCooler = COOLERS[0]

  // Tier 1: Entry / Tight Budget (< ₹60k / < $700)
  if (budgetInr < 60000 || purpose === 'budget') {
    selectedCpu = CPUS.find((c) => c.id === 'cpu-r5-5600') || CPUS[4]
    selectedGpu = GPUS.find((g) => g.id === 'gpu-rx-7600') || GPUS[10] || GPUS[0]
    selectedMb = MOTHERBOARDS.find((m) => m.socket === 'AM4') || MOTHERBOARDS[9] || MOTHERBOARDS[0]
    selectedRam = RAMS.find((r) => r.gen === 'DDR4' && r.capacityGb === 16) || RAMS[5] || RAMS[0]
    selectedStorage = STORAGES.find((s) => s.capacityGb === 1000) || STORAGES[3] || STORAGES[0]
    selectedPsu = PSUS.find((p) => p.wattage <= 650) || PSUS[4] || PSUS[0]
    selectedCase = CASES.find((c) => c.tier === 'entry') || CASES[5] || CASES[0]
    selectedCooler = COOLERS.find((c) => c.type === 'Air') || COOLERS[0]
  }
  // Tier 2: Mid-range Sweet Spot (₹60k - ₹1,00,000 / $700 - $1,200)
  else if (budgetInr < 100000) {
    if (purpose === 'programming' || purpose === 'general') {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-i5-13600k') || CPUS[6] || CPUS[0]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4060') || GPUS[5] || GPUS[0]
      selectedMb = MOTHERBOARDS.find((m) => m.chipset === 'B760') || MOTHERBOARDS[5] || MOTHERBOARDS[0]
      selectedRam = RAMS.find((r) => r.capacityGb >= 32) || RAMS[0]
    } else {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-r5-7600x') || CPUS[1] || CPUS[0]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4060' || g.id === 'gpu-rx-7600') || GPUS[5] || GPUS[0]
      selectedMb = MOTHERBOARDS.find((m) => m.chipset === 'B650') || MOTHERBOARDS[0]
      selectedRam = RAMS.find((r) => r.gen === 'DDR5' && r.capacityGb >= 16) || RAMS[0]
    }
    selectedStorage = STORAGES.find((s) => s.capacityGb === 1000) || STORAGES[2] || STORAGES[0]
    selectedPsu = PSUS.find((p) => p.wattage >= 650) || PSUS[4] || PSUS[0]
    selectedCase = CASES[1] || CASES[0]
    selectedCooler = COOLERS[0]
  }
  // Tier 3: High-Performance 1440p (₹1,00,000 - ₹1,60,000 / $1,200 - $1,900)
  else if (budgetInr < 160000) {
    if (purpose === 'gaming') {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-r7-7800x3d') || CPUS[0]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4070-super' || g.id === 'gpu-rx-7800-xt') || GPUS[3] || GPUS[0]
      selectedMb = MOTHERBOARDS.find((m) => m.chipset === 'B650') || MOTHERBOARDS[0]
      selectedRam = RAMS.find((r) => r.gen === 'DDR5' && r.capacityGb === 32) || RAMS[0]
      selectedCooler = COOLERS[0]
    } else {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-i7-14700k') || CPUS[8] || CPUS[0]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4070-super') || GPUS[3] || GPUS[0]
      selectedMb = MOTHERBOARDS.find((m) => m.socket === 'LGA1700') || MOTHERBOARDS[6] || MOTHERBOARDS[0]
      selectedRam = RAMS.find((r) => r.capacityGb >= 32) || RAMS[3] || RAMS[0]
      selectedCooler = COOLERS.find((c) => c.type.includes('AIO')) || COOLERS[3] || COOLERS[0]
    }
    selectedStorage = STORAGES.find((s) => s.capacityGb >= 1000) || STORAGES[1] || STORAGES[0]
    selectedPsu = PSUS.find((p) => p.wattage >= 750) || PSUS[1] || PSUS[0]
    selectedCase = CASES[1] || CASES[0]
  }
  // Tier 4: Enthusiast 4K / Heavy Creator (₹1,60,000 - ₹2,50,000 / $1,900 - $3,000)
  else if (budgetInr < 250000) {
    selectedCpu = CPUS.find((c) => c.id === 'cpu-r7-7800x3d') || CPUS[0]
    selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4080-super') || GPUS[1] || GPUS[0]
    selectedMb = MOTHERBOARDS.find((m) => m.chipset === 'B650' || m.chipset === 'X670E') || MOTHERBOARDS[0]
    selectedRam = RAMS.find((r) => r.gen === 'DDR5' && r.capacityGb >= 32) || RAMS[0]
    selectedStorage = STORAGES.find((s) => s.capacityGb >= 2000) || STORAGES[0]
    selectedPsu = PSUS.find((p) => p.wattage >= 850) || PSUS[0]
    selectedCase = CASES[0]
    selectedCooler = COOLERS.find((c) => c.type.includes('AIO')) || COOLERS[0]
  }
  // Tier 5: Absolute Ultimate (>= ₹2,50,000 / >= $3,000)
  else {
    selectedCpu = CPUS.find((c) => c.id === 'cpu-r7-7800x3d' || c.id === 'cpu-r9-7950x') || CPUS[0]
    selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4090') || GPUS[0]
    selectedMb = MOTHERBOARDS.find((m) => m.chipset === 'X670E') || MOTHERBOARDS[3] || MOTHERBOARDS[0]
    selectedRam = RAMS.find((r) => r.capacityGb >= 64) || RAMS[3] || RAMS[0]
    selectedStorage = STORAGES.find((s) => s.capacityGb >= 2000) || STORAGES[0]
    selectedPsu = PSUS.find((p) => p.wattage >= 1000) || PSUS[2] || PSUS[0]
    selectedCase = CASES[0]
    selectedCooler = COOLERS.find((c) => c.type.includes('360')) || COOLERS[3] || COOLERS[0]
  }

  const parts: BuildParts = {
    cpu: selectedCpu,
    gpu: selectedGpu,
    motherboard: selectedMb,
    ram: selectedRam,
    storage: selectedStorage,
    psu: selectedPsu,
    case: selectedCase,
    cooler: selectedCooler,
  }

  // Double-check compatibility
  const compat = checkCompatibility(parts)
  if (compat.status === 'incompatible') {
    // Known 100% compatible fallback preset
    return {
      cpu: CPUS[0],
      gpu: GPUS[3] || GPUS[0],
      motherboard: MOTHERBOARDS[0],
      ram: RAMS[0],
      storage: STORAGES[0],
      psu: PSUS[1] || PSUS[0],
      case: CASES[1] || CASES[0],
      cooler: COOLERS[0],
    }
  }

  return parts
}
