<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title: string
    placement?: 'right' | 'left' | 'bottom'
    mobilePlacement?: 'right' | 'left' | 'bottom'
    width?: string
  }>(),
  {
    placement: 'right',
    mobilePlacement: 'bottom',
  },
)

const emit = defineEmits<{
  close: []
}>()

// Prevent body scroll when open
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

// Ensure cleanup on unmount if component is destroyed while open
onUnmounted(() => {
  document.body.style.overflow = ''
})

// Window resizing logic for responsive placement
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

function onResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onResize)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', onResize)
  }
})

const effectivePlacement = computed(() => {
  if (windowWidth.value <= 600) {
    return props.mobilePlacement
  }
  return props.placement
})

const transitionName = computed(() => {
  switch (effectivePlacement.value) {
    case 'bottom':
      return 'slide-bottom'
    case 'left':
      return 'slide-left'
    default:
      return 'slide-right'
  }
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="isOpen" class="drawer-backdrop" @click="emit('close')"></div>
    </Transition>

    <!-- Drawer Content -->
    <Transition :name="transitionName">
      <div
        v-if="isOpen"
        class="drawer-panel"
        :class="[`placement-${effectivePlacement}`]"
        :style="effectivePlacement !== 'bottom' && props.width ? { maxWidth: props.width } : undefined"
        role="dialog"
        aria-labelledby="drawer-title"
        aria-modal="true"
      >
        <header class="drawer-header">
          <h3 id="drawer-title">{{ title }}</h3>
          <button class="close-btn" @click="emit('close')" aria-label="Close drawer">
            <Icon name="x" size="24" />
          </button>
        </header>

        <div class="drawer-body">
          <slot />
        </div>

        <div class="drawer-footer" v-if="$slots.footer">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(4px);
  z-index: var(--z-toast);
  transition: opacity 0.3s ease;
  transition-behavior: allow-discrete;

  @starting-style {
    opacity: 0;
  }
}

.drawer-panel {
  position: fixed;
  background: var(--text-inverse);
  box-shadow: -4px 0 24px rgb(0 0 0 / 15%);
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  transition-behavior: allow-discrete;
}

/* Right Placement (Default Desktop) */
.drawer-panel.placement-right {
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  border-left: 1px solid var(--border-color);

  @starting-style {
    transform: translateX(100%);
  }
}

/* Left Placement */
.drawer-panel.placement-left {
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  border-right: 1px solid var(--border-color);

  @starting-style {
    transform: translateX(-100%);
  }
}

/* Bottom Placement (Mobile Sheet) */
.drawer-panel.placement-bottom {
  inset: auto 0 0 0; /* Override top */
  width: 100%;
  max-width: 100%;
  height: 90vh; /* 90% of screen */
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -4px 24px rgb(0 0 0 / 15%);

  @starting-style {
    transform: translateY(100%);
  }
}

.drawer-header {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
  }
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  margin: -8px;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);

  &:hover {
    background: var(--color-neutral-weak);
    color: var(--text-primary);
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  background: var(--color-neutral-surface);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Slide Left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

/* Slide Bottom */
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
