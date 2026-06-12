<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useIsMobile, useIsTablet } from '../../../utils/useIsMobile.ts'
import Button from '../ui/Button.vue'
import NavDrawer from './NavDrawer.vue'

const router = useRouter()
const route = useRoute()

const menuOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

const isMobile = useIsMobile()
const isTablet = useIsTablet()

function handleDonate() {
  router.push('/donate')
}
</script>

<template>
  <div class="nav-bar">
    <nav v-if="isMobile || isTablet" class="nav-pill" aria-label="Primary navigation">
      <div class="nav-logo">
        <RouterLink to="/" class="nav-item">
          <img src="/images/adohr-logo.jpg" alt="" />
          <h1>A Dream of Home</h1>
        </RouterLink>
      </div>
      <NavDrawer v-model="menuOpen" :size="26" style="color: var(--text-primary)" />
    </nav>

    <nav v-else class="nav-pill" aria-label="Primary navigation">
      <RouterLink to="/" class="brand">
        <img src="/images/adohr-logo.jpg" alt="" />
        <span class="brand-name">A Dream of Home</span>
      </RouterLink>

      <section class="nav-links">
        <RouterLink to="/" class="nav-item" active-class="active"
          ><p data-text="Home">Home</p></RouterLink
        >
        <RouterLink
          to="/about"
          class="nav-item"
          active-class="active"
          :class="{ active: route.path.startsWith('/surrender') }"
          ><p data-text="About">About</p></RouterLink
        >
        <RouterLink
          to="/adopt"
          class="nav-item"
          active-class="active"
          :class="{
            active: route.path.startsWith('/adopt') || route.path.startsWith('/pet-adoption'),
          }"
          ><p data-text="Adopt">Adopt</p></RouterLink
        >
        <RouterLink to="/foster" class="nav-item" active-class="active"
          ><p data-text="Foster">Foster</p></RouterLink
        >
        <RouterLink to="/volunteer" class="nav-item" active-class="active"
          ><p data-text="Volunteer">Volunteer</p></RouterLink
        >
      </section>

      <Button title="Donate" color="blue" size="small" class="nav-cta" @click="handleDonate" />
    </nav>
  </div>
</template>

<style scoped lang="css">
.nav-bar {
  position: fixed;
  top: calc(12px + var(--safe-top));
  left: 0;
  right: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  padding: 0 clamp(12px, 3dvw, 24px);
  pointer-events: none;
  view-transition-name: page-navbar;

  .nav-pill {
    pointer-events: auto;
    width: 100%;
    max-width: 1080px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0.5rem 0.625rem 0.5rem 1rem;
    border-radius: var(--radius-full);
    background-color: oklch(from var(--text-inverse) l c h / 82%);
    border: 1px solid var(--line-ink);
    box-shadow: 0 10px 30px -14px oklch(from var(--shadow-color) l c h / 30%);
    backdrop-filter: blur(14px);
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-backdrop-filter: blur(14px);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
    flex-shrink: 0;

    img {
      height: 36px;
      width: 36px;
      object-fit: cover;
      border-radius: var(--radius-full);
      border: 1px solid var(--line-ink);
    }

    .brand-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: -0.02em;
      color: var(--text-primary);
      white-space: nowrap;
    }
  }

  .nav-links {
    display: flex;
    gap: clamp(1rem, 2.5vw, 2.25rem);
    align-items: center;

    .nav-item {
      color: var(--text-primary);
      text-decoration: none;
      position: relative;
      padding: 0.375rem 0;

      p {
        font-size: 0.98rem;
        font-weight: 500;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: color var(--transition-normal);
      }

      p::after {
        content: attr(data-text);
        font-weight: 700;
        height: 0;
        overflow: hidden;
        visibility: hidden;
      }

      &::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        translate: -50% 0;
        width: 5px;
        height: 5px;
        border-radius: var(--radius-full);
        background-color: var(--color-secondary);
        opacity: 0;
        scale: 0.4;
        transition:
          opacity var(--transition-normal),
          scale var(--transition-normal);
      }

      &:hover p {
        color: var(--color-secondary);
      }

      &.active p {
        font-weight: 700;
      }

      &.active::before {
        opacity: 1;
        scale: 1;
      }
    }
  }

  .nav-cta {
    flex-shrink: 0;
  }

  .nav-logo {
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      text-decoration: none;
    }

    img {
      height: 36px;
      width: 36px;
      object-fit: cover;
      border-radius: var(--radius-full);
      border: 1px solid var(--line-ink);
    }

    h1 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
  }

  @media (width <= 768px) {
    top: calc(8px + var(--safe-top));

    .nav-pill {
      padding: 0.375rem 0.5rem 0.375rem 0.875rem;
    }
  }
}
</style>
