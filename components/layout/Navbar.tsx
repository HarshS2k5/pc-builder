'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Cpu, Sparkles, Layers, Scale, Info, Menu, X, ExternalLink } from 'lucide-react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0a0b0e]/85 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff88] via-[#00d4ff] to-[#b347ff] flex items-center justify-center p-0.5 shadow-lg shadow-[#00ff88]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a0b0e] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#00ff88]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>RigCraft</span>
                <span className="text-[10px] font-mono uppercase bg-[#00ff88]/15 text-[#00ff88] px-1.5 py-0.5 rounded border border-[#00ff88]/30">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider -mt-1 hidden sm:block">
                PC Builder &amp; Performance Planner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/5 transition-all"
            >
              <Cpu className="w-4 h-4 text-[#00ff88]" />
              <span>Configurator</span>
            </Link>
            <Link
              href="/builds"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Build Guides</span>
            </Link>
            <Link
              href="/compare"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/5 transition-all"
            >
              <Scale className="w-4 h-4 text-[#00d4ff]" />
              <span>Compare Studio</span>
            </Link>
            <Link
              href="/presets"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/5 transition-all"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Presets</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/5 transition-all"
            >
              <Info className="w-4 h-4 text-gray-400" />
              <span>About</span>
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://gamerank-one.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-[#00ff88] px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <span>GameRank</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <Link
              href="/"
              className="btn-primary text-xs font-bold py-2 px-4 flex items-center gap-1.5 shadow-md shadow-[#00ff88]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Building</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e1017] border-b border-white/10 px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5"
          >
            <Cpu className="w-4 h-4 text-[#00ff88]" />
            <span>PC Configurator</span>
          </Link>
          <Link
            href="/builds"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Build Guides (SEO)</span>
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5"
          >
            <Scale className="w-4 h-4 text-[#00d4ff]" />
            <span>Compare Studio</span>
          </Link>
          <Link
            href="/presets"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Curated Builds</span>
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5"
          >
            <Info className="w-4 h-4 text-gray-400" />
            <span>About the Creator</span>
          </Link>
          <div className="pt-2 border-t border-white/10">
            <a
              href="https://gamerank-one.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white"
            >
              <span>Visit GameRank</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
