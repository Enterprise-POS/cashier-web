# Copilot instructions for this repository

## Project overview

This repo is a Next.js 16 + TypeScript enterprise POS / inventory admin app. The app uses the App Router under `src/app`, centralized route constants in `src/components/core/data/all_routes.tsx`, and a shared backend client layer in `src/_lib/action.ts` plus `src/components/core/data/serverRoutes.tsx`.

The UI is organized into route pages and reusable components under `src/components`, while typed API shapes live in `src/_interface` and model/helper classes live in `src/_classes`. Styling is primarily global SCSS and vendor CSS from `src/assets/scss` and `src/assets/plugins`.

## Build, test, and lint commands

Use the repo’s existing scripts from `package.json`:

```bash
npm install
npm run dev
npm run build
npm run lint
```

Notes:
- There is no `test` script or dedicated test runner configured in this repo right now.
- For a focused validation step without running the full suite, use a single-file lint or type check when you need to validate one area:

```bash
npx eslint src/app/login/page.tsx
npx tsc --noEmit
```

This project uses the `@/*` alias (`src/*`) and a standard Next.js build pipeline. Prefer the checked-in `package-lock.json` when installing dependencies.

## High-level architecture

### App shell and auth flow

- `src/app/layout.tsx` is the root app shell. It wraps the app in:
  - `QueryProvider` (`src/components/provider/QueryProvider.tsx`)
  - `TenantProvider` (`src/components/provider/TenantProvider.tsx`)
  - `StoreProvider` (`src/components/provider/StoreProvider.tsx`)
  - global `Header` and `Sidebar`
- Auth is cookie-based: the enterprise POS JWT is stored in a cookie and read in the root layout / server-side auth checks.
- `src/_lib/action.ts` contains the server actions used for sign-in, sign-up, sign-out, tenant lookup, and similar backend calls. Keep auth and cookie logic there, not in client components.

### Data access pattern

- Backend URLs are centralized in `src/components/core/data/serverRoutes.tsx`.
- Route constants are centralized in `src/components/core/data/all_routes.tsx`.
- Client-side state for tenant and selected store is managed by context providers instead of ad hoc local state. These providers fetch and cache IDs in `localStorage` using `Constants.LocalStorageKey`.
- The codebase frequently uses typed request/response definitions in `src/_interface` and instance wrappers in `src/_classes` to mirror backend payloads.

### Feature layout

- Route-level pages live in `src/app/*` and match the URL structure.
- Reusable feature UI lives under `src/components/*` (for example `home`, `manage_stocks`, `store_list`, `inventory`, `product_list`, `user_management`).
- The project has a substantial set of prebuilt dashboard/admin pages and shared SCSS theme assets rather than a small, single-screen app.

## Key conventions in this codebase

- Prefer repository constants over hardcoded strings:
  - use `all_routes` for navigation paths
  - use `serverRoutes` for external API URLs
  - use `Constants` for local storage / cookie keys
- Keep `use client` providers and UI logic separated from server-side auth/actions. The app is deliberately split between server actions and client context/state layers.
- When adding or changing API calls, follow the existing pattern in `src/_lib/action.ts`: validate form data first, call `fetch(...)`, convert backend errors through `getUserFacingHttpError`, and return `{ result, error }` shaped responses.
- Tenant/store selection is stateful and persisted. Any new feature that depends on the current tenant or selected store should respect the context providers and the cached IDs rather than duplicating fetch logic.
- Use the `@/*` alias for imports; avoid relative-heavy paths when touching existing files.
- The project uses a theme CSS system with vendor assets under `src/assets` and SCSS under `src/assets/scss`; match the existing visual patterns and avoid ad hoc custom CSS when there is already a theme component or utility.
- Types matter here: backend data is strongly typed through the interfaces in `src/_interface`; keep new response models aligned with the actual JSON the server sends.

## Practical working guidance

- If you are implementing a new page or feature, check the nearest existing page under `src/app` and the matching component under `src/components` before creating a new pattern.
- If a change touches navigation, route names, or API endpoints, update the centralized route definitions instead of scattering strings across files.
- For auth-sensitive flows, verify any change still respects the cookie-based login flow and `TenantProvider`/`StoreProvider` expectations.
- Keep feature work aligned with the existing “admin dashboard / POS management” product structure instead of introducing a generic app pattern that conflicts with the current layout.
