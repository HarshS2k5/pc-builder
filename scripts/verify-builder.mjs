// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Automated Validation & Verification Suite
// ─────────────────────────────────────────────────────────────────────────────

import { CPUS, GPUS, MOTHERBOARDS, RAMS, STORAGES, PSUS, CASES, COOLERS, BUILD_PRESETS } from '../lib/pc-builder/components-data.ts'
import { checkCompatibility } from '../lib/pc-builder/compatibility.ts'
import { calculatePower } from '../lib/pc-builder/power-calculator.ts'
import { calculateBuildPrice, formatCurrency } from '../lib/pc-builder/price-calculator.ts'
import { estimateGamePerformance } from '../lib/pc-builder/performance-estimator.ts'
import { analyzeBottleneck } from '../lib/pc-builder/bottleneck.ts'
import { calculateBuildScore } from '../lib/pc-builder/build-scorer.ts'
import { generateSmartBuild } from '../lib/pc-builder/smart-wizard.ts'
import { encodeBuildToShareCode, decodeShareCodeToParts } from '../lib/pc-builder/build-storage.ts'

console.log('=== TEST 1: CATALOG SANITY CHECKS ===')
console.log(`CPUs count: ${CPUS.length}`)
console.log(`GPUs count: ${GPUS.length}`)
console.log(`Motherboards count: ${MOTHERBOARDS.length}`)
console.log(`RAM kits count: ${RAMS.length}`)
console.log(`Storage drives count: ${STORAGES.length}`)
console.log(`PSUs count: ${PSUS.length}`)
console.log(`Cases count: ${CASES.length}`)
console.log(`Coolers count: ${COOLERS.length}`)
console.log(`Presets count: ${BUILD_PRESETS.length}`)
if (CPUS.length < 5 || GPUS.length < 5) throw new Error('Catalog has insufficient parts!')

console.log('\n=== TEST 2: COMPATIBILITY ENGINE ===')
// Test 2A: Perfectly compatible preset
const sweetspotPreset = BUILD_PRESETS[1]
const validParts = {
  cpu: CPUS.find(c => c.id === sweetspotPreset.partIds.cpu),
  gpu: GPUS.find(g => g.id === sweetspotPreset.partIds.gpu),
  motherboard: MOTHERBOARDS.find(m => m.id === sweetspotPreset.partIds.motherboard),
  ram: RAMS.find(r => r.id === sweetspotPreset.partIds.ram),
  storage: STORAGES.find(s => s.id === sweetspotPreset.partIds.storage),
  psu: PSUS.find(p => p.id === sweetspotPreset.partIds.psu),
  case: CASES.find(c => c.id === sweetspotPreset.partIds.case),
  cooler: COOLERS.find(c => c.id === sweetspotPreset.partIds.cooler),
}
const validReport = checkCompatibility(validParts)
console.log(`Valid build status: ${validReport.status} (issues: ${validReport.issues.length})`)
if (validReport.status === 'incompatible') throw new Error('Preset should be compatible!')

// Test 2B: Socket mismatch (AMD AM5 CPU + Intel LGA1700 Motherboard)
const socketMismatchParts = {
  ...validParts,
  cpu: CPUS.find(c => c.socket === 'AM5'),
  motherboard: MOTHERBOARDS.find(m => m.socket === 'LGA1700'),
}
const socketMismatchReport = checkCompatibility(socketMismatchParts)
console.log(`Socket mismatch status: ${socketMismatchReport.status}`)
const socketIssue = socketMismatchReport.issues.find(i => i.rule.includes('Socket'))
if (!socketIssue || socketMismatchReport.status !== 'incompatible') {
  throw new Error('Socket mismatch failed to trigger incompatibility error!')
}
console.log(`- Detected issue: "${socketIssue.message}"`)

// Test 2C: RAM generation mismatch (DDR5 RAM + DDR4 Motherboard)
const ramMismatchParts = {
  ...validParts,
  motherboard: MOTHERBOARDS.find(m => m.ramGen === 'DDR4'),
  ram: RAMS.find(r => r.gen === 'DDR5'),
}
const ramMismatchReport = checkCompatibility(ramMismatchParts)
const ramIssue = ramMismatchReport.issues.find(i => i.rule.includes('RAM Generation'))
if (!ramIssue || ramMismatchReport.status !== 'incompatible') {
  throw new Error('RAM generation mismatch failed to trigger error!')
}
console.log(`- Detected RAM issue: "${ramIssue.message}"`)

// Test 2D: GPU length clearance mismatch (Long GPU + Mini Case)
const gpuLengthParts = {
  ...validParts,
  gpu: GPUS.find(g => g.lengthMm >= 300),
  case: CASES.find(c => c.maxGpuLengthMm < 300),
}
if (gpuLengthParts.case) {
  const gpuClearanceReport = checkCompatibility(gpuLengthParts)
  console.log(`GPU clearance status: ${gpuClearanceReport.status}`)
}

console.log('\n=== TEST 3: POWER CALCULATION ===')
const power = calculatePower(validParts)
console.log(`Estimated load: ${power.totalEstimatedWatts}W`)
console.log(`Recommended PSU: ${power.recommendedPsuWatts}W`)
console.log(`PSU Status: ${power.powerStatus} (${power.message})`)
if (power.totalEstimatedWatts <= 0 || power.recommendedPsuWatts <= power.totalEstimatedWatts) {
  throw new Error('Power calculations invalid!')
}

console.log('\n=== TEST 4: PRICING & CURRENCY FORMATTING ===')
const pricingInr = calculateBuildPrice(validParts, 'INR')
const pricingUsd = calculateBuildPrice(validParts, 'USD')
console.log(`INR Total: ${pricingInr.formattedTotal}`)
console.log(`USD Total: ${pricingUsd.formattedTotal}`)
if (!pricingInr.formattedTotal.startsWith('₹') || !pricingUsd.formattedTotal.startsWith('$')) {
  throw new Error('Currency formatting failed!')
}

console.log('\n=== TEST 5: PERFORMANCE ESTIMATOR ===')
const fpsCyberpunk = estimateGamePerformance(validParts, 'cyberpunk-2077', '1440p', 'High')
console.log(`Cyberpunk 1440p High: ${fpsCyberpunk?.estimatedMinFps}–${fpsCyberpunk?.estimatedMaxFps} FPS (Avg: ${fpsCyberpunk?.estimatedAvgFps} FPS)`)
const fpsValorant = estimateGamePerformance(validParts, 'valorant', '1080p', 'High')
console.log(`Valorant 1080p High: ${fpsValorant?.estimatedMinFps}–${fpsValorant?.estimatedMaxFps} FPS (Avg: ${fpsValorant?.estimatedAvgFps} FPS)`)
if (!fpsCyberpunk || fpsCyberpunk.estimatedAvgFps <= 0) {
  throw new Error('FPS estimation failed!')
}

console.log('\n=== TEST 6: BOTTLENECK ESTIMATOR ===')
const bottleneck = analyzeBottleneck(validParts, '1440p', 'aaa-1440p')
console.log(`Limiter: ${bottleneck.primaryLimiter}, Synergy: ${bottleneck.balanceScore}/100`)
console.log(`Note: ${bottleneck.explanation}`)

console.log('\n=== TEST 7: BUILD SCORECARD ===')
const scorecard = calculateBuildScore(validParts)
console.log(`Overall: ${scorecard.overall}/10, Perf: ${scorecard.performance}/10, Compat: ${scorecard.compatibility}/10`)

console.log('\n=== TEST 8: SHARE LINK ENCODE / DECODE ===')
const code = encodeBuildToShareCode(validParts)
const decoded = decodeShareCodeToParts(code)
console.log(`Share Code: ${code.slice(0, 30)}...`)
console.log(`Decoded CPU: ${decoded.cpu?.name}`)
if (decoded.cpu?.id !== validParts.cpu?.id) {
  throw new Error('Share link decode did not match original CPU!')
}

console.log('\n=== TEST 9: SMART BUILD WIZARD ===')
const smartBuild = generateSmartBuild({
  purpose: 'gaming',
  budget: 150000,
  currency: 'INR',
  resolution: '1440p',
})
console.log(`Generated CPU: ${smartBuild.cpu?.name}, GPU: ${smartBuild.gpu?.name}`)
const smartCompat = checkCompatibility(smartBuild)
console.log(`Smart Build Compatibility: ${smartCompat.status}`)
if (smartCompat.status === 'incompatible') {
  throw new Error('Smart build generated an incompatible configuration!')
}

console.log('\nALL 9 TESTS PASSED SUCCESSFULLY! ✅')
