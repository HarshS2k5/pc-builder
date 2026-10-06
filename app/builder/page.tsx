import { Suspense } from 'react'
import { PCBuilderMain } from '@/components/pc-builder/PCBuilderMain'

export const metadata = {
  title: 'PC Configurator & Compatibility Studio | RigCraft',
  description:
    'Interactive PC builder with automatic socket clearance checks, real-time power calculations, and game FPS estimations.',
}

export default function BuilderPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  )
}
