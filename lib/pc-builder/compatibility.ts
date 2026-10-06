// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Deep Hardware Compatibility Engine
// Accurately checks physical dimensions, electrical specifications, and socket standards
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  CompatibilityReport,
  CompatibilityIssue,
  CPUComponent,
  GPUComponent,
  MotherboardComponent,
  RAMComponent,
  StorageComponent,
  PSUComponent,
  CaseComponent,
  CoolerComponent,
} from '@/types/pc-builder'

export function checkCompatibility(parts: BuildParts): CompatibilityReport {
  const issues: CompatibilityIssue[] = []
  let checksCount = 0

  const cpu = parts.cpu as CPUComponent | undefined
  const gpu = parts.gpu as GPUComponent | undefined
  const mb = parts.motherboard as MotherboardComponent | undefined
  const ram = parts.ram as RAMComponent | undefined
  const storage = parts.storage as StorageComponent | undefined
  const psu = parts.psu as PSUComponent | undefined
  const pcCase = parts.case as CaseComponent | undefined
  const cooler = parts.cooler as CoolerComponent | undefined

  // 1. CPU <-> Motherboard Socket Check
  if (cpu && mb) {
    checksCount++
    if (cpu.socket !== mb.socket) {
      issues.push({
        severity: 'error',
        rule: 'CPU Socket Incompatibility',
        componentA: cpu.name,
        componentB: mb.name,
        message: `Incompatible CPU socket: The selected motherboard uses an ${mb.socket} socket with chipset ${mb.chipset}, while the selected ${cpu.name} requires an ${cpu.socket} socket.`,
        recommendation: `Switch to a motherboard with the ${cpu.socket} socket (e.g., ${cpu.socket === 'AM5' ? 'B650 or X670' : cpu.socket === 'LGA1700' ? 'B760 or Z790' : 'compatible chipset'}).`,
      })
    }
  }

  // 2. Motherboard <-> RAM Generation Check
  if (mb && ram) {
    checksCount++
    if (mb.ramGen !== ram.gen) {
      issues.push({
        severity: 'error',
        rule: 'RAM Generation Mismatch',
        componentA: ram.name,
        componentB: mb.name,
        message: `Incompatible memory type: The ${mb.name} motherboard only accepts ${mb.ramGen} memory modules, but the selected ${ram.name} is ${ram.gen}. The physical pinouts and notch locations are entirely incompatible.`,
        recommendation: `Select a ${mb.ramGen} memory kit to match this motherboard.`,
      })
    }
  }

  // 3. CPU <-> RAM Generation Compatibility Check
  if (cpu && ram) {
    checksCount++
    if (!cpu.supportedRamGen.includes(ram.gen)) {
      issues.push({
        severity: 'error',
        rule: 'CPU Memory Controller Mismatch',
        componentA: cpu.name,
        componentB: ram.name,
        message: `The memory controller on ${cpu.name} only supports ${cpu.supportedRamGen.join(' or ')}, but ${ram.gen} was selected.`,
        recommendation: `Select ${cpu.supportedRamGen.join('/')} memory for this CPU platform.`,
      })
    }
  }

  // 4. RAM Modules Count <-> Motherboard DIMM Slots Check
  if (mb && ram) {
    checksCount++
    if (ram.modulesCount > mb.ramSlots) {
      issues.push({
        severity: 'error',
        rule: 'DIMM Slot Exceeded',
        componentA: ram.name,
        componentB: mb.name,
        message: `Slot overflow: You selected a ${ram.modulesCount}-stick memory kit (${ram.name}), but the motherboard only has ${mb.ramSlots} physical DIMM slot(s).`,
        recommendation: `Choose a 2-stick (dual-channel) kit or select a motherboard with ${ram.modulesCount} DIMM slots.`,
      })
    }
  }

  // 5. GPU <-> Case Physical Length Clearance Check
  if (gpu && pcCase) {
    checksCount++
    if (gpu.lengthMm > pcCase.maxGpuLengthMm) {
      issues.push({
        severity: 'error',
        rule: 'GPU Physical Clearance Exceeded',
        componentA: gpu.name,
        componentB: pcCase.name,
        message: `Physical dimension conflict: The ${gpu.name} is ${gpu.lengthMm}mm long, but the ${pcCase.name} chassis only supports graphics cards up to ${pcCase.maxGpuLengthMm}mm. It will physically collide with the front panel or fans.`,
        recommendation: `Choose a case with at least ${gpu.lengthMm + 15}mm GPU clearance, or choose a shorter dual-fan graphics card.`,
      })
    } else if (pcCase.maxGpuLengthMm - gpu.lengthMm < 15) {
      issues.push({
        severity: 'warning',
        rule: 'Tight GPU Clearance',
        componentA: gpu.name,
        componentB: pcCase.name,
        message: `Tight clearance warning: The graphics card length (${gpu.lengthMm}mm) leaves less than 15mm of clearance in the ${pcCase.name} (${pcCase.maxGpuLengthMm}mm max). If you mount a front radiator or thick fans, the GPU may not fit.`,
        recommendation: `Ensure front radiator is mounted at the top or verify radiator thickness before assembly.`,
      })
    }
  }

  // 6. CPU Cooler <-> CPU Socket Compatibility
  if (cooler && cpu) {
    checksCount++
    if (!cooler.supportedSockets.includes(cpu.socket)) {
      issues.push({
        severity: 'error',
        rule: 'Cooler Socket Bracket Incompatible',
        componentA: cooler.name,
        componentB: cpu.name,
        message: `Mounting bracket incompatible: The ${cooler.name} does not include or support mounting hardware for the ${cpu.socket} socket used by ${cpu.name}.`,
        recommendation: `Select a cooler that natively supports ${cpu.socket} out of the box.`,
      })
    }
  }

  // 7. CPU Cooler <-> Case Clearance (Air Cooler Height & Liquid Cooler Radiator)
  if (cooler && pcCase) {
    checksCount++
    if (cooler.type === 'Air') {
      if (cooler.heightMm > pcCase.maxCoolerHeightMm) {
        issues.push({
          severity: 'error',
          rule: 'CPU Cooler Height Exceeded',
          componentA: cooler.name,
          componentB: pcCase.name,
          message: `Chassis panel clearance conflict: The air cooler height (${cooler.heightMm}mm) exceeds the maximum CPU cooler clearance of the ${pcCase.name} (${pcCase.maxCoolerHeightMm}mm). The side panel will not close.`,
          recommendation: `Choose a lower-profile air cooler under ${pcCase.maxCoolerHeightMm}mm or an AIO liquid cooler.`,
        })
      }
    } else {
      // Liquid AIO Cooler
      if (!pcCase.radiatorSupportMm.includes(cooler.radiatorSizeMm)) {
        issues.push({
          severity: 'error',
          rule: 'AIO Radiator Size Unsupported',
          componentA: cooler.name,
          componentB: pcCase.name,
          message: `Radiator mount unsupported: The ${cooler.name} requires a ${cooler.radiatorSizeMm}mm radiator mount, but the ${pcCase.name} only supports [${pcCase.radiatorSupportMm.join('mm, ')}mm] radiators.`,
          recommendation: `Select an AIO size supported by this chassis (e.g., ${pcCase.radiatorSupportMm.filter((s) => s >= 240).join('mm or ')}mm).`,
        })
      }
    }
  }

  // 8. Motherboard <-> Case Form Factor Compatibility
  if (mb && pcCase) {
    checksCount++
    if (!pcCase.supportedMotherboards.includes(mb.formFactor)) {
      issues.push({
        severity: 'error',
        rule: 'Motherboard Chassis Form Factor Incompatible',
        componentA: mb.name,
        componentB: pcCase.name,
        message: `Chassis standoff mismatch: The ${mb.name} is a ${mb.formFactor} motherboard, but the ${pcCase.name} chassis only accepts [${pcCase.supportedMotherboards.join(', ')}] boards. It cannot fit inside this enclosure.`,
        recommendation: `Select a case that supports ${mb.formFactor} motherboards, or downsize to a ${pcCase.supportedMotherboards[0]} motherboard.`,
      })
    }
  }

  // 9. CPU Cooler TDP Capacity vs CPU Heat Output
  if (cooler && cpu) {
    checksCount++
    if (cooler.maxTdpRatingWatts < cpu.peakPowerWatts) {
      issues.push({
        severity: 'warning',
        rule: 'Potential Thermal Throttling',
        componentA: cooler.name,
        componentB: cpu.name,
        message: `Thermal headroom warning: The ${cpu.name} can draw up to ${cpu.peakPowerWatts}W under boost loads, while the ${cooler.name} is rated for ${cooler.maxTdpRatingWatts}W. Heavy sustained rendering or AVX workloads may lead to thermal throttling.`,
        recommendation: `Consider upgrading to a dual-tower air cooler or a 240mm/360mm AIO for sustained boost performance.`,
      })
    }
  }

  // 10. PSU Wattage vs System Load Headroom
  if (psu) {
    checksCount++
    // Calculate approximate load
    const cpuWatts = cpu ? Math.max(cpu.tdpWatts, cpu.peakPowerWatts * 0.85) : 80
    const gpuWatts = gpu ? gpu.tdpWatts : 50
    const otherWatts = 70 // MB, RAM, Storage, Fans
    const estimatedLoad = Math.round(cpuWatts + gpuWatts + otherWatts)
    const recommendedWattage = Math.round(estimatedLoad * 1.3)

    if (psu.wattage < estimatedLoad) {
      issues.push({
        severity: 'error',
        rule: 'Insufficient Power Supply (PSU)',
        componentA: psu.name,
        message: `Critical power shortage: The total estimated system draw is ~${estimatedLoad}W, but the selected ${psu.name} only supplies ${psu.wattage}W. The system will trigger Over-Current / Over-Power Protection (OCP/OPP) and shut down under load.`,
        recommendation: `Upgrade to at least a ${Math.ceil(recommendedWattage / 50) * 50}W power supply.`,
      })
    } else if (psu.wattage < recommendedWattage) {
      issues.push({
        severity: 'warning',
        rule: 'Tight Power Supply Headroom',
        componentA: psu.name,
        message: `Sub-optimal PSU headroom: System peak load is ~${estimatedLoad}W. While the ${psu.wattage}W PSU can run this build, it leaves minimal headroom for transient GPU power spikes. Recommended PSU capacity is ${recommendedWattage}W.`,
        recommendation: `A ${Math.ceil(recommendedWattage / 50) * 50}W PSU will operate closer to its 50% peak efficiency curve and run quieter.`,
      })
    }

    if (gpu && psu.wattage < gpu.recommendedPsuWatts) {
      issues.push({
        severity: 'warning',
        rule: 'Below GPU Manufacturer Recommended PSU',
        componentA: gpu.name,
        componentB: psu.name,
        message: `${gpu.brand} recommends a minimum ${gpu.recommendedPsuWatts}W PSU for the ${gpu.name}. You have selected a ${psu.wattage}W unit.`,
        recommendation: `Consider stepping up to a ${gpu.recommendedPsuWatts}W+ power supply to ensure stability.`,
      })
    }
  }

  // 11. Storage Interface & M.2 Slot Check
  if (storage && mb) {
    checksCount++
    if (storage.isM2 && mb.m2Slots < 1) {
      issues.push({
        severity: 'error',
        rule: 'No M.2 NVMe Slots Available',
        componentA: storage.name,
        componentB: mb.name,
        message: `The ${storage.name} requires an M.2 slot, but this motherboard has no M.2 slots.`,
        recommendation: `Select a 2.5" SATA SSD or choose a motherboard with M.2 NVMe support.`,
      })
    }
  }

  // Determine overall status
  const hasErrors = issues.some((i) => i.severity === 'error')
  const hasWarnings = issues.some((i) => i.severity === 'warning')

  let status: CompatibilityReport['status'] = 'compatible'
  if (hasErrors) {
    status = 'incompatible'
  } else if (hasWarnings) {
    status = 'warning'
  }

  return {
    status,
    issues,
    checksCount: Math.max(checksCount, 1),
  }
}
