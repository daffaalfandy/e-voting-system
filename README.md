# e-Voting RT - Sistem Pemilihan Digital RT

A real-time e-voting system for RT Chairman elections with remote control capabilities.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Firebase Realtime Database** - Real-time state synchronization
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library

## Features (Epic 1 - System Foundation)

✅ **Dual Interface Architecture**
- Kiosk interface at `/` (voter-facing)
- Admin control panel at `/admin` (committee-facing)

✅ **Event PIN Authentication**
- Single PIN for both interfaces (configurable via environment variable)
- Kiosk: localStorage-based session persistence
- Admin: cookie-based session management

✅ **Real-Time State Machine**
- LOCKED → READY → VOTING → COMPLETED
- Sub-2-second synchronization via Firebase RTDB
- Admin remote control of Kiosk state

✅ **Kiosk Screensaver**
- "MENUNGGU PETUGAS" display when LOCKED
- Automatic wake-up on Admin unlock signal

✅ **Design System**
- Custom Tailwind tokens (Deep Slate Blue, Indonesian Red, Coblos Green)
- Inter font from Google Fonts
- 60px minimum touch targets for elderly accessibility
- All UI text in Bahasa Indonesia

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" → Name: "e-voting-rt"
3. Disable Google Analytics (not needed)
4. Go to "Build" → "Realtime Database" → "Create Database"
5. Select "Singapore (asia-southeast1)" region
6. Start in **Test Mode** (allows all reads/writes for 30 days)
7. Go to Project Settings → General → "Your apps" → Web icon (`</>`)
8. Register app name: "e-voting-web"
9. Copy the `firebaseConfig` values

### 3. Configure Environment Variables

Create or update `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_EVENT_PIN=123456
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Initialize Firebase Database

In Firebase Console → Realtime Database, manually add initial data:

```json
{
  "election_state": {
    "status": "LOCKED",
    "last_updated": 0,
    "session_id": ""
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Open:
- Kiosk: http://localhost:3000
- Admin: http://localhost:3000/admin

Default PIN: `123456` (change in `.env.local`)

## Manual Testing Procedure

1. Open two browser windows:
   - Window 1: http://localhost:3000 (Kiosk)
   - Window 2: http://localhost:3000/admin (Admin)

2. Enter PIN `123456` on both

3. On Admin, click "🔓 BUKA BILIK"
   - Observe Kiosk immediately wakes from screensaver
   - Status banner turns green: "SILAKAN MEMILIH"

4. On Admin, click "🔒 KUNCI BILIK"
   - Observe Kiosk returns to screensaver

5. Refresh both pages
   - Confirm sessions persist (no re-authentication required)

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin control panel
│   ├── layout.tsx             # Root layout with Inter font
│   ├── page.tsx               # Kiosk main page
│   └── globals.css            # Tailwind directives
├── components/
│   ├── BigButton.tsx          # Large touch-friendly button
│   ├── PinInput.tsx           # PIN authentication form
│   └── StatusBanner.tsx       # Election status indicator
├── hooks/
│   ├── useAuth.ts             # Kiosk & Admin authentication
│   └── useElection.ts         # Real-time election state
├── lib/
│   └── firebase.ts            # Firebase client initialization
└── types/
    └── election.ts            # TypeScript interfaces
```

## Acceptance Criteria Status

### Story 1.1: Project Initialization ✅
- [x] Next.js 14 App Router starts on localhost:3000
- [x] Inter font loaded from Google Fonts
- [x] Custom Tailwind colors applied correctly
- [x] Firebase SDK initializes without errors

### Story 1.2: Authentication ✅
- [x] Kiosk PIN screen shows "Otorisasi Bilik Suara"
- [x] Correct PIN stores `kiosk_authorized=true` in localStorage
- [x] Incorrect PIN shows error: "PIN salah. Silakan coba lagi."
- [x] Kiosk session persists on browser refresh
- [x] Admin PIN sets session cookie
- [x] Admin session persists on refresh

### Story 1.3: Real-Time State Machine ✅
- [x] State changes sync in <2 seconds
- [x] `useElection` hook exposes state, loading, error, unlockBooth, lockBooth
- [x] TypeScript enforces valid ElectionStatus values

### Story 1.4: Admin Dashboard ✅
- [x] Shows "🔓 BUKA BILIK" button when LOCKED
- [x] Button changes to "🔒 KUNCI BILIK" when READY
- [x] StatusBanner reflects current state with correct colors
- [x] Footer shows "Terakhir diperbarui" timestamp

### Story 1.5: Kiosk Screensaver ✅
- [x] Full-screen screensaver with dark background when LOCKED
- [x] Shows "MENUNGGU PETUGAS" with lock icon
- [x] Dismisses automatically when Admin unlocks
- [x] Shows green "SILAKAN MEMILIH" banner when READY

## Next Steps (Epic 2 & 3)

- **Epic 2**: Candidate grid, vote selection, confirmation dialog, vote submission
- **Epic 3**: Results display with "Magic Reveal" animation

## Security Notes

⚠️ **Before Production:**
- Configure Firebase Security Rules (currently in Test Mode)
- Use strong Event PIN (not default `123456`)
- Enable HTTPS for deployment
- Consider server-side PIN validation

## Deployment

Build for production:

```bash
npm run build
npm start
```

Deploy to Vercel (recommended):

```bash
npx vercel
```

## License

Private - RT Internal Use Only
