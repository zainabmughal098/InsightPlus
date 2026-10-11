# InsightPulse (Insight+)

> Interactive business intelligence dashboard to visualize multidimensional data, filter commercial performance in real-time, and uncover AI-powered trends.

🌐 **Live Deployment:** [https://insight-plus-ngkr.vercel.app/](https://insight-plus-ngkr.vercel.app/)

---

## 🚀 Overview

**InsightPulse** is an executive-grade analytics platform built for rapid data exploration. It converts transaction data into synchronized charts, dynamic drilldowns, and automated strategic briefings.

Built as part of the Google AI Studio *"Build with AI: Interactive dashboard to uncover data insights"* lab.

---

## ✨ Features

- **Executive KPI Cards**: Real-time metrics for Gross Revenue, Units Sold, Average Order Value (AOV), Gross Margin %, CSAT Rating, and Return Rate with high-contrast tabular figures (`tabular-nums`).
- **Multi-Chart Visual Analytics**:
  - **Historical Trajectory (Line Chart)**: Smooth SVG curves tracking monthly metrics with hover crosshair tooltips and switchable Revenue ($) / Units Sold views.
  - **Category & Channel Distribution (Donut / Pie Charts)**: Proportional breakdown with hover slice enlargement and clickable legend filters.
  - **Regional Throughput (Bar Chart)**: Cross-market volume comparison across North America, Europe, Asia Pacific, and Latin America.
  - **Merchandising Hierarchy**: Ranked performance matrix highlighting top product lines.
  - **Granular Transaction Ledger**: Interactive data table with multi-column sorting, text search, pagination, and direct CSV export.
- **Dynamic Real-Time Filtering**:
  - Filter across Product, Category, Region, Channel, and Fiscal Quarter.
  - 1-click test button for **"Premium Tailored Trousers"** to test cross-chart reactivity.
- **AI Insights Engine**:
  - Automated executive briefings powered by **Gemini 3.8 Flash** with an integrated statistical heuristic fallback.
  - Highlights growth drivers, operational watchouts, and prioritized recommendations.
- **Custom CSV Upload**:
  - Drag-and-drop CSV importer with auto-column mapping and instant dashboard recalculation.
  - Built-in template downloader and one-click data reset.
- **Visual Design Annotation (Lab Step 3)**:
  - Interactive simulator demonstrating visual annotation and design prompts (e.g., *"Let's make these cards white"*).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend / Server**: Node.js, Express, tsx
- **Build Tool**: Vite 8, esbuild
- **AI Integration**: `@google/genai` (Gemini 3.8 Flash)

---

## 🏃 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd insight-plus

# Install dependencies
npm install
```

### Development

```bash
# Start the full-stack dev server (port 3000)
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Optional: Required for Gemini-powered insights (falls back to local heuristic engine if omitted)
GEMINI_API_KEY="your-gemini-api-key"
```

---

