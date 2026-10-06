import { Suspense } from 'react'
import { CompareStudio } from '@/components/compare/CompareStudio'

export const metadata = {
  title: 'Hardware Component Comparison Studio | RigCraft',
  description:
    'Compare processors, graphics cards, motherboards, RAM, and SSDs side-by-side. Technical specifications, power draw, value benchmarks, and verified retailer prices.',
}

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 px-3.5 py-1 rounded-full border border-[#00d4ff]/20">
          Hardware Benchmarks &amp; Specs
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Component Comparison Studio
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Analyze technical specifications, power requirements, value metrics, and indicative retailer prices side-by-side.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center text-gray-400 font-mono text-sm">
            <div className="w-6 h-6 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mr-3" />
            <span>Loading Hardware Comparison Studio...</span>
          </div>
        }
      >
        <CompareStudio />
      </Suspense>
    </div>
  )
}
