# Long-Term Memory

## Project: Autonomous Bike Service Company
- **Status:** Architecture Design Phase
- **Tech Stack:** Next.js (Web), React Native (Mechanic App), Node.js/FastAPI, PostgreSQL, n8n, Vector DB, Groq/OpenAI.

## Approved Business Rules & Logistics
- **Parts:** Mechanics supply their own parts and are liable for guarantee/warranty (via Master Agreement).
- **Upfront Fee:** Customers pay a 200 minimum booking/visiting charge upfront.
- **Offline Capabilities:** Mechanic app must support offline state transitions (sync when online).
- **Order Closure:** Feedback is optional, auto-closes if ignored.
- **Customer Unreachable:** IVR checks. If failed, ticket placed on Hold (not reallocated).
- **Revenue Split:** 70% to Mechanic, 30% to Company (applied strictly to Labor only). Payouts done Weekly.
- **Fraud Controls:**
  - Cancellation OTP required if mechanic has arrived (prevents side deals).
  - AI Parts Verification: Mechanic uploads photos of destroyed/used packaging to verify authenticity.
