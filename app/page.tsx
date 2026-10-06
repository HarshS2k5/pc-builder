import { Suspense } from 'react'
import { PCBuilderMain } from '@/components/pc-builder/PCBuilderMain'
import { Cpu, ShieldCheck, Zap, Gauge, Sparkles, HelpCircle, Layers, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-8 border-b border-white/10 bg-gradient-to-b from-[#0a0b0e] via-[#0d1017] to-[#0a0b0e]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#00ff88]/10 via-[#00d4ff]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen PC Configurator &amp; Benchmark Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
            Build Your <span className="text-gradient">Dream PC</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Select components, detect socket &amp; physical clearance issues automatically, calculate real power draw, and project your gaming FPS across 50+ titles.
          </p>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>11-Rule Compatibility Checks</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-medium">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Real Wattage &amp; PSU Headroom</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-medium">
              <Gauge className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>50+ Game Real-World FPS Estimator</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-medium">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Bottleneck &amp; Synergy Analysis</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Configurator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="min-h-[500px] flex items-center justify-center text-gray-400 font-mono text-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin" />
                <span>Loading RigCraft Configurator...</span>
              </div>
            </div>
          }
        >
          <PCBuilderMain />
        </Suspense>
      </section>

      {/* Educational Guide Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00ff88] font-bold">
            Hardware Engineering
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            How RigCraft Verifies Your Build
          </h2>
          <p className="text-gray-400 text-sm">
            We evaluate your parts against standard physical tolerances and architectural guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#12141a] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Physical &amp; Socket Clearance</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Verifies CPU socket compatibility (AM5, LGA1700), GPU length against case clearance, CPU cooler height, and motherboard form factor sizing (ATX, Micro-ATX, Mini-ITX).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12141a] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Power &amp; Transient Spikes</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Calculates CPU PL2 turbo draw, GPU transient spike headroom (up to +25%), and auxiliary rail consumption to recommend a certified PSU capacity with a safe 20-30% cushion.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12141a] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 text-[#00d4ff] flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Resolution-Aware FPS Projections</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Estimates actual framerates and 1% lows across 1080p, 1440p, and 4K resolutions based on raster compute pipelines, GPU memory bus bandwidth, and CPU IPC.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
