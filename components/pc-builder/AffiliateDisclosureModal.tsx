'use client'

import React, { useState } from 'react'
import { ShieldCheck, Info, X, ExternalLink, CheckCircle2, Lock } from 'lucide-react'

export function AffiliateDisclosureModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[11px] text-gray-400 hover:text-[#00ff88] transition-colors underline decoration-dotted underline-offset-2 flex items-center gap-1 inline-flex"
      >
        <Info className="w-3 h-3" />
        <span>Affiliate &amp; Pricing Disclosure</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#12141a] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Trust &amp; Transparency Policy</h3>
                  <span className="text-xs text-gray-400 font-mono">RigCraft PC Builder</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                  <span>How We Earn Revenue</span>
                </h4>
                <p className="text-gray-300 text-xs">
                  RigCraft is free to use. When you click on certain "Check Price" retailer links (such as Amazon or partner computer stores) and make an eligible purchase, we may earn a small affiliate commission. This never adds any extra cost to your order.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#00d4ff]" />
                  <span>Editorial &amp; Algorithmic Independence</span>
                </h4>
                <p className="text-gray-300 text-xs">
                  Our 11-rule hardware compatibility engine, wattage calculators, bottleneck analyses, and FPS projections are 100% impartial. We never promote or adjust scores for a component based on commercial relationships.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-yellow-400" />
                  <span>Prices &amp; Stock Availability</span>
                </h4>
                <p className="text-gray-300 text-xs">
                  Hardware prices fluctuate constantly. The prices shown on RigCraft are indicative benchmarks updated on a periodic basis. Final pricing, shipping fees, warranty terms, and stock availability are determined by the retailer at checkout.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary text-xs font-bold py-2.5 px-6"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function AffiliateBanner() {
  return (
    <div className="w-full bg-[#10131a] border-y border-white/10 py-2 px-4 text-center text-xs text-gray-400 flex flex-wrap items-center justify-center gap-2">
      <span>
        💡 RigCraft provides free hardware planning tools. Some product links may earn an affiliate commission.
      </span>
      <AffiliateDisclosureModal />
    </div>
  )
}
