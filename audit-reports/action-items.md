# ADOHR Feature Area Implementation Plan & Revision Tracker

**Guiding Principles & Rescue Context**:
- **Animal Safety & Rigorous Vetting First**: We do NOT remove or compromise any vetting questions in Adoption, Foster, Volunteer, or Surrender. The goal is solely to reduce user friction (save progress, eliminate confusing errors, prevent lost work on mobile, fix responsive stepper clipping, and provide clear step indicators).
- **Donate Page Status**: Online credit card / Stripe donation buttons are intentionally disabled for the next 2–3 weeks while backend billing is finalized. We preserved the buttons, added a helpful "Coming soon in October" notice banner, and added a 1-tap "Copy Zelle Email" button for immediate gifts.
- **Single Responsibility & Project Rules**: Standardize overlays on `Drawer.vue`, enforce Vue 3 one-way data flow, and ensure WCAG 2.1 AA accessibility.
- **User Scope Constraint**: Skipped Happy Tails (11), Wishlist (12), News (13), and Medical Records (14) per direct user instruction to focus on critical conversion and vetting applications.

---

## 16 Feature Areas Tracker

### [x] 1. Home Page (`Home.vue` + `src/components/home/`) — Commit `4e4e2dc`
- [x] Fix heading level sequence (`h1` Hero → `h2` Spotlight → `h2` Mission → `h2` Success Stories → `h2` Impact → `h3`/`span` BannerButtons).
- [x] Mobile Spotlight: Enable horizontal swipeable scroll-snap so mobile users can view all 4 spotlight pets instead of being locked to 1 random pet.
- [x] Replace raw `<Spinner />` in Spotlight and Impact with `PetItemSkeleton` to prevent layout shift.
- [x] Fix pure computed derivation in `usePets.ts` (move `sessionStorage` updates to an explicit watcher).
- [x] Convert `EventPrepModal.vue` to `EventPrepDrawer.vue`.

### [x] 2. About Page (`About.vue` + `src/components/about/`) — Commit `d2347ff`
- [x] **Critical Fix**: Register `v-scroll-reveal` globally in `src/main.ts` to stop console errors and restore scroll reveals across all 7 sections.
- [x] Make PetSmart Pasadena physical address interactive with a Google/Apple Maps navigation link.
- [x] Refactor 3-column desktop FAQ grid in `AboutFAQ.vue` into a clean tabbed or single-column accordion to eliminate vertical whitespace gaps.
- [x] Purge commented-out dead Candid / GuideStar code in `AboutTransparency.vue`.
- [x] Differentiate Mission bullet copy from Home's mission section.

### [x] 3. Adopt Browse & Pet Discovery (`Adopt.vue` + `src/components/adopt/`) — Commit `c79ae71`
- [x] Convert `PetMatcherModal.vue` into `PetMatcherDrawer.vue` (using canonical `Drawer.vue` with focus trap).
- [x] Add explicit API error alert with "Retry" button when `store.fetchPetsList()` fails (stop masking failures as "No pets found").
- [x] Enlarge `.search-clear-btn` touch target to 44×44px.
- [x] Add `aria-pressed` / `aria-selected` to species filter pills ("All", "Cats", "Dogs") and the Favorites toggle.
- [x] Fix color contrast on warning banner text in `AdoptPageHeader.css` (meet 4.5:1 ratio).
- [x] Purge dead unreferenced file `GeneralApplicationCTA.vue`.

### [x] 4. Pet Card & Subcomponents (`PetItem.vue`, `PetPhotoBadges.vue`, `PetItemSkeleton.vue`) — Commit `03ff23c`
- [x] **Critical Fix**: Define `--color-primary-focus: var(--color-tertiary);` in `src/styles/base.css` to restore visible focus rings on cards.
- [x] Enlarge touch hit areas for favorite heart button (`.fav-btn`) and bottom dock badges to 44×44px using invisible pseudo-elements.
- [x] Add `@click.stop` to all dock badges so tapping a badge to read its label never accidentally navigates away to the pet detail page.
- [x] Add keyboard navigation support (`tabindex="0"`, `@keydown.enter="handleAdopt"`) on card images.
- [x] Migrate `PetItem.vue` runtime `defineProps` to pure TypeScript interface `IPetItemProps`.
- [x] Allow trait capsules to wrap cleanly (`flex-wrap: wrap`) instead of silently clipping.

### [x] 5. Pet Detail & Inquiry Flow (`AdoptDetail.vue`, `AdoptDetailMedia.vue`, Drawers) — Commit `1459bc7`
- [x] Establish visual hierarchy among the 4 action buttons (Primary: "Start Adoption" in Marmalade; Secondary: "Schedule a Meet" outline; Tertiary: "Request Info" and "Share").
- [x] **Critical Reactivity Fix**: Remove prop destructuring in `AdoptDrawer.vue` and `RequestInfoDrawer.vue` (`const props = defineProps<...>()`).
- [x] Consolidate legacy `common/drawer/Drawer.vue` into canonical `common/ui/Drawer.vue`.
- [x] Convert `PreQualModal.vue` into a Drawer flow (`PreQualDrawer.vue`).
- [x] Add focus trap and Escape key dismissal to the fullscreen photo lightbox in `AdoptDetailMedia.vue`.
- [x] Align `RequestInfoDrawer.vue` colors to the Open Door palette (replace cool teal `#0f766e` with Pine).
- [x] Purge orphaned dead files: `VaccinationItem.vue`, `AdoptionFAQ.vue`, `MoreFriends.vue`.

### [x] 6. Pet Adoption Application (`PetAdoption.vue` + `src/components/pet-adoption/`) — Commit `8aab62e`
- [x] **Preserve 100% of Vetting Questions**: Kept every single vetting question intact.
- [x] **Critical Reactivity Fix**: Eliminated direct prop mutations on `modelValue` across `NewCatSection`, `CurrentPetsSection`, `PastPetsSection`, `OtherSection`, and `SummarySection`. Bound sections directly to `useAdoptionStore()`.
- [x] Conditional Housing Questions: Only show landlord pet deposit and breed restriction questions if applicant rents (`homeOwnership !== 'Own'`).
- [x] Remove `required` attribute from spouse fields for single applicants in `GeneralSection.vue`.
- [x] Fix invalid HTML: Removed `<div class="line" />` from directly inside `<ol class="steps-container">` in favor of semantic CSS pseudo-elements.
- [x] Add accessible `aria-label`s to dynamic Add/Remove buttons for roommates, children, and pets.
- [x] Move validation summary above current step fields and scroll & focus first invalid input when Next fails.
- [x] Prefix TypeScript interfaces with `I` (`ICurrentPet`, `IPastPet`, `IAdoptFormState`).

### [x] 7. Donate Page (`Donate.vue`) — Commit `203d208`
- [x] Kept all 7 Stripe donation buttons preserved in disabled state pending billing completion in October.
- [x] Added informative helper badge & banner: *"Online checkout launching in October! In the meantime, please support our rescues via Zelle below."*
- [x] Added 1-tap **"Copy Zelle Email"** button next to `donate@adohr.org` (matching the EIN copy button).
- [x] Fixed low-contrast yellow text in `.vip-badge` to WCAG AAA compliant styling.
- [x] Extracted companion stylesheet `Donate.css` (< 200 lines in `.vue`).

### [x] 8. Volunteer Application (`Volunteer.vue` + `src/components/volunteer/`) — Commit `e1d8523`
- [x] **Preserve 100% of Vetting Questions**.
- [x] Fixed touch targets: Enlarged `.day-chip` buttons in `Availability.vue` to 44×44px.
- [x] Fixed tab order trap: Kept day buttons of unchecked shifts out of keyboard Tab order via `:inert`.
- [x] Fixed canvas ID collision: Provided unique canvas IDs in `InputSignature.vue` when under-21 co-signer signature appears.
- [x] Fixed canvas resize wipe: Redrawn existing signature data when device orientation changes.
- [x] Unified triplicated age calculation logic into `@/utils/date.ts`.
- [x] Debounced `localStorage` draft saving (300ms).
- [x] Added `<Footer />` landmark to page.

### [x] 9. Foster Application (`Foster.vue` + `src/components/foster/`) — Commit `5c7dda3`
- [x] **Preserve 100% of Vetting Questions**: Kept all vetting criteria intact to ensure animal safety.
- [x] Consolidated 10 wizard steps into 4 logical stages (`Applicant & Home`, `Pet History`, `Care & Skills`, `Agreement`) to eliminate stepper collision and cognitive fatigue while preserving 100% of information.
- [x] Fixed Form Enter submit: Support Enter key advancement inside form inputs.
- [x] Pre-filled signature date: Defaulted signature dates to `getTodayLocalIsoDate()` so users don't fail rigid date matching.
- [x] Replaced `<article>` wrappers with semantic divs in `FosterQuestionCard.vue`.
- [x] Replaced raw inputs in `FosterAgreement.vue` with `InputField.vue`.
- [x] Removed function props (`getVisibleQuestion`, `questionHasError`) in `FosterAgreement.vue`.
- [x] Debounced draft persistence to `localStorage`.
- [x] Added `<Footer />` landmark to page.

### [x] 10. Pet Surrender Intake (`SurrenderPet.vue` + `src/components/about/surrender/`) — Commit `12c5350`
- [x] **Critical Data Integrity Fix**: Implemented validation for Steps 0 through 6 in `surrenderValidation.ts` and `stores/surrender.ts` so incoming pet medical and behavior histories cannot be submitted blank.
- [x] **Critical Reactivity Fix**: Eliminated direct prop mutations on `formState` across all surrender sections; connected sections directly to Pinia store.
- [x] Eliminated `defineProps` destructuring across surrender subcomponents.
- [x] Eliminated all 5 `any` type casts in `FeedingSection.vue` and `SurrenderPet.vue`.
- [x] Made radio cards keyboard accessible in `PetSelectSection.vue` (`:has(input:focus-visible)` outline).
- [x] Dynamically interpolated animal type in medical, behavior, and feeding questions (replaces hardcoded "cat" when surrendering a dog).
- [x] Extracted `HouseholdSection.css` (184 lines) to enforce single-responsibility and keep component files < 350 lines.
- [x] Debounced draft persistence (300ms) and added `<Footer borderTopColor="white" />`.

### [~] 11. Happy Tails Alumni (`HappyTails.vue` + `src/components/happy-tails/`)
- *Deferred per user instruction to focus on core conversion flows.*

### [~] 12. Foster Supply Wishlist (`Wishlist.vue` + `src/components/wishlist/`)
- *Deferred per user instruction to focus on core conversion flows.*

### [~] 13. News & Updates (`News.vue`)
- *Deferred per user instruction to focus on core conversion flows.*

### [~] 14. Pet Medical Profile & Lookup (`MedicalRecordsLookup.vue`, `PetMedicalProfile.vue`)
- *Deferred per user instruction to focus on core conversion flows.*

### [x] 15. Not Found (404 Page) (`NotFound.vue`) — Commit `5243ca9`
- [x] **Critical SPA Fix**: Replaced `window.location.href = '/'` with `useRouter().push('/')` to preserve Pinia cache and instant routing.
- [x] Wrapped in semantic `<main class="not-found-container" id="main-content">` landmark.
- [x] Added secondary recovery navigation ("Meet Adoptable Pets →", "About & Contact", "Volunteer", "Foster Program").
- [x] Added accessible action buttons and high-contrast recovery links.

### [x] 16. Global Shell, Navigation & Shared UI (`App.vue`, `NavBar.vue`, `Footer.vue`, `ui/`) — Commit `e0647b9`
- [x] **Critical Accessibility Fix**: Rebuilt `Toggle.vue` with semantic `<button type="button" role="switch">`, `:aria-checked="props.modelValue"`, keyboard listeners (`Enter`/`Space`), and visible focus ring.
- [x] **Critical Accessibility Fix**: Implemented WAI-ARIA tabs pattern in `Tabs.vue` (`role="tablist"`, `role="tab"`, arrow navigation `ArrowLeft`/`ArrowRight`/`Home`/`End`, `:tabindex="active ? 0 : -1"`).
- [x] **Critical Accessibility Fix**: Made `Combobox.vue` keyboard accessible (ArrowDown, ArrowUp, Enter to select, Escape to close), added unique `id` and `for` association, `IComboboxOption` interface, and ARIA combobox/listbox attributes.
- [x] Added Tab focus trap, Escape key listener, and focus restoration to `common/ui/Drawer.vue` and `common/drawer/Drawer.vue`.
- [x] Added `<a href="#main-content" class="skip-link">Skip to main content</a>` in `App.vue` with high-contrast keyboard focus styling.
- [x] Purged orphaned dead files: `VaccinationItem.vue`, `AdoptionFAQ.vue`, `MoreFriends.vue`.
- [x] Added `<Footer />` globally to `Volunteer.vue`, `Foster.vue`, and `SurrenderPet.vue`.
