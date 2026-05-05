# n8n Workflow Architecture: Autonomous Bike Service

n8n will serve as the central orchestration engine. Instead of hardcoding all the event logic into the Node.js backend, n8n will handle asynchronous events, API integrations (WhatsApp, Payments), and state machine transitions.

Below are the **Four Core Workflows** that will govern the company.

## 1. Customer Intake & Dispatch Loop

**Trigger:** Webhook from Next.js (Customer submits form & 200 fee paid)
*   **Node 1 (DB Action):** Create `ORDER` in PostgreSQL (Status: `AWAITING_MECHANIC`).
*   **Node 2 (Logic / Radius Calc):** Query DB for top 5 `MECHANICS` where `status = AVAILABLE` and `wallet_balance > -100` (Negative balance trap), sorted by distance (Lat/Lng) and rating.
*   **Node 3 (Loop/Wait):**
    *   Send WebSocket/Push Notification to Mechanic 1. Wait 60 seconds.
    *   *If Accepted:* Proceed to Node 4.
    *   *If Rejected/Timeout:* Loop back to Node 3 for Mechanic 2.
    *   *If no mechanics accept:* Escalate to Admin Dashboard and notify Customer.
*   **Node 4 (DB Action & Comms):** 
    *   Update `ORDER.mechanic_id`. Update `ORDER.status` to `DISPATCHED`.
    *   Trigger WhatsApp API: Send Customer the Live Tracking Link and Mechanic Details.

## 2. On-Site Operations & Diagnosis

**Trigger:** Webhook from Mechanic App (Mechanic clicks "Arrived")
*   **Node 1 (DB Action):** Update `ORDER.status` to `ARRIVED`.
*   **Node 2 (Wait for Webhook):** Wait for Mechanic to submit Diagnosis Quote (Labor + Parts).
*   **Node 3 (Customer Approval):** 
    *   Send WhatsApp/Email to Customer with Quote Breakdown.
    *   Customer clicks "Approve" (Triggers Webhook back to n8n) -> Updates state to `WORKING`.
    *   *If Customer Rejects:* Trigger Refund workflow (minus 200 visit fee).

## 3. Fraud Verification & Escrow (The Zero-Trust Node)

**Trigger:** Webhook from Mechanic App (Mechanic clicks "Work Completed" & Uploads Part Photo)
*   **Node 1 (AI Action):** Pass Photo URL to Groq/OpenAI Vision API. Prompt: "Verify this is an authentic [Brand] part packaging and it has been clearly opened/destroyed. Respond with JSON { 'pass': true/false, 'reason': '...' }."
*   **Node 2 (Switch/Condition):**
    *   *Branch A (AI Pass):* Update `ORDER.status` to `PAYMENT_PENDING`. Send Final Bill to Customer via WhatsApp/Email.
    *   *Branch B (AI Fail):* Create `FRAUD_LOGS` entry. Alert Admin Dashboard immediately. Suspend Mechanic's payout for this ticket.
*   **Node 3 (Wait for Payment Webhook):** Stripe/Razorpay confirmation.
*   **Node 4 (Wallet Trap Calculation):**
    *   *If Paid Online:* Calculate 70% of Labor Cost. Create `WALLET_TRANSACTIONS` (Type: `EARNING`).
    *   *If Paid Cash:* Calculate 30% of Labor Cost. Create `WALLET_TRANSACTIONS` (Type: `DEDUCTION`). Decrease Mechanic Wallet Balance.
*   **Node 5 (DB Action):** Update `ORDER.status` to `COMPLETED`. Request Customer Feedback (Optional).

## 4. Weekly Payouts (Cron Job)

**Trigger:** Cron Node (Every Sunday at 23:59)
*   **Node 1 (DB Query):** Fetch all `MECHANICS` where `wallet_balance > 0`.
*   **Node 2 (Batch Logic):** Loop through each mechanic.
*   **Node 3 (Payout API):** Trigger Bank Transfer API (e.g., Stripe Connect / RazorpayX) to disburse `wallet_balance` amount.
*   **Node 4 (DB Action):** Create `WALLET_TRANSACTIONS` (Type: `PAYOUT`). Reset Mechanic's `wallet_balance` to 0.

---

### User Review Required

Please review the n8n logic maps above. 

Does this accurately cover the **State Machine transitions** and the **Fraud Prevention** loops we discussed? 

If you are satisfied with this orchestration plan, the next step is mapping out the **RAG Chatbot Knowledge Base**, or we can finally move to **Phase 2: Backend Infrastructure** and begin writing the code. What do you prefer?
