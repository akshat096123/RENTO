# 🔄 RENTO — Peer-to-Peer & Demand-First Rental Marketplace

An AI-powered, demand-first rental marketplace enabling borrowers to post real-time rental needs and lenders to fulfill them with smart escrow, verified KYC, and end-to-end porter logistics.

---

## 🌟 Key Features

- **Demand-First Matching**: Borrowers post specific equipment requirements; lenders bid or match automatically.
- **Browse & Rent Marketplace**: Rich catalog across Audio-Visual, Gaming, Cameras, Laptops, Drones, Event Tech, and Power Tools.
- **Smart Escrow & Security**: Mock Razorpay/Stripe escrow with dispute resolution and refundable deposits.
- **Unified 3-in-1 Dashboard**:
  - **My Bookings**: Real-time status tracker, active rentals, and pickup/return details.
  - **Lender Studio**: Inventory management, earnings breakdown, and demand request bidding.
  - **Porter Logistics**: Integrated courier dispatch, live verification codes, and transit updates.
- **Quick Demo Accounts**: Pre-configured instant sign-in accounts for easy evaluation:
  - 👤 **Aarav Sharma** (Borrower) — *aarav@rento.io*
  - 👤 **Priya Mehta** (Lender Studio) — *priya@rento.io*
  - 👤 **Kiran Patel** (Porter Operations) — *kiran@rento.io*
- **Responsive & Modern UI**: Built with Tailwind CSS, Lucide icons, glassmorphism overlays, and mobile-friendly layouts.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Vite
- **Backend**: Express.js, TypeScript, better-sqlite3
- **Database**: SQLite with automatic seeding of sample catalog & demo requests
- **Tooling**: `tsx`, Vite dev server & production bundle compiler

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/rento.git
cd rento
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
# Run both backend server and frontend Vite in development
npm run dev
```

Or build and run the full stack together:
```bash
# Build frontend
npm run build

# Start backend server (serves API and compiled frontend on port 8088)
npm run serve
```

Open [http://localhost:8088](http://localhost:8088) in your browser.

---

## 📁 Project Structure

```
RENTO/
├── src/                  # React Frontend
│   ├── components/       # UI Components (AuthModal, DualDashboards, HomeView, etc.)
│   ├── types.ts          # Frontend TypeScript Interfaces
│   ├── App.tsx           # Main Application Container
│   └── main.tsx          # Frontend Entrypoint
├── server/               # Express Backend
│   ├── db.ts             # SQLite Schema, Migrations, and Demo Seed Data
│   ├── routes.ts         # REST API Endpoints (Auth, Items, Demands, Escrow)
│   └── index.ts          # Server initialization and static file delivery
├── uploads/              # Uploaded media assets
├── public/               # Public assets
├── package.json          # Dependencies and npm scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build & proxy settings
```

---

## 📝 License
This project is licensed under the MIT License.
