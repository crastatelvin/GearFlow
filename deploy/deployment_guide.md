# GearFlow Deployment Guide (Phase 7)

Follow these steps to move the autonomous company into production.

## 1. Backend & Infrastructure
The backend and database should be deployed using Docker for consistency.

### Steps:
1. **Prepare Server:** Spin up an Ubuntu 22.04 LTS instance (AWS EC2 / DigitalOcean).
2. **Install Docker:** `curl -sSL https://get.docker.com/ | sh`
3. **Copy `infra/`:** Transfer the `docker-compose.yml` to the server.
4. **Environment:** Create a production `.env` with real Stripe/WhatsApp API keys.
5. **Launch:** `docker-compose -f infra/docker-compose.yml up -d`

## 2. Frontend & Admin Dashboards
Both apps are Next.js and should be deployed to **Vercel** for the best UX.

### Steps:
1. **Connect Repo:** Link your GitHub repo (`crastatelvin/GearFlow`) to Vercel.
2. **Root Directories:**
   - App 1: Set Root Directory to `frontend/`.
   - App 2: Set Root Directory to `admin/`.
3. **Env Vars:** Add `NEXT_PUBLIC_API_URL` pointing to your deployed backend.
4. **Deploy:** Click "Deploy".

## 3. Mechanic Mobile App
The mobile app must be built using Expo EAS.

### Steps:
1. **Login:** `npx eas login`
2. **Project Setup:** `npx eas project:init`
3. **Build:** `npx eas build --platform android --profile production`
4. **Submit:** `npx eas submit --platform android`

## 4. Final Hook
Once everything is live, update the n8n "Lead Intake" webhook URL in the `frontend` Booking Modal to start processing real orders.
