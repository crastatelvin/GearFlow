# RAG Knowledge Base Architecture: Autonomous Bike Service

To ensure the AI operates reliably without hallucinating prices or incorrect technical advice, we need a strictly partitioned Retrieval-Augmented Generation (RAG) system. The AI will serve two distinct personas: **Customers** and **Mechanics**.

We will use a Vector Database (like Pinecone or Qdrant) to store embeddings of our knowledge documents. 

## 1. Customer-Facing AI (The Booking Assistant)

**Goal:** Answer customer queries, confirm service areas, and gently guide them to book a 200 visit, without hallucinating final repair costs.

### A. Data Sources (Collections)
*   **`pricing_matrix.md`:** Contains the base visit fee (200), estimated hourly labor rates, and general pricing disclaimers (e.g., "Final parts cost determined on-site").
*   **`service_areas.geojson` / `zones.md`:** List of supported cities, zip codes, and radius limits.
*   **`supported_vehicles.csv`:** List of bike brands and models we service (e.g., Royal Enfield, Honda, Yamaha).
*   **`customer_faq.md`:** Policies on refunds, warranties, and cancellation fees.

### B. System Prompt Engineering
> **Role:** You are the frontline support for an autonomous bike service company. Your tone is calm, polite, and highly interactive.
> **Constraint 1:** NEVER quote a final price for a repair. You may only state the initial visit/diagnosis fee of 200.
> **Constraint 2:** Only use information provided in the retrieved context. If a customer asks about a bike model not in the context, state we do not currently service it.
> **Constraint 3:** If the query is complex or the customer is angry, immediately respond with the escalation trigger: `[ESCALATE_TO_HUMAN]`.

---

## 2. Mechanic-Facing AI (The Operations Copilot)

**Goal:** Provide instantaneous technical support to mechanics on the field and answer operational questions regarding payouts and rules.

### A. Data Sources (Collections)
*   **`vehicle_manuals/` (PDFs/Text):** OEM Service Manuals. (e.g., "Honda CB350 Wiring Diagram", "Royal Enfield Classic 350 Torque Specs").
*   **`master_service_agreement.md`:** The legal contract. Contains rules on parts liability, the 70/30 labor split, negative wallet trap, and payout schedules.
*   **`troubleshooting_guides.md`:** Common symptoms and step-by-step diagnostic trees.
*   **`app_tutorial.md`:** How to use the mechanic app (e.g., "How do I take a photo of a destroyed part for AI verification?").

### B. System Prompt Engineering
> **Role:** You are the AI Copilot for our certified mechanics. Your goal is to provide precise, technical, and operational assistance.
> **Constraint 1:** When providing torque specs or wiring info, quote the exact manual page and warn the mechanic to double-check physically.
> **Constraint 2:** If asked about payouts, explain the 70% labor / 30% company split and clarify that they are liable for their own parts.

---

## 3. Data Ingestion & Sync Workflow (n8n)

To keep the RAG system updated without manual developer intervention, we will use n8n to build a **Document Sync Pipeline**.

1.  **Admin Updates File:** An admin updates a Google Doc (e.g., `customer_faq.doc`) or uploads a new PDF to a Google Drive folder.
2.  **n8n Trigger:** Detects the file change.
3.  **n8n Action (Chunking):** Downloads the file, splits the text into chunks of 500 tokens (with 50 token overlap).
4.  **n8n Action (Embedding):** Sends chunks to Groq/OpenAI embedding model.
5.  **n8n Action (Upsert):** Pushes the new vectors into Pinecone/Qdrant, instantly updating the AI's brain.

---

### User Review Required

Please review the RAG Knowledge Base structure. 

Does this accurately cover the split between what the Customer should know vs. what the Mechanic should know? 

If you approve, we have just one final planning step: detailing the **Fraud Prevention & Offline Sync** specs. After that, Phase 1 is officially complete and we wait for your command to code.
