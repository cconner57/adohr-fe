<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    size?: number
    ariaLabel?: string
    width?: string
  }>(),
  {
    modelValue: false,
    size: 28,
    ariaLabel: 'Main navigation',
    width: '80vw',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const open = ref(!!props.modelValue)
const panelEl = ref<HTMLElement | null>(null)
const prevActive = ref<HTMLElement | null>(null)
let originalOverflow: string | null = null

watch(
  () => props.modelValue,
  async (v) => {
    open.value = v
    if (v) {
      prevActive.value = document.activeElement as HTMLElement
      originalOverflow ??= document.body.style.overflow
      document.body.style.overflow = 'hidden'
      await nextTick()
      panelEl.value?.focus()
    } else {
      document.body.style.overflow = originalOverflow ?? ''
      originalOverflow = null
      prevActive.value?.focus?.()
    }
  },
  { immediate: true },
)

function toggle() {
  emit('update:modelValue', !open.value)
}
function close() {
  emit('update:modelValue', false)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

onBeforeUnmount(() => {
  if (originalOverflow !== null) document.body.style.overflow = originalOverflow
})
</script>

<template>
  <button
    class="hx-btn"
    type="button"
    :aria-expanded="open"
    :aria-label="open ? 'Close menu' : 'Open menu'"
    @click="toggle"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2.2"
      :data-open="open"
      aria-hidden="true"
      role="img"
    >
      <line class="hx-top" x1="3" y1="6" x2="21" y2="6" />
      <line class="hx-mid" x1="3" y1="12" x2="21" y2="12" />
      <line class="hx-bot" x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="drawer-backdrop" aria-hidden="true" @click="close" />
    </transition>

    <transition name="slide-in-right">
      <aside
        v-if="open"
        class="drawer"
        :style="{ width: width }"
        role="dialog"
        :aria-label="ariaLabel"
        aria-modal="true"
        tabindex="-1"
        ref="panelEl"
        @keydown="onKeydown"
      >
        <header class="drawer-header">
          <div class="drawer-brand">
            <img src="/images/adohr-logo.jpg" alt="" class="drawer-logo" />
            <span class="drawer-title">ADOHR</span>
          </div>
          <button class="drawer-close" @click="close" aria-label="Close menu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <nav class="drawer-content">
          <RouterLink to="/" class="nav-link" @click="close">
            <span>Home</span>
          </RouterLink>
          <RouterLink to="/about" class="nav-link" @click="close">
            <span>About</span>
          </RouterLink>
          <RouterLink to="/adopt" class="nav-link" @click="close">
            <span>Adopt</span>
          </RouterLink>
          <RouterLink to="/foster" class="nav-link" @click="close">
            <span>Foster</span>
          </RouterLink>
          <RouterLink to="/volunteer" class="nav-link" @click="close">
            <span>Volunteer</span>
          </RouterLink>
          <RouterLink to="/happy-tails" class="nav-link" @click="close">
            <span>Happy Tails</span>
          </RouterLink>
          <RouterLink to="/wishlist" class="nav-link" @click="close">
            <span>Wishlist</span>
          </RouterLink>
          <RouterLink to="/news" class="nav-link" @click="close">
            <span>News</span>
          </RouterLink>
          <RouterLink to="/medical-records" class="nav-link" @click="close">
            <span>Medical Records</span>
          </RouterLink>

          <div class="drawer-divider" aria-hidden="true" />

          <RouterLink
            to="/happy-tails?submit=true"
            class="nav-link nav-link--community"
            @click="close"
          >
            <span>🐾 Submit Your Happy Tail</span>
          </RouterLink>
        </nav>

        <footer class="drawer-footer">
          <RouterLink to="/donate" class="donate-btn" @click="close">Donate</RouterLink>
        </footer>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.hx-btn {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-primary, #1e2522);
  transition: background-color 0.2s;
}

.hx-btn:hover {
  background-color: oklch(from var(--text-primary) l c h / 8%);
}

.hx-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

svg {
  transition: transform 0.2s ease;
  color: var(--icon, currentColor);
}

line {
  transform-box: fill-box;
  transform-origin: center;
  transition:
    transform 0.22s ease,
    opacity 0.18s ease;
}

.hx-top {
  transform: translateY(0) rotate(0);
}

.hx-mid {
  opacity: 1;
}

.hx-bot {
  transform: translateY(0) rotate(0);
}

svg[data-open='true'] .hx-top {
  transform: translateY(6px) rotate(45deg);
}

svg[data-open='true'] .hx-mid {
  opacity: 0;
}

svg[data-open='true'] .hx-bot {
  transform: translateY(-6px) rotate(-45deg);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 40%);
  backdrop-filter: blur(4px);
  z-index: var(--z-toast);
}

.slide-in-right-enter-from,
.slide-in-right-leave-to {
  transform: translateX(100%);
}

.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  z-index: var(--z-overlay);
  background: var(--text-inverse);
  color: var(--text-primary);
  box-shadow: -8px 0 32px rgb(0 0 0 / 12%);
  display: grid;
  grid-template-rows: auto 1fr auto;
  outline: none;

  @media (width >= 431px) and (width <= 768px) {
    max-width: 400px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-logo {
  height: 40px;
  width: auto;
  border-radius: var(--radius-md);
}

.drawer-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.drawer-close {
  all: unset;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.drawer-close:hover {
  background-color: var(--color-neutral-weak);
}

.drawer-close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.drawer-content {
  padding: 8px 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.1rem;
  transition: all var(--transition-normal);
}

.nav-link:hover,
.nav-link:active {
  background-color: var(--color-neutral-weak);
  color: var(--color-primary);
  transform: translateX(4px);
}

.nav-link.router-link-active {
  background-color: var(--color-primary-weak);
  color: var(--color-primary);
}

.drawer-divider {
  height: 1px;
  background-color: var(--line-ink);
  margin: 6px 16px;
  opacity: 0.5;
}

.nav-link--community {
  background-color: oklch(from var(--color-warning) l c h / 12%);
  color: var(--color-primary);
  border: 1px dashed oklch(from var(--color-warning) l c h / 50%);
  font-size: 1rem;
}

.nav-link--community:hover {
  background-color: var(--color-warning);
  color: var(--text-inverse);
  transform: translateX(4px);
}

.drawer-footer {
  padding: 24px;
  padding-bottom: calc(24px + var(--safe-bottom, 0px));
}

.donate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  background: var(--color-primary);
  color: var(--text-inverse);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px oklch(from var(--color-primary) l c h / 15%);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.donate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px oklch(from var(--color-primary) l c h / 20%);
  background: var(--color-primary-strong);
}

.donate-btn:active {
  transform: translateY(0);
}
</style>
