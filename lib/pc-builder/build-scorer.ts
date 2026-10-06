// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Deterministic Build Scorecard
// Evaluates Performance, Value, Upgradeability, Compatibility, and Power
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  BuildScorecard,
  CPUComponent,
  GPUComponent,
  MotherboardComponent,
  RAMComponent,
  StorageComponent,
  PSUComponent,
} from '@/types/pc-builder'
import { checkCompatibility } from './compatibility'
import { calculatePower } from './power-calculator'

export function calculateBuildScore(parts: BuildParts): BuildScorecard {
  const cpu = parts.cpu as CPUComponent | undefined
  const gpu = parts.gpu as GPUComponent | undefined
  const mb = parts.motherboard as MotherboardComponent | undefined
  const ram = parts.ram as RAMComponent | undefined
  const storage = parts.storage as StorageComponent | undefined
  const psu = parts.psu as PSUComponent | undefined

  const compat = checkCompatibility(parts)
  const power = calculatePower(parts)

  const strengths: string[] = []
  const improvements: string[] = []

  // 1. Compatibility Score (1 - 10)
  let compatScore = 10
  if (compat.status === 'incompatible') {
    compatScore = 3
    improvements.push('Resolve blocking physical or socket incompatibilities before purchasing.')
  } else if (compat.status === 'warning') {
    compatScore = 7.5
    improvements.push('Review clearance or power headroom warnings to avoid build hiccups.')
  } else {
    strengths.push('Zero hardware conflicts detected. Plug-and-play assembly verified.')
  }

  // 2. Performance Score (1 - 10)
  let perfScore = 5
  if (cpu && gpu) {
    const rawPower = (cpu.singleThreadScore * 0.4 + gpu.rasterScore1440p * 0.6) / 10
    perfScore = Math.min(10, Math.max(3, Math.round(rawPower * 10) / 10))

    if (gpu.vramGb >= 16) {
      strengths.push(`Abundant ${gpu.vramGb}GB VRAM for high-resolution texture packs and ray tracing.`)
    }
    if (ram && ram.capacityGb >= 32) {
      strengths.push('32GB+ RAM ensures flawless multitasking and smooth 1% frame times.')
    }
  } else if (cpu || gpu) {
    perfScore = 5
  }

  // 3. Upgradeability Score (1 - 10)
  let upgradeScore = 6
  if (mb) {
    if (mb.socket === 'AM5' || mb.socket === 'LGA1851') {
      upgradeScore += 2.5
      strengths.push(`Next-gen ${mb.socket} platform with active CPU generation longevity.`)
    } else if (mb.socket === 'AM4' || mb.socket === 'LGA1700') {
      upgradeScore -= 1
      improvements.push(`${mb.socket} is a mature, end-of-life platform. Future CPU upgrades will require a new motherboard.`)
    }

    if (mb.ramGen === 'DDR5') {
      upgradeScore += 1
    } else {
      upgradeScore -= 0.5
    }

    if (mb.ramSlots === 4) {
      upgradeScore += 0.5
    } else {
      improvements.push('Motherboard has only 2 RAM slots, requiring full kit replacement to upgrade memory capacity.')
    }
  }
  upgradeScore = Math.min(10, Math.max(3, Math.round(upgradeScore * 10) / 10))

  // 4. Power Balance (1 - 10)
  let powerScore = 7
  if (psu) {
    if (power.powerStatus === 'optimal') {
      powerScore = 9.5
      strengths.push(`PSU provides ${power.headroomWatts}W of headroom, operating in peak efficiency range.`)
    } else if (power.powerStatus === 'tight') {
      powerScore = 6.5
      improvements.push('PSU capacity is tight under peak boost spikes. An upgrade to 750W+ is recommended.')
    } else if (power.powerStatus === 'insufficient') {
      powerScore = 2
      improvements.push('Critical: Current PSU wattage cannot safely sustain this build.')
    }
  } else {
    powerScore = 5
  }

  // 5. Value Score (1 - 10)
  let valueScore = 8
  if (cpu && gpu) {
    const isOverpricedTier = gpu.tier === 'enthusiast' && cpu.tier === 'entry'
    if (isOverpricedTier) {
      valueScore = 6
      improvements.push('GPU is heavily tier-mismatched with the CPU; you are paying for GPU performance you cannot fully utilize.')
    } else {
      valueScore = 8.5
      strengths.push('Well-balanced CPU-to-GPU budget distribution.')
    }
  }

  // Storage factor
  if (storage && storage.readSpeedMbps >= 7000) {
    strengths.push(`Blazing 7000+ MB/s Gen4 NVMe storage for near-instant level streaming and boot times.`)
  }

  // Overall Score (weighted)
  const overall = Math.round(
    ((compatScore * 0.3 + perfScore * 0.25 + upgradeScore * 0.2 + valueScore * 0.15 + powerScore * 0.1) * 10)
  ) / 10

  return {
    overall: Math.min(10, Math.max(1, overall)),
    performance: Math.min(10, Math.max(1, perfScore)),
    value: Math.min(10, Math.max(1, valueScore)),
    upgradeability: Math.min(10, Math.max(1, upgradeScore)),
    compatibility: Math.min(10, Math.max(1, compatScore)),
    powerBalance: Math.min(10, Math.max(1, powerScore)),
    strengths,
    improvements,
  }
}
