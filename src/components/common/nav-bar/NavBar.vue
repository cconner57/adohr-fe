<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { prefetchRoute, scheduleIdlePrefetch } from '../../../utils/prefetch.ts'
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

onMounted(() => {
  scheduleIdlePrefetch()
})

function handleNavClick(targetPath: string) {
  if (route.path === targetPath) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleDonate() {
  router.push('/donate')
}
</script>

<template>
  <div class="nav-bar">
    <nav v-if="isMobile || isTablet" class="nav-pill" aria-label="Primary navigation">
      <div class="nav-logo">
        <RouterLink
          to="/"
          class="nav-item"
          @click="handleNavClick('/')"
        >
          <img src="/images/adohr-logo.png" alt="ADOHR logo" />
          <span class="brand-name">A Dream of Home</span>
        </RouterLink>
      </div>
      <NavDrawer v-model="menuOpen" :size="26" style="color: var(--text-primary)" />
    </nav>

    <nav v-else class="nav-pill" aria-label="Primary navigation">
      <RouterLink
        to="/"
        class="brand"
        @click="handleNavClick('/')"
      >
        <img src="/images/adohr-logo.png" alt="ADOHR logo" />
        <span class="brand-name">A Dream of Home</span>
      </RouterLink>

      <ul class="nav-links" role="list">
        <li>
          <RouterLink
            to="/"
            class="nav-item"
            active-class="active"
            @click="handleNavClick('/')"
          >
            <p data-text="Home">Home</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/about"
            class="nav-item"
            active-class="active"
            :class="{ active: route.path.startsWith('/surrender') }"
            @pointerenter="prefetchRoute('/about')"
            @focus="prefetchRoute('/about')"
            @click="handleNavClick('/about')"
          >
            <p data-text="About">About</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/adopt"
            class="nav-item"
            active-class="active"
            :class="{
              active: route.path.startsWith('/adopt') || route.path.startsWith('/pet-adoption'),
            }"
            @pointerenter="prefetchRoute('/adopt')"
            @focus="prefetchRoute('/adopt')"
            @click="handleNavClick('/adopt')"
          >
            <p data-text="Adopt">Adopt</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/foster"
            class="nav-item"
            active-class="active"
            @pointerenter="prefetchRoute('/foster')"
            @focus="prefetchRoute('/foster')"
            @click="handleNavClick('/foster')"
          >
            <p data-text="Foster">Foster</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/volunteer"
            class="nav-item"
            active-class="active"
            @pointerenter="prefetchRoute('/volunteer')"
            @focus="prefetchRoute('/volunteer')"
            @click="handleNavClick('/volunteer')"
          >
            <p data-text="Volunteer">Volunteer</p>
          </RouterLink>
        </li>
      </ul>

      <Button
        title="Donate"
        color="blue"
        size="small"
        class="nav-cta"
        @pointerenter="prefetchRoute('/donate')"
        @focus="prefetchRoute('/donate')"
        @click="handleDonate"
      />
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
    user-select: none;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
    flex-shrink: 0;
    user-select: none;

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
    gap: clamp(0.25rem, 1vw, 0.75rem);
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    user-select: none;

    li {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      color: var(--text-primary);
      text-decoration: none;
      position: relative;
      padding: 0.45rem 0.65rem;
      border-radius: var(--radius-full);
      user-select: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;

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
        bottom: 1px;
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
