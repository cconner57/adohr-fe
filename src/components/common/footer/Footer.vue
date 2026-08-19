<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <h2 class="footer-headline">Every pet, <span class="footer-accent">home.</span></h2>

      <div class="footer-grid">
        <nav class="footer-links" aria-label="Footer navigation">
          <RouterLink to="/adopt">Adopt</RouterLink>
          <RouterLink to="/foster">Foster</RouterLink>
          <RouterLink to="/volunteer">Volunteer</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>

        <div class="footer-social">
          <p class="footer-label">Follow along</p>
          <a href="https://www.facebook.com/IDOHR.ORG" aria-label="Facebook">Facebook ↗</a>
          <a href="https://www.instagram.com/idohrcats/" aria-label="Instagram">Instagram ↗</a>
        </div>
      </div>

      <div class="footer-legal">
        <p>
          A Dream of Home Rescue, Inc. is a 501(c)(3) non-profit organization · Tax ID 81-0780050
        </p>
        <p>PO Box 7612, La Verne, California 91750</p>
        <p>&copy; {{ currentYear }} A Dream of Home Rescue. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="css">
.footer {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  border-top: 1.5px solid var(--text-primary);
  padding: clamp(48px, 8vw, 96px) var(--layout-padding-side) clamp(28px, 4vw, 48px);
}

.footer-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 5vw, 4rem);
}

.footer-headline {
  font-size: clamp(3rem, 9vw, 7rem);
  color: var(--text-inverse);
  line-height: 0.95;
  letter-spacing: -0.035em;
}

.footer-accent {
  font-style: italic;
  font-weight: 600;
  color: var(--color-warning);
}

.footer-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 1px solid oklch(from var(--text-inverse) l c h / 22%);
}

.footer-links {
  display: flex;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  flex-wrap: wrap;

  a {
    color: var(--text-inverse);
    text-decoration: none;
    font-weight: 600;
    font-size: 1.05rem;

    &:hover {
      color: var(--color-warning);
      text-decoration: underline;
      text-underline-offset: 5px;
    }
  }
}

.footer-social {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;

  .footer-label {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: oklch(from var(--text-inverse) l c h / 82%);
  }

  a {
    color: var(--text-inverse);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: var(--color-warning);
    }
  }
}

.footer-legal {
  display: flex;
  flex-direction: column;
  gap: 4px;

  p {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    color: oklch(from var(--text-inverse) l c h / 80%);
    line-height: 1.6;
  }
}

@media (width <= 600px) {
  .footer-grid {
    flex-direction: column;
  }

  .footer-social {
    align-items: flex-start;
  }
}
</style>
