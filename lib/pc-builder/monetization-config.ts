import fs from 'fs'
import path from 'path'
import {
  MonetizationSettings,
  SponsoredPlacement,
  RetailerConfig,
} from '@/types/pc-builder'

const DATA_FILE = path.join(process.cwd(), '.data', 'monetization.json')

export const DEFAULT_RETAILERS: RetailerConfig[] = [
  {
    id: 'amazon-in',
    name: 'Amazon India',
    region: 'IN',
    baseUrl: 'https://www.amazon.in',
    affiliateTagParam: 'tag',
    affiliateTagValue: process.env.AMAZON_AFFILIATE_TAG_IN || 'rigcraft-in-21',
    isEnabled: true,
  },
  {
    id: 'mdcomputers',
    name: 'MDComputers',
    region: 'IN',
    baseUrl: 'https://mdcomputers.in',
    affiliateTagParam: 'tracking',
    affiliateTagValue: process.env.MDCOMPUTERS_REF || '',
    isEnabled: true,
  },
  {
    id: 'vedant',
    name: 'Vedant Computers',
    region: 'IN',
    baseUrl: 'https://www.vedantcomputers.com',
    affiliateTagParam: 'ref',
    affiliateTagValue: process.env.VEDANT_REF || '',
    isEnabled: true,
  },
  {
    id: 'primeabgb',
    name: 'PrimeABGB',
    region: 'IN',
    baseUrl: 'https://www.primeabgb.com',
    affiliateTagParam: 'ref',
    affiliateTagValue: process.env.PRIMEABGB_REF || '',
    isEnabled: true,
  },
  {
    id: 'amazon-us',
    name: 'Amazon US',
    region: 'US',
    baseUrl: 'https://www.amazon.com',
    affiliateTagParam: 'tag',
    affiliateTagValue: process.env.AMAZON_AFFILIATE_TAG_US || 'rigcraft-us-20',
    isEnabled: true,
  },
  {
    id: 'newegg',
    name: 'Newegg',
    region: 'US',
    baseUrl: 'https://www.newegg.com',
    affiliateTagParam: 'cm_mmc',
    affiliateTagValue: process.env.NEWEGG_AFFILIATE_TAG || '',
    isEnabled: true,
  },
]

export const DEFAULT_MONETIZATION_SETTINGS: MonetizationSettings = {
  affiliateNoticeEnabled: true,
  sponsoredProductsEnabled: true,
  multiRetailerEnabled: true,
  currencyRates: {
    usdToInr: 83.2,
    lastUpdated: '2026-10-06',
  },
  retailers: DEFAULT_RETAILERS,
}

// In-memory cache
let cachedSettings: MonetizationSettings | null = null
let cachedSponsored: SponsoredPlacement[] = []

function ensureDataDir(): void {
  const dir = path.join(process.cwd(), '.data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getMonetizationSettings(): MonetizationSettings {
  if (cachedSettings) return cachedSettings

  ensureDataDir()
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      cachedSettings = {
        ...DEFAULT_MONETIZATION_SETTINGS,
        ...parsed.settings,
      }
      cachedSponsored = parsed.sponsored || []
      return cachedSettings!
    } catch (e) {
      console.warn('Failed reading monetization.json, using defaults:', e)
    }
  }

  cachedSettings = DEFAULT_MONETIZATION_SETTINGS
  return cachedSettings
}

export function saveMonetizationSettings(
  settings: MonetizationSettings,
  sponsored: SponsoredPlacement[]
): boolean {
  try {
    ensureDataDir()
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ settings, sponsored, updatedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    )
    cachedSettings = settings
    cachedSponsored = sponsored
    return true
  } catch (err) {
    console.error('Failed saving monetization settings:', err)
    return false
  }
}

export function getActiveSponsoredPlacements(): SponsoredPlacement[] {
  getMonetizationSettings() // ensure loaded
  const now = new Date()
  return cachedSponsored.filter((s) => {
    if (!s.isActive) return false
    const start = new Date(s.startDate)
    const end = new Date(s.endDate)
    return now >= start && now <= end
  })
}
