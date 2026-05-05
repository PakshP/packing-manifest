<div align="center">

# The Packing Manifest

**Your field guide to packing well.**

A multi-user packing list designed for month-long trips and serious adventures —
with a built-in TSA assistant that tells you what you can actually bring.

[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20Postgres-3ecf8e?logo=supabase)](https://supabase.com)

</div>

---

## Contents

- [What it does](#what-it-does)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [Design system](#design-system)
- [Scripts](#scripts)

---

## What it does

The Packing Manifest is a packing app for travelers who care about getting it
right. Sign in, customize the eight default categories, assign every item to a
bag, and watch your "elevation" rise as you pack. When you're not sure if
something is allowed through TSA — ask the built-in **Packing Assistant**:
a local, instant, no-API-call chatbot that searches 494 official TSA items
across four matching strategies.

It's built around four ideas:

1. **One source of truth.** All state lives in `app/page.tsx` and is debounced
   to a single Supabase row per user.
2. **Field-guide aesthetic.** Editorial typography, topographic patterns,
   organic ridgeline progress charts, and warm paper tones — not "another SaaS
   gradient."
3. **Local-first features.** The TSA chatbot runs entirely in the browser. No
   LLM, no API costs, no rate limits — just Fuse.js, a curated synonym map,
   and category fallbacks.
4. **Plain React.** No Redux, no Zustand, no React Query. Just `useState`,
   `useCallback`, `useEffect`, and one debounced save effect.

---

## Features

### Packing list
- Eight default categories tuned for long trips (pre-departure, sleep, kitchen,
  layers, footwear, fix-it, comfort, daypack)
- Bag assignment per item — checked, duffel, carry-on, backpack
- Two view modes: by **Category** or by **Bag**
- Per-category, per-bag, and global check/uncheck/reset actions
- "Elevation" progress chart that fills as items get packed
- Custom items survive resets; deleting your account wipes everything

### TSA Packing Assistant
- Floating compass button — opens a slide-in panel (right rail on desktop,
  full-screen on mobile)
- **Five-stage matching engine**, in order:
  1. **Filler strip** — removes "can I bring my", "in my carry-on", etc.
  2. **Exact match** against the 494-item TSA database
  3. **Synonym expansion** — ~110 curated terms ("razor", "vape", "bourbon" → real items)
  4. **Fuzzy match** — Fuse.js with a 0.45 confidence threshold
  5. **Category fallback** — eight regex rules (3-1-1 liquids, lithium, sharps,
     fireworks, aerosols, firearms, food, powders) for items not in the database
- Color-coded result pills using the verbatim TSA text — "Yes", "No",
  "Yes (Special Instructions)", etc.
- "Did you mean?" suggestion chips on near-misses
- Strategy debug badge so you can gauge confidence at a glance
- Chat history persists to `localStorage`, capped at 50 messages

### Account
- Email + password, with proper forgot-password flow that lands back on
  `/reset-password`
- Account modal with sign-out, reset-checks, reset-list, and full account
  deletion
- Account deletion is a server-only `/api/delete-account` route guarded by the
  service-role key

### Polish
- Light / dark-ready semantic CSS-variable palette
- Mobile-friendly throughout — sticky nav, slide-out panel, touch swipe-down to
  close the chatbot
- Topographic SVG patterns and film-grain noise overlays
- All destructive actions go through `<ConfirmDialog />` — no `window.confirm`
- Type-safe end-to-end: strict TypeScript, discriminated unions for chat results

---

## Tech stack

| Layer            | Choice                                                                 |
|------------------|------------------------------------------------------------------------|
| Framework        | Next.js 15 (App Router, RSC where useful)                              |
| Runtime          | React 19                                                               |
| Language         | TypeScript 5 (strict)                                                  |
| Styling          | Tailwind CSS 3 with semantic CSS-variable tokens                       |
| Auth + database  | Supabase (Auth + Postgres + RLS)                                       |
| Fuzzy search     | Fuse.js 7                                                              |
| Icons            | lucide-react                                                           |
| Fonts            | Fraunces, Inter, JetBrains Mono (Google Fonts)                         |
| Hosting          | Vercel-ready (zero-config)                                             |

No state library, no animation library, no UI component library — everything
is hand-rolled against Tailwind.

---

## Architecture

### State and saves

`app/page.tsx` is the single source of truth. All mutations are pure
`useState` updates. A single debounced `useEffect` (500 ms) writes the
resulting `categories` + `checked_items` JSON back to Supabase. There is one
`packing_lists` row per user, enforced by a unique constraint on `user_id`.

Item IDs are stable across renames (`usr_<base36-time>_<rand>`), so the
`checked_items` map never gets orphaned.

### TSA chatbot — local-first design

The chatbot does **zero** network calls at runtime. The 494-item TSA dataset
is bundled as a static JSON import (`lib/tsa-data.json`) and the search
engine is built once at module load. Strategies run in priority order; the
first hit wins:

```
user query
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  1. stripFiller()                                    │
│     "can I bring my razor in carry-on?" → "razor"   │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 2. Exact match  │  │ 3. Synonym map  │  │  4. Fuse.js     │
│ (Map lookup)    │→ │ (~110 entries)  │→ │  (threshold     │
│                 │  │                 │  │   0.45)         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │ 5. Category     │
                                         │    regex rules  │
                                         └─────────────────┘
                                                  │
                                                  ▼
                                          { type: "none",
                                            suggestions }
```

`SearchResult` is a discriminated union by `type` so every render branch
gets a fully typed payload. See `lib/tsa-search.ts`.

### Auth flow

- Supabase Auth handles email + password and recovery emails
- Session is read on mount and via `onAuthStateChange` subscription
- Recovery links land on `/reset-password`, which exchanges the recovery
  token for a session and lets the user pick a new password
- Account deletion calls `/api/delete-account` (server route, service-role
  key) and signs the user out

---

## Project structure

```
packing-manifest/
├── app/
│   ├── api/
│   │   └── delete-account/      # Server-only account deletion
│   ├── reset-password/          # Forgot-password landing page
│   ├── globals.css              # Theme variables, fonts, custom utilities
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main orchestrator (auth, mutations, save)
├── components/
│   ├── chat/                    # TSA Packing Assistant
│   │   ├── ChatLauncher.tsx     # Floating compass button
│   │   ├── ChatPanel.tsx        # Slide-out panel + focus trap
│   │   ├── ChatInput.tsx        # Sticky input + send
│   │   ├── EmptyState.tsx       # First-open welcome + starter chips
│   │   ├── MessageList.tsx      # aria-live conversation log
│   │   ├── MessageBubble.tsx    # User vs bot rendering
│   │   ├── ResultCard.tsx       # TSA item + status pills
│   │   └── SearchStrategyBadge.tsx
│   ├── patterns/
│   │   ├── TopoPattern.tsx      # SVG topographic contour pattern
│   │   └── TrailDivider.tsx
│   ├── ui/
│   │   ├── ConfirmDialog.tsx
│   │   └── KebabMenu.tsx
│   ├── AccountModal.tsx
│   ├── AuthScreen.tsx
│   ├── BagPanel.tsx
│   ├── CategoryPanel.tsx
│   ├── Footer.tsx
│   ├── ListActionsBar.tsx
│   ├── ListItem.tsx
│   ├── LoadingScreen.tsx
│   ├── PageHero.tsx
│   ├── ProgressCard.tsx         # Elevation-profile progress chart
│   ├── TabStrip.tsx
│   ├── TopNav.tsx
│   └── ViewModeToggle.tsx
├── lib/
│   ├── chat-store.ts            # useChatStore() hook + localStorage
│   ├── config.ts                # APP_NAME, APP_TAGLINE, CONTACT_EMAIL
│   ├── data.ts                  # BAGS, INITIAL_CATEGORIES, ICON_MAP
│   ├── styles.ts                # Accent → Tailwind class lookups
│   ├── supabase.ts              # Browser Supabase client
│   ├── supabaseAdmin.ts         # Server-only service-role client
│   ├── tsa-data.json            # 494 TSA items
│   ├── tsa-synonyms.ts          # ~110 curated synonyms
│   ├── tsa-categories.ts        # Regex fallback rules
│   └── tsa-search.ts            # Search engine (the brains)
├── types/
│   ├── index.ts                 # Bag, Category, PackingItem, etc.
│   └── tsa.ts                   # TsaItem, SearchResult, ChatMessage
├── supabase-setup.sql           # One-shot schema + RLS policies
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Local development

### Prerequisites

- Node.js 20 or newer
- A free Supabase project

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Create a .env.local in the project root with the variables below
```

```dotenv
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # server-only — see warning below
```

### Supabase configuration

1. Create a new project at [supabase.com](https://supabase.com).
2. From **Settings → API**, copy the **Project URL** and the new
   **Publishable key** (`sb_publishable_xxx`). Do **not** use the legacy
   `anon` key.
3. From **Settings → API → Project API keys**, also copy the
   **service_role** secret — it's only used server-side by
   `/api/delete-account`.
4. Open **SQL Editor**, paste the contents of
   [`supabase-setup.sql`](./supabase-setup.sql), and run it. This creates
   the `packing_lists` table, an `updated_at` trigger, and four RLS
   policies that key on `auth.uid()`.
5. Under **Authentication → URL Configuration**, set:
   - **Site URL** — `http://localhost:3000` (dev) or your real domain (prod)
   - **Redirect URLs** — add both `http://localhost:3000/**` and your
     production pattern. Must include `/reset-password` so the recovery
     link lands back in the app.

### Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and start
packing.

---

## Deployment

The app is configured to deploy to Vercel with zero config:

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the three environment variables in **Settings → Environment Variables**.
4. Deploy.
5. Copy the Vercel URL into Supabase's **Site URL** and add it to
   **Redirect URLs** (don't forget `/reset-password`).

It also runs anywhere that hosts Next.js 15 — the API route uses the standard
Node runtime and there are no Vercel-specific dependencies.

---

## Environment variables

| Variable                                | Required | Scope            | Notes                                                                  |
|-----------------------------------------|----------|------------------|------------------------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`              | Yes      | Client + server  | `https://<ref>.supabase.co`                                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`  | Yes      | Client + server  | New `sb_publishable_xxx` format. Not the legacy `anon` key.            |
| `SUPABASE_SERVICE_ROLE_KEY`             | Yes      | **Server only**  | Required for `/api/delete-account`. **Never** prefix with `NEXT_PUBLIC_`. |

> **Warning** — the service-role key bypasses RLS. Treat it like a database
> root password. It is only used inside `/api/delete-account` to remove a
> user's auth row.

Missing public vars throw a clear runtime error from `lib/supabase.ts`.
Missing the service-role key only fails when someone hits
`/api/delete-account`.

---

## Design system

### Palette (semantic tokens)

All colors flow through CSS variables in `app/globals.css`, exposed to
Tailwind via `tailwind.config.ts` as semantic classes. Components never
hardcode hex values.

| Token                  | Value     | Used for                                    |
|------------------------|-----------|---------------------------------------------|
| `bg-bg-base`           | `#f5f1ea` | Page background                             |
| `bg-bg-paper`          | `#fbf8f1` | Cards, panels                               |
| `bg-bg-elevated`       | `#ffffff` | Modals, popovers                            |
| `border-border-soft`   | `#e5dccb` | Default border                              |
| `border-border-strong` | `#c4b896` | Hovered, focused, active borders            |
| `text-ink-primary`     | `#1f2419` | Body text                                   |
| `text-ink-secondary`   | `#4a5246` | Supporting text                             |
| `text-ink-tertiary`    | `#8a8775` | Muted captions, mono labels                 |
| `accent-moss`          | `#5a6b3e` | Primary action, "allowed" pills             |
| `accent-rust`          | `#b8531f` | Destructive, "prohibited" pills             |
| `accent-river`         | `#4a6b7c` | Info, category-rule callouts                |
| `accent-summit`        | `#c89028` | Highlight, "conditional" pills              |

### Typography

- **Display / headings** — Fraunces (700 / 900). Editorial,
  expedition-journal feel.
- **Body** — Inter (400 / 500 / 600 / 700).
- **UI labels, badges, counts, debug strings** — JetBrains Mono with
  tabular figures.

All loaded via `@import` in `app/globals.css`.

### Patterns and motifs

- `<TopoPattern />` — SVG topographic contour rings around three cluster
  peaks. Props: `opacity`, `color`, `density: "sparse" | "medium" | "dense"`.
- `<TrailDivider />` — dashed line with a centered compass-rose chip.
- `.grain-overlay` — 3% film-grain noise overlay via fractal SVG filter.
- `.field-label` — uppercase mono caption used for "field guide" labels.
- `ProgressCard` chart — an organic ridgeline SVG path; the "packed"
  portion fills left-to-right via `clip-path` as the percentage rises.

---

## Scripts

```bash
npm run dev       # Next.js dev server with HMR
npm run build     # Production build
npm run start     # Run the built app
npm run lint      # ESLint
```

---

<div align="center">

Made for travelers who pack like they mean it.

</div>
