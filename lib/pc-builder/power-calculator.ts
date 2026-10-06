// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Power Consumption Calculator
// Calculates component-by-component electrical draw, transient margins, and PSU recommendations
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  PowerCalculation,
  CPUComponent,
  GPUComponent,
  MotherboardComponent,
  RAMComponent,
  StorageComponent,
  PSUComponent,
  CoolerComponent,
} from '@/types/pc-builder'

export function calculatePower(parts: BuildParts): PowerCalculation {
  const cpu = parts.cpu as CPUComponent | undefined
  const gpu = parts.gpu as GPUComponent | undefined
  const mb = parts.motherboard as MotherboardComponent | undefined
  const ram = parts.ram as RAMComponent | undefined
  const storage = parts.storage as StorageComponent | undefined
  const psu = parts.psu as PSUComponent | undefined
  const cooler = parts.cooler as CoolerComponent | undefined

  // CPU Power Estimate
  // Modern CPUs boost well past base TDP; we calculate realistic heavy load wattage
  let cpuWatts = 0
  if (cpu) {
    cpuWatts = Math.round(cpu.tdpWatts * 0.4 + cpu.peakPowerWatts * 0.6)
  }

  // GPU Power Estimate
  let gpuWatts = 0
  if (gpu) {
    gpuWatts = gpu.tdpWatts
  }

  // Motherboard Base Draw
  let motherboardWatts = 0
  if (mb) {
    motherboardWatts = mb.basePowerDrawWatts
  } else if (cpu || ram) {
    motherboardWatts = 35 // default estimated baseline
  }

  // RAM Power Draw (~4W per stick DDR4, ~5W per stick DDR5 under active load)
  let ramWatts = 0
  if (ram) {
    ramWatts = ram.modulesCount * (ram.gen === 'DDR5' ? 5 : 4)
  }

  // Storage Draw (NVMe ~6-9W under write/read, SATA SSD ~3W, HDD ~8W spin up)
  let storageWatts = 0
  if (storage) {
    if (storage.type === 'NVMe SSD') {
      storageWatts = storage.interface.includes('5.0') ? 11 : 7
    } else if (storage.type === 'HDD') {
      storageWatts = 9
    } else {
      storageWatts = 4
    }
  }

  // Fans & Cooler Power Draw
  let fansCoolerWatts = 0
  if (cooler) {
    if (cooler.type.includes('AIO')) {
      // Pump (10W-15W) + 2 or 3 120mm/140mm high-static pressure fans (5W each)
      fansCoolerWatts = cooler.type.includes('360') ? 22 : 18
    } else {
      // Air cooler dual or single fan
      fansCoolerWatts = 8
    }
  } else {
    fansCoolerWatts = 10 // stock/case fans
  }

  // System Overhead (USB controllers, chipset communication, audio, VRM thermal loss)
  const activeComponentsCount = [cpu, gpu, mb, ram, storage].filter(Boolean).length
  const systemOverheadWatts = activeComponentsCount > 0 ? 25 : 0

  const totalEstimatedWatts =
    cpuWatts +
    gpuWatts +
    motherboardWatts +
    ramWatts +
    storageWatts +
    fansCoolerWatts +
    systemOverheadWatts

  // Recommended PSU: ~30-40% safety headroom for transient spikes (especially on high-end GPUs like RTX 4080/4090)
  // Plus we respect GPU manufacturer's official recommended baseline
  let recommendedPsuWatts = totalEstimatedWatts > 0 ? Math.ceil((totalEstimatedWatts * 1.35) / 50) * 50 : 450
  if (gpu && gpu.recommendedPsuWatts > recommendedPsuWatts) {
    recommendedPsuWatts = gpu.recommendedPsuWatts
  }

  // Installed PSU checks
  let installedPsuWatts: number | undefined = undefined
  let headroomWatts: number | undefined = undefined
  let loadPercentage: number | undefined = undefined
  let powerStatus: PowerCalculation['powerStatus'] = 'no-psu'
  let message = 'Add components to calculate system wattage.'

  if (psu) {
    installedPsuWatts = psu.wattage
    headroomWatts = psu.wattage - totalEstimatedWatts
    loadPercentage = totalEstimatedWatts > 0 ? Math.round((totalEstimatedWatts / psu.wattage) * 100) : 0

    if (psu.wattage < totalEstimatedWatts) {
      powerStatus = 'insufficient'
      message = `Overloaded: System load (~${totalEstimatedWatts}W) exceeds PSU rated capacity (${psu.wattage}W). System may trip under gaming or multicore loads.`
    } else if (psu.wattage < recommendedPsuWatts) {
      powerStatus = 'tight'
      message = `Sub-optimal headroom: Load is ~${loadPercentage}% of capacity. Recommended PSU for stable transient response is ${recommendedPsuWatts}W.`
    } else {
      powerStatus = 'optimal'
      message = `Optimal power delivery: Operating at ~${loadPercentage}% peak load with ${headroomWatts}W headroom, sitting near the peak efficiency curve.`
    }
  } else if (totalEstimatedWatts > 0) {
    message = `Estimated system load is ~${totalEstimatedWatts}W. We recommend at least a ${recommendedPsuWatts}W PSU.`
  }

  return {
    cpuWatts,
    gpuWatts,
    motherboardWatts,
    ramWatts,
    storageWatts,
    fansCoolerWatts,
    systemOverheadWatts,
    totalEstimatedWatts,
    recommendedPsuWatts,
    installedPsuWatts,
    headroomWatts,
    loadPercentage,
    powerStatus,
    message,
  }
}
