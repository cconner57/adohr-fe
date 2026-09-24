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
        width="360"
        height="360"
      />
      <h1 id="not-found-heading">Oops! Page Not Found</h1>
      <p>The page you are looking for might have been moved, renamed, or is temporarily unavailable.</p>
      <div class="action-buttons">
        <Button @click="handleGoHome" title="Return Home" color="orange" size="large" />
        <Button @click="handleGoAdopt" title="Meet Adoptable Pets" variant="secondary" color="white" size="large" />
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
  max-width: min(100%, 320px);
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: var(--radius-arch, 999px 999px var(--radius-lg) var(--radius-lg));
  box-shadow: var(--shadow-lg);
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
