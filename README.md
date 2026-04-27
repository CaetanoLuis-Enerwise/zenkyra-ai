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

## Connecting a real backend

Mock data lives in `src/lib/mock-data.ts` and is consumed by the UI through small typed helpers. Swap any helper for a `fetch` / `tRPC` / `Server Action` call without touching the components.

## License

© Zenkyra AI. All rights reserved.
