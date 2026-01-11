---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
inputDocuments: ['docs/analysis/brainstorming-session-2026-01-11.md']
workflowType: 'prd'
lastStep: 0
---

# Product Requirements Document - e-voting-system

**Author:** Daffaalfandy
**Date:** 2026-01-11

## Executive Summary

We are building a lightweight, one-time use "Digital Polling Booth" for an RT Chairman election. Ideally suited for neighborhood environments where community trust and simplicity are paramount, this system replaces paper ballots with a zero-cost digital kiosk. It ensures a strict "one-person-one-vote" process through physical verification and digital unlocking, without compromising the secrecy of the individual ballot.

### What Makes This Special

The **"Committee Remote Control"** pattern is the core innovation. It solves the "Double Voting" problem by requiring an admin to physically verify a voter and remotely unlock the booth for a single session. Crucially, while the admin controls *access*, the architecture ensures **Vote Secrecy**: the admin cannot see the voter's choice, only the final tallied results. This balances the strict accountability needed for an election with the technical simplicity and zero-cost requirement of a one-time event.

## Project Classification

**Technical Type:** Web Application (Next.js + Firebase)
**Domain:** GovTech (Civic/Voting)
**Complexity:** Low (Focused on Simplicity & Reliability for limited scale)
**Project Context:** Greenfield - new project

**Classification Notes:**
This project specifically targets a "Low-Tech, High-Trust" environment. Unlike national elections requiring complex crypto-verification, this system relies on the physical presence of the committee for identity verification, allowing the software to remain simple, fast, and robust against basic internet flakiness.

## Success Criteria

### User Success

*   **For Voters (Simplicity):** "I walked up to the laptop, saw the candidates' photos, clicked one, confirmed, and was done in under 30 seconds."
*   **For Committee (Control & Integrity):** "I unlocked the booth for each voter from my phone easily. I could NOT see the running tally during the voting process (preserving secrecy), but the moment I closed the election, the final results were instantly available and accurate."
*   **Localization:** All interfaces, instructions, and buttons are in **Bahasa Indonesia** to ensure accessibility for all community members.

### Business / Event Success

*   **Zero Cost & Efficiency:** The entire event runs on $0 infrastructure. The voting line moves fast (target < 1 minute per voter).
*   **100% Integrity:** No double votes (prevented by architecture) and no secrecy breaches (prevented by UI logic). 0 disputes.

### Technical Success

*   **Reliability:** The Kiosk state syncs with the Admin's "Unlock" command in < 2 seconds.
*   **Security:** The Kiosk automatically locks immediately after a vote is cast, ensuring the next person in line cannot vote until the Committee re-verifies them.

### Measurable Outcomes

*   **Transaction Time:** Average Time-To-Vote < 30 seconds.
*   **Error Rate:** 0 incidents of "stuck" kiosk requiring page refresh.
*   **Cost:** Rp 0.

## Product Scope

### MVP - Minimum Viable Product

*   **Admin App (Mobile Web):**
    *   Simple Login.
    *   **"Unlock Booth" Button:** Sets kiosk state to ready.
    *   **"End Election" Button:** Permanently closes voting and reveals the Results Dashboard.
*   **Kiosk App (Laptop Web):**
    *   **Locked State:** "Waiting for Committee..."
    *   **Voting State:** Candidate Grid (Photos + Names) -> Confirm Dialog.
    *   **Success State:** "Thank You" (Auto-locks after 3s).
    *   **Language:** 100% Bahasa Indonesia.
*   **Backend:**
    *   Firebase implementation for real-time state sync and secure vote storage.

### Growth Features (Post-MVP)
*   *None.* This is a strict one-time use tool.

### Vision (Future)
*   Potentially reusable for future RT elections if successful, but strictly kept simple.

## User Journeys

### Journey 1: Pak Budi's 30-Second Vote (The Happy Voter)
Pak Budi walks up to the voting station. He greets Bu Sari, who unlocks the booth. He approaches the "Bilik Suara" (laptop), which currently displays "Waiting for Committee...".
Suddenly, the screen changes to **display the 4 candidates** with large, clear photos and names. Pak Budi taps the photo of Candidate #3. A confirmation dialog appears: "Anda yakin memilih Calon #3?". He taps "Ya, Yakin".
The screen says "Terima Kasih!" and auto-locks. The whole process took 20 seconds.

### Journey 2: Bu Sari's Stress-Free Control (The Committee Admin)
Bu Sari manages the line using her phone to "Unlock" the booth for each voter. She uses the yellow "Voting in Progress" status to know when the booth is occupied without peeking.
At 1:00 PM, voting closes. She gathers the witnesses and taps **"Akhiri Pemilihan"** (End Election) on her phone.
**The Magic Moment:** Instantly, the Kiosk Laptop (which was just a voting booth) **transforms into a Result Dashboard**. The screen displays a clear bar chart of the 4 candidates. The voters gathered around can see the results immediately and transparently on the big screen, cheering for the winner.

### Journey Requirements Summary

*   **Voter Interface:**
    *   **Grid for exactly 4 Candidates.**
    *   Real-time state listening (Locked vs. Voting vs. **Results Mode**).
    *   Simple "Tap-to-Select" interaction.
    *   Confirmation Dialog.
    *   Auto-reset timer after success.
*   **Admin Interface:**
    *   One-tap "Unlock" capability.
    *   Real-time status feedback (Ready, Voting, Done).
    *   **"Show Results" trigger:** Pushes the result view to the public Kiosk screen.
*   **System Core:**
    *   Sub-second latency between Admin Unlock and Kiosk update.
    *   Strict state management (One unlock = One vote).

## Innovation & Novel Patterns

### Detected Innovation Areas

**The "Committee Remote Control" Pattern**
Unlike traditional e-voting which relies on digital identity (usernames/tokens), this system relies on **Physical Identity + Digital Access Control**.
*   **Concept:** The Admin's phone acts as the "Key" to the "Lock" (the Laptop Kiosk).
*   **Novelty:** It decouples *authentication* (Human Committee) from *authorization* (Digital Unlock signal), eliminating the need for voter accounts or specialized hardware.

### Market Context & Competitive Landscape

*   **Google Forms/Survey Apps:** Require users to have accounts or accounts for duplicate protection (unsafe) or have no protection (double voting risk).
*   **Professional E-Voting (e.g., ElectionBuddy):** Too expensive and complex for a neighborhood RT election.
*   **Paper Ballots:** Secure but slow, manual counting errors, no "instant result" excitement.
*   **e-voting-system:** The "Goldilocks" solution — fast, free, secure enough, and exciting.

### Validation Approach

*   **Latency Test:** Ensure the "Unlock" signal travels from Phone -> Firebase -> Laptop in < 2 seconds on 4G.
*   **Concurrency Test:** Ensure two admins unlocking simultaneously doesn't break the state (though typically strictly serial).

### Risk Mitigation

*   **Risk:** Internet failure breaks the "Unlock" capability.
*   **Mitigation:** The system is "Lightweight Online" - it works fine on a standard mobile hotspot tethering.

## Web Application Specific Requirements

### Project-Type Overview
A specialized Single Page Application (SPA) built with Next.js, optimized for two distinct viewports: a fixed-resolution "Kiosk" mode for Laptops (Voters) and a responsive Mobile mode for Phones (Committee).

### Technical Architecture Considerations
*   **Framework:** Next.js (React) to prevent full page reloads and ensure smooth "Unlock" transitions.
*   **Real-time Engine:** Firebase Realtime Database / Firestore to push state changes instantly.
*   **Hosting:** Vercel (Free Tier) for zero-configuration global CDN delivery.

### Browser & Device Matrix
*   **Kiosk Device (Voting Station):**
    *   **Hardware:** Mid-range Laptop (Windows/Mac).
    *   **Browser:** Modern Chrome or Edge (latest 2 versions).
    *   **Resolution:** Optimized for 1366x768 and above.
*   **Admin Device (Committee):**
    *   **Hardware:** Any Smartphone (iOS/Android) or Laptop.
    *   **Browser:** Modern Mobile Chrome, Safari, or Edge.

### Performance Targets
*   **State Latency:** The critical "Unlock" signal from Admin Phone to Kiosk Laptop must execute in **under 2 seconds**.
*   **Interaction:** Candidate selection must feel instant (< 100ms visual response).

### SEO Strategy
*   **Private Application:** `robots.txt` set to `Disallow: /`. Meta tags `noindex, nofollow` to prevent accidental public discovery.

### Accessibility Level
*   **Visual Priority:** High contrast, large fonts (>16px), and clear, uncropped candidate photos are prioritized over screen-reader compliance (due to human assistance availability).
*   **Language:** 100% Bahasa Indonesia.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** **The "1-Day MVP"**
We are building for a single event on a specific date. Any feature not critical to the success of that 4-hour window is cut. The philosophy is "Robust Simplicity"—it must work perfectly once.

**Resource Requirements:**
*   **Team:** 1 Solo Full-Stack Developer.
*   **Time:** < 1 Week.
*   **Budget:** $0 (Free Tier).

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
*   **Pak Budi (Voter):** "Walk up, Vote, Leave" (30s flow).
*   **Bu Sari (Committee):** "Unlock, Monitor, Close" (Control flow).

**Must-Have Capabilities:**
*   **Auth (Admin):** Simple hardcoded/env-var authentication for the Committee Dashboard.
*   **Kiosk State Machine:** Locked -> Unlocked -> Voting -> Done -> Locked.
*   **Remote Signal:** Sub-second latency trigger from Admin -> Kiosk.
*   **Vote Storage:** secure, anonymous (no user ID attached to vote).
*   **Result Visualization:** Bar chart revealed only on "End Election".

### Post-MVP Features

**Phase 2 (Deprioritized):**
*   **SaaS-ification:** Multi-tenancy to allow other RTs to sign up and run their own elections.
*   **Voter Accounts:** Email/OTP login for remote voting (if physical gathering is banned).
*   *Note:* It is highly likely this project stops at Phase 1.

### Risk Mitigation Strategy

*   **Technical Risks:** One laptop dying. **Mitigation:** The system is just a URL. Open it on *any* backup laptop/phone immediately.
*   **Market Risks:** Voters rejecting the tech. **Mitigation:** The UI mimics a paper ballot simplicity (Big photos).
*   **Resource Risks:** Running out of dev time. **Mitigation:** Cut everything else (candidate bios, animations) to ensure the "Unlock -> Vote" loop works.

## Functional Requirements

### FR Area 1: Voting Station (Kiosk) Capabilities
*   **FR1:** The Kiosk can display a persistent "Locked / Waiting" state when no vote is active.
*   **FR2:** The Kiosk can listen for a real-time "Unlock" signal from the Admin.
*   **FR3:** The Kiosk can display the 4 Candidates in a grid layout (Photo + Name) upon unlocking.
*   **FR4:** The Voter can select exactly one candidate by tapping their photo.
*   **FR5:** The system can prevent "Double Tapping" via a Confirmation Dialog ("Yakin?").
*   **FR6:** The Kiosk can automatically re-lock itself after a successful vote or timeout (e.g., 2 mins idle).
*   **FR7:** The Kiosk can display a privacy-safe "Thank You" message before locking.

### FR Area 2: Committee Control (Admin) Capabilities
*   **FR8:** The Admin can access the control panel via a secret URL or simple login (Code/Password).
*   **FR9:** The Admin can trigger an "Unlock Booth" action for a specific verified voter.
*   **FR10:** The Admin can see the real-time status of the booth (Locked, Voting, Done) to manage the queue.
*   **FR11:** The Admin CANNOT see who the current voter is selecting (Vote Secrecy).
*   **FR12:** The Admin can trigger "End Election" to permanently close voting.

### FR Area 3: Results & Data
*   **FR13:** The System can record each vote anonymously (incrementing a counter or adding a hash).
*   **FR14:** The System can aggregate total votes for each of the 4 candidates.
*   **FR15:** The Kiosk can switch to "Results Mode" only after the Election is Ended.
*   **FR16:** The Results Mode can display a bar chart of the final tally for public viewing.

## Non-Functional Requirements

### Performance
*   **NFR1 (Unlock Latency):** The time from Admin pressing "Unlock" to the Kiosk becoming active must be **under 2 seconds** (on 4G/LTE).
*   **NFR2 (Vote Interaction):** Tapping a candidate photo must show visual feedback (highlight/border) in **under 100ms**.
*   **NFR3 (Cold Start):** The application must load and become interactive in **under 3 seconds** on the Kiosk laptop.

### Reliability & Uptime
*   **NFR4 (Zero Downtime Window):** The system must maintain 99.9% availability during the specific 4-hour voting window (e.g., 09:00 - 13:00).
*   **NFR5 (State Recovery):** If the browser accidentally closes, re-opening the URL must recover the last known state (Locked/Unlocked) immediately.

### Security
*   **NFR6 (Vote Secrecy):** The database structure must NOT link a specific vote to a specific timestamp/ID in a way that the Committee could "guess" who voted.
*   **NFR7 (Admin Access):** The Admin Dashboard must be protected by a hardcoded "Event Code" preventing public access.

### Usability & Accessibility
*   **NFR8 (Elderly Visibility):** All candidate names must be at least **24px font size**, and buttons must have a touch target of at least **60x60px**.
*   **NFR9 (Language):** All instructions must be in clear, non-technical **Bahasa Indonesia** (e.g., "Masuk" instead of "Login", "Buka" instead of "Unlock").
