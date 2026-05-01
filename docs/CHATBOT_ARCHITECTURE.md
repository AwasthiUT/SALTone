# UT's Agentic Chatbot Architecture

This document outlines the complete architecture, data flow, and memory system for the portfolio chatbot. The system is designed to create a "scarily aware," highly persistent, and human-like AI agent that represents Utkarsh (UT).

---

## 1. Database Architecture: The Two-Table Split

To maintain clean data separation and save space for passive visitors, the data model is split into two tables:

### A. `visitors` (Passive Tracking)
Captures silent analytics. A row is created the moment a user loads the page, regardless of whether they chat.
- **Primary Key:** `id`
- **Unique Key:** `browser_id`
- **Fields:**
  - `ip_address`: Used for cross-device syncing.
  - `visit_count`: Synced across all browsers on the same IP.
  - `locations`: Array of locations identified via Vercel IP headers (e.g., `["Mumbai, IN"]`).
  - `device_info`: Parsed from User-Agent (e.g., `{ device: "Mobile", os: "iOS", browser: "Safari" }`).
  - `referrers`: Array of sources (e.g., `["Instagram", "Direct"]`).
  - `last_session_snapshot`: Live frontend data sent during chat (battery, local time, timezone, etc.).

### B. `visitor_profiles` (Active Chat Memory)
Captures conversational intelligence. A row is ONLY created when the user sends their first chat message.
- **Foreign Key:** `browser_id` (References `visitors.browser_id` on delete cascade)
- **Fields:**
  - `user_name`: Extracted from chat.
  - `memory_json`: Contains the `facts` array (notable things the user revealed).
  - `behavior_profile`: Contains behavioral tags (e.g., "sarcastic", "curious").
  - `archived`: Vault for deleted/forgotten data.

---

## 2. API Data Flow

### The Page Load: `GET /api/chat`
1. The frontend (`ChatBot.tsx`) generates/retrieves a `browserId` from `localStorage`.
2. Frontend calls `GET /api/chat?browserId=...&referrer=...`.
3. **Backend Logic:**
   - Looks up the `visitors` row. If missing, creates it (passive tracking begins).
   - Looks up the `visitor_profiles` row. If missing, it does **not** create it yet.
   - Triggers `updateVisitorEnrichment()` async to save Location, Device, and Referrer without slowing down the page load.
   - If a profile exists with a name and facts, makes a quick LLM call to generate a customized greeting.

### The Chat Message: `POST /api/chat`
1. Frontend gathers the message history + live `deviceContext` (battery, network, local time).
2. Frontend calls `POST /api/chat`.
3. **Backend Logic:**
   - Upserts `visitors` and updates `visit_count` (increments if it's a new session).
   - Ensures `visitor_profiles` exists (creates it now if it didn't).
   - Updates `visitors.last_session_snapshot` async with the live `deviceContext`.
   - Constructs the heavily enriched System Prompt.
   - Calls the LLM (Groq / Llama).
   - Extracts memory markers from the LLM's response.
   - Strips the markers so the user only sees the conversational text.
   - Saves extracted facts/name/behaviors to `visitor_profiles`.

---

## 3. The Prompting Engine

The AI's context is built by combining three major blocks:

### Block 1: Persona
The core personality. It is either loaded dynamically from Supabase (`main_v4` table, `side = 'chatbot'`) or falls back to a hardcoded string instructing the AI to "BE Utkarsh" (first-person, confident, sharp).

### Block 2: Visitor & Live Context
This makes the AI feel psychic. It injects:
- **Stored Profile:** Name, Visit Count, Known Facts, Behaviors.
- **Live Context:** Current Battery %, Network Type, Screen Size, Local Time, Timezone, Device Type, and Referrer.

### Block 3: Marker Extraction Rules
Strict instructions telling the AI to append specific syntax markers to the end of its response.
- `[SET_NAME: X]`
- `[ADD_FACT: X]` (Only for notable moments, opinions, and deep cuts. Not for small talk).
- `[ADD_BEHAVIOR: X]`
- `[REMOVE_FACT: X]` / `[FORGET_ME]`

---

## 4. Cross-Device Identity Syncing (The "Highest Watermark")

The system uses `ip_address` as a soft anchor to link multiple `browser_ids` belonging to the same user.

- **Visit Count Sync:** When `upsertVisitor` runs, it finds the maximum `visit_count` associated with that IP across *all* their browsers. It increments it (if the session is >1 hr old), and then saves that highest number to *every* browser row sharing that IP.
- **Name Sync:** If the user sets their name on their laptop, `updateVisitorName` updates the `user_name` for the laptop's `browser_id`, AND queries all other `browser_ids` on that IP to update their names too.
- **Fact Syncing / Archiving:** Similar logic applies when removing facts or triggering `[FORGET_ME]`.

---

## 5. Archival Strategy (Never Delete)

If the user triggers `[REMOVE_FACT]` or the ultimate `[FORGET_ME]`, data is never actually destroyed.
Instead, the `forgetVisitorCompletely()` and `removeVisitorFact()` functions move the active data out of `memory_json` and `behavior_profile` and append it into the `archived` JSONB column. 

This ensures that while the chatbot "forgets" the data in active conversation (it is no longer passed in the prompt), the historical record of the interaction is preserved for backend analytics.

---

## Appendix: Example Prompt Injection

\`\`\`
VISITOR CONTEXT (from visitors table — passive):
  Visit Count: 4
  Device: Mobile — iOS — Safari
  Location: Mumbai, Maharashtra, IN
  Found via: Instagram

LIVE DEVICE CONTEXT (from browser, real-time):
  Battery: 23% not charging
  Network: 4g
  Local Time: 11:45 PM
  Timezone: Asia/Kolkata

CHAT PROFILE (from visitor_profiles — active):
  Name: Priya
  Facts: [prefers anonymity, lives a simple life]
  Behaviors: [boring as hell, conversational effort is zero]
\`\`\`
