# The Packing Manifest

> Your field guide to packing well.

A multi-user packing list designed for month-long trips and serious adventures.
Sign in, customize the eight default categories, assign every item to a bag,
and watch your "elevation" rise as you pack. Built with Next.js 15, Tailwind v3,
and Supabase.

---

## File structure

```
packing-manifest/
├── app/
│   ├── globals.css           # Theme variables, fonts, custom utilities
│   ├── layout.tsx            # Root layout + ThemeProvider
│   └── page.tsx              # Main orchestrator (auth, mutations, save)
├── components/
│   ├── AccountModal.tsx
│   ├── AuthScreen.tsx
│   ├── BagPanel.tsx
│   ├── CategoryPanel.tsx
│   ├── Footer.tsx
│   ├── ListActionsBar.tsx
│   ├── ListItem.tsx
│   ├── LoadingScreen.tsx
│   ├── PageHero.tsx
│   ├── ProgressCard.tsx      # Elevation-profile progress chart
│   ├── TabStrip.tsx
│   ├── TopNav.tsx
│   ├── ViewModeToggle.tsx
│   ├── patterns/
│   │   ├── TopoPattern.tsx   # SVG topographic contour pattern
│   │   └── TrailDivider.tsx
│   └── ui/
│       ├── ConfirmDialog.tsx
│       ├── KebabMenu.tsx
│       └── ThemeToggle.tsx
├── lib/
│   ├── config.ts             # APP_NAME, APP_TAGLINE, CONTACT_EMAIL
│   ├── data.ts               # BAGS, INITIAL_CATEGORIES, ICON_MAP
│   ├── styles.ts             # Accent → Tailwind class lookups
│   └── supabase.ts           # Supabase client (publishable key)
├── types/
│   └── index.ts              # Bag, Category, PackingItem, etc.
├── public/
├── supabase-setup.sql        # Run this in the Supabase SQL editor
├── tailwind.config.ts        # Semantic CSS-variable token system
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── .env.local.example
└── README.md
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. From **Settings → API**, copy:
   - **Project URL** (`https://<ref>.supabase.co`)
   - **Publishable key** — the new `sb_publishable_xxx` format. Do **not** use
     the legacy `anon` key.

### 3. Run the schema

In **Supabase → SQL Editor**, paste the contents of
[`supabase-setup.sql`](./supabase-setup.sql) and run it. This creates the
`packing_lists` table, an `updated_at` trigger, and four RLS policies that key
on `auth.uid()`.

### 4. Configure auth providers

In **Supabase → Authentication → Providers**, **Email** is enabled by default.
Decide whether to require email confirmation in **Auth → Providers → Email**
(recommended on for production).

Then under **Authentication → URL Configuration**, set:

- **Site URL**: `http://localhost:3000` for dev, your real domain for prod.
- **Redirect URLs**: add both `http://localhost:3000/**` and your production
  domain pattern. Crucially, this must include `/reset-password` so the
  forgot-password recovery link can land back on the app.

### 5. Local environment

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxx
```

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js. No build command changes needed.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy.
6. After the first deploy, copy your Vercel URL and add it to Supabase's
   **Site URL** and **Redirect URLs** (don't forget `/reset-password`).

---

## Environment variables

| Var                                   | Required | Where it runs | Notes                                                                |
|---------------------------------------|----------|---------------|----------------------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`            | Yes      | Client + server | `https://<ref>.supabase.co`                                        |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`| Yes      | Client + server | The new `sb_publishable_xxx` key. Not the anon key.                |
| `SUPABASE_SERVICE_ROLE_KEY`           | Yes      | Server only     | Required for `/api/delete-account`. **Never** prefix with `NEXT_PUBLIC_`. |

Missing public vars throw a clear runtime error from `lib/supabase.ts`. Missing
the service-role key only fails when someone hits `/api/delete-account`.

---

## Design system

### Palette (semantic tokens)

All colors flow through CSS variables in `app/globals.css`, exposed to Tailwind
via `tailwind.config.ts` as semantic classes — never hardcoded hex.

| Token                  | Value       |
|------------------------|-------------|
| `bg-bg-base`           | `#f5f1ea`   |
| `bg-bg-paper`          | `#fbf8f1`   |
| `bg-bg-elevated`       | `#ffffff`   |
| `border-border-soft`   | `#e5dccb`   |
| `border-border-strong` | `#c4b896`   |
| `text-ink-primary`     | `#1f2419`   |
| `text-ink-secondary`   | `#4a5246`   |
| `text-ink-tertiary`    | `#8a8775`   |
| `text-accent-moss`     | `#5a6b3e`   |
| `text-accent-rust`     | `#b8531f`   |
| `text-accent-river`    | `#4a6b7c`   |
| `text-accent-summit`   | `#c89028`   |

### Typography

- **Display / headings** — Fraunces (700/900). Editorial, expedition-journal feel.
- **Body** — Inter (400/500/600/700).
- **UI labels, badges, counts** — JetBrains Mono with tabular figures.

All loaded via `@import` in `app/globals.css`.

### Patterns

- `<TopoPattern />` — SVG topographic contour rings around three cluster peaks.
  Props: `opacity`, `color`, `density: "sparse" | "medium" | "dense"`.
- `<TrailDivider />` — dashed line with a centered compass-rose chip.
- `.grain-overlay` — 3% film-grain noise overlay via fractal SVG filter.
- `.field-label` — uppercase mono caption used for "field guide" labels.
- `ProgressCard` chart — an organic ridgeline SVG path; the "packed" portion
  fills left-to-right via clip-path as the percentage rises.

---

## Architecture notes

- `app/page.tsx` owns all state. Mutations are pure `useState` updates; a single
  debounced effect (500 ms) writes the resulting `categories` + `checked_items`
  back to Supabase.
- All destructive actions surface through `<ConfirmDialog />` — there's no
  `window.confirm` anywhere.
- Item IDs stay stable across renames so the `checked_items` map doesn't break.
- One `packing_lists` row per user, enforced by a unique constraint on
  `user_id`.

---

## Scripts

```bash
npm run dev      # next dev
npm run build    # next build (production)
npm run start    # next start
npm run lint     # next lint
```
