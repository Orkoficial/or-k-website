# OR-K WORK

Internal agency-operations workspace, mounted at **`/work`**. Fully isolated from
the public marketing site — see the isolation notes below before changing
anything shared.

## Isolation contract

The public site (`app/page.tsx` + `app/globals.css`) must render **byte-identical**
to how it did before this module existed. Guardrails:

| Concern | How it's handled |
|---|---|
| Global CSS leaking into `/work` | `app/globals.css` is pulled into `@layer marketing` via `app/styles/marketing.css`; `work.css` declares `@layer marketing, theme, base, components, utilities` so Tailwind always wins on `/work`. Marketing routes load a single stylesheet, so the layer is invisible there. |
| Bare `nav` / `footer` rules in `globals.css` | Neutralised for `[data-orkwork]` in `work.css` (`@layer base`). |
| Marketing `body { cursor:none; background:… }` | Overridden by the `[data-orkwork]` wrapper in `work.css`. |
| Tailwind preflight hitting the marketing site | `work.css` is imported **only** by `app/work/layout.tsx`, so Next scopes it to `/work/*`. |
| Auth middleware touching the public site | `proxy.ts` matcher is `['/work/:path*']` only. |
| Component / util name clashes | Everything lives under `components/work/**`, `lib/work/**`, `hooks/work/**`; shadcn is configured (`components.json`) to install there. |

**Never** import `app/work/work.css` or `components/work/**` from the marketing
tree, and never add generic global rules to `app/globals.css`.

## Stack

- Next.js 16 App Router, React 19
- Supabase (Postgres + Auth + Storage + RLS) — `lib/work/supabase/*`
- Tailwind v4 + shadcn/ui (`new-york`, dark-only) — `components/work/ui/*`

## Setup

1. Create a Supabase project.
2. Copy `.env.example` → `.env.local` and fill in the keys.
3. Run migrations (added in the DB slice).

Until the keys exist the module runs in "preview mode": pages render, auth is
bypassed, the middleware passes through.

## Structure

```
app/work/
  layout.tsx            isolation wrapper (data-orkwork, dark, Geist, work.css)
  work.css              Tailwind + OR-K dark tokens (scoped to /work)
  login/                auth screen
  (app)/                authenticated shell (sidebar + topbar) + feature pages
components/work/         ui/ (shadcn) · shell/ · auth/
lib/work/               supabase/ · auth/ · navigation.tsx · utils.ts
proxy.ts                session refresh + route guard, matched to /work only
```
