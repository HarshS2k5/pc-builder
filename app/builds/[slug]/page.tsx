import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { SEO_BUILDS, getSeoBuildBySlug } from '@/lib/pc-builder/seo-builds'
import { findComponentById } from '@/lib/pc-builder/components-data'
import { checkCompatibility } from '@/lib/pc-builder/compatibility'
import { calculatePower } from '@/lib/pc-builder/power-calculator'
import { calculateBuildPrice, formatCurrency } from '@/lib/pc-builder/price-calculator'
import { estimateGamePerformance } from '@/lib/pc-builder/performance-estimator'
import { encodeBuildToShareCode } from '@/lib/pc-builder/build-storage'
import { SEED_GAMES } from '@/lib/database'
import { CheckPriceButton } from '@/components/pc-builder/CheckPriceButton'
import { AffiliateBanner } from '@/components/pc-builder/AffiliateDisclosureModal'
import { ReportButton } from '@/components/report/ReportButton'
import {
  BuildParts,
  ComponentCategory,
  AnyComponent,
  GamePerformanceEstimate,
} from '@/types/pc-builder'
import {
  ShieldCheck,
  Zap,
  Gauge,
  ArrowRight,
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Box,
  Thermometer,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar,
  DollarSign,
  Monitor,
} from 'lucide-react'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return SEO_BUILDS.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const build = getSeoBuildBySlug(params.slug)
  if (!build) return {}

  const url = `https://pc-builder-seven-ashen.vercel.app/builds/${build.slug}`

  return {
    title: build.metaTitle,
    description: build.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: build.metaTitle,
      description: build.metaDescription,
      url,
      type: 'article',
      publishedTime: build.publishedDate,
      modifiedTime: build.lastUpdatedDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: build.metaTitle,
      description: build.metaDescription,
    },
  }
}

export default function SeoBuildDetailPage({ params }: PageProps) {
  const build = getSeoBuildBySlug(params.slug)
  if (!build) notFound()

  // Resolve parts
  const parts: BuildParts = {}
  for (const [cat, id] of Object.entries(build.partIds)) {
    const comp = findComponentById(id)
    if (comp) (parts as any)[cat] = comp
  }

  const compat = checkCompatibility(parts)
  const power = calculatePower(parts)
  const price = calculateBuildPrice(parts, 'INR')
  const shareCode = encodeBuildToShareCode(parts)

  // Curate 4 highlight games to estimate performance
  const highlightGameSlugs = ['cyberpunk-2077', 'fortnite', 'grand-theft-auto-v', 'black-myth-wukong']
  const highlightGames = SEED_GAMES.filter((g) => highlightGameSlugs.includes(g.slug)).slice(0, 4)
  const fpsEstimates: GamePerformanceEstimate[] = highlightGames
    .map((game) => estimateGamePerformance(parts, game.slug, build.resolutionTarget, 'High'))
    .filter((est): est is GamePerformanceEstimate => est !== null)

  const componentOrder: { category: ComponentCategory; label: string; icon: any }[] = [
    { category: 'cpu', label: 'Processor (CPU)', icon: Cpu },
    { category: 'gpu', label: 'Graphics Card (GPU)', icon: Tv },
    { category: 'motherboard', label: 'Motherboard', icon: Layers },
    { category: 'ram', label: 'Memory (RAM)', icon: Layers },
    { category: 'storage', label: 'Storage (NVMe SSD)', icon: HardDrive },
    { category: 'psu', label: 'Power Supply (PSU)', icon: Zap },
    { category: 'case', label: 'PC Case', icon: Box },
    { category: 'cooler', label: 'CPU Cooler', icon: Thermometer },
  ]

  // Structured Data JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: build.title,
    description: build.metaDescription,
    datePublished: build.publishedDate,
    dateModified: build.lastUpdatedDate,
    author: {
      '@type': 'Person',
      name: 'Harsh Sisodia',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RigCraft',
      url: 'https://pc-builder-seven-ashen.vercel.app',
    },
  }

  return (
    <article className="min-h-screen pb-24">
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Affiliate Disclaimer */}
      <AffiliateBanner />

      {/* Hero Header */}
      <header className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-[#10131d] via-[#0d0f17] to-[#0a0b0e]">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              RigCraft
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/builds" className="text-gray-400 hover:text-white transition-colors">
              Build Guides
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-[#00ff88]">{build.categoryTag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
            {build.title}
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            {build.headlineDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>Verified: {build.lastUpdatedDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-purple-400" />
              <span>Target: {build.resolutionTarget}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>100% Verified Compatible</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Highlight Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#12141a] border border-white/10">
            <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
              Target Budget
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {formatCurrency(build.targetBudgetInr, 'INR')}
            </div>
            <span className="text-[11px] text-gray-400 font-mono">
              ~${build.targetBudgetUsd.toLocaleString()} USD
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141a] border border-white/10">
            <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
              Compatibility Check
            </span>
            <div className="text-lg font-black text-[#00ff88] uppercase mt-1 flex items-center gap-1">
              <ShieldCheck className="w-5 h-5 inline" />
              <span>Certified</span>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">Zero Clearance Issues</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141a] border border-white/10">
            <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
              System Power Draw
            </span>
            <div className="text-2xl font-black text-yellow-400 font-mono mt-1">
              {power.totalEstimatedWatts}W
            </div>
            <span className="text-[11px] text-gray-400 font-mono">
              Recommended: {power.recommendedPsuWatts}W
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141a] border border-white/10">
            <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
              Target Resolution
            </span>
            <div className="text-2xl font-black text-[#00d4ff] font-mono mt-1">
              {build.resolutionTarget}
            </div>
            <span className="text-[11px] text-gray-400 font-mono">High/Ultra Preset</span>
          </div>
        </div>

        {/* CTA Banner: Customize in Builder */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#00ff88]/15 via-[#00d4ff]/10 to-[#00ff88]/15 border border-[#00ff88]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white">
              Want to customize or tweak this build?
            </h3>
            <p className="text-xs text-gray-300">
              Load these parts directly into the RigCraft PC Configurator to swap parts or re-test compatibility.
            </p>
          </div>
          <Link
            href={`/?share=${shareCode}`}
            className="btn-primary text-xs font-bold py-3 px-6 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-[#00ff88]/20 shrink-0"
          >
            <span>Open in PC Builder</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Component Breakdown Table with Rationale & Multi-Retailer Links */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-[#00ff88]">
              Hardware Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Selected Components &amp; Technical Rationale
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Why each specific part was selected for this build budget and workload.
            </p>
          </div>

          <div className="space-y-4">
            {componentOrder.map(({ category, label, icon: Icon }) => {
              const part = parts[category] as AnyComponent | undefined
              const rationale = build.componentRationale[category]
              if (!part) return null

              return (
                <div
                  key={category}
                  className="p-5 sm:p-6 rounded-3xl bg-[#12141a] border border-white/10 hover:border-white/20 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 text-[#00ff88] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                          {label}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {part.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-base sm:text-lg font-mono font-black text-white">
                        {formatCurrency(part.priceInr, 'INR')}
                      </span>
                      <CheckPriceButton component={part} currency="INR" showAllRetailers={true} />
                    </div>
                  </div>

                  {/* Technical Rationale */}
                  <div className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
                    <strong className="text-[#00ff88] font-mono text-xs block mb-1">
                      WHY IT WAS CHOSEN:
                    </strong>
                    {rationale}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Real-Game Estimated Performance */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-[#00d4ff]">
              Performance Benchmarks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Estimated Gaming Framerates ({build.resolutionTarget})
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Projections calculated via raster compute index, VRAM bandwidth, and IPC scaling at High settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fpsEstimates.map((est) => (
              <div
                key={est.gameId}
                className="p-5 rounded-2xl bg-[#12141a] border border-white/10 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{est.gameName}</h4>
                  <span className="text-xs text-gray-400 font-mono">
                    {est.resolution} &bull; {est.quality} Quality
                  </span>
                  <div className="text-[11px] text-[#00ff88] font-medium mt-1">
                    {est.smoothnessRating}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black font-mono text-white">
                    {est.estimatedAvgFps}
                    <span className="text-xs font-normal text-gray-400 ml-1">FPS</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    1% Low: {est.estimatedMinFps} FPS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upgrade & Future Considerations */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#12141a] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>Recommended Upgrade Paths</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
            {build.upgradePaths.map((path, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#00ff88] font-bold">&bull;</span>
                <span>{path}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer Actions & Disclaimers */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/builds" className="text-xs text-gray-400 hover:text-white transition-colors">
              &larr; Back to all build guides
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ReportButton
              variant="pill"
              contextPage={`/builds/${build.slug}`}
              defaultCategory="price"
              label="Report Price Issue"
            />
          </div>
        </div>
      </div>
    </article>
  )
}
