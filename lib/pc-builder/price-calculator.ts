// ─────────────────────────────────────────────────────────────────────────────
// TechForge PC Builder – Build Price Calculator & Currency Formatter
// Formats Indian Rupee (₹) using South Asian Lakh/Crore notation alongside global currencies
// ─────────────────────────────────────────────────────────────────────────────

import {
  BuildParts,
  BuildPriceSummary,
  Currency,
  ComponentCategory,
  AnyComponent,
} from '@/types/pc-builder'

// Approximate benchmark exchange rates relative to USD / INR
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency]
  if (currency === 'INR') {
    // Format using Indian numbering system (e.g. 1,50,000)
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount)
    return `${symbol}${formatted}`
  }

  const localeMap: Record<Currency, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
  }

  const formatted = new Intl.NumberFormat(localeMap[currency], {
    maximumFractionDigits: 0,
  }).format(amount)
  return `${symbol}${formatted}`
}

export function getComponentPrice(component: AnyComponent, currency: Currency): number {
  if (currency === 'INR') {
    return component.priceInr
  }
  if (currency === 'USD') {
    return component.priceUsd
  }
  if (currency === 'EUR') {
    return Math.round(component.priceUsd * 0.93)
  }
  if (currency === 'GBP') {
    return Math.round(component.priceUsd * 0.79)
  }
  return component.priceInr
}

export function calculateBuildPrice(parts: BuildParts, currency: Currency): BuildPriceSummary {
  const byCategory: Record<ComponentCategory, number> = {
    cpu: 0,
    gpu: 0,
    motherboard: 0,
    ram: 0,
    storage: 0,
    psu: 0,
    case: 0,
    cooler: 0,
  }

  let total = 0
  let cheapestComponent: BuildPriceSummary['cheapestComponent'] = undefined
  let mostExpensiveComponent: BuildPriceSummary['mostExpensiveComponent'] = undefined

  const categories = Object.keys(parts) as ComponentCategory[]

  for (const cat of categories) {
    const component = parts[cat]
    if (component) {
      const price = getComponentPrice(component, currency)
      byCategory[cat] = price
      total += price

      if (!cheapestComponent || price < cheapestComponent.price) {
        cheapestComponent = {
          name: component.name,
          price,
          category: cat,
        }
      }

      if (!mostExpensiveComponent || price > mostExpensiveComponent.price) {
        mostExpensiveComponent = {
          name: component.name,
          price,
          category: cat,
        }
      }
    }
  }

  return {
    currency,
    currencySymbol: CURRENCY_SYMBOLS[currency],
    total,
    formattedTotal: formatCurrency(total, currency),
    cheapestComponent,
    mostExpensiveComponent,
    byCategory,
  }
}
