import Link from 'next/link'
import { BUILD_PRESETS } from '@/lib/pc-builder/components-data'
import { Layers, ArrowRight, Zap, Cpu, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Curated PC Build Presets | RigCraft',
  description:
    'Explore hand-picked, pre-verified gaming and workstation PC configurations across various budgets and performance targets.',
}

export default function PresetsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 px-3 py-1 rounded-full border border-[#00d4ff]/20">
          <Layers className="w-3.5 h-3.5" />
          <span>Tested &amp; Verified Configurations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Curated Build Presets
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Start with a pre-configured template tailored for esports, 1440p high-refresh gaming, 4K ray tracing, or compact form factors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BUILD_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="p-6 rounded-2xl bg-[#12141a] border border-white/10 hover:border-[#00ff88]/30 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-full border border-[#00ff88]/20">
                  {preset.useCase}
                </span>
                <span className="text-lg font-black text-white font-mono">
                  ${preset.targetBudgetUsd.toLocaleString()}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#00ff88] transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span>Verified 100% physically compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Optimized power envelope &amp; airflow</span>
                </div>
              </div>
            </div>

            <Link
              href={`/?preset=${preset.id}`}
              className="w-full btn-primary text-xs font-bold py-2.5 px-4 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#00ff88]/25"
            >
              <span>Load This Build</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
