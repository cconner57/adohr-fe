<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    borderTopColor?: 'dark' | 'white' | 'inverse'
  }>(),
  {
    borderTopColor: 'dark',
  },
)

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="footer" :class="[`border-top-${props.borderTopColor}`]">
    <div class="footer-inner">
      <h2 class="footer-headline">Every pet, <span class="footer-accent">home.</span></h2>

      <div class="footer-grid">
        <nav class="footer-links" aria-label="Footer navigation">
          <RouterLink to="/adopt">Adopt</RouterLink>
          <RouterLink to="/foster">Foster</RouterLink>
          <RouterLink to="/volunteer">Volunteer</RouterLink>
          <RouterLink to="/donate">Donate</RouterLink>
          <RouterLink to="/happy-tails">Happy Tails</RouterLink>
          <RouterLink to="/wishlist">Wishlist</RouterLink>
          <RouterLink to="/news">News</RouterLink>
          <RouterLink to="/medical-records">Medical Records</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>

        <div class="footer-social">
          <span class="footer-label">Follow along</span>
          <div class="footer-social-links">
            <span class="social-link disabled" aria-disabled="true">
              Facebook
              <span class="coming-soon-tag">Coming soon</span>
            </span>
            <span class="social-link disabled" aria-disabled="true">
              Instagram
              <span class="coming-soon-tag">Coming soon</span>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-legal">
        <p>
          A Dream of Home Rescue, Inc. is a 501(c)(3) non-profit organization · Tax ID 81-0780050
        </p>
        <p>PO Box 5543, Pasadena, California 91107</p>
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

.footer.border-top-white,
.footer.border-top-inverse {
  border-top-color: var(--text-inverse);
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
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;

  .footer-label {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: oklch(from var(--text-inverse) l c h / 82%);
  }

  .footer-social-links {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .social-link.disabled {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: oklch(from var(--text-inverse) l c h / 80%);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: default;
    user-select: none;
  }

  .coming-soon-tag {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background-color: oklch(from var(--text-inverse) l c h / 14%);
    color: var(--color-warning, #f2b33d);
    border: 1px solid oklch(from var(--color-warning) l c h / 35%);
    padding: 2px 7px;
    border-radius: var(--radius-full);
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
    gap: 0.75rem 1.25rem;
  }
}
</style>
