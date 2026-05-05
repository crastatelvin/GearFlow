# System Architecture: Autonomous Bike Service

This document outlines the complete technological architecture and orchestration plan, incorporating all the approved business rules (e.g., 200 upfront charge, weekly mechanic payouts, liability agreements).

## 1. Where We Use n8n (Orchestration & Webhooks)
n8n will act as the "nervous system" of your company, connecting different microservices without needing hardcoded logic everywhere.

*   **Lead Intake & Upfront Billing:**
    *   *Trigger:* Webhook from Next.js Frontend.
    *   *Action:* Validate input -> Generate 200 booking charge link (Stripe/Razorpay) -> Wait for Webhook payment confirmation -> Create Lead in DB.
*   **The "Dispatcher" Loop:**
    *   *Trigger:* Lead Paid.
    *   *Action:* Query DB for nearest available mechanics.
    *   *Logic:* Broadcast via WebSockets -> If accepted -> Update DB -> Trigger WhatsApp/Email API to notify customer. If no response -> Trigger IVR Call to Customer.
*   **Fraud & Hold Workflows:**
    *   *Trigger:* Mechanic arrives but customer cancels.
    *   *Logic:* n8n requests Cancellation OTP. If successful -> Calculate refund minus the 200 visit charge -> Process refund.
*   **Cron Jobs (Weekly Payouts):**
    *   *Trigger:* Every Sunday at Midnight.
    *   *Action:* Aggregate all "Completed" tasks for each mechanic -> Calculate 70% of Labor -> Trigger API to disburse funds to virtual wallets/bank accounts.

## 2. Where We Use RAG (Retrieval-Augmented Generation)
RAG will be the "brain" of the operation, giving your AI agents contextual knowledge.

*   **Customer Support Chatbot (Front-end):**
    *   *RAG Source:* Pricing matrices, service area maps, operating hours, FAQ documents.
    *   *Use:* If a customer asks "Do you service Honda City in Downtown?", the bot retrieves the location boundaries and responds accurately, blocking hallucinated promises.
*   **Mechanic "Copilot" (Mechanic App):**
    *   *RAG Source:* Vehicle manuals, historical repair notes, master service agreements.
    *   *Use:* If a mechanic is stuck on a repair, they ask the app "How to reset ECU on Royal Enfield?". The RAG pulls the exact manual page for them.
*   **Fraud Detection (AI Verification):**
    *   *RAG/Vision Use:* AI compares the mechanic's uploaded photo of the "destroyed/used" part against a vector database of genuine part packaging to ensure counterfeit parts aren't being used.

## 3. Complete System Architecture

### A. Frontend (User Interfaces)
*   **Customer Web App:** Next.js (React) + TailwindCSS. Fast, SEO-optimized, with live map integration (Google Maps/Mapbox API) and Stripe/Razorpay elements.
*   **Admin Dashboard:** Next.js. Glassmorphic, dynamic, real-time tracking of operations.
*   **Mechanic App:** React Native (Expo) or PWA. Crucial for device hardware access (Camera, GPS) and **Offline Mode** (using SQLite or WatermelonDB locally to sync when back online).

### B. Backend & Database
*   **Core Backend API:** Node.js (Express) or Python (FastAPI). Handles complex business logic and serves the mobile/web apps.
*   **Primary Database:** PostgreSQL (Supabase or Neon). Relational data is critical here (Users, Leads, Mechanics, Wallet Transactions).
*   **Real-time Layer:** Socket.io or Supabase Realtime for live mechanic tracking and chat.

### C. AI & Automation Layer
*   **Workflow Engine:** self-hosted n8n.
*   **LLM Provider:** Groq or NVIDIA NIM (for ultra-fast chatbot responses), OpenAI (for complex reasoning/vision tasks).
*   **Vector DB:** Pinecone or Qdrant (for RAG).

## 4. Improvements & Suggestions

> [!TIP]
> To truly make this a "fully autonomous company", consider these architectural enhancements:

1.  **Event-Driven "State Machine":** 
    Instead of simple database updates, treat every order as a State Machine (e.g., `PENDING` -> `MECHANIC_DISPATCHED` -> `DIAGNOSING` -> `QUOTE_APPROVED` -> `WORKING` -> `PAID`). This prevents a ticket from skipping a step (like skipping the quote approval) and ensures strict zero-trust governance.
2.  **Mechanic Wallet "Negative Balance" Trap:** 
    Since mechanics bring their own parts, what if a mechanic collects $500 cash from a customer (for $100 labor, $400 parts)? The company is owed $30 (30% of labor). The mechanic's virtual wallet should go into the negative. If the wallet hits -$100, they are automatically suspended from receiving new leads until they clear their debt to the company.
3.  **Customer "Ghosting" Defense:** 
    If the mechanic arrives and the customer isn't responding, the mechanic clicks "Customer Unreachable" in the app. n8n should automatically trigger an IVR call. If the IVR fails, the GPS coordinates are verified, the mechanic is released, and the customer forfeits their 200 visit fee.

---

## Next Steps / User Review Required

Does this architecture align with your vision for the company? 

If approved, our next task will be to design the **Database Schema** and map out the exact **State Machine logic** for an order, before any code is written.
