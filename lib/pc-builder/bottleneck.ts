// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Educational Bottleneck & Hardware Balance Estimator
// Explains CPU vs GPU workload distribution dynamically based on resolution and application
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  BottleneckAnalysis,
  CPUComponent,
  GPUComponent,
} from '@/types/pc-builder'

export function analyzeBottleneck(
  parts: BuildParts,
  resolution: '1080p' | '1440p' | '4k' = '1440p',
  workload: 'esports-1080p' | 'aaa-1440p' | 'cinematic-4k' | 'workstation' = 'aaa-1440p'
): BottleneckAnalysis {
  const cpu = parts.cpu as CPUComponent | undefined
  const gpu = parts.gpu as GPUComponent | undefined

  if (!cpu || !gpu) {
    return {
      workload,
      workloadLabel: 'General Gaming',
      resolution,
      primaryLimiter: 'BALANCED',
      balanceScore: 100,
      explanation: 'Select both a CPU and a GPU to evaluate system balance and hardware synergy.',
      educationalNote: 'Bottlenecks occur in every computer system and shift continuously depending on the resolution and application.',
    }
  }

  // CPU relative power score (0 - 100)
  const cpuPower = cpu.singleThreadScore * 0.7 + cpu.multiThreadScore * 0.3

  // GPU relative power score depending on resolution (0 - 100)
  let gpuPower = gpu.rasterScore1440p
  if (resolution === '1080p') gpuPower = gpu.rasterScore1080p
  else if (resolution === '4k') gpuPower = gpu.rasterScore4k

  // Resolution impact factor on CPU load vs GPU load
  // At 1080p, GPU finishes frames faster, putting high draw-call demand on the CPU.
  // At 4K, the GPU is saturated shading 8.3M pixels, so the CPU rarely waits.
  let resolutionModifier = 1.0
  if (resolution === '1080p') resolutionModifier = 1.25 // shifts towards CPU limit
  if (resolution === '4k') resolutionModifier = 0.75 // shifts towards GPU limit

  // Workload factor
  let workloadModifier = 1.0
  let workloadLabel = '1440p AAA Gaming'
  if (workload === 'esports-1080p') {
    workloadModifier = 1.4
    workloadLabel = 'High-FPS Esports (CS2, Valorant, Fortnite)'
  } else if (workload === 'cinematic-4k') {
    workloadModifier = 0.65
    workloadLabel = 'Cinematic 4K Native & Ray Tracing'
  } else if (workload === 'workstation') {
    workloadModifier = 1.1
    workloadLabel = 'Content Creation & 3D Rendering'
  }

  // Compute effective demand balance ratio
  const adjustedGpuDemand = gpuPower * resolutionModifier * workloadModifier
  const ratio = adjustedGpuDemand / Math.max(cpuPower, 20)

  let primaryLimiter: BottleneckAnalysis['primaryLimiter'] = 'BALANCED'
  let balanceScore = 95
  let explanation = ''
  let educationalNote = ''

  if (ratio > 1.35) {
    primaryLimiter = 'CPU'
    balanceScore = Math.max(60, Math.round(100 - (ratio - 1.35) * 45))
    explanation = `At ${resolution.toUpperCase()} in ${workloadLabel}, the ${gpu.name} is exceptionally capable, and this system will be primarily CPU-limited in fast-paced scenarios. The graphics card may not hit 100% utilization in high-framerate titles because the CPU cannot feed draw calls quickly enough.`
    educationalNote = `This is not harmful to your PC. To get higher GPU utilization, you can increase resolution to 1440p/4K, turn on Ray Tracing, or increase graphic quality presets.`
  } else if (ratio < 0.75) {
    primaryLimiter = 'GPU'
    balanceScore = Math.max(65, Math.round(100 - (0.75 - ratio) * 50))
    explanation = `At ${resolution.toUpperCase()} in ${workloadLabel}, this build will be strictly GPU-limited. The ${cpu.name} has substantial headroom, while the ${gpu.name} will operate at ~99% utilization, which is the ideal scenario for graphics-heavy games.`
    educationalNote = `GPU limitation is the standard target in gaming PCs. It ensures you are getting the absolute maximum return on your graphics card investment with steady frame pacing.`
  } else {
    primaryLimiter = 'BALANCED'
    balanceScore = 94
    explanation = `Excellent synergy: The ${cpu.name} and ${gpu.name} are harmoniously paired for ${resolution.toUpperCase()} gaming. Neither component severely restricts the other in typical modern workloads.`
    educationalNote = `Remember that bottlenecks are not static numbers: competitive esports titles lean on CPU single-core speed, while cinematic story games lean heavily on GPU compute and VRAM.`
  }

  return {
    workload,
    workloadLabel,
    resolution,
    primaryLimiter,
    balanceScore,
    explanation,
    educationalNote,
  }
}
