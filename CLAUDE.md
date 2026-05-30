# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # localhost:3000
npm run build      # production build
npm run lint       # ESLint
npx tsc --noEmit   # type-check (no test suite exists)
```

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · styled-components 6 · Framer Motion 12 · Zustand 5 · React Query 5 · GSAP 3.

Path alias: `@/` → `src/`. The app is a single page (`/`) rendered by `app/page.tsx` → `TournamentLayout` in `sections/bracket/`.

---

## Folder contract (STRICT — do not deviate)

Each folder has exactly one role. **Putting code in the wrong folder is the most common mistake.** Use this table as a flowchart before creating any new file.

| Folder | What goes here | What does NOT go here |
|---|---|---|
| `app/` | Next.js routes + BFF API handlers only | UI components, business logic |
| `app/api/` | BFF `route.ts` files (server-side) | Provider clients (use `lib/server.ts`) |
| `sections/<feature>/` | A feature area visible on the page | Anything shared by 2+ sections |
| `sections/<feature>/index.tsx` | Section root component (JSX only) | Animation objects, styled components, fetch calls |
| `sections/<feature>/styles.ts` | Styled components for the section | Section JSX |
| `sections/<feature>/components/<Name>/` | Sub-components used **only** by this section | Anything imported elsewhere → promote to `src/components/` |
| `sections/<feature>/hooks/` | React hooks specific to this section | Hooks used by 2+ sections → `src/hooks/` |
| `sections/<feature>/services/` | API call wrappers for this section | `fetch()` calls inside components/hooks |
| `sections/<feature>/animations/` | Framer Motion variants for this section | Inline animation objects in components |
| `sections/<feature>/types/` | Types used only by this section | Shared domain types → `src/types/` |
| `sections/<feature>/utils/` | Pure helpers for this section | Anything reusable → `src/utils/` |
| `components/<Name>/` | Shared UI used by 2+ sections | Section-specific UI |
| `components/<Name>/index.tsx` | Component JSX | Styled components |
| `components/<Name>/styles.ts` | Styled components | Component JSX |
| `theme/` | Design tokens (colors, spacing, fonts, radii, shadows, breakpoints) | Component styles |
| `animations/` | Global Framer Motion variants (fade, slide, scale, stagger, spring) | Feature-specific variants → `sections/<x>/animations/` |
| `stores/` | Zustand stores for **UI/interaction state only** | API response data (use React Query) |
| `providers/` | App-level React providers (Theme, QueryClient, StyledRegistry) | Business logic, hooks |
| `hooks/` | Hooks used by 2+ sections | Section-specific hooks |
| `queries/` | React Query key factories and query object definitions | API fetch logic (use services) |
| `lib/api/` | Browser-side HTTP client + endpoint URLs | Server-side code |
| `lib/server.ts` | Entry point for BFF routes — exports `getXxxRepository()` | Business logic |
| `lib/repositories/` | `createXxxRepository(bundles, cache)` — orchestrates providers + cache | HTTP calls |
| `lib/providers/<name>/` | One folder per external API: `client.ts` (HTTP) + `adapter.ts` (mapping) + `<name>.types.ts` | Business logic |
| `lib/cache/` | Cache abstraction + in-memory implementation | API logic |
| `lib/config/` | Zod env schema + competition registry | Runtime state |
| `lib/mock/` | Fallback seed data when no API key configured | Live data |
| `modules/realtime/` | Client-side simulation engine (no UI, no React except `useRealtime`) | UI rendering |
| `types/` | Shared TypeScript types | Section-specific types |
| `constants/` | App-wide constants (rounds, TTLs) | Section-specific constants |
| `utils/` | Pure utility functions | React hooks, side effects |
| `config/env.ts` | Browser-safe `NEXT_PUBLIC_*` accessors | Server env vars (use `lib/config/`) |

---

## Request flow (memorize this)

```
Browser
  └─ Section component               sections/<x>/index.tsx
       └─ section hook               sections/<x>/hooks/useXxx.ts
            └─ section service       sections/<x>/services/xxx.service.ts
                 └─ apiClient        lib/api/client.ts
                      │
                      ▼  HTTP GET /api/...
                      │
  Server (Next.js Route Handler)
  └─ app/api/<route>/route.ts
       └─ getXxxRepository()         lib/server.ts
            └─ repository            lib/repositories/<x>.ts
                 └─ provider chain   lib/providers/<name>/client.ts
                      └─ External API
```

**Rules:**
- Components **never** call `fetch()`. They call hooks.
- Hooks **never** call `fetch()`. They call services.
- Services **never** call external APIs directly. They call `apiClient` → BFF route.
- BFF routes **never** call external APIs directly. They call `getXxxRepository()` from `lib/server.ts`.

**No API key configured?** Every BFF route catches the error and falls back to `lib/mock/` data automatically.

---

## Naming conventions (STRICT)

| Pattern | Use for |
|---|---|
| `PascalCase/index.tsx` | React components — folder name = component name |
| `PascalCase/styles.ts` | Styled components for that folder |
| `useXxx.ts` | React hooks |
| `xxx.service.ts` | Service modules (API call wrappers) |
| `xxx.queries.ts` | React Query definition modules |
| `xxxStore.ts` | Zustand store modules |
| `createXxx()` | Factory functions returning plain objects |
| `getXxx()` | Lazy singletons (in `lib/server.ts`) |

**No classes** except `Error` subclasses in `lib/providers/errors.ts`. **No `this` keyword.**

---

## Coding rules

### Components
- Folder structure: `ComponentName/index.tsx` + `ComponentName/styles.ts`.
- `index.tsx` contains only JSX + handlers. No styled components, no animation objects, no `fetch()`.
- Hooks order: React → stores → section hooks → derived values → handlers → effects.

### Animations
- **Never** write inline `initial={{...}} animate={{...}}` objects.
- Import named variants from `@/animations/<file>` (global) or `./animations/<file>` (section).
- Variant naming: `xxxVariants` for `Variants` objects, `xxxAnimate` / `xxxTransition` for plain objects.

### Data fetching
- Use the 4-layer flow above. Never short-circuit.
- One service per section. Services only contain `apiClient.get/post()` calls.
- Mock data fallback lives in **hooks** (`data ?? MOCK_X`), not components.

### Stores (Zustand)
- Stores hold **only UI/interaction state**: zoom, selected ID, open/closed flags, tabs.
- Server data lives in React Query cache, never in Zustand.
- Each store: `xxxStore.ts` with `useXxxStore` hook, wrapped in `devtools` middleware.

### Server code (`lib/`)
- Everything in `lib/` (except `lib/api/`, `lib/mock/`, `lib/config/` browser-safe parts) runs **server-side only**.
- Never import `lib/server.ts`, `lib/repositories/*`, `lib/providers/*`, `lib/cache/*` from client components.

### Imports
- Use `@/` alias, not relative `../../`.
- Within the same section, relative imports are OK (`./components/X`, `../hooks/useY`).

---

## When adding a new feature (checklist)

**New page section?**
1. Create `sections/<name>/index.tsx` + `styles.ts`.
2. If it needs API data: add `services/<name>.service.ts` + `hooks/use<Name>.ts`.
3. If it needs animations: add `animations/<topic>.ts`.
4. Sub-components → `components/<Name>/index.tsx` + `styles.ts`.

**New API endpoint?**
1. Add `lib/providers/<name>/client.ts` method + `adapter.ts` mapping.
2. Add `lib/repositories/<x>.ts` method.
3. Add `app/api/<route>/route.ts` calling `getXxxRepository()`.
4. Add `lib/mock/` fallback inside the route's `catch`.
5. Add `queries/xxx.queries.ts` + section service + section hook.

**New shared component?**
- Lives in `sections/<x>/components/` first. **Only promote to `components/` when 2+ sections need it.**

**New shared hook?**
- Same rule — section-local first, promote on second usage.

---

## Realtime engine (`modules/realtime/`)

`useRealtime()` in `sections/app-shell/` boots:
1. `createMockWebSocket()` → simulates Socket.IO interface.
2. `getSimulationEngine()` → one `createMatchTimer()` per live match.
3. Per tick, `processMinute()` (Poisson probability) emits goals/cards/subs.
4. Events flow: `eventBus` → `realtimeStore` (scores) + `eventFeedStore` (toasts).

To swap for real Socket.IO: **replace only `mockWebSocket.ts`**.

---

## Provider chain (`lib/providers/`)

`.env.local` keys:
- `FOOTBALL_PROVIDER` — primary (`api-football` | `sportmonks` | `sportradar`)
- `FOOTBALL_FALLBACK` — comma-separated fallback list
- `API_FOOTBALL_KEY` / `SPORTMONKS_TOKEN` / `SPORTRADAR_KEY`

`lib/providers/chain.ts` creates bundles in priority order. Repositories try each in sequence (`withFallback`). Results cached in `lib/cache/` with TTL from `lib/cache/index.ts`.

---

## Don't

- ❌ Add new top-level folders in `src/`.
- ❌ Define styled components inside `index.tsx`.
- ❌ Write inline Framer Motion variant objects.
- ❌ Call `fetch()` in components or hooks.
- ❌ Store API response data in Zustand.
- ❌ Use classes (except `Error` subclasses).
- ❌ Import server-only code (`lib/server.ts` etc.) from client components.
- ❌ Promote section-local code to shared folders until a second consumer exists.
- ❌ Touch the realtime engine internals — only swap `mockWebSocket.ts` if integrating real WS.
