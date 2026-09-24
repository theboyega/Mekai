# Mekai — Automotive Diagnostic Intelligence

> **Diagnostic intelligence for the modern workshop.**  
> Developed by **Cestcore Limited**.

---

## 🏎️ Overview

**Mekai** is an enterprise-grade AI automotive diagnostic platform and workshop copilot. Engineered specifically for professional mechanics, automotive technicians, garage managers, and modern dealerships, Mekai turns raw vehicle symptoms, diagnostic trouble codes (DTCs), sensor readings, and acoustic observations into root-cause diagnoses, step-by-step repair roadmaps, and OEM component verification.

---

## ✨ Key Features

- **⚡ Instant OBD-II / DTC Diagnostic Engine**:
  - Full support for SAE Standard codes (**P**, **B**, **C**, and **U** code series).
  - Identifies root causes, failure likelihoods, affected subsystems, and verified repair paths.
- **🎙️ Acoustic & Symptom Diagnostic Analysis**:
  - Diagnoses complex mechanical symptoms (engine knocks, vacuum leaks, belt squeals, transmission slips, suspension rattles).
  - Audio recording input & photo inspection support for workshop floor triage.
- **🤖 Dedicated Diagnostics Pipeline**:
  - Integrated via real-time proxy to Mekai's n8n workflow reasoning engine.
  - Interactive follow-ups, workshop notes generation, parts recommendation, and printable diagnostic work orders.
- **🛠️ Technician Workshop Workspace**:
  - Vehicle profile management (VIN, Make, Model, Year, Mileage, Trim).
  - Chat history session persistence with search, rename, and quick reload capabilities.
  - Technician quick-action prompt tiles (OBD-II, Engine Noise, Electrical Glitch, Transmission, Braking System).
- **🔒 Workshop Privacy & Data Integrity**:
  - Self-custodial session model; private, local-first garage storage without unnecessary telemetry.
- **📱 Fully Responsive Design**:
  - Tailored specifically for workshop environments: rugged mobile view, tablet wallboard mode, laptop, and ultra-wide monitor desktop setups.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
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
├── index.html                   # App entry HTML & meta tags
├── metadata.json                # AI Studio & applet metadata
├── package.json                 # Dependencies & scripts
├── server.ts                    # Express API server & n8n webhook proxy
├── tsconfig.json                # TypeScript compiler config
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── public/                      # Static assets & icons
└── src/
    ├── App.tsx                  # Main React application router & entry
    ├── main.tsx                 # React DOM mount point
    ├── index.css                # Tailwind CSS v4 entry
    ├── components/
    │   ├── AppDashboard.tsx     # Full workshop technician interface & chat
    │   ├── AuthModal.tsx        # Workshop technician code & account modal
    │   ├── CoreCapabilities.tsx # Landing page capabilities section
    │   ├── FloorValidation.tsx  # Workshop floor validation & metrics
    │   ├── Footer.tsx           # Global footer & legal page links
    │   ├── HeroSection.tsx      # Landing page hero with interactive prompt
    │   ├── MobileAppSection.tsx # Native mobile app download showcase
    │   ├── Navbar.tsx           # Main navigation bar
    │   ├── PhoneMockup.tsx      # Interactive mobile app preview mockup
    │   ├── WorkflowArchitecture.tsx # High-level system architecture section
    │   └── LegalPages.tsx       # Docs, Terms, Privacy, Licenses, Help, Status
```

---

## 📄 License & Legal Notice

© **Cestcore Limited**. All rights reserved.

- **Automotive Notice**: Mekai provides AI-powered automotive diagnostic assistance and guidance. Repairs, parts replacements, and safety inspections must be performed by certified, licensed automotive technicians.
- **Open Source**: Built with open-source libraries licensed under MIT, Apache 2.0, and BSD.
- **Contact**: For enterprise licensing, workshop fleet deployments, or inquiries, reach out at [compliance@cestcore.com](mailto:compliance@cestcore.com).
