<script setup lang="ts">
import { onUnmounted, watch } from 'vue'

import Button from './Button.vue'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title: string
    width?: string
    saveLabel?: string
    cancelLabel?: string
    isSaving?: boolean
    canSave?: boolean
    hideActions?: boolean
  }>(),
  {
    width: '900px',
    saveLabel: 'Save',
    cancelLabel: 'Cancel',
    isSaving: false,
    canSave: true,
    hideActions: false,
  },
)

const emit = defineEmits<{
  close: []
  save: []
}>()

// Prevent body scroll
watch(
  () => props.isOpen,
  (val) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = val ? 'hidden' : ''
    }
  },
)

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="editor-overlay" @click.self="emit('close')"></div>
    </Transition>

    <Transition name="slide">
      <div v-if="isOpen" class="editor-drawer" :style="{ '--drawer-width': width }">
        <header class="editor-header">
          <div class="header-left">
            <h2>{{ title }}</h2>
            <slot name="subtitle"></slot>
          </div>
          <button class="close-icon-btn" @click="emit('close')">
            <Icon name="x" size="24" />
          </button>
        </header>

        <slot name="pre-body"></slot>

        <div class="editor-body">
          <div class="editor-sidebar" v-if="$slots.sidebar">
            <slot name="sidebar"></slot>
          </div>
          <div class="editor-content">
            <slot name="content"></slot>
            <slot></slot>
          </div>
        </div>

        <footer class="editor-footer" v-if="!hideActions">
          <slot name="actions">
            <Button color="white" :title="cancelLabel" @click="emit('close')" :full-width="true" />
            <Button
              color="green"
              :title="saveLabel"
              @click="emit('save')"
              :loading="isSaving"
              :disabled="!canSave"
              :full-width="true"
            />
          </slot>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.editor-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(2px);
  z-index: var(--z-editor-overlay, 3002);
  cursor: pointer;
}

.editor-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  background: var(--color-white);
  width: var(--drawer-width);
  max-width: 95vw;
  box-shadow: -4px 0 24px rgb(0 0 0 / 15%);
  display: flex;
  flex-direction: column;
  z-index: var(--z-editor, 3003);
}

/* Header */
.editor-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-white);
  flex-shrink: 0;
}

.editor-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.header-actions {
  display: none;
}

.close-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  border-radius: 50%;
}

/* Body */
.editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: var(--bg-secondary);
}

.editor-sidebar {
  width: 200px;
  background: var(--color-neutral-surface);
  border-right: 1px solid var(--border-color);
  padding-top: 16px;
  flex-shrink: 0;
  overflow-y: auto;
}

.editor-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: var(--color-white);
}

/* Footer */
.editor-footer {
  padding: 16px 32px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: var(--color-white);
  flex-shrink: 0;

  /* Ensure footer respects bottom safe area */
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.editor-footer :deep(button) {
  flex: 1;
}

/* Scrollbars */
.editor-sidebar::-webkit-scrollbar,
.editor-content::-webkit-scrollbar {
  width: 6px;
}

.editor-sidebar::-webkit-scrollbar-thumb,
.editor-content::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 3px;
}

/* Transitions - Desktop (Right Slide) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Responsive - Mobile (Bottom Sheet) */
@media (width <= 600px) {
  .editor-drawer {
    top: auto;
    bottom: 0;
    left: 0;
    width: 100vw;
    max-width: 100vw;
    height: 90vh; /* Bottom sheet height */
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-top: 1px solid var(--border-color);
  }

  .editor-header {
    padding: 16px 20px;
  }

  /* Body becomes vertical stack -> Horizontal Sidebar Tabs */
  .editor-body {
    flex-direction: column;
  }

  .editor-sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 0;
    display: flex;
    flex-direction: row;

    /* Let the child component handle scrolling if needed */
    overflow-x: hidden;
    background: var(--color-white);
  }

  .editor-content {
    padding: 16px;
  }

  .editor-footer {
    padding: 12px 20px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  /* Mobile Transition (Slide Up) */
  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(100%);
  }
}
</style>
