# 🌌 Nexus Finance — Next-Gen Financial Ecosystem

Nexus Finance is a high-fidelity, production-grade financial dashboard built with **React 18**, **Vite**, and **Zustand**. It features a modern, obsidian-dark aesthetic with fluid GSAP animations, comprehensive data visualization through Recharts, and a robust role-based access control system.

Designed for an enterprise-level fintech experience, this platform delivers seamless performance with a focus on visual excellence and user efficiency.

---

## ⚡ Core Features

### 📊 Intelligence & Analytics
- **Dynamic Dashboard**: Real-time summary cards for Balance, Income, Expenses, and Savings.
- **Cumulative Performance**: Area charts tracking 6-month financial trajectories.
- **Spending Distribution**: Advanced donut charts with synchronized hover states.
- **Insights Engine**: Automated identification of highest spending categories and largest outflows.

### 💸 Transaction Management
- **Enterprise-Grade Ledger**: Full-featured table with real-time searching, filtering, and sorting.
- **Advanced Controls**: Role-based row deletion and real-time transaction updates.
- **Data Mobility**: Single-click CSV export for offline financial analysis and reporting.

### 🛡️ Role-Based Access Control (RBAC)
- **Granular Permissions**: Two distinct roles — `Admin` (Full control) and `Viewer` (Read-only).
- **Persistent States**: User roles and preferences persist across sessions via `localStorage`.

### 🎨 Visual & Motion Design
- **Observian UI**: A premium, "pure black" cyberpunk aesthetic for high contrast and focus.
- **Fluid Motion**: GSAP-powered staggered entries and Framer Motion page transitions.
- **Aesthetic Precision**: Custom magnetic cursor tracking and smooth Lenis scrolling.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | `React 18` + `Vite` | Blazing-fast HMR and optimized build pipeline. |
| **State** | `Zustand` | Lightweight, scalable state management with persist middleware. |
| **Styling** | `Vanilla CSS` + `Tailwind` | Custom design system using CSS variables for theme tokens. |
| **Animation** | `GSAP` & `Framer Motion` | Industry-standard libraries for cinematic transitions. |
| **Charts** | `Recharts` | Composable, SVG-based declarative charting components. |
| **Interactions** | `Lucide` & `react-hot-toast` | Premium iconography and responsive notifications. |

---

## 🚀 Getting Started

**Prerequisites:** Node.js v18+

### 1. Installation
```bash
npm install
```

### 2. Launch Development
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Architecture

```
src/
├── components/
│   ├── animations/   # LiquidBackground, GSAP reveals
│   ├── charts/       # Analytics visuals, Spending donuts
│   ├── layout/       # Sidebar, Header, Responsive wrappers
│   └── ui/           # High-polish design primitives
├── pages/
│   ├── Dashboard.jsx # Main overview and vital stats
│   ├── Transactions.jsx # Transaction ledger and filtration
│   └── Analytics.jsx # Deep-dive spending heatmaps
├── store/
│   └── useFinanceStore.js # Central terminal for global state
└── styles/
    └── globals.css   # Core design system and theme tokens
```

---

## 📜 Design Decisions

- **Single-Viewport Experience**: Optimized for fixed-height layouts that mirror desktop software rather than traditional scrolling websites.
- **Dark-First Philosophy**: Engineered for modern "Dark Mode" standards while maintaining full accessibility in alternate themes.
- **Zero-Latency Interactions**: Animations are GPU-composited using `transform` and `opacity` to ensure a consistent 60fps experience.

---

*Developed with precision by Jeevesh Sankar M*
*Contact: mjeeveshsankar@gmail.com*
