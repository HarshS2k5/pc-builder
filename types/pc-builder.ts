// ─────────────────────────────────────────────────────────────────────────────
// GameRank / TechForge – PC Builder Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

export type ComponentCategory =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooler'

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP'

export type CompatibilityStatus = 'compatible' | 'warning' | 'incompatible'

export interface CompatibilityIssue {
  severity: 'error' | 'warning' | 'info'
  rule: string
  message: string
  componentA: string
  componentB?: string
  recommendation?: string
}

export interface CompatibilityReport {
  status: CompatibilityStatus
  issues: CompatibilityIssue[]
  checksCount: number
}

// ---------------------------------------------------------------------------
// Base Component Interface
// ---------------------------------------------------------------------------

export interface BaseComponent {
  id: string
  name: string
  brand: string
  category: ComponentCategory
  priceInr: number
  priceUsd: number
  image?: string
  tier: 'entry' | 'mid' | 'high' | 'enthusiast'
  releaseYear?: number
  verifiedSpec: boolean
}

// ---------------------------------------------------------------------------
// Specialized Component Specifications
// ---------------------------------------------------------------------------

export type CpuSocket = 'AM5' | 'AM4' | 'LGA1700' | 'LGA1851'
export type RamGeneration = 'DDR4' | 'DDR5'
export type MotherboardFormFactor = 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX'
export type PsuModularity = 'Full' | 'Semi' | 'Non-Modular'
export type PsuEfficiency = '80+ Bronze' | '80+ Silver' | '80+ Gold' | '80+ Platinum' | '80+ Titanium'
export type CoolerType = 'Air' | 'AIO 240mm' | 'AIO 280mm' | 'AIO 360mm'
export type StorageType = 'NVMe SSD' | 'SATA SSD' | 'HDD'

export interface CPUComponent extends BaseComponent {
  category: 'cpu'
  socket: CpuSocket
  cores: number
  threads: number
  baseClockGhz: number
  boostClockGhz: number
  tdpWatts: number
  peakPowerWatts: number
  integratedGpu: boolean
  pcieGen: number // 4 or 5
  supportedRamGen: RamGeneration[] // ['DDR4', 'DDR5'] or ['DDR5']
  l3CacheMb: number
  singleThreadScore: number // Normalized index (0 - 100)
  multiThreadScore: number // Normalized index (0 - 100)
}

export interface GPUComponent extends BaseComponent {
  category: 'gpu'
  chipmaker: 'NVIDIA' | 'AMD' | 'Intel'
  vramGb: number
  vramType: 'GDDR6' | 'GDDR6X' | 'HBM'
  lengthMm: number
  slotWidth: number // e.g. 2, 2.5, 3 slots
  tdpWatts: number
  recommendedPsuWatts: number
  pcieGen: number
  rasterScore1080p: number // Index 0 - 100
  rasterScore1440p: number
  rasterScore4k: number
  rayTracingScore: number
}

export interface MotherboardComponent extends BaseComponent {
  category: 'motherboard'
  socket: CpuSocket
  chipset: string // e.g. B650, X670, B760, Z790, Z890
  formFactor: MotherboardFormFactor
  ramGen: RamGeneration
  ramSlots: number // 2 or 4
  maxRamGb: number
  m2Slots: number // e.g. 2, 3, 4
  sataPorts: number
  pcieGen: number
  wifiIncluded: boolean
  basePowerDrawWatts: number
}

export interface RAMComponent extends BaseComponent {
  category: 'ram'
  gen: RamGeneration
  capacityGb: number // e.g. 16, 32, 64
  speedMhz: number // e.g. 3200, 3600, 5600, 6000
  modulesCount: number // e.g. 1, 2, 4
  casLatency: number // CL e.g. 30, 36, 16, 18
  rgb: boolean
}

export interface StorageComponent extends BaseComponent {
  category: 'storage'
  type: StorageType
  interface: string // 'M.2 PCIe 4.0 x4', 'M.2 PCIe 5.0 x4', 'SATA III'
  capacityGb: number // e.g. 1000 (1TB), 2000 (2TB)
  readSpeedMbps: number
  writeSpeedMbps: number
  isM2: boolean
}

export interface PSUComponent extends BaseComponent {
  category: 'psu'
  wattage: number
  efficiency: PsuEfficiency
  modularity: PsuModularity
  formFactor: 'ATX' | 'SFX'
  pcieConnectorsCount: number
  atx3Compatible: boolean
}

export interface CaseComponent extends BaseComponent {
  category: 'case'
  formFactor: 'ATX Mid Tower' | 'ATX Full Tower' | 'MicroATX Mini' | 'Mini-ITX'
  maxGpuLengthMm: number
  maxCoolerHeightMm: number
  radiatorSupportMm: number[] // [120, 240, 280, 360]
  supportedMotherboards: MotherboardFormFactor[]
  includedFansCount: number
  sidePanel: 'Tempered Glass' | 'Mesh' | 'Solid'
}

export interface CoolerComponent extends BaseComponent {
  category: 'cooler'
  type: CoolerType
  supportedSockets: CpuSocket[]
  heightMm: number // for air coolers (0 for AIO pump block)
  radiatorSizeMm: number // 0 for air coolers, 240, 280, 360 for AIO
  maxTdpRatingWatts: number
  noiseLevelDb: number
}

export type AnyComponent =
  | CPUComponent
  | GPUComponent
  | MotherboardComponent
  | RAMComponent
  | StorageComponent
  | PSUComponent
  | CaseComponent
  | CoolerComponent

// ---------------------------------------------------------------------------
// Build Configuration State
// ---------------------------------------------------------------------------

export type BuildParts = Partial<Record<ComponentCategory, AnyComponent>>

export interface BuildPriceSummary {
  currency: Currency
  currencySymbol: string
  total: number
  formattedTotal: string
  cheapestComponent?: { name: string; price: number; category: ComponentCategory }
  mostExpensiveComponent?: { name: string; price: number; category: ComponentCategory }
  byCategory: Record<ComponentCategory, number>
}

export interface PowerCalculation {
  cpuWatts: number
  gpuWatts: number
  motherboardWatts: number
  ramWatts: number
  storageWatts: number
  fansCoolerWatts: number
  systemOverheadWatts: number
  totalEstimatedWatts: number
  recommendedPsuWatts: number
  installedPsuWatts?: number
  headroomWatts?: number
  loadPercentage?: number
  powerStatus: 'optimal' | 'tight' | 'insufficient' | 'no-psu'
  message: string
}

export interface BottleneckAnalysis {
  workload: 'esports-1080p' | 'aaa-1440p' | 'cinematic-4k' | 'workstation'
  workloadLabel: string
  resolution: '1080p' | '1440p' | '4k'
  primaryLimiter: 'CPU' | 'GPU' | 'BALANCED'
  balanceScore: number // 0 - 100
  explanation: string
  educationalNote: string
}

export interface BuildScorecard {
  overall: number // 1 - 10
  performance: number // 1 - 10
  value: number // 1 - 10
  upgradeability: number // 1 - 10
  compatibility: number // 1 - 10
  powerBalance: number // 1 - 10
  strengths: string[]
  improvements: string[]
}

export interface GamePerformanceEstimate {
  gameId: number | string
  gameName: string
  coverImage: string
  resolution: '1080p' | '1440p' | '4K'
  quality: 'Low' | 'Medium' | 'High' | 'Ultra'
  estimatedMinFps: number
  estimatedAvgFps: number
  estimatedMaxFps: number
  smoothnessRating: 'Competitive 144+ FPS' | 'Ultra Smooth 90-144 FPS' | 'Smooth 60-90 FPS' | 'Playable 30-60 FPS' | 'Below 30 FPS'
  meetsMinimum: boolean
  meetsRecommended: boolean
  limitingFactor: 'CPU' | 'GPU' | 'RAM' | 'None'
}

export interface SavedBuild {
  id: string
  name: string
  description?: string
  shareCode: string
  partIds: Partial<Record<ComponentCategory, string>>
  createdAt: string
  updatedAt: string
  currency: Currency
}

export interface BuildPreset {
  id: string
  name: string
  tagline: string
  targetBudgetInr: number
  targetBudgetUsd: number
  useCase: 'Gaming' | 'Esports' | 'Content Creation' | 'AI / Workstation' | 'Budget'
  description: string
  partIds: Record<ComponentCategory, string>
}
