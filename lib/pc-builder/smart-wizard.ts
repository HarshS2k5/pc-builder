// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Smart Build Recommender & Budget Engine
// Generates 100% compatible, balanced component builds based on user goals and target budget
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  Currency,
  ComponentCategory,
} from '@/types/pc-builder'
import {
  ALL_COMPONENTS,
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
import { getComponentPrice } from './price-calculator'

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
}

export function generateSmartBuild(criteria: WizardCriteria): BuildParts {
  const { purpose, budget, currency, resolution = '1440p' } = criteria

  // Convert budget to INR for uniform tier matching
  const budgetInr = currency === 'INR' ? budget : budget * 85

  let selectedCpu = CPUS[0]
  let selectedGpu = GPUS[0]
  let selectedMb = MOTHERBOARDS[0]
  let selectedRam = RAMS[0]
  let selectedStorage = STORAGES[0]
  let selectedPsu = PSUS[0]
  let selectedCase = CASES[0]
  let selectedCooler = COOLERS[0]

  // Tier 1: Entry / Tight Budget (~₹40k - ₹65k / ~$500 - $750)
  if (budgetInr < 65000 || purpose === 'budget') {
    selectedCpu = CPUS.find((c) => c.id === 'cpu-r5-5600x') || CPUS[4]
    selectedGpu = GPUS.find((g) => g.id === 'gpu-rx-6600-8gb') || GPUS[10]
    selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-gigabyte-b550m-ds3h-ac') || MOTHERBOARDS[9]
    selectedRam = RAMS.find((r) => r.id === 'ram-corsair-vengeance-lpx-16gb-ddr4-3200') || RAMS[5]
    selectedStorage = STORAGES.find((s) => s.id === 'ssd-crucial-p3-plus-1tb') || STORAGES[3]
    selectedPsu = PSUS.find((p) => p.id === 'psu-deepcool-pk550d') || PSUS[5]
    selectedCase = CASES.find((c) => c.id === 'case-cm-q300l') || CASES[5]
    selectedCooler = COOLERS.find((c) => c.id === 'cooler-assassin-x-120-se') || COOLERS[6]
  }
  // Tier 2: Mid-range Sweet Spot (~₹65k - ₹1,00,000 / ~$750 - $1,200)
  else if (budgetInr < 100000) {
    if (purpose === 'programming' || purpose === 'general') {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-i5-13400f') || CPUS[6]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-3060-12gb') || GPUS[6]
      selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-msi-pro-b760m-a-wifi-d4') || MOTHERBOARDS[5]
      selectedRam = RAMS.find((r) => r.id === 'ram-gskill-ripjaws-v-32gb-ddr4-3600') || RAMS[6]
    } else {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-r5-7600x') || CPUS[1]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4060-8gb') || GPUS[5]
      selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-gigabyte-b650m-ds3h') || MOTHERBOARDS[1]
      selectedRam = RAMS.find((r) => r.id === 'ram-corsair-vengeance-32gb-ddr5-6000') || RAMS[0]
    }
    selectedStorage = STORAGES.find((s) => s.id === 'ssd-wd-black-sn850x-1tb') || STORAGES[2]
    selectedPsu = PSUS.find((p) => p.id === 'psu-msi-mag-a650bn') || PSUS[4]
    selectedCase = CASES.find((c) => c.id === 'case-montech-air-903-max') || CASES[4]
    selectedCooler = COOLERS.find((c) => c.id === 'cooler-peerless-assassin-120-se') || COOLERS[0]
  }
  // Tier 3: High Performance (~₹1,00,000 - ₹1,70,000 / ~$1,200 - $2,000)
  else if (budgetInr < 170000) {
    if (purpose === 'gaming') {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-r7-7800x3d') || CPUS[0]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4070-super') || GPUS[3]
      selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-msi-b650-tomahawk') || MOTHERBOARDS[0]
      selectedRam = RAMS.find((r) => r.id === 'ram-corsair-vengeance-32gb-ddr5-6000') || RAMS[0]
      selectedCooler = COOLERS.find((c) => c.id === 'cooler-peerless-assassin-120-se') || COOLERS[0]
    } else if (purpose === 'video-editing' || purpose === '3d-rendering') {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-i7-14700k') || CPUS[8]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4070-super') || GPUS[3]
      selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-gigabyte-b760-gaming-x-ax') || MOTHERBOARDS[6]
      selectedRam = RAMS.find((r) => r.id === 'ram-crucial-pro-64gb-ddr5-5600') || RAMS[3]
      selectedCooler = COOLERS.find((c) => c.id === 'cooler-arctic-freezer-iii-240') || COOLERS[4]
    } else {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-r7-9700x') || CPUS[2]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rx-7800-xt') || GPUS[8]
      selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-msi-b650-tomahawk') || MOTHERBOARDS[0]
      selectedRam = RAMS.find((r) => r.id === 'ram-teamgroup-tforce-32gb-ddr5-6000') || RAMS[4]
      selectedCooler = COOLERS.find((c) => c.id === 'cooler-deepcool-ak620') || COOLERS[2]
    }
    selectedStorage = STORAGES.find((s) => s.id === 'ssd-samsung-990-pro-1tb') || STORAGES[1]
    selectedPsu = PSUS.find((p) => p.id === 'psu-corsair-rm750e-atx3') || PSUS[1]
    selectedCase = CASES.find((c) => c.id === 'case-corsair-4000d-airflow') || CASES[1]
  }
  // Tier 4: Enthusiast & Pro Workstation (~₹1,70,000 - ₹2,50,000 / ~$2,000 - $3,000)
  else if (budgetInr < 250000) {
    if (purpose === 'ai-ml') {
      // Prioritize VRAM for model weights
      selectedCpu = CPUS.find((c) => c.id === 'cpu-i7-14700k') || CPUS[8]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4070-ti-super') || GPUS[2]
      selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-gigabyte-b760-gaming-x-ax') || MOTHERBOARDS[6]
      selectedRam = RAMS.find((r) => r.id === 'ram-crucial-pro-64gb-ddr5-5600') || RAMS[3]
    } else if (purpose === 'gaming') {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-r7-7800x3d') || CPUS[0]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4080-super') || GPUS[1]
      selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-msi-b650-tomahawk') || MOTHERBOARDS[0]
      selectedRam = RAMS.find((r) => r.id === 'ram-gskill-trident-z5-rgb-32gb-ddr5-6400') || RAMS[1]
    } else {
      selectedCpu = CPUS.find((c) => c.id === 'cpu-i7-14700k') || CPUS[8]
      selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4070-ti-super') || GPUS[2]
      selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-gigabyte-b760-gaming-x-ax') || MOTHERBOARDS[6]
      selectedRam = RAMS.find((r) => r.id === 'ram-crucial-pro-64gb-ddr5-5600') || RAMS[3]
    }
    selectedStorage = STORAGES.find((s) => s.id === 'ssd-samsung-990-pro-2tb') || STORAGES[0]
    selectedPsu = PSUS.find((p) => p.id === 'psu-corsair-rm850x') || PSUS[0]
    selectedCase = CASES.find((c) => c.id === 'case-fractal-north') || CASES[3]
    selectedCooler = COOLERS.find((c) => c.id === 'cooler-arctic-freezer-iii-360') || COOLERS[3]
  }
  // Tier 5: Ultra Flagship (> ₹2,50,000 / > $3,000)
  else {
    selectedCpu = purpose === 'ai-ml' || purpose === '3d-rendering'
      ? (CPUS.find((c) => c.id === 'cpu-r9-7950x3d') || CPUS[3])
      : (CPUS.find((c) => c.id === 'cpu-r7-7800x3d') || CPUS[0])
    selectedGpu = GPUS.find((g) => g.id === 'gpu-rtx-4090') || GPUS[0]
    selectedMb = MOTHERBOARDS.find((m) => m.id === 'mb-asus-rog-strix-x670e-e') || MOTHERBOARDS[3]
    selectedRam = RAMS.find((r) => r.id === 'ram-crucial-pro-64gb-ddr5-5600') || RAMS[3]
    selectedStorage = STORAGES.find((s) => s.id === 'ssd-crucial-t700-2tb-gen5') || STORAGES[4]
    selectedPsu = PSUS.find((p) => p.id === 'psu-corsair-rm1000e-atx3') || PSUS[2]
    selectedCase = CASES.find((c) => c.id === 'case-lian-li-o11d-evo') || CASES[0]
    selectedCooler = COOLERS.find((c) => c.id === 'cooler-arctic-freezer-iii-360') || COOLERS[3]
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

  // Double check compatibility
  const compat = checkCompatibility(parts)
  if (compat.status === 'incompatible') {
    // If somehow incompatible, fallback to known safe preset
    return {
      cpu: CPUS[0],
      gpu: GPUS[3],
      motherboard: MOTHERBOARDS[0],
      ram: RAMS[0],
      storage: STORAGES[0],
      psu: PSUS[1],
      case: CASES[1],
      cooler: COOLERS[0],
    }
  }

  return parts
}
