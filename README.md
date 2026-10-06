# RigCraft 🖥️ — Next-Gen PC Builder & Performance Planner

RigCraft is a standalone, high-performance PC Builder and hardware planner built with Next.js 14 App Router, TypeScript, and Tailwind CSS. It enables PC builders and gamers to configure custom systems with real-time socket compatibility, power draw calculations, bottleneck identification, and framerate estimation across 50+ real titles.

Created by **Harsh Sisodia** (12-year-old creator & developer).

---

## ⚡ Key Features

- **🖥️ 8 Modular Component Slots**: CPU, GPU, Motherboard, RAM, Storage (NVMe/SATA/HDD), PSU, Case, CPU Cooler.
- **🛡️ 11-Rule Automatic Compatibility Engine**:
  - CPU ↔ Motherboard socket validation (AM5, LGA1700, etc.)
  - Motherboard ↔ RAM generation (DDR4 vs DDR5)
  - RAM stick count ↔ Motherboard DIMM slots
  - GPU length ↔ Case physical clearance
  - CPU cooler height ↔ Case cooler clearance
  - CPU cooler ↔ CPU socket mounting bracket
  - Form factor matching (ATX, Micro-ATX, Mini-ITX)
  - Storage interface check (M.2 NVMe vs SATA)
  - PSU wattage ↔ Total system power draw & transient spike protection
  - Clear explanations for every issue with educational context
- **⚡ Power & Safety Headroom Calculator**:
  - Calculates component wattage breakdowns (CPU PL2, GPU TGP, Motherboard, RAM, Storage, Fans)
  - Accounts for GPU transient power spikes
  - Recommends minimum PSU wattage with a safe 20-30% cushion
- **🎮 Real-World FPS Estimator**:
  - Projects framerates across 50+ popular titles
  - Switch between 1080p, 1440p, and 4K resolutions
  - Toggle between Low, Medium, High, and Ultra settings
  - Highlights whether the system meets Minimum or Recommended requirements
- **⚖️ Educational Bottleneck Analyzer**:
  - Real-time balance score across Esports, AAA 1440p, 4K, and Workstation workloads
  - Explains hardware synergies and limiting components without marketing hype
- **📊 5-Pillar Build Scorecard**:
  - Rates Performance, Value, Upgradeability, Compatibility, and Power Balance
- **💾 Save & Share**:
  - Portable compressed share codes (`#build=...`)
  - Export to Reddit Markdown and JSON specs
  - Local save management in browser storage

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/HarshS2k5/rigcraft-pc-builder.git
cd rigcraft-pc-builder

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building!

---

## 👨‍💻 Created By

**Harsh Sisodia** — Creator of [GameRank](https://gamerank-one.vercel.app/) and [Internet Time Machine](https://internet-time-machine-six.vercel.app/).
Instagram: [@hxrsh_s2k14](https://www.instagram.com/hxrsh_s2k14)
