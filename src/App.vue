<script setup lang="ts">
import '../src/styles/reset.css'
import '../src/styles/base.css'
import '../src/styles/shared.css'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

import NavBar from './components/common/nav-bar/NavBar.vue'
import Toast from './components/common/ui/Toast.vue'
import { useUIStore } from './stores/ui'

const uiStore = useUIStore()

const route = useRoute()
const showNavBar = computed(() => {
  return !route.meta.hideNavbar
})
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div v-if="uiStore.isLoading" class="route-progress-bar" aria-hidden="true" />
  <Toast
    :show="uiStore.toast.show"
    :message="uiStore.toast.message"
    :type="uiStore.toast.type"
    @close="uiStore.hideToast()"
  />
  <NavBar v-if="showNavBar" />
  <main id="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.skip-link {
  position: fixed;
  top: -100px;
  left: 1rem;
  background: var(--color-primary, #173829);
  color: var(--color-white, #fff);
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md, 8px);
  font-weight: 700;
  font-size: 1rem;
  z-index: 100000;
  text-decoration: none;
  box-shadow: 0 4px 12px rgb(0 0 0 / 25%);
  transition: top 0.2s ease-in-out;
}

.skip-link:focus {
  top: 1rem;
  outline: 3px solid var(--color-warm-cream, #faecc7);
  outline-offset: 2px;
}

.route-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  z-index: 9999;
  pointer-events: none;
  animation: route-progress 1.2s ease-in-out infinite;
  box-shadow: 0 0 10px oklch(from var(--color-primary) l c h / 60%);
}

@keyframes route-progress {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
