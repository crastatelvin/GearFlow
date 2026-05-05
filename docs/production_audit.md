# GearFlow Production Security & Infrastructure Audit

Before the final launch of the autonomous system, the following security and operational checks must be completed.

## 1. Authentication & Security
- [ ] **Rotate Secret Keys:** Replace all `JWT_SECRET` and `API_KEYS` in `.env` files with high-entropy production keys.
- [ ] **DB Access Control:** Ensure the `gearflow_admin` user has restricted permissions and the database is NOT exposed to the public internet (use a VPC or Tunnel).
- [ ] **HTTPS Enforcement:** Force SSL on all endpoints (`frontend`, `admin`, `backend`, `n8n`).
- [ ] **Rate Limiting:** Implement Redis-based rate limiting on the `/request-service` and `/mechanic-sync` endpoints to prevent DDoS or brute-force attacks.

## 2. Autonomous Nervous System (n8n)
- [ ] **Webhook Security:** Enable "Basic Auth" or "Header Auth" for all n8n webhooks to ensure only our backend can trigger workflows.
- [ ] **Worker Scaling:** Configure n8n to use "Queue Mode" with Redis if the order volume exceeds 1,000/day.
- [ ] **Error Handling:** Ensure all failed workflows trigger a "Human-in-the-Loop" notification to the Admin via the Ops Dashboard.

## 3. Infrastructure (Phase 7)
- [ ] **Frontend/Admin:** Deploy to **Vercel** for edge-optimized performance.
- [ ] **Backend/DB:** Deploy to **AWS (RDS + ECS)** or **Render** for reliable persistent storage and compute.
- [ ] **Mobile App:** Build the production `.apk`/`.ipa` via **Expo EAS** and submit to the stores.

## 4. Financial Safeguards
- [ ] **Payout Watchdog:** Verify that the "Weekly Payout" cron job has a 24-hour verification delay before final settlement.
- [ ] **Refund Logic:** Test the automated 200 fee refund logic for cases where a mechanic is not found within the SLA.

---
**Status:** Ready for Infrastructure Execution.
