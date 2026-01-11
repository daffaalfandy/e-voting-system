---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments: ['docs/planning-artifacts/prd.md', 'docs/planning-artifacts/ux-design-specification.md', 'docs/planning-artifacts/architecture.md']
---

# e-voting-system - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for e-voting-system, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

*   **FR1 (Kiosk):** The Kiosk can display a persistent "Locked / Waiting" state when no vote is active.
*   **FR2 (Kiosk):** The Kiosk can listen for a real-time "Unlock" signal from the Admin.
*   **FR3 (Kiosk):** The Kiosk can display the 4 Candidates in a grid layout (Photo + Name) upon unlocking.
*   **FR4 (Kiosk):** The Voter can select exactly one candidate by tapping their photo.
*   **FR5 (Kiosk):** The system can prevent "Double Tapping" via a Confirmation Dialog ("Yakin?").
*   **FR6 (Kiosk):** The Kiosk can automatically re-lock itself after a successful vote or timeout (e.g., 2 mins idle).
*   **FR7 (Kiosk):** The Kiosk can display a privacy-safe "Thank You" message before locking.
*   **FR8 (Admin):** The Admin can access the control panel via a secret URL or simple login (Code/Password).
*   **FR9 (Admin):** The Admin can trigger an "Unlock Booth" action for a specific verified voter.
*   **FR10 (Admin):** The Admin can see the real-time status of the booth (Locked, Voting, Done) to manage the queue.
*   **FR11 (Admin):** The Admin CANNOT see who the current voter is selecting (Vote Secrecy).
*   **FR12 (Admin):** The Admin can trigger "End Election" to permanently close voting.
*   **FR13 (Backend):** The System can record each vote anonymously (no user ID attached).
*   **FR14 (Backend):** The System can aggregate total votes for each of the 4 candidates.
*   **FR15 (Kiosk):** The Kiosk can switch to "Results Mode" only after the Election is Ended.
*   **FR16 (Kiosk):** The Results Mode can display a bar chart of the final tally for public viewing.
*   **FR17 (Kiosk):** The Kiosk requires a one-time "Event PIN" upon initial load to authorize the device as a valid voting station.
*   **FR18 (Kiosk):** The Kiosk can display the "Visi & Misi" (Vision & Mission) for each candidate.

### NonFunctional Requirements

*   **NFR1 (Performance):** Unlock Latency < 2 seconds (Admin -> Kiosk).
*   **NFR2 (Interaction):** Visual feedback < 100ms.
*   **NFR3 (Startup):** Cold start < 3 seconds.
*   **NFR4 (Reliability):** 99.9% uptime during 4-hour window.
*   **NFR5 (Recovery):** Restore state immediately on browser refresh.
*   **NFR6 (Security):** Vote Secrecy (unlinked data).
*   **NFR7 (Security):** Admin access via Event Code.
*   **NFR8 (Accessibility):** Large text (>24px), large touch targets (>60px), High Contrast (AAA).
*   **NFR9 (Language):** 100% Bahasa Indonesia.

### Additional Requirements

**From Architecture:**
*   **Framework:** Next.js 14+ (App Router).
*   **Starter Template:** `create-next-app` (Official).
*   **Database:** Firebase Realtime Database (RTDB) for sub-second sync and presence.
*   **Data Model:** Flat JSON (`election_state`, `votes`) to minimize latency.
*   **State Machine:** STRICT states (LOCKED -> READY -> VOTING -> COMPLETED).
*   **Integration:** "Remote Control" pattern (Admin Authority, Kiosk Listener).
*   **Deployment:** Vercel (Singapore region preferred).

**From UX Design:**
*   **Layout:** "No Scroll" rule for Kiosk (Fixed 2x2 Grid).
*   **Responsive:** "Two Faces" strategy (Tablet Kiosk, Mobile Admin).
*   **Design System:** Tailwind CSS + Radix UI Primitives.
*   **Aesthetic:** "Official High-Tech" (Deep Slate, Flag Red, Coblos Green).
*   **Feedback:** "Active Wait" progress bars (no spinners).
*   **Interaction:** 500ms debounce on primary actions.
*   **Audio:** Silent Mode (Visual-only feedback).

### FR Coverage Map

### FR Coverage Map

FR1: Epic 1 - Kiosk Locked State
FR2: Epic 1 - Kiosk Listen for Unlock
FR3: Epic 2 - Kiosk Candidate Grid
FR4: Epic 2 - Voter Selection
FR5: Epic 2 - Double Tap Prevention
FR6: Epic 2 - Auto Relock
FR7: Epic 2 - Thank You Message
FR8: Epic 1 - Admin Access
FR9: Epic 1 - Admin Unlock Trigger
FR10: Epic 1 - Admin Status Monitoring
FR11: Epic 3 - Admin Vote Secrecy (Not seeing selection)
FR12: Epic 3 - End Election Trigger
FR13: Epic 2 - Anonymous Vote Recording
FR14: Epic 3 - Vote Aggregation
FR15: Epic 3 - Results Mode Switch
FR16: Epic 3 - Results Display
FR17: Epic 1 - Kiosk Authorization (PIN)
FR18: Epic 2 - Candidate Visi Misi Display

## Epic List

## Epic List

### Epic 1: System Foundation & "Remote Control" Integration
**Goal:** Establish the core real-time link between Admin and Kiosk to enable the "Committee Remote Control" pattern.
**Value:** Enables the Admin to physically control access to the voting booth, ensuring security and process flow.
**FRs covered:** FR1, FR2, FR8, FR9, FR10, FR17, NFR1, NFR3, NFR4, NFR7.

### Epic 2: The "Voting Booth" Experience (Kiosk)
**Goal:** Allow a verified voter to cast a secure, anonymous vote using a simple, accessible interface.
**Value:** Solves the core user need for a trusted, easy-to-use voting mechanism for all ages.
**FRs covered:** FR3, FR4, FR5, FR6, FR7, FR13, FR18, NFR2, NFR5, NFR6, NFR8, NFR9.

### Epic 3: The "Magic Reveal" (Results & Closing)
**Goal:** Securely close the election and participate in the public reveal of results.
**Value:** Provides immediate transparency and closure to the event, building community trust.
**FRs covered:** FR11, FR12, FR14, FR15, FR16.

### Story 1.1: Project Initialization & Foundation
As a Developer,
I want to initialize the Next.js project with Firebase, Tailwind, and Radix UI,
So that the team has a solid technical foundation to build the Kiosk and Admin apps.

**Acceptance Criteria:**
**Given** a blank environment
**When** I run the initialization script
**Then** I should have a Next.js 14 App Router project running
**And** Firebase SDK should be installed and configured with env vars (`NEXT_PUBLIC_FIREBASE_API_KEY`)
**And** Tailwind CSS should be configured with the "Official" color palette (Deep Slate, etc.)
**And** Radix UI primitives (Dialog) should be installed

### Story 1.2: Kiosk & Admin Authentication (Event PIN)
As an Admin,
I want to secure the Kiosk and Admin app with a shared "Event PIN",
So that unauthorized users cannot access the admin controls or set up a fake kiosk.

**Acceptance Criteria:**
**Given** an unauthenticated user opening the Admin URL
**When** they enter the correct hardcoded "Event PIN"
**Then** they are redirected to the Admin Dashboard and a session cookie is set
**Given** a Kiosk device loading the app for the first time
**When** the officer enters the "Event PIN"
**Then** the device is authorized as a valid Kiosk and enters the "Locked" state
**And** the authorization persists across refreshes

### Story 1.3: Real-Time State Machine (The "Remote Control" Core)
As a Developer,
I want to implement the shared `election_state` listener in Firebase,
So that both Kiosk and Admin are perfectly synchronized in sub-second time.

**Acceptance Criteria:**
**Given** the Firebase Realtime Database
**When** the `status` changes from `LOCKED` to `READY`
**Then** all connected Kiosk clients should receive the update in < 2 seconds
**And** the `useElection` hook should expose methods to `unlockBooth()` and `resetBooth()`
**And** TypeScript interfaces for `ElectionState` should be strictly defined

### Story 1.4: Admin Dashboard UI (Control Panel)
As an Admin,
I want to see the current status of the booth and have a big "Unlock" button,
So that I can manage the voting queue efficiently.

**Acceptance Criteria:**
**Given** the Admin Dashboard
**When** the Kiosk is `LOCKED`
**Then** I see a large "BUKA BILIK" (Unlock) button
**When** I tap "Unlock"
**Then** the status updates to `READY` and the button becomes "MENUNGGU..." (Waiting)
**And** I see a status indicator (Green/Red) reflecting the real-time state

### Story 1.5: Kiosk Screensaver (Locked State)
As a Voter,
I want to see a clear "Wait" screen when the booth is locked,
So that I know I cannot vote yet until the officer lets me in.

**Acceptance Criteria:**
**Given** the Kiosk is in `LOCKED` state
**Then** a full-screen "Screensaver" is displayed
**And** it shows the text "MENUNGGU PETUGAS" (Waiting for Officer)
**And** it listens for the `READY` state to dismiss itself automatically

### Story 2.1: Candidate Grid UI
As a Voter,
I want to see all 4 candidates in a single clean grid,
So that I can scan my options without scrolling.

**Acceptance Criteria:**
**Given** the Kiosk is in `READY` (Unlocked) state
**Then** I see 4 Candidate Cards in a 2x2 grid
**And** each card shows the Photo and Name/Number
**And** the layout fits 100% of the viewport (No Scroll)

### Story 2.2: Vote Interaction & Confirmation
As a Voter,
I want to tap a candidate and confirm my choice,
So that I don't accidentally select the wrong person.

**Acceptance Criteria:**
**Given** I am viewing the Candidate Grid
**When** I tap a candidate
**Then** a Modal Dialog appears showing the selected candidate's big photo
**And** asking "Anda yakin memilih [Name]?" with "Ya" and "Batal" options
**When** I tap "Ya"
**Then** the vote is processed

### Story 2.3: Secure Vote Submission
As a System,
I want to record the vote anonymously to the backend,
So that the election result is preserved.

**Acceptance Criteria:**
**Given** The user tapped "Ya" to confirm
**Then** a new record is pushed to `/votes` path in Firebase
**And** the record contains only `candidate_id`, `timestamp`, and `device_id` (NO user identifiers)
**And** the app transitions to "Thank You" state

### Story 2.4: Success & Auto-Lock
As a Voter,
I want to know my vote was counted and see the screen reset,
So that I can leave the booth confident my duty is done.

**Acceptance Criteria:**
**Given** valid vote submission
**Then** the screen shows "TERIMA KASIH" (Thank You) for 3 seconds
**And** it automatically transitions back to `LOCKED` state
**And** the Admin receives a status update that the booth is now "Done/Locked"

### Story 2.5: Active Wait Visuals
As a Voter,
I want to see a progress bar when the system is working,
So that I know the app hasn't crashed.

**Acceptance Criteria:**
**Given** I confirmed my vote
**Then** a "Simulated" progress bar fills up over 1-2 seconds
**And** it prevents any further interaction during this time

### Story 2.6: Candidate Visi & Misi Detail
As a Voter,
I want to see the "Visi & Misi" of a candidate,
So that I can make an informed decision if I forgot who is who.

**Acceptance Criteria:**
**Given** I am in the confirmation dialog (or detail view)
**Then** I can see a "Lihat Visi Misi" section or button
**When** accessible, it displays the text clearly without breaking the "No Scroll" main page rule (e.g., inside the Modal)
### Story 3.1: Admin "End Election" Trigger
As an Admin,
I want to permanently close the election and reveal the results,
So that the event can conclude and the winner can be announced.

**Acceptance Criteria:**
**Given** the Admin Dashboard
**Then** I see a "AKHIRI PEMILIHAN" (End Election) button (distinct from Unlock)
**When** I tap it
**Then** a serious Confirmation Dialog appears ("Tindakan ini tidak dapat dibatalkan. Tampilkan Hasil?")
**When** I confirm "Ya"
**Then** the `election_state` status updates to `COMPLETED`
**And** the Admin UI updates to indicate "Election Closed"

### Story 3.2: Results Calculation & Aggregation
As a System,
I want to tally the votes accurately from the raw data,
So that the correct winner is identified.

**Acceptance Criteria:**
**Given** the `COMPLETED` state
**Then** the client retrieves all records from `/votes`
**And** aggregates the count by `candidate_id`
**And** handles cases with 0 votes correctly
**And** ensures the integrity of the count (e.g. no double-counting)

### Story 3.3: Public Result Display (The Magic Reveal)
As a Community Member,
I want to see the results appear on the big screen (Kiosk),
So that we can all celebrate the winner together.

**Acceptance Criteria:**
**Given** the Kiosk receives the `COMPLETED` signal
**Then** it transitions to "Results Mode"
**And** displays a clearly readable Bar Chart of the 4 candidates
**And** the winner is visually highlighted
**And** the Total Vote Count is displayed
**And** the UI prevents any further voting
