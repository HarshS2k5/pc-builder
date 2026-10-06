import Link from 'next/link'
import { Cpu, Instagram, Github, Heart, Layers, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#0b0c10] border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-[#0a0b0e] rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-[#00ff88]" />
                </div>
              </div>
              <span className="text-xl font-black text-white">RigCraft</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              RigCraft is an interactive PC Builder and Performance Planner. Check real-time hardware compatibility, estimate power loads and real-game FPS across 50+ titles, analyze component bottlenecks, and build your dream machine.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/hxrsh_s2k14"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-pink-400 transition-colors border border-white/10"
                aria-label="Instagram profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold">
              Configurator
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#00ff88] transition-colors">
                  Interactive PC Builder
                </Link>
              </li>
              <li>
                <Link href="/presets" className="text-gray-300 hover:text-[#00ff88] transition-colors">
                  Curated Build Presets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#00ff88] transition-colors">
                  About the Creator
                </Link>
              </li>
            </ul>
          </div>

          {/* Sister Projects */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold">
              Harsh's Projects
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://gamerank-one.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#00d4ff] transition-colors flex items-center gap-1.5"
                >
                  <span>GameRank</span>
                  <span className="text-[10px] text-gray-500 font-mono">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://internet-time-machine-six.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Internet Time Machine</span>
                  <span className="text-[10px] text-gray-500 font-mono">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} RigCraft PC Builder. Created by <span className="text-white font-medium">Harsh Sisodia</span> (12 Years Old).
          </p>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>Built with precision for PC enthusiasts</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  )
}
