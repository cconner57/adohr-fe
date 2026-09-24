<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  header: string
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const open = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    open.value = newValue
  },
  { immediate: true },
)

function closeDrawer() {
  open.value = false
  emit('update:modelValue', false)
}

function handleKeydown(event: KeyboardEvent) {
  if (open.value && event.key === 'Escape') {
    closeDrawer()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <Transition name="drawer-fade">
    <div v-if="open" class="overlay" @click="closeDrawer">
      <div
        class="drawer"
        role="dialog"
        aria-labelledby="drawer-title"
        aria-modal="true"
        @click.stop
      >
        <div class="drawer-header">
          <h2 id="drawer-title">{{ props.header }}</h2>
          <button
            class="hx-btn"
            type="button"
            :aria-expanded="open"
            :aria-label="'Close menu'"
            @click="closeDrawer"
          >
            <svg
              :width="24"
              :height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
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
        </div>
        <div class="drawer-body"><slot></slot></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="css">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background-color: rgb(0 0 0 / 50%);
  z-index: var(--z-drawer);

  .drawer {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100dvw;
    max-width: 500px;
    height: 100dvh;
    z-index: var(--z-modal);
    background-color: var(--text-inverse);
    box-shadow: -2px 0 10px rgb(0 0 0 / 10%);
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
    display: flex;
    flex-direction: column;

    .drawer-header {
      padding: 1rem 1rem 1rem 2rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;

      & h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-primary);
        text-align: left;
      }

      .hx-btn {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-radius: var(--radius-lg);
        cursor: pointer;
        color: var(--text-inverse);
      }

      .hx-btn:focus-visible {
        outline: 2px solid var(--color-secondary);
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
    }

    .drawer-body {
      padding: 1rem 2rem;
      overflow-y: auto;
      flex-grow: 1;
    }
  }

  @media (width >= 0) and (width <= 320px) {
  }

  @media (width >= 321px) and (width <= 430px) {
  }

  @media (width >= 431px) and (width <= 768px) {
    .drawer {
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      border-bottom-left-radius: 0;
      height: 70dvh;

      .drawer-header {
        & h2 {
          margin: 0;
          font-size: 1.35rem;
        }
      }
    }
  }
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-fade-enter-active .drawer,
.drawer-fade-leave-active .drawer {
  transition: transform 0.3s ease-out;
}

.drawer-fade-enter-from .drawer,
.drawer-fade-leave-to .drawer {
  transform: translateX(100%);
}
</style>
