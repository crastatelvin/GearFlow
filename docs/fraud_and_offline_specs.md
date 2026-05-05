# Technical Specifications: Fraud Prevention & Offline Sync

To guarantee the "Zero-Trust" nature of the autonomous company, the Mechanic App must be structurally resilient against both network drops (basement parking lots) and physical fraud attempts.

---

## 1. Offline-First Synchronization Architecture

Mechanics often work in underground garages where GPS and 4G/5G signals are non-existent. A standard API-based app will crash or stall. We will implement an **Offline-First Action Queue**.

### A. Local Database (WatermelonDB / SQLite)
*   Instead of writing directly to the PostgreSQL backend, the Mechanic App (React Native) writes to a local SQLite database on the phone.
*   **Action Queue:** Every state change (e.g., clicking "Start Work", "Pause", "Add Part Photo") is stored locally with a secure `timestamp`.

### B. The Sync Manager
*   The app listens to the device's `NetInfo` state.
*   *If Offline:* The UI reflects the change instantly (optimistic UI), but flags the action as "Pending Sync".
*   *If Online:* The Background Sync Manager flushes the queue to the backend API.
*   **Timestamp Integrity:** The backend strictly respects the encrypted client-side timestamp for billing and SLA tracking, rather than the time the server received the payload.

---

## 2. Zero-Trust Physical Fraud Prevention

Digital platforms are vulnerable when transitioning to the physical world. We will deploy the following strict protocols.

### A. The "Fake Cancellation" Defense (Side-deal Prevention)
*   **Vulnerability:** Mechanic arrives, diagnoses the bike, and tells the customer: *"Cancel the order on the app to save the 30% company fee, and pay me in cash directly."*
*   **Solution (The Proximity OTP):**
    1. Once the mechanic's GPS is within 50 meters of the customer's location, the backend locks the `CANCEL` button on the Customer's app.
    2. To cancel the order on-site, the customer must provide a 4-digit `Cancel OTP` to the mechanic. 
    3. Entering this OTP triggers the base 200 visit charge to the customer's card. Without it, the mechanic's app cannot close the ticket, preventing them from getting new jobs.

### B. Counterfeit Parts Verification (AI Vision)
*   **Vulnerability:** The mechanic buys cheap/fake engine oil, uses it, but charges the system for premium branded oil. Or, they take a photo of an empty premium oil bottle they've kept in their bag for months.
*   **Solution (The Destroyed Packaging Protocol):**
    1. The mechanic must take a live photo (gallery uploads disabled) of the part packaging alongside the customer's bike license plate.
    2. The packaging **must be visibly destroyed/crushed** in the photo.
    3. The photo is sent to Groq/OpenAI Vision API.
    4. *System Prompt:* "Verify this image contains the brand [Brand Name]. Verify the packaging is definitively destroyed or cut open. Verify a license plate is visible. Return { 'valid': true } only if all conditions are met."
    5. If false, the payout is suspended and escalated to human review.

### C. OS-Level Security Checks
*   **No Root / Jailbreak:** The app uses RootBeer (Android) and IOSSecuritySuite to refuse launch on modified devices.
*   **No Mock Locations:** The app detects if "Developer Options" or "Allow Mock Locations" is enabled, preventing GPS spoofing.
*   **SIM Binding:** The app verifies the active SIM card matches the registered phone number, ensuring mechanics aren't passing their accounts to unverified friends.

---

### User Review Required

Please review the offline architecture and fraud modules.

This artifact concludes **Phase 1: System Design & Architecture**. We now have a complete, zero-trust blueprint.

Are you ready to officially approve the start of **Phase 2: Backend Infrastructure**? Once you say the word, I will begin writing the actual codebase!
