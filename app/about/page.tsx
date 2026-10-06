import { Metadata } from 'next'
import Link from 'next/link'
import {
  Gamepad2,
  Clock,
  Sparkles,
  Cpu,
  Globe,
  Bot,
  Code2,
  Rocket,
  Heart,
  Instagram,
  ExternalLink,
  ArrowRight,
  Monitor,
  Infinity as InfinityIcon,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About the Creator | Harsh Sisodia | RigCraft PC Builder',
  description:
    'Hi! I’m Harsh Sisodia, a 12-year-old creator who enjoys technology, gaming, AI, and building interactive websites and digital projects including RigCraft, GameRank, and Internet Time Machine.',
  openGraph: {
    title: 'About the Creator | Harsh Sisodia',
    description:
      'Meet Harsh Sisodia, a 12-year-old creator and developer passionate about gaming, technology, AI, and building interactive web projects.',
  },
}

const INTERESTS = [
  {
    icon: Gamepad2,
    label: 'Gaming',
    description: 'Exploring immersive game worlds, game design mechanics, and industry benchmarks.',
    color: '#00ff88',
  },
  {
    icon: Monitor,
    label: 'Technology',
    description: 'Following hardware breakthroughs, silicon architectures, and consumer tech.',
    color: '#00d4ff',
  },
  {
    icon: Bot,
    label: 'AI',
    description: 'Experimenting with modern artificial intelligence, automation, and smart interfaces.',
    color: '#b347ff',
  },
  {
    icon: Globe,
    label: 'Web Development',
    description: 'Crafting responsive, high-speed, modern full-stack websites and interactive web apps.',
    color: '#00d4ff',
  },
  {
    icon: Cpu,
    label: 'PC Hardware',
    description: 'Analyzing processor sockets, GPU clearance tolerances, power loads, and thermal limits.',
    color: '#ff6b35',
  },
  {
    icon: Rocket,
    label: 'Building Projects',
    description: 'Taking fresh ideas from concept to real code that people can use and enjoy.',
    color: '#00ff88',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 space-y-16">
      {/* 1. HERO SECTION — ABOUT THE CREATOR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12141a] via-[#161a22] to-[#12141a] border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar / Profile Badge */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-[#00ff88] via-[#00d4ff] to-[#b347ff] p-1 shadow-2xl shadow-[#00ff88]/20">
                <div className="w-full h-full bg-[#0d1017] rounded-[22px] flex flex-col items-center justify-center text-center p-3">
                  <Cpu className="w-10 h-10 sm:w-12 sm:h-12 text-[#00ff88] mb-1" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase text-gray-400">
                    Creator
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#00ff88] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg">
                12 Y/O
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-3 py-1 rounded-full border border-[#00ff88]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>About the Creator</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                  Harsh Sisodia
                </h1>
                <p className="text-base sm:text-lg text-[#00d4ff] font-semibold">
                  Creator &amp; Developer
                </p>
              </div>

              <p className="text-gray-200 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Hi! I'm Harsh Sisodia, a 12-year-old creator who enjoys technology, gaming, AI, and building interactive websites and digital projects.
              </p>

              {/* Creator Stats Cards */}
              <div className="pt-2 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#00ff88]">12</div>
                  <div className="text-[11px] text-gray-400 font-medium">Years Old</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#00d4ff]">3</div>
                  <div className="text-[11px] text-gray-400 font-medium">Featured Projects</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#b347ff]">
                    <InfinityIcon className="w-7 h-7 mx-auto inline" />
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium">Ideas to Build</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MY PROJECTS — PROJECTS I'VE CREATED */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-3 py-1 rounded-full border border-[#00ff88]/20">
            <Rocket className="w-3.5 h-3.5" />
            <span>Interactive Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Projects I've Created
          </h2>
          <p className="text-gray-400 text-sm">
            I enjoy turning ideas into interactive websites and experimenting with technology. Here are some of the projects I've created.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project 1: GameRank */}
          <div className="p-8 rounded-3xl bg-[#12141a] border border-white/10 hover:border-[#00ff88]/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] group-hover:scale-105 transition-transform">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-full border border-[#00ff88]/20">
                  Live Project
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-[#00ff88] transition-colors">
                  GameRank
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                  Worldwide Gaming Ranking &amp; Discovery Platform
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                GameRank is one of my gaming-focused web projects, created to explore games and gaming-related content through an interactive website experience.
              </p>
            </div>

            <div>
              <a
                href="https://gamerank-one.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary text-xs sm:text-sm font-bold py-3 px-6 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#00ff88]/25"
              >
                <span>VISIT GAMERANK</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <span className="text-[10px] text-gray-500 text-center block mt-2 font-mono">
                gamerank-one.vercel.app
              </span>
            </div>
          </div>

          {/* Project 2: Internet Time Machine */}
          <div className="p-8 rounded-3xl bg-[#12141a] border border-white/10 hover:border-[#00d4ff]/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff] group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 px-2.5 py-1 rounded-full border border-[#00d4ff]/20">
                  Live Project
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-[#00d4ff] transition-colors">
                  Internet Time Machine
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                  Web &amp; Digital History Archive
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                Internet Time Machine is an interactive project focused on exploring the history and evolution of the internet, technology, websites, gaming, and the digital world.
              </p>
            </div>

            <div>
              <a
                href="https://internet-time-machine-six.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-secondary text-xs sm:text-sm font-bold py-3 px-6 flex items-center justify-center gap-2 hover:bg-[#00d4ff] hover:text-black hover:border-transparent transition-all group-hover:shadow-lg group-hover:shadow-[#00d4ff]/25"
              >
                <span>VISIT INTERNET TIME MACHINE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <span className="text-[10px] text-gray-500 text-center block mt-2 font-mono">
                internet-time-machine-six.vercel.app
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY I BUILD */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#12141a] border border-white/10 relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00ff88]">
              Personal Motivation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Why I Build
            </h2>
          </div>

          <div className="space-y-4 text-gray-200 text-base sm:text-lg leading-relaxed font-normal">
            <p>
              I enjoy learning by building things. Creating websites gives me a way to experiment with technology, turn ideas into real projects, and keep improving with every project I make.
            </p>
            <p>
              My goal is to continue learning, experimenting, and creating projects that people can actually enjoy and find useful.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHAT I'M INTERESTED IN — VISUAL GRID */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-16 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 px-3 py-1 rounded-full border border-[#00d4ff]/20">
            <Code2 className="w-3.5 h-3.5" />
            <span>Passions &amp; Curiosity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            What I'm Interested In
          </h2>
          <p className="text-gray-400 text-sm">
            Technologies, digital fields, and hobbies I enjoy exploring
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTERESTS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="p-6 rounded-2xl bg-[#12141a] border border-white/10 hover:border-white/25 transition-all space-y-3 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00ff88] transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. CONNECT SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#12141a] via-[#181c26] to-[#12141a] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-pink-400 flex items-center justify-center md:justify-start gap-1.5 font-bold">
              <Heart className="w-3.5 h-3.5 fill-pink-400" /> Connect
            </span>
            <h3 className="text-2xl font-black text-white">
              Follow Harsh Sisodia
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Follow along on Instagram to see project milestones and new ideas.
            </p>
          </div>

          <a
            href="https://www.instagram.com/hxrsh_s2k14"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Harsh Sisodia on Instagram @hxrsh_s2k14"
            className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white font-bold text-xs rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-105 transition-all shrink-0"
          >
            <Instagram className="w-4 h-4" />
            <span>@hxrsh_s2k14 on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </section>
    </div>
  )
}
