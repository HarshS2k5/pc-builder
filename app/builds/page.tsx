import Link from 'next/link'
import { SEO_BUILDS } from '@/lib/pc-builder/seo-builds'
import { formatCurrency } from '@/lib/pc-builder/price-calculator'
import { Layers, ArrowRight, Sparkles, ShieldCheck, Zap, Monitor } from 'lucide-react'

export const metadata = {
  title: 'Recommended PC Builds & Hardware Guides (2026) | RigCraft',
  description:
    'Explore verified, benchmarked PC configurations tailored for gaming, esports, programming, video editing, and AI workloads across various budgets.',
}

export default function BuildsIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-3.5 py-1 rounded-full border border-[#00ff88]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Engineering Blueprints</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Recommended PC Builds &amp; Guides
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Every configuration is hand-verified for zero physical clearance conflicts, balanced component synergies, and real-world gaming and workstation benchmarks.
        </p>
      </div>

      {/* Grid of SEO Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SEO_BUILDS.map((build) => (
          <Link
            key={build.slug}
            href={`/builds/${build.slug}`}
            className="p-6 rounded-3xl bg-[#12141a] border border-white/10 hover:border-[#00ff88]/40 transition-all flex flex-col justify-between space-y-6 group hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-[#00d4ff] bg-[#00d4ff]/10 px-2.5 py-1 rounded-full border border-[#00d4ff]/20">
                  {build.categoryTag}
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {formatCurrency(build.targetBudgetInr, 'INR')}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-[#00ff88] transition-colors leading-snug">
                  {build.title}
                </h2>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {build.headlineDescription}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-[#00d4ff]" />
                  <span>Targeted for: <strong className="text-white">{build.resolutionTarget}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span>100% Certified Socket &amp; Cooler Clearance</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-bold text-[#00ff88] group-hover:text-[#00e87a]">
              <span>View Full Specs &amp; Rationale</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
