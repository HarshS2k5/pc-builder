// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Build Persistence, Sharing & Markdown Exporter
// Handles LocalStorage persistence, portable base64 share links, and Reddit/forum formatting
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  SavedBuild,
  ComponentCategory,
  Currency,
} from '@/types/pc-builder'
import { findComponentById, ALL_COMPONENTS } from './components-data'
import { formatCurrency, calculateBuildPrice } from './price-calculator'
import { calculatePower } from './power-calculator'
import { checkCompatibility } from './compatibility'

const STORAGE_KEY = 'gamerank_techforge_saved_builds_v1'

export function getSavedBuilds(): SavedBuild[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedBuild[]
  } catch (err) {
    console.error('Failed to parse saved builds from localStorage', err)
    return []
  }
}

export function saveBuildToStorage(
  name: string,
  parts: BuildParts,
  currency: Currency = 'INR',
  existingId?: string
): SavedBuild {
  const builds = getSavedBuilds()
  const partIds: Partial<Record<ComponentCategory, string>> = {}

  for (const cat of Object.keys(parts) as ComponentCategory[]) {
    const c = parts[cat]
    if (c) {
      partIds[cat] = c.id
    }
  }

  const shareCode = encodeBuildToShareCode(parts)
  const now = new Date().toISOString()

  let savedBuild: SavedBuild

  if (existingId) {
    const index = builds.findIndex((b) => b.id === existingId)
    if (index !== -1) {
      savedBuild = {
        ...builds[index],
        name,
        partIds,
        currency,
        shareCode,
        updatedAt: now,
      }
      builds[index] = savedBuild
    } else {
      savedBuild = {
        id: existingId,
        name,
        shareCode,
        partIds,
        createdAt: now,
        updatedAt: now,
        currency,
      }
      builds.unshift(savedBuild)
    }
  } else {
    const randomNum = Math.floor(10000 + Math.random() * 90000)
    savedBuild = {
      id: `build-${Date.now()}-${randomNum}`,
      name: name || `TECHFORGE BUILD #${randomNum}`,
      shareCode,
      partIds,
      createdAt: now,
      updatedAt: now,
      currency,
    }
    builds.unshift(savedBuild)
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds))
  } catch (err) {
    console.error('Failed to save build to localStorage', err)
  }

  return savedBuild
}

export function deleteSavedBuild(id: string): SavedBuild[] {
  const builds = getSavedBuilds().filter((b) => b.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds))
  } catch (err) {
    console.error('Failed to update localStorage after delete', err)
  }
  return builds
}

export function duplicateSavedBuild(id: string): SavedBuild | null {
  const builds = getSavedBuilds()
  const target = builds.find((b) => b.id === id)
  if (!target) return null

  const randomNum = Math.floor(10000 + Math.random() * 90000)
  const duplicated: SavedBuild = {
    ...target,
    id: `build-${Date.now()}-${randomNum}`,
    name: `${target.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  builds.unshift(duplicated)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds))
  } catch (err) {
    console.error('Failed to duplicate build in localStorage', err)
  }
  return duplicated
}

// ---------------------------------------------------------------------------
// Share Code & URL Encoding
// ---------------------------------------------------------------------------

export function encodeBuildToShareCode(parts: BuildParts): string {
  const partIds: Partial<Record<ComponentCategory, string>> = {}
  for (const cat of Object.keys(parts) as ComponentCategory[]) {
    if (parts[cat]) {
      partIds[cat] = parts[cat]!.id
    }
  }
  try {
    const json = JSON.stringify(partIds)
    if (typeof window !== 'undefined') {
      return btoa(encodeURIComponent(json))
    }
    return Buffer.from(encodeURIComponent(json)).toString('base64')
  } catch {
    return ''
  }
}

export function decodeShareCodeToParts(shareCode: string): BuildParts {
  const parts: BuildParts = {}
  try {
    let json = ''
    if (typeof window !== 'undefined') {
      json = decodeURIComponent(atob(shareCode))
    } else {
      json = decodeURIComponent(Buffer.from(shareCode, 'base64').toString('utf8'))
    }
    const partIds = JSON.parse(json) as Partial<Record<ComponentCategory, string>>

    for (const cat of Object.keys(partIds) as ComponentCategory[]) {
      const id = partIds[cat]
      if (id) {
        const component = findComponentById(id)
        if (component) {
          parts[cat] = component
        }
      }
    }
  } catch (err) {
    console.error('Failed to decode share code', err)
  }
  return parts
}

// ---------------------------------------------------------------------------
// Markdown Exporter for Forums & Reddit
// ---------------------------------------------------------------------------

export function exportBuildToMarkdown(parts: BuildParts, currency: Currency = 'INR'): string {
  const pricing = calculateBuildPrice(parts, currency)
  const power = calculatePower(parts)
  const compat = checkCompatibility(parts)

  const rows = [
    `# 🛠️ TechForge PC Build Specification`,
    ``,
    `**Compatibility Status:** ${
      compat.status === 'compatible'
        ? '🟢 100% Compatible'
        : compat.status === 'warning'
        ? '🟡 Warnings Detected'
        : '🔴 Incompatibilities Detected'
    }`,
    `**Estimated Peak Load:** ~${power.totalEstimatedWatts}W | **Recommended PSU:** ${power.recommendedPsuWatts}W`,
    `**Total Build Price:** ${pricing.formattedTotal} (${currency})`,
    ``,
    `| Component | Model | Specs | Price |`,
    `| :--- | :--- | :--- | :--- |`,
  ]

  const categories: { cat: ComponentCategory; label: string }[] = [
    { cat: 'cpu', label: 'CPU' },
    { cat: 'cooler', label: 'CPU Cooler' },
    { cat: 'motherboard', label: 'Motherboard' },
    { cat: 'ram', label: 'Memory (RAM)' },
    { cat: 'storage', label: 'Storage' },
    { cat: 'gpu', label: 'Graphics Card (GPU)' },
    { cat: 'case', label: 'Case' },
    { cat: 'psu', label: 'Power Supply (PSU)' },
  ]

  for (const { cat, label } of categories) {
    const item = parts[cat]
    if (item) {
      let specSummary = ''
      if (cat === 'cpu') specSummary = `${(item as any).cores}C/${(item as any).threads}T, ${(item as any).socket}`
      else if (cat === 'gpu') specSummary = `${(item as any).vramGb}GB ${(item as any).vramType}, ${(item as any).lengthMm}mm`
      else if (cat === 'motherboard') specSummary = `${(item as any).socket}, ${(item as any).formFactor}, ${(item as any).ramGen}`
      else if (cat === 'ram') specSummary = `${(item as any).capacityGb}GB ${(item as any).gen}-${(item as any).speedMhz} CL${(item as any).casLatency}`
      else if (cat === 'storage') specSummary = `${(item as any).capacityGb >= 1000 ? (item as any).capacityGb / 1000 + 'TB' : (item as any).capacityGb + 'GB'} ${(item as any).type}`
      else if (cat === 'psu') specSummary = `${(item as any).wattage}W ${(item as any).efficiency}`
      else if (cat === 'case') specSummary = `${(item as any).formFactor}`
      else if (cat === 'cooler') specSummary = `${(item as any).type}`

      const priceStr = formatCurrency(
        currency === 'INR' ? item.priceInr : item.priceUsd,
        currency
      )
      rows.push(`| **${label}** | ${item.name} | ${specSummary} | ${priceStr} |`)
    } else {
      rows.push(`| **${label}** | *None selected* | - | - |`)
    }
  }

  rows.push(``)
  rows.push(`*Generated via GameRank TechForge PC Builder*`)

  return rows.join('\n')
}
