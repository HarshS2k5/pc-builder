'use client'

import React, { useState, useRef, useEffect } from 'react'
import { AnyComponent, ComponentRetailer, Currency } from '@/types/pc-builder'
import { getComponentRetailers } from '@/lib/pc-builder/retailers'
import { formatCurrency } from '@/lib/pc-builder/price-calculator'
import { trackAnalyticsEvent } from '@/lib/analytics/tracker'
import { ShoppingCart, ExternalLink, ChevronDown, Check, ShieldAlert } from 'lucide-react'

interface CheckPriceButtonProps {
  component: AnyComponent
  currency?: Currency
  variant?: 'compact' | 'standard' | 'large'
  showAllRetailers?: boolean
  className?: string
}

export function CheckPriceButton({
  component,
  currency = 'INR',
  variant = 'standard',
  showAllRetailers = false,
  className = '',
}: CheckPriceButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const retailers = getComponentRetailers(component, currency)
  const primaryRetailer = retailers[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleClick = (retailer: ComponentRetailer) => {
    trackAnalyticsEvent('check_price_clicked', {
      componentId: component.id,
      componentName: component.name,
      category: component.category,
      retailer: retailer.name,
      currency,
      isAffiliate: retailer.isAffiliate,
    })
  }

  if (!primaryRetailer) {
    return null
  }

  // Large or standard multi-retailer dropdown
  if (showAllRetailers || retailers.length > 1) {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <div className="inline-flex rounded-xl shadow-sm border border-white/10 hover:border-[#00ff88]/40 transition-all">
          <a
            href={primaryRetailer.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={() => handleClick(primaryRetailer)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-black bg-[#00ff88] hover:bg-[#00e87a] rounded-l-xl transition-colors"
            title={`Check price on ${primaryRetailer.name}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Check Price</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-2 py-1.5 text-xs font-bold text-gray-300 bg-[#161a22] hover:bg-[#202532] hover:text-white rounded-r-xl border-l border-white/10 transition-colors flex items-center gap-1"
            title="View all verified retailers"
          >
            <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
              ({retailers.length})
            </span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#141722] border border-white/15 shadow-2xl z-50 p-2 space-y-1">
            <div className="px-2 py-1 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                Verified Retailers
              </span>
              <span className="text-[9px] text-gray-500 font-mono">Indicative</span>
            </div>

            {retailers.map((ret) => {
              const displayPrice =
                currency === 'INR' && ret.priceInr
                  ? formatCurrency(ret.priceInr, 'INR')
                  : ret.priceUsd
                  ? formatCurrency(ret.priceUsd, 'USD')
                  : null

              return (
                <a
                  key={ret.id}
                  href={ret.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() => {
                    handleClick(ret)
                    setDropdownOpen(false)
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-[#00ff88] transition-colors flex items-center gap-1">
                      <span>{ret.name}</span>
                      {ret.isAffiliate && (
                        <span className="text-[9px] text-[#00d4ff] bg-[#00d4ff]/10 px-1 rounded font-mono">
                          Partner
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {ret.stockStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-right">
                    {displayPrice && (
                      <span className="text-xs font-mono font-bold text-gray-200">
                        {displayPrice}
                      </span>
                    )}
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white" />
                  </div>
                </a>
              )
            })}

            <div className="pt-1.5 border-t border-white/5 px-2">
              <p className="text-[9px] text-gray-500 leading-tight">
                Prices and availability may vary upon clicking.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Compact Single Button
  return (
    <a
      href={primaryRetailer.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={() => handleClick(primaryRetailer)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-black bg-[#00ff88] hover:bg-[#00e87a] transition-all hover:shadow-md hover:shadow-[#00ff88]/20 ${className}`}
      title={`Check price on ${primaryRetailer.name}`}
    >
      <ShoppingCart className="w-3.5 h-3.5" />
      <span>Check Price</span>
      <ExternalLink className="w-3 h-3 opacity-70" />
    </a>
  )
}
