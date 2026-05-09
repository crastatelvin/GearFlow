<div align="center">

# 🚲 GEARFLOW

### Fully Autonomous Bike Service — AI-Driven Logistics, Smart Dispatch & RAG-Powered Support

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://expo.dev/)
[![n8n](https://img.shields.io/badge/Orchestration-n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

<br/>

> **GearFlow** is a next-generation, zero-trust autonomous bike service ecosystem. By leveraging n8n orchestration and multimodal AI, it automates the entire service lifecycle—from intelligent lead triage and proximity-based dispatch to vision-locked part verification and automated payouts.

<br/>

![Dispatch](https://img.shields.io/badge/Dispatch-AI_Proximity_Matching-f3b44f?style=for-the-badge) ![Automation](https://img.shields.io/badge/Workflows-n8n_Orchestrated-5aa6ff?style=for-the-badge) ![AI](https://img.shields.io/badge/Intelligence-RAG_%2B_Vision-b189ff?style=for-the-badge) ![Security](https://img.shields.io/badge/Security-Zero_Trust_Auth-36cfc9?style=for-the-badge)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Application Preview](#-application-preview)
- [System Features](#-system-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Infrastructure & Workflows](#-infrastructure--workflows)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [License](#-license)

---

## 🧠 Overview

GearFlow transforms traditional bike maintenance into a fully autonomous digital operation. The platform eliminates human intervention in logistics and verification, ensuring a "zero-trust" environment where every action is verified by AI and logged on-chain (or in a secure ledger).

**Key User Flows:**
- **Customers:** Request service via a premium Next.js portal, track mechanics in real-time, and receive AI-generated health reports for their bikes.
- **Mechanics:** Use an offline-first Expo app to receive jobs, navigate to locations, and verify part replacements using vision-based AI.
- **System:** n8n acts as the "Central Nervous System," handling fraud detection, automated payouts, and RAG-based technical support for mechanics.

---

## 🖼️ Application Preview

<div align="center">

### 1) Landing Page
![Landing Page](docs/screenshots/01-landing.png)

<br/>

### 2) Login Page
![Login Page](docs/screenshots/02-login.png)

<br/>

### 3) Customer Dashboard
![Dashboard](docs/screenshots/03-dashboard.png)

<br/>

### 4) Live Tracking
![Tracking](docs/screenshots/04-tracking.png)

<br/>

### 5) AI Assistant
![AI Chat](docs/screenshots/05-ai-chat.png)

<br/>

---

## 🛡️ Admin Dashboard Features

The Admin Dashboard provides real-time oversight of the entire autonomous fleet.

### 📊 Fleet Overview & Analytics
![Admin Overview](docs/screenshots/admin_overview.png)
*Real-time metrics, revenue tracking, and active session monitoring.*

<br/>

### 🗺️ Live Fleet Tracking
![Admin Map](docs/screenshots/admin_map.png)
*Geographic distribution of active mechanics and service requests.*

<br/>

### 📋 Active Orders & Mechanics
| Active Service Orders | Registered Technicians |
|---|---|
| ![Orders](docs/screenshots/admin_orders.png) | ![Mechanics](docs/screenshots/admin_mechanics.png) |

<br/>

### 🛡️ Fraud & Operations Logs
![Admin Fraud](docs/screenshots/admin_fraud.png)
*AI-detected anomalies and verification logs.*

</div>

---

## ✨ System Features

| Feature | Description |
|---|---|
| 🎯 **Smart Dispatch** | Real-time mechanic allocation based on Geo-proximity, rating, and current load. |
| 👁️ **Vision Verification** | Multimodal AI validates new vs. old parts via photos to prevent fraud. |
| 📚 **RAG Support** | Instant technical assistance for mechanics using a RAG pipeline over maintenance manuals. |
| 🛡️ **Fraud Detection** | Automated n8n workflow monitors patterns and flags suspicious service claims. |
| 💳 **Automated Payouts** | Weekly cron-based payouts for mechanics via integrated fintech gateways (Razorpay/Cashfree). |
| 📱 **Offline-First Mobile** | Reliable mechanic app that functions in low-connectivity areas with sync-on-reconnect. |

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph "Clients"
        A[Next.js Portal] -->|API Requests| B[Express Backend]
        C[Expo Mobile App] -->|API Requests| B
    end

    subgraph "Core Logic"
        B --> D[(PostgreSQL / pgvector)]
        B --> E[n8n Orchestrator]
    end

    subgraph "Automation & AI"
        E --> F[Dispatch Workflow]
        E --> G[RAG Support System]
        E --> H[Fraud Detection]
        E --> I[Payout Cron]
    end

    subgraph "External Services"
        G --> J[Groq / OpenAI]
        I --> K[Payment Gateway]
        F --> L[WhatsApp API]
    end
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15+, TailwindCSS 4, Framer Motion |
| **Mobile** | React Native (Expo), Moti (Animations), SecureStore |
| **Backend** | Node.js, Express 5, JWT Auth, Helmet |
| **Orchestration** | n8n (Self-hosted or Cloud) |
| **Database** | PostgreSQL + pgvector (Vector Search) |
| **AI / LLM** | Groq (Llama 3), OpenAI Vision, LangChain |
| **Infrastructure** | Docker, AWS EKS (Proposed) |

---

## 📁 Project Structure

```
GearFlow/
│
├── admin/                 # Admin Dashboard (React)
├── backend/               # Core Express API
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── db/            # Migrations & Models
│   │   ├── middleware/    # Auth & Security
│   │   └── routes/        # API Endpoints
│   └── package.json
│
├── frontend/              # Customer Web Portal (Next.js)
│   ├── src/app/           # App Router
│   ├── src/components/    # UI Library
│   └── tailwind.config.ts
│
├── mobile/                # Mechanic Mobile App (Expo)
│   ├── src/               # Reusable logic
│   └── app/               # Expo Router pages
│
├── infra/                 # Infrastructure & Automation
│   └── n8n/               # Workflow JSON exports
│       ├── dispatch.json
│       ├── rag_workflow.json
│       └── payouts_cron.json
│
├── deploy/                # Deployment scripts (Docker/K8s)
└── README.md
```

---

## 🤖 Infrastructure & Workflows

The `infra/n8n/` directory contains the blueprint of GearFlow's intelligence.

<div align="center">

![n8n Workflows](docs/screenshots/n8n_workflows.png)
*Orchestrated logic for Dispatch, RAG, and Fraud Detection.*

</div>

1.  **`dispatch_workflow.json`**: Handles the logic for matching service requests to the best available mechanic.
2.  **`rag_workflow.json`**: Implements the Retrieval-Augmented Generation pipeline to provide mechanics with repair guides.
3.  **`operations_fraud.json`**: Analyzes technician photos and logs to detect anomalies.
4.  **`payouts_cron.json`**: Triggered weekly to calculate and disperse earnings.

---

## 🚀 Installation

### 1) Clone the Repository
```bash
git clone https://github.com/crastatelvin/GearFlow.git
cd GearFlow
```

### 2) Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run db:init   # Initialize database schema
npm run dev
```

### 3) Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4) Setup Mobile (Expo)
```bash
cd ../mobile
npm install
npx expo start
```

---

## ⚙️ Configuration

Ensure your `backend/.env` contains:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/gearflow
JWT_SECRET=your_super_secret_key
N8N_WEBHOOK_URL=http://your-n8n-instance/webhook/...
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-...
```

---

## 🔒 Security Notes

- **Zero Trust:** All mechanic actions require proximity-based GPS verification and visual confirmation.
- **JWT Auth:** Stateless authentication across Web and Mobile.
- **Rate Limiting:** Protects the n8n webhooks from excessive automated calls.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
<br/>
Built by **Telvin Crasta** • Empowering Autonomous Service
<br/>
⭐ Star this repo if you're building the future of autonomous logistics!
</div>
