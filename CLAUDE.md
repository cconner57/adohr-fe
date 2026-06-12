# ADOHR-FE

Public-facing website for A Dream of Home Rescue (ADOHR) — a pet adoption/rescue organization.

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript** (strict mode)
- **Vite** dev server on `:5173`, proxies API routes to backend at `:8080`
- **Pinia** for state management
- **Vue Router** for client-side routing
- **Vitest** + `@vue/test-utils` for testing

## Commands

- `npm run dev` — Start dev server
- `npm run check` — **Full validation** (type-check + eslint + stylelint + tests). Run this before committing.
- `npm run build` — Production build (type-check + vite build)
- `npm run lint` — ESLint with auto-fix
- `npm run format` — Prettier format all src files
- `npm run test:unit` — Vitest in watch mode
- `npm run test:check` — Vitest single run (CI mode)
- `npm run test:coverage` — Vitest with coverage report

## Code Conventions

### Style Rules
- No semicolons, single quotes, 100 char print width, trailing commas
- 2-space indentation, LF line endings
- Imports sorted by `simple-import-sort` (external first, then relative)

### TypeScript
- `@typescript-eslint/no-explicit-any`: error — never use `any`
- Strict mode enabled, no implicit any
- Prefix interfaces with `I` (e.g., `IPet`, `IVaccine`), types with `T`

### ESLint Key Rules
- `max-depth`: 4 levels max nesting
- `max-lines`: 500 lines per file
- `no-nested-ternary`: error
- `prefer-template`: use template literals
- `vue/no-v-html`: error

### Stylelint
- Max 4 levels of CSS nesting
- No named colors (use hex/rgb)
- Numeric font weights only

### Components
- Always use `<script setup lang="ts">` with Composition API
- Use `@/` path alias for all src imports (e.g., `@/components/...`)
- PascalCase for component names, kebab-case for directories
- Scoped CSS in Vue SFCs
- CSS variables for theming (`--color-primary`, `--text-primary`, etc.)

### State Management
- Pinia stores in `src/stores/`
- Composables in `src/composables/` for reusable logic
- Auth token stored in localStorage, sent as `Bearer` header

### API Integration
- Fetch-based API calls with `Authorization: Bearer` header
- API endpoints defined in `src/constants/api.ts`
- Vite proxies `/v1`, `/api`, `/pets`, `/applications` to backend

## Project Structure

```
src/
  api/              — API integration layer
  assets/           — Fonts, SVG icons
  components/       — UI components (organized by feature)
    common/ui/      — Base components (Button, Input, etc.)
    common/drawer/  — Modal drawer
    common/nav-bar/ — Responsive navigation
  composables/      — Vue composables (usePets, useScrollReveal, etc.)
  constants/        — API endpoints, breed data
  models/           — TypeScript interfaces (IPet, adopt/volunteer/surrender forms)
  pages/            — Page-level components (Home, Adopt, Volunteer, etc.)
  router/           — Route definitions
  stores/           — Pinia stores (pets, adoption, auth, ui, etc.)
  styles/           — Global CSS (reset, base, forms, breakpoints, transitions)
  utils/            — Validators, date helpers, fetch interceptor, haptics
  __tests__/        — Unit tests
```
