---
title: 'Epic 3: The Magic Reveal (Results & Closing)'
slug: 'epic-3-magic-reveal'
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
  - 'src/app/admin/page.tsx'
  - 'src/app/page.tsx'
  - 'src/hooks/useElection.ts'
  # New files to create
  - 'src/components/ConfirmDialog.tsx'
  - 'src/components/ResultsDisplay.tsx'
  - 'src/components/ResultBar.tsx'
  - 'src/hooks/useResults.ts'
code_patterns:
  - 'State hook pattern: useElection() returns { state, loading, error, methods }'
  - 'Firebase updates: set() with last_updated + session_id refresh'
  - 'Firebase reads: ref() + get() for one-time data fetch'
  - 'Firebase writes: remove() for data deletion'
  - 'Component styling: Tailwind with design tokens (deep-slate, paper-white, etc.)'
  - 'Variant pattern: VARIANT_STYLES object lookup for styling'
  - 'Modal pattern: Radix UI Dialog.Root/Portal/Overlay/Content'
  - 'Button component: BigButton with variant prop'
  - 'Bahasa Indonesia: All UI text in Indonesian'
test_patterns:
  - 'Manual testing with two browser windows (Kiosk + Admin)'
  - 'Firebase Console verification for /votes and /election_state'
  - 'No automated tests for MVP (Vitest available for future)'
---

# Tech-Spec: Epic 3 - The Magic Reveal (Results & Closing)

**Created:** 2026-01-11

## Overview

### Problem Statement

The election needs a formal mechanism to close voting permanently and display results publicly to the community on the Kiosk screen. Additionally, a reset mechanism is needed for testing purposes to clear all data and start fresh.

### Solution

Add an "AKHIRI PEMILIHAN" (End Election) button to the Admin Dashboard with a serious confirmation dialog. On confirmation, transition the election state to `COMPLETED`. The Kiosk then retrieves all votes from Firebase `/votes`, aggregates counts by `candidate_id`, and displays a straightforward bar chart with candidate photos, names, and vote counts. The winner (highest vote count) is visually highlighted. Admin gets a "RESET DATA" button (with serious warning) to clear all votes and reset to `LOCKED` for testing. All UI text in Bahasa Indonesia.

### Scope

**In Scope:**
- Story 3.1: Admin "End Election" Trigger ("AKHIRI PEMILIHAN" button with confirmation dialog)
- Story 3.2: Results Calculation & Aggregation (client-side vote counting from Firebase)
- Story 3.3: Public Result Display (CSS/Tailwind bar chart, winner highlight, total vote count)
- Bonus: Reset Data feature ("RESET DATA" button on Admin in `COMPLETED` state for testing)
- All UI text in Bahasa Indonesia

**Out of Scope:**
- Admin Dashboard showing results (only Kiosk displays results)
- Dramatic reveal animations (straightforward instant display)
- Special tie-breaker visualization (raw numbers only)
- Server-side aggregation (client-side for MVP simplicity)

## Context for Development

### Technical Preferences & Constraints

- **Chart Library:** Pure CSS/Tailwind bar chart (no new dependencies)
- **Language:** All UI text in Bahasa Indonesia
- **Reset Feature:** For testing only; includes serious confirmation warning
- **Display Style:** Straightforward, no dramatic animations
- **Tie Handling:** Raw numbers only, no special winner logic for ties

### Codebase Patterns

**Existing patterns from Epics 1 & 2 to follow:**

| Pattern | Convention |
|---------|------------|
| **Directory Structure** | `src/app/` routes, `src/components/` UI, `src/hooks/` hooks, `src/types/` types |
| **Firebase Operations** | Client-side `firebase/database` with `ref()`, `push()`, `set()`, `get()`, `remove()` |
| **State Management** | `useElection` hook for real-time state; add `useResults` for vote aggregation |
| **Design Tokens** | Tailwind custom colors: `deep-slate`, `indonesian-red`, `coblos-green`, `paper-white` |
| **Touch Targets** | `min-h-touch` (60px minimum) for all interactive elements |
| **Typography** | 24px+ body text, 32px+ headings, Inter font |
| **Modals** | Radix UI `@radix-ui/react-dialog` (pattern in `VoteConfirmModal.tsx`) |
| **Buttons** | `BigButton` component with `variant` prop: `primary`, `success`, `danger` |
| **Language** | All UI text in Bahasa Indonesia |

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `docs/planning-artifacts/epics.md` | Story acceptance criteria (Stories 3.1-3.3) |
| `src/hooks/useElection.ts` | Existing hook with `updateStatus('COMPLETED')` method |
| `src/app/admin/page.tsx` | Admin Dashboard - add "End Election" + "Reset" buttons |
| `src/app/page.tsx` | Kiosk page - replace `COMPLETED` placeholder (lines 141-151) |
| `src/types/election.ts` | `Vote` interface: `{ candidate_id, timestamp, device_id }` |
| `src/data/candidates.ts` | `CANDIDATES` array with 4 candidates for results display |
| `src/components/VoteConfirmModal.tsx` | Radix Dialog pattern to reuse for confirmation dialogs |
| `src/components/BigButton.tsx` | Button component with variants |
| `src/lib/firebase.ts` | Firebase client with `database` export |

### Anchor Points (from Investigation)

**`src/app/admin/page.tsx`** - Admin Dashboard:
- Lines 55-59: `LOCKED` state with "BUKA BILIK" button
- Lines 61-70: `READY` state with "KUNCI BILIK" button
- Lines 72-76: `COMPLETED` state with placeholder text → **Add "RESET DATA" button here**
- **Missing:** "AKHIRI PEMILIHAN" button → **Add in `LOCKED`, `READY`, and `VOTING` states**
- Uses: `useElection` hook, `BigButton` component

**`src/app/page.tsx`** - Kiosk Page:
- Lines 141-151: `COMPLETED` state placeholder → **Replace with ResultsDisplay component**
- Pattern: Conditional rendering based on `state.status`

**`src/hooks/useElection.ts`** - Election State:
- Line 52-54: Methods `unlockBooth`, `lockBooth`, `setVoting` → **Add `endElection()` method**
- Line 40-50: `updateStatus()` pattern → **Reuse for `endElection()`**
- **Need to add:** `resetElection()` that clears `/votes` AND resets state to `LOCKED`

**`src/types/election.ts`** - Types:
- Line 1: `ElectionStatus` includes `'COMPLETED'` ✅ Already defined
- Lines 9-13: `Vote` interface ✅ Already defined

**`src/components/VoteConfirmModal.tsx`** - Modal Pattern:
- Lines 28-128: Complete Radix Dialog implementation to use as template
- Pattern: `Dialog.Root` > `Dialog.Portal` > `Dialog.Overlay` > `Dialog.Content`
- Uses: `BigButton` for actions

### Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Pure CSS bar chart** | No new dependencies; 4 candidates = simple horizontal bars with percentage widths |
| **Client-side aggregation** | MVP simplicity; `/votes` data is small for a local RT election |
| **Reusable ConfirmDialog** | Extract pattern from VoteConfirmModal for "End Election" and "Reset" dialogs |
| **useResults hook** | Encapsulate vote fetching and aggregation logic |
| **"End Election" in all pre-COMPLETED states** | Admin can end election from LOCKED, READY, or during VOTING |
| **"Reset Data" only in COMPLETED state** | Prevent accidental reset during active election |
| **Winner = highest vote count** | Simple comparison; ties show raw numbers, no special handling |

## Implementation Plan

### Tasks

#### Phase 1: Core Hooks & Utilities

- [ ] **Task 1: Add endElection Method to useElection Hook**
  - **File:** `src/hooks/useElection.ts`
  - **Action:** Add new method after `setVoting`:
    ```typescript
    const endElection = () => updateStatus('COMPLETED');
    
    return { state, loading, error, unlockBooth, lockBooth, setVoting, endElection, updateStatus };
    ```
  - **Notes:** Simple state transition to `COMPLETED`. Uses existing `updateStatus()` pattern.

- [ ] **Task 2: Add resetElection Method to useElection Hook**
  - **File:** `src/hooks/useElection.ts`
  - **Action:** Add new method that clears votes AND resets state:
    ```typescript
    import { ref, set, remove } from 'firebase/database';
    
    const resetElection = async () => {
        if (!database) throw new Error('Firebase not initialized');
        
        // Clear all votes
        const votesRef = ref(database, 'votes');
        await remove(votesRef);
        
        // Reset state to LOCKED
        await updateStatus('LOCKED');
    };
    
    return { state, loading, error, unlockBooth, lockBooth, setVoting, endElection, resetElection, updateStatus };
    ```
  - **Notes:** Must import `remove` from `firebase/database`. Clears `/votes` path completely.

- [ ] **Task 3: Create useResults Hook**
  - **File:** `src/hooks/useResults.ts`
  - **Action:** Create new hook for vote aggregation:
    ```typescript
    import { useState, useEffect } from 'react';
    import { ref, get } from 'firebase/database';
    import { database } from '@/lib/firebase';
    import { Vote } from '@/types/election';
    import { CANDIDATES } from '@/data/candidates';

    export interface CandidateResult {
        candidateId: string;
        name: string;
        photo: string;
        number: number;
        voteCount: number;
        percentage: number;
        isWinner: boolean;
    }

    export function useResults() {
        const [results, setResults] = useState<CandidateResult[]>([]);
        const [totalVotes, setTotalVotes] = useState(0);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<Error | null>(null);

        useEffect(() => {
            async function fetchAndAggregate() {
                if (!database) {
                    setError(new Error('Firebase not initialized'));
                    setLoading(false);
                    return;
                }

                try {
                    const votesRef = ref(database, 'votes');
                    const snapshot = await get(votesRef);
                    const votesData = snapshot.val() || {};

                    // Count votes per candidate
                    const counts: Record<string, number> = {};
                    CANDIDATES.forEach(c => counts[c.id] = 0);
                    
                    Object.values(votesData).forEach((vote: unknown) => {
                        const v = vote as Vote;
                        if (counts[v.candidate_id] !== undefined) {
                            counts[v.candidate_id]++;
                        }
                    });

                    const total = Object.values(counts).reduce((a, b) => a + b, 0);
                    const maxVotes = Math.max(...Object.values(counts));

                    const candidateResults: CandidateResult[] = CANDIDATES.map(c => ({
                        candidateId: c.id,
                        name: c.name,
                        photo: c.photo,
                        number: c.number,
                        voteCount: counts[c.id],
                        percentage: total > 0 ? (counts[c.id] / total) * 100 : 0,
                        isWinner: counts[c.id] === maxVotes && maxVotes > 0,
                    }));

                    setResults(candidateResults);
                    setTotalVotes(total);
                    setLoading(false);
                } catch (err) {
                    setError(err as Error);
                    setLoading(false);
                }
            }

            fetchAndAggregate();
        }, []);

        return { results, totalVotes, loading, error };
    }
    ```
  - **Notes:** One-time fetch on mount. Winner is highest vote count. Handles 0 votes case.

#### Phase 2: Reusable Confirm Dialog

- [ ] **Task 4: Create ConfirmDialog Component**
  - **File:** `src/components/ConfirmDialog.tsx`
  - **Action:** Create reusable confirmation dialog based on VoteConfirmModal pattern:
    ```typescript
    'use client';
    import { BigButton } from './BigButton';
    import * as Dialog from '@radix-ui/react-dialog';
    import { AlertTriangle, X } from 'lucide-react';

    interface ConfirmDialogProps {
        isOpen: boolean;
        onConfirm: () => void;
        onCancel: () => void;
        title: string;
        message: string;
        confirmText: string;
        cancelText?: string;
        variant?: 'danger' | 'warning';
        isLoading?: boolean;
    }

    export function ConfirmDialog({
        isOpen,
        onConfirm,
        onCancel,
        title,
        message,
        confirmText,
        cancelText = 'Batal',
        variant = 'danger',
        isLoading = false,
    }: ConfirmDialogProps) {
        return (
            <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full z-50">
                        {/* Close Button */}
                        <Dialog.Close
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            <X className="w-6 h-6 text-slate-600" />
                        </Dialog.Close>

                        {/* Warning Icon */}
                        <div className="flex justify-center mb-6">
                            <div className={`p-4 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                                <AlertTriangle className={`w-12 h-12 ${variant === 'danger' ? 'text-indonesian-red' : 'text-yellow-600'}`} />
                            </div>
                        </div>

                        {/* Title */}
                        <Dialog.Title className="text-2xl font-bold text-center text-deep-slate mb-4">
                            {title}
                        </Dialog.Title>

                        {/* Message */}
                        <p className="text-lg text-center text-slate-600 mb-8">
                            {message}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <BigButton
                                variant="danger"
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? 'Memproses...' : confirmText}
                            </BigButton>
                            <BigButton
                                variant="primary"
                                onClick={onCancel}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {cancelText}
                            </BigButton>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        );
    }
    ```
  - **Notes:** Reusable for both "End Election" and "Reset Data" confirmations. Uses danger variant styling.

#### Phase 3: Results Display Components

- [ ] **Task 5: Create ResultBar Component**
  - **File:** `src/components/ResultBar.tsx`
  - **Action:** Create individual result bar for each candidate:
    ```typescript
    import Image from 'next/image';
    import { Trophy } from 'lucide-react';
    import { CandidateResult } from '@/hooks/useResults';

    interface ResultBarProps {
        result: CandidateResult;
    }

    export function ResultBar({ result }: ResultBarProps) {
        return (
            <div className={`flex items-center gap-4 p-4 rounded-xl ${result.isWinner ? 'bg-coblos-green/10 ring-2 ring-coblos-green' : 'bg-slate-50'}`}>
                {/* Candidate Photo */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                    <Image
                        src={result.photo}
                        alt={result.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                </div>

                {/* Info & Bar */}
                <div className="flex-1 min-w-0">
                    {/* Name Row with Winner Badge */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-deep-slate">
                            {result.number}. {result.name}
                        </span>
                        {result.isWinner && (
                            <Trophy className="w-6 h-6 text-coblos-green flex-shrink-0" />
                        )}
                    </div>

                    {/* Bar Chart */}
                    <div className="h-8 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${result.isWinner ? 'bg-coblos-green' : 'bg-deep-slate'}`}
                            style={{ width: `${Math.max(result.percentage, 2)}%` }}
                        />
                    </div>

                    {/* Vote Count */}
                    <div className="flex justify-between mt-2 text-lg">
                        <span className="font-semibold text-slate-700">
                            {result.voteCount} suara
                        </span>
                        <span className="text-slate-500">
                            {result.percentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    ```
  - **Notes:** Winner gets green highlight and trophy icon. Bar minimum width 2% for visibility.

- [ ] **Task 6: Create ResultsDisplay Component**
  - **File:** `src/components/ResultsDisplay.tsx`
  - **Action:** Create container component that uses useResults hook:
    ```typescript
    'use client';
    import { useResults } from '@/hooks/useResults';
    import { ResultBar } from './ResultBar';
    import { Trophy } from 'lucide-react';

    export function ResultsDisplay() {
        const { results, totalVotes, loading, error } = useResults();

        if (loading) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-2xl text-slate-600">Menghitung suara...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-2xl text-indonesian-red">Gagal memuat hasil: {error.message}</p>
                </div>
            );
        }

        return (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Trophy className="w-10 h-10 text-coblos-green" />
                        <h1 className="text-4xl font-bold text-deep-slate">HASIL PEMILIHAN</h1>
                        <Trophy className="w-10 h-10 text-coblos-green" />
                    </div>
                    <p className="text-xl text-slate-600">
                        Total suara masuk: <span className="font-bold text-deep-slate">{totalVotes}</span>
                    </p>
                </div>

                {/* Results List */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                    {results.map((result) => (
                        <ResultBar key={result.candidateId} result={result} />
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-lg text-slate-500">
                        Pemilihan telah berakhir. Terima kasih atas partisipasi Anda.
                    </p>
                </div>
            </div>
        );
    }
    ```
  - **Notes:** Full-screen results display. Shows all candidates sorted by vote count.

#### Phase 4: Admin Dashboard Integration (Story 3.1)

- [ ] **Task 7: Add End Election Button to Admin Dashboard**
  - **File:** `src/app/admin/page.tsx`
  - **Action:** 
    1. Add imports at top:
       ```typescript
       import { ConfirmDialog } from '@/components/ConfirmDialog';
       import { useState } from 'react';
       ```
    2. Add state for dialogs inside component:
       ```typescript
       const [showEndDialog, setShowEndDialog] = useState(false);
       const [showResetDialog, setShowResetDialog] = useState(false);
       const [isProcessing, setIsProcessing] = useState(false);
       ```
    3. Destructure new methods from useElection:
       ```typescript
       const { state, loading, error, unlockBooth, lockBooth, endElection, resetElection } = useElection();
       ```
    4. Add handler functions:
       ```typescript
       const handleEndElection = async () => {
           setIsProcessing(true);
           await endElection();
           setIsProcessing(false);
           setShowEndDialog(false);
       };

       const handleResetElection = async () => {
           setIsProcessing(true);
           await resetElection();
           setIsProcessing(false);
           setShowResetDialog(false);
       };
       ```
    5. Add "AKHIRI PEMILIHAN" button in `LOCKED`, `READY`, and `VOTING` states (below existing buttons):
       ```tsx
       <BigButton 
           variant="danger" 
           onClick={() => setShowEndDialog(true)} 
           className="w-full max-w-md mt-4"
       >
           ⚠️ AKHIRI PEMILIHAN
       </BigButton>
       ```
    6. Replace `COMPLETED` state block (lines 72-76) with:
       ```tsx
       {state.status === 'COMPLETED' && (
           <div className="text-center space-y-4">
               <p className="text-xl text-slate-600">
                   Pemilihan telah berakhir. Lihat hasil di layar Kiosk.
               </p>
               <BigButton 
                   variant="danger" 
                   onClick={() => setShowResetDialog(true)} 
                   className="w-full max-w-md"
               >
                   🔄 RESET DATA (Testing)
               </BigButton>
           </div>
       )}
       ```
    7. Add dialogs at end of component (before closing `</div>`):
       ```tsx
       {/* End Election Confirmation Dialog */}
       <ConfirmDialog
           isOpen={showEndDialog}
           onConfirm={handleEndElection}
           onCancel={() => setShowEndDialog(false)}
           title="AKHIRI PEMILIHAN?"
           message="Tindakan ini tidak dapat dibatalkan. Setelah pemilihan diakhiri, hasil akan ditampilkan di layar Kiosk."
           confirmText="Ya, Akhiri"
           isLoading={isProcessing}
       />

       {/* Reset Data Confirmation Dialog */}
       <ConfirmDialog
           isOpen={showResetDialog}
           onConfirm={handleResetElection}
           onCancel={() => setShowResetDialog(false)}
           title="RESET SEMUA DATA?"
           message="PERINGATAN: Semua suara akan dihapus dan pemilihan akan direset. Tindakan ini tidak dapat dibatalkan!"
           confirmText="Ya, Reset"
           isLoading={isProcessing}
       />
       ```
  - **Notes:** "End Election" button appears in all states except COMPLETED. "Reset" only in COMPLETED.

#### Phase 5: Kiosk Results Integration (Story 3.3)

- [ ] **Task 8: Replace COMPLETED Placeholder in Kiosk Page**
  - **File:** `src/app/page.tsx`
  - **Action:**
    1. Add import at top:
       ```typescript
       import { ResultsDisplay } from '@/components/ResultsDisplay';
       ```
    2. Replace COMPLETED state block (lines 141-151) with:
       ```tsx
       // COMPLETED state - Show Results
       return (
           <div className="min-h-screen bg-paper-white flex flex-col">
               <StatusBanner status={state.status} />
               <ResultsDisplay />
           </div>
       );
       ```
  - **Notes:** Simple integration; ResultsDisplay handles all loading and display logic.

### Acceptance Criteria

#### Story 3.1: Admin "End Election" Trigger

- [ ] **AC 3.1.1:** Given the Admin Dashboard in `LOCKED` state, when I view the page, then I see an "AKHIRI PEMILIHAN" button below the "BUKA BILIK" button
- [ ] **AC 3.1.2:** Given the Admin Dashboard in `READY` state, when I view the page, then I see an "AKHIRI PEMILIHAN" button
- [ ] **AC 3.1.3:** Given any pre-COMPLETED state, when I tap "AKHIRI PEMILIHAN", then a confirmation dialog appears with warning message "Tindakan ini tidak dapat dibatalkan"
- [ ] **AC 3.1.4:** Given the confirmation dialog, when I tap "Ya, Akhiri", then the `election_state.status` updates to `COMPLETED`
- [ ] **AC 3.1.5:** Given the confirmation dialog, when I tap "Batal", then the dialog closes and no state change occurs
- [ ] **AC 3.1.6:** Given the Admin Dashboard in `COMPLETED` state, when I view the page, then the "AKHIRI PEMILIHAN" button is NOT visible

#### Story 3.2: Results Calculation & Aggregation

- [ ] **AC 3.2.1:** Given the `COMPLETED` state, when the Kiosk loads results, then it retrieves all records from `/votes` in Firebase
- [ ] **AC 3.2.2:** Given vote records exist, when aggregation runs, then vote counts are correctly grouped by `candidate_id`
- [ ] **AC 3.2.3:** Given 0 votes for a candidate, when results display, then that candidate shows `0 suara` and `0.0%`
- [ ] **AC 3.2.4:** Given multiple votes, when percentage is calculated, then all percentages sum to 100% (within rounding)

#### Story 3.3: Public Result Display (The Magic Reveal)

- [ ] **AC 3.3.1:** Given the Kiosk receives `COMPLETED` signal, when the page renders, then it transitions to "Results Mode" showing the bar chart
- [ ] **AC 3.3.2:** Given the Results Display, when I view the results, then I see all 4 candidates with their photos, names, vote counts, and percentages
- [ ] **AC 3.3.3:** Given the Results Display, when there is a clear winner (highest vote count), then that candidate's bar is highlighted in green with a trophy icon
- [ ] **AC 3.3.4:** Given the Results Display, when I view the header, then I see the total vote count displayed
- [ ] **AC 3.3.5:** Given the `COMPLETED` state, when viewing the Kiosk, then no voting interaction is possible

#### Bonus: Reset Data Feature

- [ ] **AC B.1:** Given the Admin Dashboard in `COMPLETED` state, when I view the page, then I see a "RESET DATA (Testing)" button
- [ ] **AC B.2:** Given I tap "RESET DATA", when the confirmation dialog appears, then I see a serious warning about data deletion
- [ ] **AC B.3:** Given I confirm reset, when the operation completes, then all records in `/votes` are deleted
- [ ] **AC B.4:** Given I confirm reset, when the operation completes, then `election_state.status` returns to `LOCKED`
- [ ] **AC B.5:** Given the reset completes, when I check Firebase Console, then `/votes` path is empty

## Additional Context

### Dependencies

**Already Installed (from Epics 1 & 2):**
- `firebase` - Realtime Database SDK (`ref`, `get`, `set`, `remove`, `onValue`)
- `@radix-ui/react-dialog` - Modal component
- `lucide-react` - Icons (Trophy, AlertTriangle, X, RefreshCcw)
- `tailwindcss` - Styling with design tokens
- `next/image` - Optimized images

**No additional packages required for Epic 3.**

**External Dependencies:**
- Firebase Realtime Database must be accessible
- Candidate data from `src/data/candidates.ts`

**Task Dependencies:**
- Task 1 & 2 must complete before Task 7 (Admin needs methods)
- Task 3 must complete before Task 6 (ResultsDisplay needs useResults)
- Tasks 4 & 5 must complete before Tasks 6 & 7 (components needed)
- Task 8 can run after Task 6

### Testing Strategy

**MVP Approach:** Manual testing with two browser windows

**Manual Test Procedure:**

1. **Setup:** Open two browser windows: `/` (Kiosk) and `/admin` (Admin)
2. **Cast Test Votes:**
   - Unlock booth from Admin
   - Cast 2-3 votes for different candidates on Kiosk
   - Verify votes appear in Firebase Console under `/votes`

3. **Test End Election (Story 3.1):**
   - On Admin, verify "AKHIRI PEMILIHAN" button is visible
   - Tap button → verify confirmation dialog appears
   - Tap "Batal" → verify dialog closes, state unchanged
   - Tap "AKHIRI PEMILIHAN" again → tap "Ya, Akhiri"
   - Verify Admin shows "Pemilihan telah berakhir" + "RESET DATA" button
   - Verify Firebase Console shows `election_state.status: "COMPLETED"`

4. **Test Results Display (Story 3.2 & 3.3):**
   - On Kiosk, verify results bar chart appears
   - Verify all 4 candidates are shown with correct vote counts
   - Verify winner (highest votes) has green bar + trophy icon
   - Verify total vote count is displayed
   - Verify percentages are calculated correctly
   - Verify no voting interaction is possible

5. **Test Reset (Bonus):**
   - On Admin, tap "RESET DATA (Testing)"
   - Verify confirmation dialog with serious warning
   - Tap "Batal" → verify nothing changes
   - Tap "RESET DATA" again → tap "Ya, Reset"
   - Verify Admin shows "TERKUNCI" status + "BUKA BILIK" button
   - Verify Firebase `/votes` is empty
   - Verify Kiosk shows "MENUNGGU PETUGAS" screensaver

**Firebase Verification:**
```
/election_state
  └── status: "COMPLETED" (after end) → "LOCKED" (after reset)

/votes (after reset)
  └── (empty)
```

### Risk Analysis (Pre-Mortem)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Accidental "End Election" tap | Medium | High | Serious confirmation dialog with clear warning |
| Accidental "Reset Data" tap | Medium | Critical | Only visible in COMPLETED state; double confirmation |
| Firebase read fails on results | Low | High | Error handling in useResults hook with message display |
| Vote count mismatch | Low | High | Client-side aggregation from single source of truth |
| Winner determination with ties | Medium | Low | Raw numbers only; all tied candidates get isWinner=true |
| Slow results loading | Low | Medium | Loading state with "Menghitung suara..." message |

### Notes

**Before Testing:**
- Ensure Firebase has some test votes in `/votes` path
- Run `npm run dev` to start development server
- Test with at least 2 candidates having votes to verify bar chart scaling

**UI Text (Bahasa Indonesia):**
All UI text is in Bahasa Indonesia:
- "AKHIRI PEMILIHAN" - End Election button
- "Tindakan ini tidak dapat dibatalkan" - Action cannot be undone
- "Ya, Akhiri" - Yes, End
- "RESET DATA (Testing)" - Reset Data button
- "RESET SEMUA DATA?" - Reset all data?
- "HASIL PEMILIHAN" - Election Results
- "suara" - votes
- "Pemilihan telah berakhir" - Election has ended
- "Menghitung suara..." - Counting votes...

**State Machine Notes:**
- Any state → COMPLETED: Only via Admin "End Election" button
- COMPLETED → LOCKED: Only via Admin "Reset Data" button
- Reset also clears `/votes` path completely
- Kiosk in COMPLETED state shows results, no voting possible

**Winner Logic:**
- Winner = candidate(s) with highest vote count
- If multiple candidates have same highest count, all are marked as winners
- Visual: Green bar, green ring around card, trophy icon
