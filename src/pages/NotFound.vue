<script setup lang="ts">
import { useRouter } from 'vue-router'

import Button from '@/components/common/ui/Button.vue'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}

const handleGoAdopt = () => {
  router.push('/adopt')
}
</script>

<template>
  <main id="main-content" class="not-found-container" aria-labelledby="not-found-heading">
    <div class="content">
      <img
        src="/images/404.jpeg"
        alt="A pet looking for directions - 404 Not Found"
        class="not-found-image"
        width="280"
        height="280"
      />
      <h1 id="not-found-heading">Oops! Page Not Found</h1>
      <p>The page you are looking for might have been moved, renamed, or is temporarily unavailable.</p>
      <div class="action-buttons">
        <Button
          class="btn-return-home"
          @click="handleGoHome"
          title="Return Home"
          theme="secondary"
          size="large"
        />
        <Button
          class="btn-adopt-pets"
          @click="handleGoAdopt"
          title="Meet Adoptable Pets"
          variant="secondary"
          size="large"
        />
      </div>

      <nav class="recovery-links" aria-label="Helpful navigation links">
        <span class="recovery-label">Or explore:</span>
        <router-link to="/about" class="recovery-link">About & Contact</router-link>
        <span class="bullet" aria-hidden="true">•</span>
        <router-link to="/volunteer" class="recovery-link">Volunteer</router-link>
        <span class="bullet" aria-hidden="true">•</span>
        <router-link to="/foster" class="recovery-link">Foster Program</router-link>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-primary);
  padding: 2rem;
  padding-top: 8rem;
  text-align: center;
}

@media (width <= 768px) {
  .not-found-container {
    padding-top: 6rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.not-found-image {
  width: min(75vw, 280px);
  height: min(75vw, 280px);
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: var(--radius-full, 50%);
  border: 4px solid oklch(from var(--text-inverse) l c h / 18%);
  box-shadow: 0 16px 36px -8px oklch(0% 0 0 / 30%);
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

h1 {
  color: var(--text-inverse);
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
}

p {
  color: oklch(from var(--text-inverse) l c h / 88%);
  font-size: 1.15rem;
  font-weight: 500;
  margin: 0 0 0.5rem;
  line-height: 1.55;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Return Home: high-contrast brand Marmalade CTA on dark green ground */
:deep(.btn-return-home) {
  background-color: var(--color-secondary, #e0571f) !important;
  color: var(--text-inverse, #ffffff) !important;
  border: 1.5px solid transparent !important;
  box-shadow: 0 4px 14px oklch(0% 0 0 / 25%) !important;
  font-weight: 700 !important;
}

:deep(.btn-return-home:hover:not(:disabled)) {
  background-color: #c94a15 !important;
  box-shadow: 0 6px 18px oklch(0% 0 0 / 35%) !important;
  translate: 0 -2px !important;
}

:deep(.btn-return-home:active:not(:disabled)) {
  translate: 0 0 !important;
  box-shadow: 0 2px 6px oklch(0% 0 0 / 25%) !important;
}

/* Meet Adoptable Pets: crisp high-contrast outline on dark pine ground */
:deep(.btn-adopt-pets) {
  background-color: transparent !important;
  color: var(--text-inverse, #ffffff) !important;
  border: 1.5px solid oklch(from var(--text-inverse) l c h / 75%) !important;
  font-weight: 700 !important;
}

:deep(.btn-adopt-pets:hover:not(:disabled)) {
  background-color: oklch(from var(--text-inverse) l c h / 14%) !important;
  border-color: var(--text-inverse, #ffffff) !important;
  color: #ffffff !important;
  translate: 0 -2px !important;
}

:deep(.btn-adopt-pets:active:not(:disabled)) {
  translate: 0 0 !important;
}

:deep(.btn-return-home:focus-visible),
:deep(.btn-adopt-pets:focus-visible) {
  outline: 2px solid var(--text-inverse, #ffffff) !important;
  outline-offset: 3px !important;
}

.recovery-links {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: oklch(from var(--text-inverse) l c h / 80%);
}

.recovery-label {
  font-weight: 600;
}

.recovery-link {
  color: var(--text-inverse);
  text-underline-offset: 4px;
  text-decoration: underline;
  font-weight: 600;
  transition: opacity var(--transition-fast, 150ms ease);
}

.recovery-link:hover,
.recovery-link:focus-visible {
  opacity: 0.8;
  outline: 2px solid var(--color-warm-cream, #faecc7);
  outline-offset: 2px;
  border-radius: var(--radius-xs, 2px);
}

.bullet {
  color: oklch(from var(--text-inverse) l c h / 50%);
}
</style>
