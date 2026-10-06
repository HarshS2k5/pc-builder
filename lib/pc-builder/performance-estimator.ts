// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Real-Time Game Performance & FPS Estimator
// Accurately predicts framerate distributions across resolutions and graphics presets
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  GamePerformanceEstimate,
  CPUComponent,
  GPUComponent,
  RAMComponent,
} from '@/types/pc-builder'
import { SEED_GAMES } from '@/lib/database'

// Engine demandingness factor & CPU-vs-GPU weighting per game
interface GameProfile {
  name: string
  gpuWeight: number // 0 (100% CPU bound) to 1 (100% GPU bound)
  baseDemand: number // Higher means more demanding
  esports: boolean
  rtxHeavy?: boolean
}

const GAME_PROFILES: Record<string, GameProfile> = {
  'cyberpunk-2077': { name: 'Cyberpunk 2077', gpuWeight: 0.82, baseDemand: 1.0, esports: false, rtxHeavy: true },
  'grand-theft-auto-v': { name: 'Grand Theft Auto V', gpuWeight: 0.65, baseDemand: 0.45, esports: false },
  'fortnite': { name: 'Fortnite', gpuWeight: 0.60, baseDemand: 0.52, esports: true },
  'minecraft': { name: 'Minecraft', gpuWeight: 0.45, baseDemand: 0.35, esports: true },
  'elden-ring': { name: 'Elden Ring', gpuWeight: 0.75, baseDemand: 0.72, esports: false },
  'baldurs-gate-3': { name: "Baldur's Gate 3", gpuWeight: 0.68, baseDemand: 0.78, esports: false },
  'red-dead-redemption-2': { name: 'Red Dead Redemption 2', gpuWeight: 0.80, baseDemand: 0.88, esports: false },
  'counter-strike-2': { name: 'Counter-Strike 2', gpuWeight: 0.50, baseDemand: 0.48, esports: true },
  'valorant': { name: 'Valorant', gpuWeight: 0.40, baseDemand: 0.30, esports: true },
  'apex-legends': { name: 'Apex Legends', gpuWeight: 0.65, baseDemand: 0.58, esports: true },
  'call-of-duty-warzone': { name: 'Call of Duty: Warzone', gpuWeight: 0.74, baseDemand: 0.82, esports: true },
  'the-witcher-3-wild-hunt': { name: 'The Witcher 3: Wild Hunt', gpuWeight: 0.76, baseDemand: 0.75, esports: false },
  'forza-horizon-5': { name: 'Forza Horizon 5', gpuWeight: 0.78, baseDemand: 0.68, esports: false },
  'black-myth-wukong': { name: 'Black Myth: Wukong', gpuWeight: 0.85, baseDemand: 1.05, esports: false, rtxHeavy: true },
  'starfield': { name: 'Starfield', gpuWeight: 0.75, baseDemand: 0.95, esports: false },
}

// Preset multiplier: Low (1.45x), Medium (1.20x), High (1.0x), Ultra (0.80x)
const QUALITY_MULTIPLIERS: Record<'Low' | 'Medium' | 'High' | 'Ultra', number> = {
  Low: 1.45,
  Medium: 1.20,
  High: 1.0,
  Ultra: 0.80,
}

// Resolution base pixel load penalty: 1080p (1.0), 1440p (0.72), 4K (0.45)
const RESOLUTION_MULTIPLIERS: Record<'1080p' | '1440p' | '4K', number> = {
  '1080p': 1.0,
  '1440p': 0.72,
  '4K': 0.45,
}

export function estimateGamePerformance(
  parts: BuildParts,
  gameSlug: string,
  resolution: '1080p' | '1440p' | '4K' = '1440p',
  quality: 'Low' | 'Medium' | 'High' | 'Ultra' = 'High'
): GamePerformanceEstimate | null {
  const game = SEED_GAMES.find((g) => g.slug === gameSlug) || SEED_GAMES[0]
  if (!game) return null

  const cpu = parts.cpu as CPUComponent | undefined
  const gpu = parts.gpu as GPUComponent | undefined
  const ram = parts.ram as RAMComponent | undefined

  const profile = GAME_PROFILES[game.slug] || {
    name: game.name,
    gpuWeight: 0.70,
    baseDemand: 0.70,
    esports: false,
  }

  // Baseline if no hardware selected
  if (!cpu && !gpu) {
    return {
      gameId: game.id,
      gameName: game.name,
      coverImage: game.coverImage,
      resolution,
      quality,
      estimatedMinFps: 0,
      estimatedAvgFps: 0,
      estimatedMaxFps: 0,
      smoothnessRating: 'Below 30 FPS',
      meetsMinimum: false,
      meetsRecommended: false,
      limitingFactor: 'None',
    }
  }

  // CPU Score Component (normalized 15 - 120 FPS baseline capability in standard AAA)
  const cpuSingle = cpu ? cpu.singleThreadScore : 40
  const cpuMulti = cpu ? cpu.multiThreadScore : 40
  const cpuEffective = cpuSingle * 0.65 + cpuMulti * 0.35

  // GPU Score Component depending on resolution
  let gpuRaster = 30
  if (gpu) {
    if (resolution === '1080p') gpuRaster = gpu.rasterScore1080p
    else if (resolution === '1440p') gpuRaster = gpu.rasterScore1440p
    else gpuRaster = gpu.rasterScore4k
  }

  // VRAM penalty if 4K or 1440p Ultra with low VRAM
  let vramPenalty = 1.0
  if (gpu) {
    if (resolution === '4K' && gpu.vramGb < 12) {
      vramPenalty = 0.75
    } else if (resolution === '1440p' && quality === 'Ultra' && gpu.vramGb < 8) {
      vramPenalty = 0.82
    }
  }

  // RAM capacity influence
  let ramMultiplier = 1.0
  if (!ram || ram.capacityGb < 8) {
    ramMultiplier = 0.65
  } else if (ram.capacityGb === 8) {
    ramMultiplier = 0.85
  } else if (ram.capacityGb >= 32) {
    ramMultiplier = 1.03
  }

  // Esports games scale higher in FPS
  const esportsMultiplier = profile.esports ? 1.85 : 1.0

  // Combined score: Weighted average between GPU & CPU
  // At 1080p, CPU has more influence. At 4K, GPU dominates.
  let activeGpuWeight = profile.gpuWeight
  if (resolution === '1080p') activeGpuWeight = Math.max(0.40, profile.gpuWeight - 0.15)
  if (resolution === '4K') activeGpuWeight = Math.min(0.92, profile.gpuWeight + 0.12)

  const activeCpuWeight = 1 - activeGpuWeight

  // Raw computing index
  const combinedCompute = (gpuRaster * activeGpuWeight + cpuEffective * activeCpuWeight) * 1.6

  // Base raw FPS at High 1080p
  let baselineFps = (combinedCompute / (profile.baseDemand * 0.85)) * esportsMultiplier

  // Apply Resolution, Quality, VRAM, and RAM modifiers
  const finalAvg = Math.round(
    baselineFps *
      RESOLUTION_MULTIPLIERS[resolution] *
      QUALITY_MULTIPLIERS[quality] *
      vramPenalty *
      ramMultiplier
  )

  // Calculate 1% lows and max FPS
  const minFps = Math.max(1, Math.round(finalAvg * 0.78))
  const maxFps = Math.round(finalAvg * 1.18)

  // Smoothness rating
  let smoothnessRating: GamePerformanceEstimate['smoothnessRating'] = 'Below 30 FPS'
  if (finalAvg >= 144) smoothnessRating = 'Competitive 144+ FPS'
  else if (finalAvg >= 90) smoothnessRating = 'Ultra Smooth 90-144 FPS'
  else if (finalAvg >= 60) smoothnessRating = 'Smooth 60-90 FPS'
  else if (finalAvg >= 30) smoothnessRating = 'Playable 30-60 FPS'

  // Limiting factor identification
  let limitingFactor: GamePerformanceEstimate['limitingFactor'] = 'None'
  if (gpu && cpu) {
    if (cpuEffective < gpuRaster * 0.72) limitingFactor = 'CPU'
    else if (gpuRaster < cpuEffective * 0.72) limitingFactor = 'GPU'
  }
  if (!ram || ram.capacityGb < 16) {
    if (quality === 'Ultra' || resolution === '4K') limitingFactor = 'RAM'
  }

  // Requirement checks
  const meetsMinimum = Boolean(cpu && gpu && (ram ? ram.capacityGb >= 8 : false) && finalAvg >= 30)
  const meetsRecommended = Boolean(cpu && gpu && (ram ? ram.capacityGb >= 16 : false) && finalAvg >= 60)

  return {
    gameId: game.id,
    gameName: game.name,
    coverImage: game.coverImage,
    resolution,
    quality,
    estimatedMinFps: minFps,
    estimatedAvgFps: finalAvg,
    estimatedMaxFps: maxFps,
    smoothnessRating,
    meetsMinimum,
    meetsRecommended,
    limitingFactor,
  }
}

export function getCuratedGameList() {
  return SEED_GAMES.map((game) => ({
    id: game.id,
    name: game.name,
    slug: game.slug,
    coverImage: game.coverImage,
    criticScore: game.criticScore,
    genres: game.genres,
    systemRequirements: game.systemRequirements,
  }))
}
