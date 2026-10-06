import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'RigCraft | Ultimate PC Builder & Performance Planner',
  description:
    'Plan, configure, and benchmark your dream custom PC. Real-time 11-rule compatibility checks, system power load calculator, educational bottleneck analyzer, and FPS estimator across 50+ games.',
  keywords: [
    'pc builder',
    'custom pc builder',
    'pc part picker',
    'compatibility checker',
    'pc bottleneck calculator',
    'fps estimator',
    'gaming pc build',
    'rigcraft',
  ],
  authors: [{ name: 'Harsh Sisodia' }],
  openGraph: {
    title: 'RigCraft | Ultimate PC Builder & Performance Planner',
    description:
      'Plan and build custom PCs with real-time socket compatibility, power estimation, bottleneck analysis, and real-game FPS estimation.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0a0b0e" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen bg-[#0a0b0e] text-white flex flex-col font-sans selection:bg-[#00ff88]/30 selection:text-[#00ff88]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
