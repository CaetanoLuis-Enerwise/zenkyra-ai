# Zenkyra AI

> Your company already has knowledge. We turn it into intelligence.

Zenkyra AI is a premium enterprise SaaS platform that turns a company's private knowledge into a private, secure AI system. This repository contains the production-ready frontend, fully wired with realistic mock data and ready to be connected to a real backend.

## Stack

- **Next.js 15** (App Router) + React 19
- **TypeScript**
- **Tailwind CSS** + custom design tokens (light + dark)
- **shadcn/ui-style** primitives (Radix UI)
- **Framer Motion** for animation
- **Recharts** for analytics
- **Zustand** for client state
- **next-themes** for dark/light mode
- **cmdk** for the ⌘K command palette

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the local dev server   |
| `npm run build` | Build for production         |
| `npm run start` | Run the production server    |
| `npm run lint`  | Lint the project             |
| `npm test`      | Unit tests (vitest)          |

## Project structure

```
src/
├─ app/                # Next.js App Router routes
│  ├─ (marketing)/     # Public landing page
│  └─ (app)/           # Authenticated SaaS app
├─ components/
│  ├─ ui/              # shadcn-style primitives
│  ├─ layout/          # Sidebar, Topbar, CommandK, ThemeToggle
│  ├─ marketing/       # Landing-page sections
│  └─ app/             # Feature components (charts, chat, uploader, …)
├─ hooks/              # Reusable hooks
└─ lib/                # Mock data, types, utilities
```

## Mock mode vs live mode

The mode is fixed at **build time** by `NEXT_PUBLIC_API_URL` (`src/lib/config.ts`).

| | `NEXT_PUBLIC_API_URL` unset (default) | `NEXT_PUBLIC_API_URL=https://api.example.com` |
|---|---|---|
| App pages | `src/lib/mock-data.ts` behind the "Demo data" banner | Data from the FastAPI backend in `backend/` |
| `/login`, `/set-password` | 404 | Live |
| App shell | Open | Redirects to `/login` without a valid JWT |

Live mode wires: login (`POST /api/v1/auth/login`), `/set-password?token=…` (`POST /api/v1/auth/set-password`,
the page `PASSWORD_SET_URL_BASE` must point to), topbar/sidebar (`/auth/me`, `/tenants/me`), Overview KPIs
(`/analytics/summary`, `/documents`, `/billing/current`), Knowledge Hub (list / upload ≤25MB / delete on
`/documents`, chat on `POST /chat/messages` + `/chat/conversations/{id}/messages`) and Billing
(`/billing/current`, `/billing/plans`). Agents, Workflows, Analytics, Team, Security and Settings have no
backend data yet, so live mode shows a "not connected yet" state instead of sample numbers.

Backend settings that must match: `CORS_ALLOW_ORIGINS=<this site's origin>` and
`PASSWORD_SET_URL_BASE=<this site>/set-password`.

### Token storage and the XSS trade-off

The JWT is stored in `localStorage` (`zenkyra.jwt`) and sent as `Authorization: Bearer`. That keeps the
backend cookie-free and CSRF-free, but **any script running on this origin (an XSS bug or a compromised
dependency) can read the token** and use it until it expires (`ACCESS_TOKEN_EXPIRE_MINUTES`, 7 days by
default). Mitigations in place: React escaping, no `dangerouslySetInnerHTML` in the live components, logout
and any 401 clear the token. Before handling sensitive customer data consider: a shorter token lifetime, a
strict Content-Security-Policy, or moving to an `HttpOnly; Secure; SameSite` cookie set by the API (needs
backend changes + CSRF protection).

## License

© Zenkyra AI. All rights reserved.
