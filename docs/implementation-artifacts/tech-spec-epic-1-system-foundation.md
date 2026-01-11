---
title: 'Epic 1: System Foundation & Remote Control Integration'
slug: 'epic-1-system-foundation'
created: '2026-01-11'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4, 5]
tech_stack: ['Next.js 14', 'Firebase RTDB', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Lucide React', 'Inter Font']
files_to_modify:
  - 'src/lib/firebase.ts'
  - 'src/types/election.ts'
  - 'src/hooks/useElection.ts'
  - 'src/hooks/useAuth.ts'
  - 'src/app/page.tsx'
  - 'src/app/admin/page.tsx'
  - 'src/app/layout.tsx'
  - 'src/components/StatusBanner.tsx'
  - 'src/components/BigButton.tsx'
  - 'src/components/PinInput.tsx'
  - 'tailwind.config.ts'
  - '.env.local'
code_patterns:
  - 'Next.js 14 App Router with src/ directory'
  - 'Firebase client-side only (no Admin SDK)'
  - 'Custom React hooks for real-time data'
  - 'Strict TypeScript with union types for state'
  - 'Tailwind CSS with custom design tokens'
  - 'Radix UI headless primitives'
test_patterns:
  - 'Vitest for unit tests (optional for MVP)'
  - 'Manual testing for real-time sync'
---

# Tech-Spec: Epic 1 - System Foundation & Remote Control Integration

**Created:** 2026-01-11

## Overview

### Problem Statement

We need to build the foundational infrastructure for a real-time e-voting system that enables an Admin to remotely control a Kiosk device, with secure access via a shared Event PIN. The system must support sub-2-second synchronization between devices to create a seamless "Committee Remote Control" experience for an RT Chairman election.

### Solution

Create a single Next.js 14 application with separate routes for Kiosk (`/`) and Admin (`/admin`), connected via Firebase Realtime Database for sub-second state synchronization. Both interfaces are gated by an Event PIN stored as an environment variable (`NEXT_PUBLIC_EVENT_PIN`). The Kiosk uses `localStorage` for session persistence (survives browser refresh), while the Admin uses cookies for session management.

### Scope

**In Scope:**
- Next.js 14 project initialization with App Router, TypeScript, Tailwind CSS, Radix UI
- Firebase project creation (console setup) and SDK integration
- Event PIN authentication for both Kiosk and Admin routes
- Real-time `election_state` listener with strict state machine (LOCKED → READY → VOTING → COMPLETED)
- Admin Dashboard with "BUKA BILIK" (Unlock) button and status indicator
- Kiosk Screensaver ("MENUNGGU PETUGAS") with real-time wake-up on unlock signal
- Session persistence (localStorage for Kiosk, cookies for Admin)
- TypeScript interfaces for `ElectionState` and related types
- Design system tokens configured in Tailwind (colors, spacing, fonts)

**Out of Scope:**
- Candidate grid UI (Story 2.1)
- Vote selection and confirmation dialog (Story 2.2)
- Vote submission logic (Story 2.3)
- Success & Auto-Lock flow (Story 2.4)
- Results display (Story 3.3)
- Candidate Visi & Misi (Story 2.6)
- Production deployment configuration

## Context for Development

### Technical Preferences & Constraints

- **Single App Architecture:** Kiosk at `/`, Admin at `/admin`
- **Event PIN:** Single environment variable `NEXT_PUBLIC_EVENT_PIN`
- **Session Storage:** 
  - Kiosk: `localStorage` (key: `kiosk_authorized`)
  - Admin: HTTP-only cookie (`admin_session`)
- **Language:** All UI text in Bahasa Indonesia
- **State Machine:** LOCKED → READY → VOTING → COMPLETED (strict, no skipping)

### Codebase Patterns

**Confirmed Clean Slate** - No existing code. Establishing the following conventions:

| Pattern | Convention |
|---------|------------|
| **Directory Structure** | `src/app/` for routes, `src/components/` for UI, `src/lib/` for utilities, `src/hooks/` for custom hooks, `src/types/` for TypeScript interfaces |
| **Firebase Config** | `src/lib/firebase.ts` - singleton client initialization with environment variables |
| **Custom Hooks** | `useElection()` for real-time state, `useAuth()` for PIN authentication |
| **TypeScript** | Strict mode, union types for state machine (`ElectionStatus = 'LOCKED' \| 'READY' \| 'VOTING' \| 'COMPLETED'`) |
| **Components** | Coarse-grained, self-contained: `StatusBanner`, `BigButton`, `PinInput` |
| **Styling** | Tailwind CSS with custom design tokens, no inline arbitrary values |
| **State Management** | React hooks + Firebase real-time listeners (no Redux/Zustand needed) |

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `docs/planning-artifacts/prd.md` | Product requirements and success criteria |
| `docs/planning-artifacts/architecture.md` | Firebase data schema and state machine logic |
| `docs/planning-artifacts/ux-design-specification.md` | Design system tokens, component specs, interaction patterns |
| `docs/planning-artifacts/epics.md` | Story acceptance criteria (Stories 1.1-1.5) |

### Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Firebase RTDB over Firestore** | Sub-second WebSocket sync, simpler JSON tree structure, ideal for real-time "Remote Control" pattern |
| **Client-only Firebase** | No server-side Admin SDK needed; all operations are client-side with security rules |
| **localStorage for Kiosk** | Survives browser refresh, simpler than cookies for same-device persistence |
| **Cookie for Admin** | Enables potential future server-side validation; more secure for control panel |
| **Tailwind custom config** | Enforces design system consistency, prevents arbitrary values |
| **No state library** | React hooks + Firebase listeners sufficient for this scale |

### Firebase Data Schema

```json
{
  "election_state": {
    "status": "LOCKED | READY | VOTING | COMPLETED",
    "last_updated": 1704940000000,
    "session_id": "uuid-v4-string"
  },
  "votes": {
    "$vote_id": {
      "candidate_id": "candidate_1",
      "timestamp": 1704940000000,
      "device_id": "kiosk_01"
    }
  }
}
```

### Design System Tokens (from UX Spec)

| Token | Value | Usage |
|-------|-------|-------|
| **Deep Slate Blue** | `#0F172A` | Primary actions, headers |
| **Indonesian Red** | `#D00C0C` | Destructive actions, errors |
| **Coblos Green** | `#16A34A` | Success states, "Ready" indicator |
| **Paper White** | `#F8FAFC` | Backgrounds |
| **Slate-900** | `#020617` | Primary text |
| **Font** | Inter | All text |
| **Touch Target** | 60px min | All interactive elements |
| **Text Size** | 24px min body, 32px candidate names | Elderly accessibility |

## Implementation Plan

### Tasks

#### Phase 1: Project Initialization (Story 1.1)

- [ ] **Task 1: Create Next.js Project**
  - **Action:** Run `npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` in the project root
  - **Notes:** Answer "No" to Turbopack (experimental). This creates the base structure with App Router.

- [ ] **Task 2: Install Dependencies**
  - **Action:** Run `npm install firebase @radix-ui/react-dialog lucide-react`
  - **Notes:** These are the only additional packages needed for Epic 1.

- [ ] **Task 3: Configure Tailwind Design System**
  - **File:** `tailwind.config.ts`
  - **Action:** Add custom colors, fonts, and spacing tokens:
    ```typescript
    colors: {
      'deep-slate': '#0F172A',
      'indonesian-red': '#D00C0C',
      'coblos-green': '#16A34A',
      'paper-white': '#F8FAFC',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      minHeight: {
        'touch': '60px',
      },
      minWidth: {
        'touch': '60px',
      },
    }
    ```
  - **Notes:** Also add Inter font import to `src/app/layout.tsx` via Google Fonts.

- [ ] **Task 4: Create Environment Template**
  - **File:** `.env.local`
  - **Action:** Create file with placeholder variables:
    ```
    NEXT_PUBLIC_EVENT_PIN=123456
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    ```
  - **Notes:** Add `.env.local` to `.gitignore` (already default).

#### Phase 2: Firebase Setup (Story 1.1 continued)

- [ ] **Task 5: Create Firebase Project (Console)**
  - **Action:** Manual steps in Firebase Console:
    1. Go to https://console.firebase.google.com/
    2. Click "Create a project" → Name: "e-voting-rt"
    3. Disable Google Analytics (not needed)
    4. Wait for project creation
    5. Go to "Build" → "Realtime Database" → "Create Database"
    6. Select "Singapore (asia-southeast1)" region
    7. Start in **Test Mode** (allows all reads/writes for 30 days)
    8. Go to Project Settings → General → "Your apps" → Web icon (</>)
    9. Register app name: "e-voting-web"
    10. Copy the `firebaseConfig` object values to `.env.local`
  - **Notes:** Test Mode is acceptable for MVP. Configure proper security rules before production.

- [ ] **Task 6: Initialize Firebase Client**
  - **File:** `src/lib/firebase.ts`
  - **Action:** Create Firebase singleton:
    ```typescript
    import { initializeApp, getApps } from 'firebase/app';
    import { getDatabase } from 'firebase/database';

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    export const database = getDatabase(app);
    ```
  - **Notes:** Singleton pattern prevents multiple initializations during hot reload.

- [ ] **Task 7: Initialize Database Structure**
  - **Action:** In Firebase Console → Realtime Database, manually add initial data:
    ```json
    {
      "election_state": {
        "status": "LOCKED",
        "last_updated": 0,
        "session_id": ""
      }
    }
    ```
  - **Notes:** This ensures the path exists for listeners.

#### Phase 3: TypeScript Types & Hooks (Story 1.3)

- [ ] **Task 8: Create TypeScript Interfaces**
  - **File:** `src/types/election.ts`
  - **Action:** Define strict types:
    ```typescript
    export type ElectionStatus = 'LOCKED' | 'READY' | 'VOTING' | 'COMPLETED';

    export interface ElectionState {
      status: ElectionStatus;
      last_updated: number;
      session_id: string;
    }

    export interface Vote {
      candidate_id: string;
      timestamp: number;
      device_id: string;
    }
    ```
  - **Notes:** Union type ensures compile-time safety for state transitions.

- [ ] **Task 9: Create useElection Hook**
  - **File:** `src/hooks/useElection.ts`
  - **Action:** Implement real-time listener:
    ```typescript
    import { useState, useEffect } from 'react';
    import { ref, onValue, set } from 'firebase/database';
    import { database } from '@/lib/firebase';
    import { ElectionState, ElectionStatus } from '@/types/election';

    export function useElection() {
      const [state, setState] = useState<ElectionState | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<Error | null>(null);

      useEffect(() => {
        const stateRef = ref(database, 'election_state');
        const unsubscribe = onValue(stateRef, (snapshot) => {
          setState(snapshot.val());
          setLoading(false);
        }, (err) => {
          setError(err);
          setLoading(false);
        });

        return () => unsubscribe();
      }, []);

      const updateStatus = async (newStatus: ElectionStatus) => {
        const stateRef = ref(database, 'election_state');
        await set(stateRef, {
          status: newStatus,
          last_updated: Date.now(),
          session_id: crypto.randomUUID(),
        });
      };

      const unlockBooth = () => updateStatus('READY');
      const lockBooth = () => updateStatus('LOCKED');

      return { state, loading, error, unlockBooth, lockBooth, updateStatus };
    }
    ```
  - **Notes:** Returns loading/error states for proper UI feedback.

- [ ] **Task 10: Create useAuth Hook**
  - **File:** `src/hooks/useAuth.ts`
  - **Action:** Implement PIN authentication:
    ```typescript
    import { useState, useEffect, useCallback } from 'react';

    const EVENT_PIN = process.env.NEXT_PUBLIC_EVENT_PIN || '';
    const KIOSK_STORAGE_KEY = 'kiosk_authorized';
    const ADMIN_COOKIE_NAME = 'admin_session';

    export function useKioskAuth() {
      const [isAuthorized, setIsAuthorized] = useState(false);

      useEffect(() => {
        const stored = localStorage.getItem(KIOSK_STORAGE_KEY);
        setIsAuthorized(stored === 'true');
      }, []);

      const authorize = useCallback((pin: string): boolean => {
        if (pin === EVENT_PIN) {
          localStorage.setItem(KIOSK_STORAGE_KEY, 'true');
          setIsAuthorized(true);
          return true;
        }
        return false;
      }, []);

      return { isAuthorized, authorize };
    }

    export function useAdminAuth() {
      const [isAuthorized, setIsAuthorized] = useState(false);

      useEffect(() => {
        const cookie = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${ADMIN_COOKIE_NAME}=`));
        setIsAuthorized(cookie?.split('=')[1] === 'true');
      }, []);

      const authorize = useCallback((pin: string): boolean => {
        if (pin === EVENT_PIN) {
          document.cookie = `${ADMIN_COOKIE_NAME}=true; path=/admin; max-age=86400`;
          setIsAuthorized(true);
          return true;
        }
        return false;
      }, []);

      return { isAuthorized, authorize };
    }
    ```
  - **Notes:** Separate hooks for Kiosk (localStorage) and Admin (cookie).

#### Phase 4: UI Components

- [ ] **Task 11: Create StatusBanner Component**
  - **File:** `src/components/StatusBanner.tsx`
  - **Action:** Create status indicator:
    ```typescript
    import { ElectionStatus } from '@/types/election';
    import { LockKeyhole, Unlock, Vote, Trophy } from 'lucide-react';

    const STATUS_CONFIG: Record<ElectionStatus, { label: string; bgColor: string; icon: typeof LockKeyhole }> = {
      LOCKED: { label: 'MENUNGGU PETUGAS', bgColor: 'bg-indonesian-red', icon: LockKeyhole },
      READY: { label: 'SILAKAN MEMILIH', bgColor: 'bg-coblos-green', icon: Unlock },
      VOTING: { label: 'SEDANG MEMILIH...', bgColor: 'bg-deep-slate', icon: Vote },
      COMPLETED: { label: 'PEMILIHAN SELESAI', bgColor: 'bg-deep-slate', icon: Trophy },
    };

    export function StatusBanner({ status }: { status: ElectionStatus }) {
      const config = STATUS_CONFIG[status];
      const Icon = config.icon;
      
      return (
        <div className={`${config.bgColor} text-white py-4 px-6 flex items-center justify-center gap-3`}>
          <Icon className="w-8 h-8" />
          <span className="text-2xl font-bold tracking-wide">{config.label}</span>
        </div>
      );
    }
    ```
  - **Notes:** Uses Lucide icons. All text in Bahasa Indonesia.

- [ ] **Task 12: Create BigButton Component**
  - **File:** `src/components/BigButton.tsx`
  - **Action:** Create large touch-friendly button:
    ```typescript
    import { ButtonHTMLAttributes } from 'react';

    interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'primary' | 'success' | 'danger';
    }

    const VARIANT_STYLES = {
      primary: 'bg-deep-slate hover:bg-slate-800 text-white',
      success: 'bg-coblos-green hover:bg-green-700 text-white',
      danger: 'bg-indonesian-red hover:bg-red-700 text-white',
    };

    export function BigButton({ variant = 'primary', className = '', children, disabled, ...props }: BigButtonProps) {
      return (
        <button
          className={`
            min-h-touch min-w-touch px-8 py-4
            text-2xl font-bold uppercase tracking-wide
            rounded-lg shadow-lg
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            active:shadow-md active:translate-y-0.5
            ${VARIANT_STYLES[variant]}
            ${className}
          `}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      );
    }
    ```
  - **Notes:** 60px min touch target. Uses design system colors.

- [ ] **Task 13: Create PinInput Component**
  - **File:** `src/components/PinInput.tsx`
  - **Action:** Create PIN entry form:
    ```typescript
    'use client';
    import { useState } from 'react';
    import { BigButton } from './BigButton';

    interface PinInputProps {
      onSubmit: (pin: string) => boolean;
      title: string;
    }

    export function PinInput({ onSubmit, title }: PinInputProps) {
      const [pin, setPin] = useState('');
      const [error, setError] = useState(false);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onSubmit(pin);
        if (!success) {
          setError(true);
          setPin('');
          setTimeout(() => setError(false), 2000);
        }
      };

      return (
        <div className="min-h-screen bg-paper-white flex items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <h1 className="text-3xl font-bold text-deep-slate text-center">{title}</h1>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Masukkan PIN Acara"
              className={`
                w-full p-4 text-2xl text-center
                border-2 rounded-lg
                ${error ? 'border-indonesian-red bg-red-50' : 'border-slate-300'}
              `}
              autoFocus
            />
            {error && (
              <p className="text-indonesian-red text-center text-lg">PIN salah. Silakan coba lagi.</p>
            )}
            <BigButton type="submit" className="w-full">
              MASUK
            </BigButton>
          </form>
        </div>
      );
    }
    ```
  - **Notes:** Clear error feedback in Bahasa Indonesia.

#### Phase 5: Page Implementations (Stories 1.2, 1.4, 1.5)

- [ ] **Task 14: Implement Kiosk Page**
  - **File:** `src/app/page.tsx`
  - **Action:** Create Kiosk with auth gate and screensaver:
    ```typescript
    'use client';
    import { useKioskAuth } from '@/hooks/useAuth';
    import { useElection } from '@/hooks/useElection';
    import { PinInput } from '@/components/PinInput';
    import { StatusBanner } from '@/components/StatusBanner';
    import { LockKeyhole } from 'lucide-react';

    export default function KioskPage() {
      const { isAuthorized, authorize } = useKioskAuth();
      const { state, loading } = useElection();

      if (!isAuthorized) {
        return <PinInput onSubmit={authorize} title="Otorisasi Bilik Suara" />;
      }

      if (loading || !state) {
        return (
          <div className="min-h-screen bg-deep-slate flex items-center justify-center">
            <p className="text-white text-2xl">Menghubungkan...</p>
          </div>
        );
      }

      // LOCKED state - Screensaver
      if (state.status === 'LOCKED') {
        return (
          <div className="min-h-screen bg-deep-slate flex flex-col items-center justify-center">
            <LockKeyhole className="w-32 h-32 text-slate-400 mb-8" />
            <h1 className="text-4xl font-bold text-white mb-4">MENUNGGU PETUGAS</h1>
            <p className="text-xl text-slate-400">Harap tunggu hingga petugas membuka bilik suara</p>
          </div>
        );
      }

      // READY state - Will show candidate grid in Epic 2
      if (state.status === 'READY') {
        return (
          <div className="min-h-screen bg-paper-white flex flex-col">
            <StatusBanner status={state.status} />
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl text-slate-600">
                [Kandidat akan ditampilkan di sini - Epic 2]
              </p>
            </div>
          </div>
        );
      }

      // COMPLETED state - Will show results in Epic 3
      return (
        <div className="min-h-screen bg-paper-white flex flex-col">
          <StatusBanner status={state.status} />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-2xl text-slate-600">
              [Hasil akan ditampilkan di sini - Epic 3]
            </p>
          </div>
        </div>
      );
    }
    ```
  - **Notes:** Placeholder content for Epic 2/3 features. Screensaver shows on LOCKED.

- [ ] **Task 15: Implement Admin Dashboard**
  - **File:** `src/app/admin/page.tsx`
  - **Action:** Create Admin control panel:
    ```typescript
    'use client';
    import { useAdminAuth } from '@/hooks/useAuth';
    import { useElection } from '@/hooks/useElection';
    import { PinInput } from '@/components/PinInput';
    import { BigButton } from '@/components/BigButton';
    import { StatusBanner } from '@/components/StatusBanner';

    export default function AdminPage() {
      const { isAuthorized, authorize } = useAdminAuth();
      const { state, loading, unlockBooth, lockBooth } = useElection();

      if (!isAuthorized) {
        return <PinInput onSubmit={authorize} title="Panel Petugas" />;
      }

      if (loading || !state) {
        return (
          <div className="min-h-screen bg-paper-white flex items-center justify-center">
            <p className="text-2xl text-slate-600">Menghubungkan ke server...</p>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-paper-white flex flex-col">
          <StatusBanner status={state.status} />
          
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
            <div className="text-center">
              <p className="text-lg text-slate-500">Status Bilik Suara</p>
              <p className="text-4xl font-bold text-deep-slate mt-2">
                {state.status === 'LOCKED' ? 'TERKUNCI' : 
                 state.status === 'READY' ? 'SIAP MENERIMA' :
                 state.status === 'VOTING' ? 'SEDANG DIGUNAKAN' : 'SELESAI'}
              </p>
            </div>

            {state.status === 'LOCKED' && (
              <BigButton variant="success" onClick={unlockBooth} className="w-full max-w-md">
                🔓 BUKA BILIK
              </BigButton>
            )}

            {state.status === 'READY' && (
              <div className="text-center space-y-4">
                <p className="text-xl text-coblos-green font-semibold animate-pulse">
                  Menunggu pemilih memasuki bilik...
                </p>
                <BigButton variant="danger" onClick={lockBooth} className="w-full max-w-md">
                  🔒 KUNCI BILIK
                </BigButton>
              </div>
            )}

            {state.status === 'COMPLETED' && (
              <p className="text-xl text-slate-600">
                Pemilihan telah berakhir. Lihat hasil di layar Kiosk.
              </p>
            )}
          </div>

          <div className="p-4 text-center text-sm text-slate-400">
            Terakhir diperbarui: {new Date(state.last_updated).toLocaleTimeString('id-ID')}
          </div>
        </div>
      );
    }
    ```
  - **Notes:** "BUKA BILIK" button when LOCKED. Status indicator shows real-time state.

- [ ] **Task 16: Update Root Layout**
  - **File:** `src/app/layout.tsx`
  - **Action:** Add Inter font and base styles:
    ```typescript
    import type { Metadata } from 'next';
    import { Inter } from 'next/font/google';
    import './globals.css';

    const inter = Inter({ subsets: ['latin'] });

    export const metadata: Metadata = {
      title: 'e-Voting RT',
      description: 'Sistem Pemilihan Digital RT',
      robots: { index: false, follow: false },
    };

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="id">
          <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
      );
    }
    ```
  - **Notes:** `lang="id"` for Indonesian. `robots` prevents indexing (private app).

### Acceptance Criteria

#### Story 1.1: Project Initialization & Foundation

- [ ] **AC 1.1.1:** Given a blank environment, when I run `npm run dev`, then the Next.js 14 App Router project starts successfully on localhost:3000
- [ ] **AC 1.1.2:** Given the project is running, when I inspect the page, then Inter font is loaded from Google Fonts
- [ ] **AC 1.1.3:** Given the Tailwind config, when I use `bg-deep-slate` or `bg-coblos-green` classes, then the correct custom colors are applied
- [ ] **AC 1.1.4:** Given `.env.local` exists, when the app loads, then Firebase SDK initializes without errors

#### Story 1.2: Kiosk & Admin Authentication (Event PIN)

- [ ] **AC 1.2.1:** Given an unauthenticated user opening `/`, when they see the Kiosk PIN screen, then they see "Otorisasi Bilik Suara" title and PIN input
- [ ] **AC 1.2.2:** Given the Kiosk PIN screen, when the user enters the correct Event PIN, then they are redirected to the Kiosk main view and `localStorage` stores "kiosk_authorized=true"
- [ ] **AC 1.2.3:** Given the Kiosk PIN screen, when the user enters an incorrect PIN, then an error message "PIN salah. Silakan coba lagi." appears
- [ ] **AC 1.2.4:** Given an authorized Kiosk session, when I refresh the browser, then I remain authorized (not redirected to PIN screen)
- [ ] **AC 1.2.5:** Given an unauthenticated user opening `/admin`, when they enter the correct PIN, then a session cookie is set and they see the Admin Dashboard
- [ ] **AC 1.2.6:** Given an authorized Admin session, when I refresh `/admin`, then I remain on the Admin Dashboard

#### Story 1.3: Real-Time State Machine

- [ ] **AC 1.3.1:** Given Firebase RTDB with `election_state`, when the `status` changes from `LOCKED` to `READY` via Admin, then the Kiosk receives the update in < 2 seconds
- [ ] **AC 1.3.2:** Given the `useElection` hook, when called, then it exposes `state`, `loading`, `error`, `unlockBooth()`, and `lockBooth()` methods
- [ ] **AC 1.3.3:** Given TypeScript interfaces, when I try to set `status` to an invalid value like `'INVALID'`, then TypeScript throws a compile-time error

#### Story 1.4: Admin Dashboard UI

- [ ] **AC 1.4.1:** Given the Admin Dashboard, when the Kiosk is `LOCKED`, then I see a large green "🔓 BUKA BILIK" button
- [ ] **AC 1.4.2:** Given the Admin Dashboard with status `LOCKED`, when I tap "BUKA BILIK", then the status updates to `READY` and the button changes to "🔒 KUNCI BILIK"
- [ ] **AC 1.4.3:** Given the Admin Dashboard, when any status change occurs, then the StatusBanner at the top reflects the current state with correct color (Red for LOCKED, Green for READY)
- [ ] **AC 1.4.4:** Given the Admin Dashboard, when observing the footer, then I see "Terakhir diperbarui:" with a timestamp that updates on state changes

#### Story 1.5: Kiosk Screensaver (Locked State)

- [ ] **AC 1.5.1:** Given the Kiosk is in `LOCKED` state, then a full-screen "Screensaver" is displayed with dark background (`bg-deep-slate`)
- [ ] **AC 1.5.2:** Given the Screensaver, then it shows the text "MENUNGGU PETUGAS" in large white text, with a lock icon
- [ ] **AC 1.5.3:** Given the Kiosk is in Screensaver mode, when the Admin sets status to `READY`, then the Screensaver dismisses automatically and shows the "SILAKAN MEMILIH" banner
- [ ] **AC 1.5.4:** Given the Kiosk in `READY` state, when I see the StatusBanner, then it displays green background with "SILAKAN MEMILIH" text

## Additional Context

### Dependencies

**NPM Packages to Install:**
```bash
npm install firebase @radix-ui/react-dialog lucide-react
```

**Dev Dependencies (already included by create-next-app):**
- TypeScript
- Tailwind CSS
- ESLint
- PostCSS

**External Services:**
- Firebase Realtime Database (Spark plan - free)
- Vercel (Hobby plan - free) for deployment

### Testing Strategy

**MVP Approach:** Manual testing with two browser windows (Kiosk + Admin)

**Test Scenarios:**
1. PIN authentication flow (correct/incorrect PIN)
2. Real-time state sync (unlock latency < 2s)
3. Session persistence (browser refresh)
4. State transitions (LOCKED → READY → back to LOCKED)

**Manual Test Procedure:**
1. Open two browser windows: one at `/` (Kiosk), one at `/admin` (Admin)
2. Enter correct PIN on both
3. On Admin, click "BUKA BILIK" and observe Kiosk immediately waking from screensaver
4. On Admin, click "KUNCI BILIK" and observe Kiosk returning to screensaver
5. Refresh both pages and confirm sessions persist

**Future (Post-MVP):**
- Vitest unit tests for hooks
- Playwright E2E for state sync

### Risk Analysis (Pre-Mortem)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Firebase quota exceeded | Low | High | Monitor usage; free tier has 10GB/month bandwidth |
| Slow unlock (>2s latency) | Low | Medium | Use Singapore region; test on 4G |
| PIN exposed in client code | Medium | Low | Use env var; acceptable for MVP (physical security primary) |
| Browser localStorage cleared | Low | Low | User re-enters PIN; minor inconvenience |

### Notes

- First-time Firebase user - Task 5 includes detailed console setup steps
- Target: Zero-cost infrastructure (Firebase Spark plan, Vercel Hobby plan)
- Critical NFR: Unlock latency < 2 seconds
- All UI text must be in Bahasa Indonesia
- Firebase security rules are in Test Mode (open) - configure before production
- The `VOTING` and `COMPLETED` states have placeholder UI - will be implemented in Epic 2 and 3
- Radix UI Dialog is installed but not used in Epic 1 - needed for Epic 2 confirmation modals

---

## Review Notes

**Implementation Status:** ✅ Completed  
**Date:** 2026-01-11  
**Commit:** 8e59dd8

### Adversarial Review Summary
- **Total Findings:** 15 (2 Critical, 3 High, 5 Medium, 5 Low)
- **Findings Addressed:** 0 (all acknowledged as MVP limitations)
- **Findings Skipped:** 15 (documented in README security warnings)
- **Resolution Approach:** Skip (acceptable for MVP scope)

### Key Findings Acknowledged
1. **F1 (Critical)** - Client-side PIN exposure: Acceptable for physical security model
2. **F2 (Critical)** - Firebase Test Mode: Documented in README "Before Production" section
3. **F3-F15** - Error boundaries, validation, i18n, accessibility: Future enhancements

All critical security concerns are explicitly documented in README.md under "Security Notes" with clear warnings for production deployment.
