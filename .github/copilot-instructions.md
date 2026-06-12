# Copilot Instructions for ADOHR

Welcome to the ADOHR codebase! This document provides essential guidelines for AI coding agents to be productive in this project. Please follow these instructions to ensure consistency and alignment with the project's architecture and conventions.

---

## 1. Project Overview

ADOHR is a Vue 3 application built with Vite. It features a modular structure with components organized by domain-specific functionality. The project emphasizes:

- **Component-based architecture**: Reusable and domain-specific components.
- **TypeScript integration**: Strong typing for `.ts` and `.vue` files.
- **State management**: Centralized data handling using Vue's Composition API.
- **Testing**: Unit tests using Vitest.

---

## 2. File Structure & Patterns

- **`src/components/`**: Contains reusable UI components, organized by feature (e.g., `adopt`, `volunteer`). Subfolders group related components.
- **`src/pages/`**: Defines top-level pages for routing.
- **`src/router/index.ts`**: Centralized routing configuration.
- **`src/stores/`**: Contains mock data and state management files.
- **`src/utils/`**: Utility functions for shared logic.
- **`public/`**: Static assets like images and fonts.
- **`vite.config.ts`**: Vite configuration file.
- **`tsconfig.json`**: TypeScript configuration.
- **`src/models/`**: TypeScript interfaces for data structures.
- **`src/constants/`**: Static data and enums.
- **`src/assets/`**: Icons, fonts, and images. Use strict navigation (relative or absolute paths).

---

## 3. File Format & Order

- Each `.vue` file must follow this order: `<script>` element first, then `<template>`, then `<style>`.
- The `<script>` element must always use `setup lang="ts"`.
- The `<style>` element must always be `scoped`.
- All imports must be at the very top of the `<script>` tag, organized, and unused imports must be removed.
- If the `<template>` is too large, refactor and create reusable components.
- If the `<style>` is too large, move it to its own external CSS file.

---

## 4. Data Flow

- Data is passed from views to components via props.
- Example: `Adopt.vue` defines pet arrays and passes them to `AdoptSummary` with pet info.
- Use TypeScript interfaces to define prop shapes.

---

## 5. Developer Workflows

### Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

### Testing

- Run unit tests:
  ```sh
  npm run test:unit
  ```
- Add tests in `src/__tests__/` following the `*.spec.ts` naming convention.

### Linting

- Check code quality:
  ```sh
  npm run lint
  ```

### Build

- Create a production build:
  ```sh
  npm run build
  ```

### Additional Commands

- **Type check:**
  ```sh
  npm run type-check
  ```
- **E2E tests (if applicable):**
  ```sh
  npm run test:e2e
  ```
- **Format code:**
  ```sh
  npm run format
  ```

---

## 6. Project-Specific Conventions

### Component Structure

- **File organization**: Group components by feature (e.g., `adopt`, `volunteer`).
- **Naming**: Use PascalCase for component names (e.g., `AdoptionFAQ.vue`).
- **Props and Events**: Define props and emit events explicitly with TypeScript annotations.

### State Management

- Use the Composition API for state management.
- Mock data is stored in `src/stores/mockPetData.ts`.

### Routing

- Define routes in `src/router/index.ts`.
- Use lazy loading for page components.

### Styling

- Global styles are in `src/styles/`.
- Follow the BEM methodology for CSS class naming.

### Mock Data Management

- Store all mock data in `src/constants/` or a dedicated `src/mock/` directory.
- Do not hardcode mock data directly in components or views unless for quick prototyping.

### Asset Usage

- Reference all static assets (icons, images, fonts, SVGs) using strict navigation (relative or absolute paths).
- All SVG images must be placed in the `src/assets/` folder and referenced from there.
- Do not import assets from outside the `src/assets/` directory.

---

## 7. Integration Points

- **Vite plugins:** `@vitejs/plugin-vue`, `vite-plugin-vue-devtools`.
- **Testing:** Vitest for unit, Playwright for E2E.
- **No backend/API integration** is present; all data is local/mock.

---

## 8. Code Modification and Contribution Guidelines for AI Coding Agent

These instructions guide AI-assisted code contributions to ensure precision, maintainability, and alignment with project architecture. Follow each rule exactly unless explicitly told otherwise.

### 8.1. General Principles

1. **Minimize Scope of Change**: Identify the smallest unit (function, class, or module) that fulfills the requirement. Do not modify unrelated code. Avoid refactoring unless required for correctness or explicitly requested.
2. **Preserve System Behavior**: Ensure the change does not affect existing features or alter outputs outside the intended scope. Maintain original patterns, APIs, and architectural structure unless otherwise instructed.
3. **Graduated Change Strategy**: Default to minimal, focused change. If needed, apply small, local refactorings. Only if explicitly requested, perform broad restructuring across files or modules.
4. **Clarify Before Acting on Ambiguity**: If the task scope is unclear or may impact multiple components, stop and request clarification. Never assume broader intent beyond the described requirement.
5. **Ensure Reversibility**: Write changes so they can be easily undone. Avoid cascading or tightly coupled edits.

### 8.2. Code Quality & Testing

6. **Code Quality Standards:**
   - Clarity: Use descriptive names. Keep functions short and single-purpose.
   - Consistency: Match existing styles, patterns, and naming.
   - Error Handling: Use try/catch. Anticipate failures (e.g., I/O, user input).
   - Security: Sanitize inputs. Avoid hardcoding secrets. Use environment variables for config.
   - Testability: Enable unit testing. Prefer dependency injection over global state.
   - Documentation: Use JSDoc for JS/TS, and comment only non-obvious logic.
7. **Testing Requirements:** Add or modify only tests directly related to your change. Ensure both success and failure paths are covered. Do not delete existing tests unless explicitly allowed.

### 8.3. Workflow & Commit Standards

8. **Commit Message Format:** Use the [Conventional Commits](https://www.conventionalcommits.org) format. Structure: `type(scope): message`, using imperative mood. Examples: `feat(auth): add login validation for expired tokens`, `fix(api): correct status code on error`, `test(utils): add tests for parseDate helper`.
9. **Forbidden Actions Unless Explicitly Requested:** No global refactoring across files, changes to unrelated modules, formatting/style-only changes without functional reason, or adding new dependencies.
10. **Handling Ambiguous References:** When encountering ambiguous terms (e.g., "this component", "the helper"), always refer to the exact file path and line numbers when possible. If exact location is unclear, ask for clarification before proceeding. Never assume the meaning of ambiguous references.

---

## 9. Additional Best Practices for ADOHR

### 9.1. Component Naming and Placement

- Name components using PascalCase (e.g., `AdoptSummary.vue`).
- Place each component in its own file within a relevant subfolder if it belongs to a feature group (e.g., `adopt/`, `volunteer/`).
- Avoid generic names like `Component.vue` or `Helper.vue`.

### 9.2. Props and Emits

- Always type props and emits using TypeScript interfaces or types.
- Document expected prop shapes in the script section using JSDoc if the type is complex.

### 9.3. CSS/Styling

- Use BEM or utility-first naming for custom classes if not using a framework.
- Prefer CSS modules or scoped styles for new components to avoid style leakage.
- All CSS files must be placed within the `src/styles/` folder. You may create subfolders within `src/styles/` for organization, but no CSS file should exist outside this directory.

### 9.4. Accessibility

- Ensure all interactive elements (buttons, links) have accessible labels and roles.
- Use semantic HTML wherever possible.
- Lazy-load large components or views using dynamic imports when possible.
- Avoid unnecessary reactivity in the script setup.

### 9.5. Advanced Practices

- **Error Boundaries and Fallbacks:** For critical UI components, use error boundaries or fallback UIs to prevent a single failure from breaking the whole app.
- **Consistent Import Paths:** Do not use the `@` alias for internal imports. Always use strict navigation (relative or absolute paths) to reference files or images, even within the same directory, to ensure clarity and maintainability.
- **Component Registration:** For global components (used in many places), register them in a single location (e.g., a `components/index.ts`) and import from there.
- **Pinia Store Usage:** When using Pinia, keep stores flat and focused. Avoid deeply nested state. Use actions for business logic, and keep state serializable.
- **Prop Validation:** Use TypeScript types for all props, but also add `required` and default values in the prop definition when appropriate for runtime safety.
- **Accessibility Testing:** Use tools like axe or Lighthouse to periodically check for accessibility issues, especially after UI changes.
- **Documentation:** For any new utility or helper function, add a short usage example in a comment or in a `README.md` in the `utils/` directory.
- **Deprecation Notices:** If a component, prop, or utility is deprecated, add a clear comment and, if possible, a console warning to guide future maintainers.
- **Performance Budgets:** Set and monitor performance budgets (e.g., bundle size, initial load time) using Vite or CI tools, and document thresholds in the README.
- **Security Practices:** Never interpolate raw user input into the DOM. Always sanitize or escape as needed, especially if adding new features that handle user content.

---

For any questions or clarifications, consult the project maintainers or refer to the documentation in the `docs/` folder (if available).
