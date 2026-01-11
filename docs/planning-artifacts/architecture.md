---
stepsCompleted: [step-01-init, step-02-context]
inputDocuments: ['docs/planning-artifacts/prd.md', 'docs/planning-artifacts/ux-design-specification.md']
workflowType: 'architecture'
project_name: 'e-voting-system'
user_name: 'Daffaalfandy'
date: '2026-01-11'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
*   **Remote Control Mechanics:** One-way command flow (Admin -> Kiosk) with bidirectional status updates (Kiosk -> Admin).
*   **Strict State Machine:** The application state (LOCKED/READY/VOTING/DONE) must be synchronized globally.
*   **Anonymous Voting:** Vote writes must be unlinked from the "Unlock" transaction log for privacy.

**Non-Functional Requirements:**
*   **Latency:** Sub-2-second sync required for the "Handoff" moment.
*   **Uptime:** 4-hour critical window with no tolerance for "cold starts" during the vote.
*   **Access:** Zero-login for voters vs. Secure Code for Admin.

**Scale & Complexity:**
*   **Primary Domain:** Real-time Single Page Application (SPA).
*   **Complexity:** Low code volume, but Medium interaction criticality.
*   **Components:** 2 Frontends (Kiosk/Admin) sharing 1 Real-time Data Source.

### Technical Constraints & Dependencies
*   **Framework:** Next.js (React) is requested.
*   **Infrastructure:** Serverless / Edge preferred (Vercel).
*   **Connectivity:** Must handle "flaky 4G" gracefully (Optimistic UI updates).

### Cross-Cutting Concerns
*   **Global State Sync:** Handling "race conditions" where two admins might try to unlock, or network latency causes state drift.

## Frontend Strategy & Tech Stack

### Framework Selection
*   **Decision:** **Next.js 14+ (App Router)**
*   **Rationale:**
    *   **Server Components:** Efficient initial load for the Kiosk.
    *   **Routing:** File-system based routing simplifies the Kiosk/Admin split (`/admin` vs `/`).
    *   **Ecosystem:** Robust Vercel integration for zero-config deployment.

### Starter Template
*   **Selected Template:** `create-next-app` (Official)
*   **Configuration:**
    *   TypeScript: **Yes** (Strict type safety for state machines)
    *   Tailwind CSS: **Yes** (Matching our design system)
    *   ESLint: **Yes**
    *   App Router: **Yes**
    *   `src/` directory: **Yes**

### Database & Real-time Strategy
*   **Primary Database:** **Firebase Realtime Database (RTDB)**
*   **Rationale:**
    *   **Latency:** Websocket-first architecture ideal for sub-second "Remote Control" signal.
    *   **Presence:** Native support for "online/offline" presence detection (crucial for Admin seeing if Kiosk is ready).
    *   **Simplicity:** JSON tree structure fits perfectly with our "State Machine" model.
    *   **Cost:** Generous free tier.

### Component Architecture
*   **Headless:** Radix UI (Primitives for Dialogs, Accessibility)
*   **Styling:** Tailwind CSS (Custom "Official" and "Dignified" themes)
*   **Icons:** Lucide React

## Integration Strategy: The "Remote Control" Pattern

### Data Schema (Firebase RTDB)
We will use a flat, simplified data structure to minimize latency.

```json
{
  "election_state": {
    "status": "LOCKED | READY | VOTING | COMPLETED",
    "last_updated": 1704940000000,
    "session_id": "uuid-v4-string" // Prevents stale command replays
  },
  "votes": {
    "$vote_id": {
      "candidate_id": "candidate_1",
      "timestamp": 1704940000000,
      "device_id": "kiosk_01"
    }
  },
  "admin_presence": {
    "is_online": true,
    "last_seen": 1704940000000
  }
}
```

### State Machine Logic
The system relies on a **Optimistic Client-Authority** model for the Voting step to ensure responsiveness, safeguarded by Admin oversight.

| State | Kiosk UI | Admin UI | Transition Trigger |
| :--- | :--- | :--- | :--- |
| **LOCKED** | "Waiting for Officer" (Screensaver) | "Unlock Booth" Button | Admin taps "Unlock" |
| **READY** | "Touch to Start" / Ballot | "Voter in Booth..." (Monitoring) | Admin writes `status: READY` |
| **VOTING** | Candidate Selection Grid | "Voter is selecting..." | Voter interaction |
| **COMPLETED** | "Thank You" (Auto-dismiss) | "Vote Cast!" -> "Next Voter" | Voter confirms selection |

### Integration Flow
1.  **Unlock:** Admin generates a new `session_id`, sets `status: READY`.
2.  **Poll:** Kiosk listens to `election_state`. Detects change -> Wakes up.
3.  **Vote:** Voter selects candidate. Kiosk:
    *   1. Writes vote to `/votes`.
    *   2. (Optional) Updates `status: LOCKED` immediately to prevent double-voting?
    *   *Refinement:* To ensure "One Person One Vote", the Kiosk will immediately transition itself to a "Done" local state and ignore further inputs. Ideally, it writes `status: LOCKED` back to Firebase to signal completion to all listeners.
4.  **Reset:** Admin sees status revert to `LOCKED` (or sees Vote Count increment) and prepares for next voter.

## Security & Deployment

### Firestore / RTDB Rules
*   **elections/state:** Read: All, Write: Admin Only (Kiosk can strictly transition Ready->Locked?)
    *   *Simplification:* Admin is the strict authority. Kiosk listens. Kiosk writes to `/votes` only. Admin resets state after observing vote?
    *   *Decision:* For MVP, **Admin controls state**. Kiosk simply writes the vote. Admin app observes the `/votes` collection change (count increases) and manually or auto-resets state if needed, OR Admin allows the "Next Voter" which overwrites the state.
*   **votes/:** Create: All (Anonymous), Read: Admin, Update/Delete: None.

### Deployment (Vercel)
*   **Build Command:** `next build`
*   **Environment Variables:** `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.
*   **Region:** Singapore (sin1) or nearest to user for lowest latency.
