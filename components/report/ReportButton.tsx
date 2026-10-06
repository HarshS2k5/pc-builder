'use client'

import React, { useState } from 'react'
import { ReportProblemModal } from './ReportProblemModal'
import { ProblemCategory } from '@/types/report'
import { Bug, Lightbulb } from 'lucide-react'

interface ReportButtonProps {
  variant?: 'button' | 'text' | 'compact' | 'pill'
  defaultCategory?: ProblemCategory
  defaultComponent?: string
  defaultGame?: string
  contextPage?: string
  className?: string
  label?: string
}

export function ReportButton({
  variant = 'button',
  defaultCategory = 'bug',
  defaultComponent,
  defaultGame,
  contextPage,
  className = '',
  label,
}: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const isSuggestion = defaultCategory === 'suggestion'
  const displayLabel = label || (isSuggestion ? 'Suggest a Feature' : 'Report a Problem')

  return (
    <>
      {variant === 'pill' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isSuggestion
              ? 'bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30'
              : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
          } ${className}`}
        >
          {isSuggestion ? <Lightbulb className="w-3.5 h-3.5" /> : <Bug className="w-3.5 h-3.5" />}
          <span>{displayLabel}</span>
        </button>
      )}

      {variant === 'text' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 ${className}`}
        >
          {isSuggestion ? <Lightbulb className="w-3.5 h-3.5" /> : <Bug className="w-3.5 h-3.5" />}
          <span>{displayLabel}</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title={displayLabel}
          className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-yellow-400 border border-white/10 transition-colors ${className}`}
        >
          {isSuggestion ? <Lightbulb className="w-4 h-4" /> : <Bug className="w-4 h-4" />}
        </button>
      )}

      {variant === 'button' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors ${className}`}
        >
          {isSuggestion ? <Lightbulb className="w-4 h-4 text-[#00d4ff]" /> : <Bug className="w-4 h-4 text-yellow-400" />}
          <span>{displayLabel}</span>
        </button>
      )}

      <ReportProblemModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultCategory={defaultCategory}
        defaultComponent={defaultComponent}
        defaultGame={defaultGame}
        contextPage={contextPage}
      />
    </>
  )
}
