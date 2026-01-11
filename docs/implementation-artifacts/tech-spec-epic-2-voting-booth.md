---
title: 'Epic 2: Voting Booth Experience'
slug: 'epic-2-voting-booth'
created: '2026-01-11'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - 'Next.js 14 (App Router, src/ directory)'
  - 'Firebase Realtime Database (client-side SDK)'
  - 'TypeScript (strict mode)'
  - 'Tailwind CSS (custom design tokens)'
  - 'Radix UI Dialog (already installed)'
  - 'Lucide React (icons)'
  - 'Inter font (Google Fonts)'
files_to_modify:
  # Existing files to modify
  - 'src/app/page.tsx'
  - 'src/hooks/useElection.ts'
  # New files to create
  - 'src/types/candidate.ts'
  - 'src/data/candidates.ts'
  - 'src/components/CandidateCard.tsx'
  - 'src/components/CandidateGrid.tsx'
  - 'src/components/VoteConfirmModal.tsx'
  - 'src/components/ThankYouScreen.tsx'
  - 'src/components/ProgressBar.tsx'
  - 'src/hooks/useVote.ts'
  - 'src/hooks/useDeviceId.ts'
  # Static assets
  - 'public/candidates/candidate_1.jpeg'
  - 'public/candidates/candidate_2.jpeg'
  - 'public/candidates/candidate_3.jpeg'
  - 'public/candidates/placeholder.svg'
code_patterns:
  - 'State hook pattern: useElection() returns { state, loading, error, methods }'
  - 'Firebase updates: set() with last_updated + session_id refresh'
  - 'Component styling: Tailwind with design tokens (deep-slate, paper-white, etc.)'
  - 'Variant pattern: VARIANT_STYLES object lookup for styling'
  - 'Page structure: Conditional rendering based on state.status'
  - 'Touch accessibility: min-h-touch (60px) for all interactive elements'
  - 'Firebase safety: null check before database operations'
test_patterns:
  - 'Manual testing with two browser windows (Kiosk + Admin)'
  - 'Firebase Console verification for /votes records'
  - 'No automated tests for MVP (Vitest available for future)'
---

# Tech-Spec: Epic 2 - Voting Booth Experience

**Created:** 2026-01-11

## Overview

### Problem Statement

We need to build the complete voting interface for the Kiosk that allows a verified voter to view candidates, select one, confirm their choice, and submit an anonymous vote. The interface must be accessible to all ages (large text, touch-friendly), display candidate information (including Visi & Misi), prevent accidental double-taps, and automatically lock after a successful vote.

### Solution

Implement a 2x2 candidate grid in the Kiosk's `READY` state, with candidate data hardcoded in the component. Tapping a candidate opens a Radix UI modal showing an enlarged photo, name, and expandable Visi & Misi section. After confirmation ("Ya"), the vote is anonymously submitted to Firebase (no user ID, only `candidate_id`, `timestamp`, `device_id`), a progress bar plays for UX feedback, the "Terima Kasih" screen displays for 3 seconds, then the state auto-resets to `LOCKED`.

### Scope

**In Scope:**
- Story 2.1: Candidate Grid UI (2x2 grid, Photo + Name, fits 100% viewport)
- Story 2.2: Vote Interaction & Confirmation (Radix modal with "Yakin?" dialog)
- Story 2.3: Secure Vote Submission (anonymous Firebase write to `/votes`)
- Story 2.4: Success & Auto-Lock ("Terima Kasih" + 3-second delay + auto `LOCKED`)
- Story 2.5: Active Wait Visuals (simulated progress bar during submission)
- Story 2.6: Candidate Visi & Misi Detail (expandable accordion in confirmation modal)
- Candidate photos stored in `/public/candidates/`
- Generic avatar/silhouette for placeholder candidate (Mas Prayit)
- Device ID stored in `localStorage` for anonymous vote tracking

**Out of Scope:**
- Idle timeout auto-lock (2 min) — only auto-lock after successful vote
- Results display (Epic 3)
- Admin "End Election" feature (Epic 3)
- Firebase-based candidate data storage (hardcoded for simplicity)
- Production deployment and security rules

## Context for Development

### Technical Preferences & Constraints

- **Candidate Data:** Hardcoded in TypeScript file (one-time election, no CMS needed)
- **Image Storage:** `/public/candidates/` for Next.js static serving
- **Placeholder Strategy:** Generic silhouette avatar for Mas Prayit
- **Visi & Misi Display:** Inside confirmation modal (respects "No Scroll" rule)
- **Device ID:** `localStorage` key `device_id` with persistent UUID
- **No Idle Timeout:** Admin manually locks if needed; auto-lock only after vote

### Codebase Patterns

**Existing patterns from Epic 1 to follow:**

| Pattern | Convention |
|---------|------------|
| **Directory Structure** | `src/app/` routes, `src/components/` UI, `src/hooks/` hooks, `src/types/` types |
| **Firebase Operations** | Client-side `firebase/database` with `ref()`, `push()`, `set()` |
| **State Management** | `useElection` hook for real-time state; add `useVote` for submission |
| **Design Tokens** | Tailwind custom colors: `deep-slate`, `indonesian-red`, `coblos-green`, `paper-white` |
| **Touch Targets** | `min-h-touch` (60px minimum) for all interactive elements |
| **Typography** | 24px+ body text, 32px+ candidate names, Inter font |
| **Modals** | Radix UI `@radix-ui/react-dialog` (already installed) |

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `docs/planning-artifacts/epics.md` | Story acceptance criteria (Stories 2.1-2.6) |
| `docs/candidates.md` | Candidate data (names, visi, misi, photo paths) |
| `docs/planning-artifacts/ux-design-specification.md` | Design tokens, "No Scroll" rule, interaction patterns |
| `docs/planning-artifacts/architecture.md` | Firebase `/votes` schema |
| `src/hooks/useElection.ts` | Existing election state hook to extend |
| `src/components/BigButton.tsx` | Existing button component to reuse |

### Anchor Points (from Investigation)

**`src/app/page.tsx`** - Main Kiosk page:
- Lines 38-49: `READY` state placeholder → **Replace with CandidateGrid component**
- Lines 27-36: `LOCKED` state → **No changes needed**
- Missing: `VOTING` state handling → **Add VOTING state with ProgressBar/ThankYou**
- Uses: `useKioskAuth`, `useElection`, `StatusBanner`

**`src/hooks/useElection.ts`** - Election state management:
- Line 42-43: `unlockBooth()`, `lockBooth()` methods → **Add `setVoting()` method**
- Line 30-39: `updateStatus()` pattern → **Reuse for VOTING transition**
- Returns: `{ state, loading, error, unlockBooth, lockBooth, updateStatus }`

**`src/types/election.ts`** - TypeScript types:
- Line 1: `ElectionStatus` includes `'VOTING'` ✅ Already defined
- Lines 9-13: `Vote` interface ✅ Already defined with `candidate_id`, `timestamp`, `device_id`

**`src/lib/firebase.ts`** - Firebase client:
- Exports: `database` for Firebase operations
- Includes null safety checks for SSR

**`src/components/BigButton.tsx`** - Button component:
- Variants: `primary`, `success`, `danger` → **Reuse for "Ya"/"Batal" buttons**
- Pattern: `VARIANT_STYLES` object lookup

### Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Hardcoded candidate data** | Simplest solution for one-time election; no CMS complexity |
| **`/public/candidates/`** | Standard Next.js static assets; no Firebase Storage cost |
| **Generic avatar placeholder** | Avoids blocking development; easily replaceable |
| **Visi & Misi in modal** | Respects "No Scroll" rule on main grid; contained UX |
| **localStorage device ID** | Persistent across sessions; consistent vote attribution |
| **Skip idle timeout** | MVP simplification; Admin can manually lock |
| **500ms debounce on confirm** | UX spec requirement to prevent double-tap |
| **1-2 second progress bar** | "Active Wait" pattern from UX spec |

## Implementation Plan

### Tasks

#### Phase 1: Foundation & Data Layer (Story 2.1 prep)

- [ ] **Task 1: Create Candidate Type Definition**
  - **File:** `src/types/candidate.ts`
  - **Action:** Create new file with `Candidate` interface:
    ```typescript
    export interface Candidate {
      id: string;           // e.g., "candidate_1"
      number: number;       // Display number (1-4)
      name: string;         // e.g., "Mas Ucup"
      photo: string;        // Path: "/candidates/candidate_1.jpeg"
      visi: string;         // Vision statement
      misi: string[];       // Array of mission points
    }
    ```
  - **Notes:** Keep it simple; array for misi to handle bullet points.

- [ ] **Task 2: Create Hardcoded Candidate Data**
  - **File:** `src/data/candidates.ts`
  - **Action:** Create new file with candidate data from `docs/candidates.md`:
    ```typescript
    import { Candidate } from '@/types/candidate';
    
    export const CANDIDATES: Candidate[] = [
      {
        id: 'candidate_1',
        number: 1,
        name: 'Mas Ucup',
        photo: '/candidates/candidate_1.jpeg',
        visi: 'RT yang harmonis, sejahtera, dan gotong royong.',
        misi: [
          'Pelayanan cepat dan transparan untuk warga.',
          'Perkuat gotong royong dan kerja bakti.',
          'Dukung kegiatan sosial dan keagamaan.',
          'Tingkatkan keamanan dan kebersihan lingkungan.',
        ],
      },
      // ... remaining 3 candidates
    ];
    ```
  - **Notes:** Use placeholder image path for Mas Prayit: `/candidates/placeholder.svg`

- [ ] **Task 3: Create Device ID Hook**
  - **File:** `src/hooks/useDeviceId.ts`
  - **Action:** Create hook that generates/retrieves persistent device UUID:
    ```typescript
    import { useState, useEffect } from 'react';
    
    const DEVICE_ID_KEY = 'device_id';
    
    export function useDeviceId() {
      const [deviceId, setDeviceId] = useState<string>('');
      
      useEffect(() => {
        let id = localStorage.getItem(DEVICE_ID_KEY);
        if (!id) {
          id = crypto.randomUUID();
          localStorage.setItem(DEVICE_ID_KEY, id);
        }
        setDeviceId(id);
      }, []);
      
      return deviceId;
    }
    ```
  - **Notes:** Returns empty string during SSR; safe to use in client components.

- [ ] **Task 4: Create Placeholder Image Asset**
  - **File:** `public/candidates/placeholder.svg`
  - **Action:** Create SVG placeholder silhouette (simple user avatar shape):
    - Gray background (#E2E8F0)
    - White silhouette icon
    - Dimensions: 400x400px (square, matches photo aspect)
  - **Notes:** Creates `public/candidates/` directory if it doesn't exist.

#### Phase 2: Candidate Grid UI (Story 2.1)

- [ ] **Task 5: Create CandidateCard Component**
  - **File:** `src/components/CandidateCard.tsx`
  - **Action:** Create touchable candidate card:
    ```typescript
    interface CandidateCardProps {
      candidate: Candidate;
      onSelect: (candidate: Candidate) => void;
    }
    ```
    - Full card is clickable (min-h-touch)
    - Photo displayed with `next/image` or `<img>` with object-cover
    - Candidate number badge in corner
    - Name displayed below photo (text-2xl font-bold)
    - Hover/active states with ring highlight (ring-coblos-green)
    - 500ms debounce on click via disabled state
  - **Notes:** Card should fill its grid cell; photo aspect ratio preserved.

- [ ] **Task 6: Create CandidateGrid Component**
  - **File:** `src/components/CandidateGrid.tsx`
  - **Action:** Create 2x2 grid container:
    ```typescript
    interface CandidateGridProps {
      onSelectCandidate: (candidate: Candidate) => void;
    }
    ```
    - Import `CANDIDATES` from data layer
    - CSS Grid: `grid-cols-2 grid-rows-2`
    - `h-full` to fill available viewport (below StatusBanner)
    - Gap between cards: `gap-4` or `gap-6`
    - Padding: `p-4` or `p-6`
  - **Notes:** Grid must fit 100% viewport without scrolling.

#### Phase 3: Vote Confirmation Modal (Story 2.2 + Story 2.6)

- [ ] **Task 7: Create VoteConfirmModal Component**
  - **File:** `src/components/VoteConfirmModal.tsx`
  - **Action:** Create Radix Dialog modal:
    ```typescript
    interface VoteConfirmModalProps {
      candidate: Candidate | null;
      isOpen: boolean;
      onConfirm: () => void;
      onCancel: () => void;
      isSubmitting: boolean;
    }
    ```
    - Radix `Dialog.Root`, `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`
    - Large candidate photo (centered, prominent)
    - "Anda yakin memilih [Name]?" text (text-2xl)
    - Expandable "Lihat Visi & Misi" section (accordion pattern):
      - Collapsed by default
      - Toggle button with ChevronDown/ChevronUp icon
      - Visi heading + text
      - Misi as bullet list
    - Two buttons: "YA, SAYA YAKIN" (success variant) and "BATAL" (danger variant)
    - Disable buttons when `isSubmitting=true`
    - Modal should prevent background scroll
  - **Notes:** All text in Bahasa Indonesia. Use BigButton component for consistency.

- [ ] **Task 8: Add setVoting Method to useElection**
  - **File:** `src/hooks/useElection.ts`
  - **Action:** Add new method after `lockBooth`:
    ```typescript
    const setVoting = () => updateStatus('VOTING');
    
    return { state, loading, error, unlockBooth, lockBooth, setVoting, updateStatus };
    ```
  - **Notes:** Used when user confirms vote before submission starts.

#### Phase 4: Vote Submission (Story 2.3)

- [ ] **Task 9: Create useVote Hook**
  - **File:** `src/hooks/useVote.ts`
  - **Action:** Create vote submission hook:
    ```typescript
    import { ref, push } from 'firebase/database';
    import { database } from '@/lib/firebase';
    import { Vote } from '@/types/election';
    
    export function useVote() {
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [error, setError] = useState<Error | null>(null);
      
      const submitVote = async (candidateId: string, deviceId: string): Promise<boolean> => {
        if (!database) throw new Error('Firebase not initialized');
        
        setIsSubmitting(true);
        setError(null);
        
        try {
          const votesRef = ref(database, 'votes');
          const vote: Vote = {
            candidate_id: candidateId,
            timestamp: Date.now(),
            device_id: deviceId,
          };
          await push(votesRef, vote);
          return true;
        } catch (err) {
          setError(err as Error);
          return false;
        } finally {
          setIsSubmitting(false);
        }
      };
      
      return { submitVote, isSubmitting, error };
    }
    ```
  - **Notes:** Uses `push()` for auto-generated keys. NO user identifiers in vote record.

#### Phase 5: Success & Auto-Lock (Story 2.4 + Story 2.5)

- [ ] **Task 10: Create ProgressBar Component**
  - **File:** `src/components/ProgressBar.tsx`
  - **Action:** Create animated progress bar:
    ```typescript
    interface ProgressBarProps {
      duration?: number; // milliseconds, default 1500
    }
    ```
    - Full-width bar with height ~8px
    - Background: `bg-slate-200`
    - Fill: `bg-coblos-green` with CSS transition/animation
    - Animation: 0% to 100% width over `duration`
    - Use CSS `@keyframes` or Tailwind `animate-` class
  - **Notes:** Purely visual "Active Wait" - not tied to actual network latency.

- [ ] **Task 11: Create ThankYouScreen Component**
  - **File:** `src/components/ThankYouScreen.tsx`
  - **Action:** Create success screen:
    ```typescript
    interface ThankYouScreenProps {
      onComplete: () => void; // Called after display duration
      duration?: number;      // milliseconds, default 3000
    }
    ```
    - Full screen with `bg-coblos-green`
    - Large check icon (Lucide `CheckCircle2` or similar)
    - "TERIMA KASIH" text (text-4xl font-bold text-white)
    - "Suara Anda telah tercatat" subtext
    - `useEffect` with `setTimeout` to call `onComplete` after duration
  - **Notes:** Clean, celebratory design. Auto-transitions after timeout.

#### Phase 6: Page Integration (All Stories)

- [ ] **Task 12: Create Voting Flow State Machine in page.tsx**
  - **File:** `src/app/page.tsx`
  - **Action:** Add local state for voting flow:
    ```typescript
    // Add state for voting flow
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    ```
  - **Notes:** Local state manages UI flow; Firebase state manages election phases.

- [ ] **Task 13: Import New Components and Hooks**
  - **File:** `src/app/page.tsx`
  - **Action:** Add imports at top of file:
    ```typescript
    import { CandidateGrid } from '@/components/CandidateGrid';
    import { VoteConfirmModal } from '@/components/VoteConfirmModal';
    import { ThankYouScreen } from '@/components/ThankYouScreen';
    import { ProgressBar } from '@/components/ProgressBar';
    import { useVote } from '@/hooks/useVote';
    import { useDeviceId } from '@/hooks/useDeviceId';
    import { Candidate } from '@/types/candidate';
    ```

- [ ] **Task 14: Replace READY State Placeholder**
  - **File:** `src/app/page.tsx`
  - **Action:** Replace lines 38-49 (READY state block) with:
    ```typescript
    if (state.status === 'READY') {
      return (
        <div className="min-h-screen bg-paper-white flex flex-col">
          <StatusBanner status={state.status} />
          <div className="flex-1 p-4">
            <CandidateGrid onSelectCandidate={handleSelectCandidate} />
          </div>
          <VoteConfirmModal
            candidate={selectedCandidate}
            isOpen={isConfirmOpen}
            onConfirm={handleConfirmVote}
            onCancel={handleCancelVote}
            isSubmitting={isSubmitting}
          />
        </div>
      );
    }
    ```
  - **Notes:** CandidateGrid fills viewport minus StatusBanner.

- [ ] **Task 15: Add VOTING State Handler**
  - **File:** `src/app/page.tsx`
  - **Action:** Add new state block after READY block:
    ```typescript
    // VOTING state - Show progress or thank you
    if (state.status === 'VOTING') {
      if (showThankYou) {
        return <ThankYouScreen onComplete={handleThankYouComplete} />;
      }
      return (
        <div className="min-h-screen bg-paper-white flex flex-col items-center justify-center">
          <StatusBanner status={state.status} />
          <div className="text-center p-8">
            <p className="text-2xl text-slate-600 mb-8">Mencatat suara Anda...</p>
            <ProgressBar duration={1500} />
          </div>
        </div>
      );
    }
    ```

- [ ] **Task 16: Implement Vote Flow Handlers**
  - **File:** `src/app/page.tsx`
  - **Action:** Add handler functions inside component:
    ```typescript
    const { submitVote, isSubmitting } = useVote();
    const deviceId = useDeviceId();
    const { lockBooth, setVoting } = useElection(); // destructure setVoting
    
    const handleSelectCandidate = (candidate: Candidate) => {
      setSelectedCandidate(candidate);
      setIsConfirmOpen(true);
    };
    
    const handleCancelVote = () => {
      setIsConfirmOpen(false);
      setSelectedCandidate(null);
    };
    
    const handleConfirmVote = async () => {
      if (!selectedCandidate || !deviceId) return;
      
      setIsConfirmOpen(false);
      await setVoting(); // Transition to VOTING state
      
      const success = await submitVote(selectedCandidate.id, deviceId);
      
      if (success) {
        setShowProgress(false);
        setShowThankYou(true);
      } else {
        // On error, reset to READY state (Admin can unlock again)
        await lockBooth();
        setSelectedCandidate(null);
      }
    };
    
    const handleThankYouComplete = async () => {
      setShowThankYou(false);
      setSelectedCandidate(null);
      await lockBooth(); // Auto-lock after thank you
    };
    ```
  - **Notes:** Error handling resets to LOCKED. Success path shows thank you then locks.

### Acceptance Criteria

#### Story 2.1: Candidate Grid UI

- [ ] **AC 2.1.1:** Given the Kiosk is in `READY` state, when the screen loads, then I see 4 candidate cards in a 2x2 grid layout
- [ ] **AC 2.1.2:** Given the Candidate Grid, when I view each card, then I see the candidate's photo and name/number clearly visible
- [ ] **AC 2.1.3:** Given the Candidate Grid, when I view the full page, then the layout fits 100% of the viewport with no scrolling required
- [ ] **AC 2.1.4:** Given a candidate card, when I tap it, then there is visible feedback (ring highlight or scale effect)

#### Story 2.2: Vote Interaction & Confirmation

- [ ] **AC 2.2.1:** Given I am viewing the Candidate Grid, when I tap a candidate, then a Modal Dialog appears showing the selected candidate's large photo
- [ ] **AC 2.2.2:** Given the Confirmation Modal, when I view the content, then I see "Anda yakin memilih [Name]?" with "YA, SAYA YAKIN" and "BATAL" buttons
- [ ] **AC 2.2.3:** Given the Confirmation Modal with "YA" button, when I tap "YA", then the vote submission process begins
- [ ] **AC 2.2.4:** Given the Confirmation Modal, when I tap "BATAL", then the modal closes and I return to the Candidate Grid
- [ ] **AC 2.2.5:** Given the Confirmation Modal, when a vote is being submitted, then both buttons are disabled to prevent double-tap

#### Story 2.3: Secure Vote Submission

- [ ] **AC 2.3.1:** Given the user tapped "YA" to confirm, then a new record is pushed to `/votes` path in Firebase
- [ ] **AC 2.3.2:** Given the vote record, when I inspect it in Firebase Console, then it contains only `candidate_id`, `timestamp`, and `device_id`
- [ ] **AC 2.3.3:** Given the vote record, when I inspect it, then there are NO user identifiers, session IDs, or IP addresses stored
- [ ] **AC 2.3.4:** Given a successful vote submission, then the election state transitions to `VOTING`

#### Story 2.4: Success & Auto-Lock

- [ ] **AC 2.4.1:** Given a successful vote submission, then the screen shows "TERIMA KASIH" in large green text
- [ ] **AC 2.4.2:** Given the Thank You screen, when 3 seconds elapse, then it automatically transitions back to `LOCKED` state
- [ ] **AC 2.4.3:** Given the booth returns to `LOCKED` state, when I check the Admin Dashboard, then the status shows "TERKUNCI" (Locked)
- [ ] **AC 2.4.4:** Given the Thank You screen, then no interaction is possible (touch disabled)

#### Story 2.5: Active Wait Visuals

- [ ] **AC 2.5.1:** Given I confirmed my vote, then a progress bar immediately appears and begins filling
- [ ] **AC 2.5.2:** Given the progress bar, when I observe it, then it fills from 0% to 100% over approximately 1-2 seconds
- [ ] **AC 2.5.3:** Given the progress bar is animating, then the UI prevents any further interaction

#### Story 2.6: Candidate Visi & Misi Detail

- [ ] **AC 2.6.1:** Given I am in the Confirmation Modal, then I see a "Lihat Visi & Misi" expandable section
- [ ] **AC 2.6.2:** Given the Visi & Misi section, when I tap to expand it, then I see the candidate's vision statement and mission bullet points
- [ ] **AC 2.6.3:** Given the expanded Visi & Misi section, when I tap again, then it collapses back to hidden state
- [ ] **AC 2.6.4:** Given the Visi & Misi content, when I read it, then no scrolling is required on the main page (content is inside modal)

## Additional Context

### Dependencies

**Already Installed (from Epic 1):**
- `firebase` - Realtime Database SDK
- `@radix-ui/react-dialog` - Modal component
- `lucide-react` - Icons
- `tailwindcss` - Styling with design tokens

**No additional packages required for Epic 2.**

**External Dependencies:**
- Candidate photos must be provided (3 real + 1 placeholder)
- Firebase Realtime Database must be accessible

**Task Dependencies:**
- Phase 1 (Tasks 1-4) must complete before Phase 2
- Phases 2-4 can be partially parallelized
- Phase 6 depends on all prior phases

### Testing Strategy

**MVP Approach:** Manual testing with two browser windows

**Manual Test Procedure:**
1. Open two browser windows: one at `/` (Kiosk), one at `/admin` (Admin)
2. Enter correct PIN on both
3. On Admin, click "BUKA BILIK" to unlock booth
4. On Kiosk, verify candidate grid appears with 4 cards
5. Tap a candidate card → verify modal opens with correct data
6. Expand "Lihat Visi & Misi" → verify content displays
7. Tap "BATAL" → verify modal closes
8. Tap same candidate again → modal reopens
9. Tap "YA, SAYA YAKIN" → verify progress bar appears
10. Verify "TERIMA KASIH" screen appears after progress
11. Wait 3 seconds → verify auto-lock to screensaver
12. Check Admin → verify status shows "TERKUNCI"
13. Open Firebase Console → verify vote record in `/votes`

**Firebase Verification:**
```
/votes/{auto-id}
  ├── candidate_id: "candidate_1"
  ├── timestamp: 1736579200000
  └── device_id: "uuid-string"
```
Confirm NO session_id, user_id, or IP fields.

**Test Scenarios:**
1. Candidate grid displays correctly with 4 cards in 2x2 layout
2. Tapping candidate opens confirmation modal with correct data
3. Visi & Misi section expands/collapses in modal
4. "Ya" button submits vote to Firebase `/votes` path
5. Progress bar displays during submission
6. "Terima Kasih" screen shows for 3 seconds
7. State auto-resets to LOCKED after thank you
8. Vote record contains only `candidate_id`, `timestamp`, `device_id`
9. No user identifier is attached to vote (anonymity check)
10. Error handling: if submission fails, booth resets to LOCKED

### Risk Analysis (Pre-Mortem)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missing candidate photos | High | Medium | Task 4 creates placeholder; user must provide real photos |
| Mas Prayit data incomplete | High | Low | Placeholder values defined; update before event |
| Firebase write fails | Low | High | Error handler resets to LOCKED; Admin can unlock again |
| Progress bar timing mismatch | Low | Low | Visual only; doesn't block actual submission |
| Accidental double-vote | Medium | High | 500ms debounce + button disabled during submission |
| Viewport scrolling on small screens | Medium | Medium | CSS Grid with vh units; test on actual device |......
| State desync (local vs Firebase) | Low | Medium | Firebase is source of truth; local state is UI only |

### Notes

**Before Testing:**
- Candidate photos must be placed in `/public/candidates/` before testing
- Run `npm run dev` to start development server
- Ensure Firebase Console shows `election_state.status = "LOCKED"`

**Placeholder Data:**
- Mas Prayit uses placeholder Visi & Misi text
- Placeholder photo is a generic silhouette SVG
- Update with real data before the actual event

**UX Considerations:**
- All UI text must be in Bahasa Indonesia
- Progress bar is purely visual (not tied to actual network latency)
- 500ms debounce on candidate card prevents rapid taps
- Modal prevents background scroll to maintain focus

**State Machine Notes:**
- READY → User views candidates, can tap to select
- VOTING → Vote submission in progress, shows progress bar then thank you
- After "Thank You" timeout → Auto-transition to LOCKED
- Error during submission → Reset to LOCKED (Admin can unlock again)

**Device ID Strategy:**
- Device ID is generated once, stored in `localStorage`
- Persists across browser refreshes
- Different devices will have different IDs
- NOT tied to any user identity - purely for tracking which kiosk cast the vote
