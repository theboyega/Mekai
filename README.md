# Mekai — Automotive Diagnostic Intelligence

> **Diagnostic intelligence for the modern workshop.**  
> Developed by **Cestcore Limited**.

---

## 🏎️ Overview

**Mekai** is an enterprise-grade automotive diagnostic platform and workshop copilot. Engineered specifically for professional mechanics, automotive technicians, garage managers, and modern dealerships, Mekai turns raw vehicle symptoms, diagnostic trouble codes (DTCs), sensor readings, and acoustic observations into root-cause diagnoses, step-by-step repair roadmaps, and OEM component verification.

---

## ✨ Key Features

- **⚡ Instant OBD-II / DTC Diagnostic Engine**:
  - Full support for SAE Standard codes (**P**, **B**, **C**, and **U** code series).
  - Identifies root causes, failure likelihoods, affected subsystems, and verified repair paths.
- **🎙️ Acoustic & Symptom Diagnostic Analysis**:
  - Diagnoses complex mechanical symptoms (engine knocks, vacuum leaks, belt squeals, transmission slips, suspension rattles).
  - Audio recording input & photo inspection support for workshop floor triage.
- **🤖 Dedicated Diagnostics Pipeline & Graceful Quota Handling**:
  - Integrated via real-time proxy (`/api/chat-webhook`) to Mekai's n8n workflow reasoning engine.
  - Interactive follow-ups, workshop notes generation, parts recommendation, and printable diagnostic work orders.
  - Seamless standard Mekai response when daily diagnostic credits are reached or the engine is temporarily unreachable (*"You've reached your diagnostic limit for today. Your credits will automatically refresh tomorrow at 8:00 AM, and you'll be ready to dive back into your workshop sessions."*).
- **🔐 Dedicated Full-Screen Authentication Page (`#signup` / `#login`)**:
  - Clicking **Sign up**, **Log in**, or **Get started** navigates to a dedicated full-screen Auth Page (`src/pages/AuthPage.tsx`).
  - Features the clickable Mekai logo at the top (returning to the homepage), followed by **Activate Workshop Access** / **Technician Login** headings outside the card, center-aligned card layout with left-aligned input labels and fields, and a two-step verification flow (12-character `CST-XXXX-XXXX` workshop access code verification followed by Technician Name setup).
- **🧭 Precision Navigation & Mobile Menu Drawer**:
  - Sticky translucent obsidian header (`#0E1111/80` with `backdrop-blur-md` and bottom divider border) with vertically centered brand logo, Sign up link, and custom animated two-bar hamburger button.
  - Lock-scroll mobile menu drawer with zero layout shift, quick section navigation, resource links, and a full-width sage-green **Log in** pill button.
- **📱 Sage Green Dual Phone Mockups**:
  - Dual interactive mobile app mockups (`PhoneMockup.tsx`) showcasing the *Ready for Diagnostics* prompt view and the *Navigation Drawer* view, styled cohesively in Mekai's signature sage green (`#A3B18A`).
- **🛠️ Technician Workshop Workspace**:
  - Chat history session persistence with search, rename, delete, and quick reload capabilities.
  - Responsive workshop interface across mobile, tablet, laptop, and ultra-wide desktop displays.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4
- **Animations & Icons**: Motion, Lucide React
- **Backend / API Gateway**: Express (Node.js / tsx) with `/api/chat-webhook` proxy to the Mekai n8n reasoning workflow
- **Deployment**: Docker/Node container ready, cloud hosting ready

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` or `bun`

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/<your-username-or-org>/mekai.git
cd mekai

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Set the following variables in `.env`:

```env
PORT=3000
# Mekai n8n webhook endpoint
MEKAI_WEBHOOK_URL=https://mekai-ai.app.n8n.cloud/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
```

To run the production full-stack server:

```bash
npm start
```

---

## 📁 Project Structure

```text
├── index.html                        # App entry HTML, SEO & OpenGraph meta tags
├── metadata.json                     # Applet metadata
├── package.json                      # Dependencies & scripts
├── server.ts                         # Express API server & n8n webhook proxy
├── tsconfig.json                     # TypeScript compiler config
├── vite.config.ts                    # Vite configuration with Tailwind CSS plugin
├── public/                           # Static assets & icons
└── src/
    ├── App.tsx                       # Main React application router & entry
    ├── main.tsx                      # React DOM mount point
    ├── index.css                     # Tailwind CSS v4 entry & custom animations
    ├── data/
    │   └── accessCodes.ts            # Workshop invitation access codes & formatter
    ├── components/
    │   ├── AppDashboard.tsx          # Full workshop technician interface & chat
    │   ├── CoreCapabilities.tsx      # Landing page capabilities section
    │   ├── FloorValidation.tsx       # Workshop floor validation & metrics
    │   ├── Footer.tsx                # Global footer & sub-page navigation links
    │   ├── HeroSection.tsx           # Landing page hero with interactive diagnostic preview
    │   ├── MekaiLogo.tsx             # Hexagonal mechanical nut brand logo SVG
    │   ├── MobileAppSection.tsx      # Native mobile app download showcase
    │   ├── Navbar.tsx                # Sticky translucent navigation bar & mobile drawer
    │   ├── PageHeader.tsx            # Shared header for informational sub-pages
    │   ├── PhoneMockup.tsx           # Sage green dual mobile app preview mockups
    │   └── WorkflowArchitecture.tsx  # Capture → Reason → Execute workflow section
    └── pages/
        ├── AuthPage.tsx              # Dedicated full-screen workshop authentication page
        ├── CareersPage.tsx           # Careers & open roles page
        ├── DocsPage.tsx              # Technical documentation & OBD-II reference
        ├── HelpPage.tsx              # Workshop support & FAQ page
        ├── LicensesPage.tsx          # Open-source & OEM data licensing page
        ├── PressPage.tsx             # Press releases & brand kit page
        ├── PrivacyPage.tsx           # Workshop data privacy policy page
        ├── StatusPage.tsx            # Real-time diagnostic system status page
        └── TermsPage.tsx             # Terms of service page
```

---

## 📄 License & Legal Notice

© **Cestcore Limited**. All rights reserved.

- **Automotive Notice**: Mekai provides automotive diagnostic assistance and guidance. Repairs, parts replacements, and safety inspections must be performed by certified, licensed automotive technicians.
- **Contact**: For enterprise licensing, workshop fleet deployments, or inquiries, reach out at [compliance@cestcore.com](mailto:compliance@cestcore.com).
