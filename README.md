# e-Voting RT - Sistem Pemilihan Digital RT

A real-time e-voting system for RT Chairman elections with remote control capabilities, designed for simplicity and accessibility.

![Status](https://img.shields.io/badge/status-production--ready-green)
![Firebase](https://img.shields.io/badge/Firebase-Free%20Tier-orange)

## ✨ Features

### 🏠 Dual Interface Architecture
- **Kiosk** (`/`) - Voter-facing touchscreen interface
- **Admin** (`/admin`) - Committee-controlled remote panel

### 🔐 Event PIN Authentication
- Single PIN for both interfaces (environment variable)
- Kiosk: localStorage-based session persistence
- Admin: cookie-based session management

### 📊 Real-Time State Machine
```
LOCKED → READY → VOTING → COMPLETED
```
- Sub-2-second synchronization via Firebase RTDB
- Admin remote control of Kiosk state
- Automatic state transitions after voting

### 🗳️ Complete Voting Flow (Epic 2)
- **2x2 Candidate Grid** - Photos, names, touch-friendly cards
- **Vote Confirmation Modal** - Expandable Visi & Misi section
- **Anonymous Vote Submission** - Only `candidate_id`, `timestamp`, `device_id`
- **Progress Bar** - Visual "Active Wait" during submission
- **Thank You Screen** - 3-second display with auto-lock

### 🏆 Results Display (Epic 3)
- **Bar Chart Results** - Pure CSS/Tailwind (no chart library)
- **Winner Highlighting** - Green bar + trophy icon
- **Vote Aggregation** - Client-side counting from Firebase
- **Total Vote Count** - Displayed in header

### ⚙️ Admin Controls
- **BUKA BILIK** - Unlock booth for next voter
- **KUNCI BILIK** - Lock booth (back to screensaver)
- **AKHIRI PEMILIHAN** - End election permanently (with confirmation)
- **RESET DATA** - Clear all votes for testing (COMPLETED state only)

### 🎨 Design System
- Custom Tailwind tokens (Deep Slate Blue, Indonesian Red, Coblos Green)
- Inter font from Google Fonts
- 60px minimum touch targets for elderly accessibility
- All UI text in **Bahasa Indonesia**

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Firebase Realtime Database** | Real-time state synchronization |
| **Radix UI Dialog** | Accessible modal components |
| **Lucide React** | Icon library |

## 📦 Project Structure

```
src/
├── app/
│   ├── admin/page.tsx        # Admin control panel
│   ├── layout.tsx            # Root layout with Inter font
│   ├── page.tsx              # Kiosk main page
│   └── globals.css           # Tailwind directives
├── components/
│   ├── BigButton.tsx         # Large touch-friendly button
│   ├── CandidateCard.tsx     # Individual candidate card
│   ├── CandidateGrid.tsx     # 2x2 candidate grid
│   ├── ConfirmDialog.tsx     # Reusable confirmation modal
│   ├── PinInput.tsx          # PIN authentication form
│   ├── ProgressBar.tsx       # Animated progress indicator
│   ├── ResultBar.tsx         # Individual result bar
│   ├── ResultsDisplay.tsx    # Full results view
│   ├── StatusBanner.tsx      # Election status indicator
│   ├── ThankYouScreen.tsx    # Post-vote success screen
│   └── VoteConfirmModal.tsx  # Vote confirmation with Visi/Misi
├── data/
│   └── candidates.ts         # Hardcoded candidate data
├── hooks/
│   ├── useAuth.ts            # Kiosk & Admin authentication
│   ├── useDeviceId.ts        # Persistent device UUID
│   ├── useElection.ts        # Real-time election state
│   ├── useResults.ts         # Vote aggregation
│   └── useVote.ts            # Vote submission
├── lib/
│   └── firebase.ts           # Firebase client initialization
├── types/
│   ├── candidate.ts          # Candidate interface
│   └── election.ts           # Election state types
└── public/
    └── candidates/           # Candidate photos (JPEG/SVG)
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" → Name: `e-voting-rt`
3. Disable Google Analytics (not needed)
4. Go to **Build** → **Realtime Database** → **Create Database**
5. Select **Singapore (asia-southeast1)** region
6. Start in **Test Mode** (allows all reads/writes for 30 days)
7. Go to **Project Settings** → **General** → **Your apps** → Web icon (`</>`)
8. Register app name: `e-voting-web`
9. Copy the `firebaseConfig` values

### 3. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_EVENT_PIN=123456
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Add Candidate Photos

Place candidate photos in `public/candidates/`:
- `candidate_1.jpeg`
- `candidate_2.jpeg`
- `candidate_3.jpeg`
- `placeholder.svg` (for candidates without photos)

### 5. Update Candidate Data

Edit `src/data/candidates.ts` with your candidate information:

```typescript
export const CANDIDATES: Candidate[] = [
  {
    id: 'candidate_1',
    number: 1,
    name: 'Nama Kandidat',
    photo: '/candidates/candidate_1.jpeg',
    visi: 'Visi kandidat...',
    misi: ['Misi 1', 'Misi 2', 'Misi 3'],
  },
  // ... more candidates
];
```

### 6. Run Development Server

```bash
npm run dev
```

Open:
- **Kiosk**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

Default PIN: `123456` (change in `.env.local`)

## 📱 LAN Access (Mobile/Tablet)

To access from other devices on the same network:

```bash
npm run dev
# Note the Network URL: http://192.168.x.x:3000
```

Access from mobile/tablet using the Network URL.

> **Note:** The app handles non-secure contexts (HTTP over LAN) with fallback UUID generation.

## 🧪 Manual Testing Procedure

### Basic Flow Test

1. Open two browser windows:
   - Window 1: http://localhost:3000 (Kiosk)
   - Window 2: http://localhost:3000/admin (Admin)

2. Enter PIN `123456` on both

3. **Admin**: Click "🔓 BUKA BILIK"
   - Kiosk wakes from screensaver
   - Status turns green: "SILAKAN MEMILIH"

4. **Kiosk**: Tap a candidate
   - Confirmation modal appears
   - Expand "Lihat Visi & Misi" to view details

5. **Kiosk**: Tap "YA, SAYA YAKIN"
   - Progress bar animates
   - "TERIMA KASIH" screen appears
   - Auto-locks after 3 seconds

6. Repeat steps 3-5 for multiple votes

7. **Admin**: Click "⚠️ AKHIRI PEMILIHAN"
   - Confirm in dialog
   - Kiosk shows results with bar chart

8. **Admin**: Click "🔄 RESET DATA" (optional, for testing)
   - Clears all votes
   - Resets to LOCKED state

### Verify in Firebase Console

```
/election_state
  └── status: "LOCKED" | "READY" | "VOTING" | "COMPLETED"

/votes/{auto-id}
  ├── candidate_id: "candidate_1"
  ├── timestamp: 1736579200000
  └── device_id: "uuid-string"
```

## 📊 Firebase Free Tier Limits

Your RT election is **well within free tier limits**:

| Resource | Free Limit | 200 Voters Estimate |
|----------|------------|---------------------|
| Storage | 1 GB | ~20 KB (0.002%) |
| Downloads | 10 GB/month | ~200 KB |
| Connections | 100 | 2 (Kiosk + Admin) |

✅ **You can run thousands of elections per month on the free tier!**

## 🔒 Security Notes

⚠️ **Before Production:**

1. **Firebase Security Rules** - Currently in Test Mode (30-day limit)
   ```json
   {
     "rules": {
       "election_state": {
         ".read": true,
         ".write": true
       },
       "votes": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

2. **Strong Event PIN** - Change default `123456` to a secure 6-digit PIN

3. **HTTPS** - Use Vercel or similar for automatic HTTPS

4. **Physical Security** - Keep Admin device with committee only

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

```bash
npx vercel
```

Add environment variables in Vercel Dashboard → Settings → Environment Variables.

## 📋 Acceptance Criteria Status

### Epic 1: System Foundation ✅
- [x] Next.js 14 App Router with TypeScript
- [x] Firebase Realtime Database integration
- [x] Event PIN authentication (Kiosk + Admin)
- [x] Real-time state machine (LOCKED → READY → VOTING → COMPLETED)
- [x] Admin Dashboard with unlock/lock controls
- [x] Kiosk Screensaver with auto-wake

### Epic 2: Voting Booth Experience ✅
- [x] 2x2 Candidate Grid with photos and names
- [x] Vote Confirmation Modal with Visi & Misi
- [x] Anonymous vote submission to Firebase `/votes`
- [x] Progress bar during submission
- [x] Thank You screen with 3-second auto-lock
- [x] 500ms debounce to prevent double-tap

### Epic 3: Magic Reveal (Results & Closing) ✅
- [x] "AKHIRI PEMILIHAN" button with confirmation dialog
- [x] Vote aggregation from Firebase
- [x] Bar chart results display with percentages
- [x] Winner highlighting (green + trophy icon)
- [x] "RESET DATA" button for testing (COMPLETED state only)
- [x] All votes cleared on reset

## 📄 License

Private - RT Internal Use Only

---

Built with ❤️ for RT community elections
