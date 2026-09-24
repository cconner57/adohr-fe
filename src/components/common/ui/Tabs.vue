<script setup lang="ts">
import { ref } from 'vue'

import Icon from './Icon.vue'

interface TabItem {
  id: string
  label: string
  icon?: string
  badge?: number | string | null
}

const props = withDefaults(
  defineProps<{
    items: TabItem[]
    modelValue: string
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'Content tabs',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabListRef = ref<HTMLElement | null>(null)

const handleKeydown = (event: KeyboardEvent, index: number) => {
  let targetIndex = -1
  if (event.key === 'ArrowRight') {
    targetIndex = (index + 1) % props.items.length
  } else if (event.key === 'ArrowLeft') {
    targetIndex = (index - 1 + props.items.length) % props.items.length
  } else if (event.key === 'Home') {
    targetIndex = 0
  } else if (event.key === 'End') {
    targetIndex = props.items.length - 1
  }

  if (targetIndex !== -1) {
    event.preventDefault()
    const nextItem = props.items[targetIndex]
    if (nextItem) {
      emit('update:modelValue', nextItem.id)
      const buttons = tabListRef.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      buttons?.[targetIndex]?.focus()
    }
  }
}
</script>

<template>
  <div
    ref="tabListRef"
    class="tabs"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <button
      v-for="(item, index) in items"
      :id="`tab-${item.id}`"
      :key="item.id"
      type="button"
      role="tab"
      :aria-selected="modelValue === item.id"
      :tabindex="modelValue === item.id ? 0 : -1"
      :aria-controls="`panel-${item.id}`"
      class="tab-btn"
      :class="{ active: modelValue === item.id }"
      @click="emit('update:modelValue', item.id)"
      @keydown="handleKeydown($event, index)"
    >
      <span v-if="item.icon" class="tab-icon">
        <Icon :name="item.icon" size="18" />
      </span>
      <span class="tab-label">{{ item.label }}</span>
      <span v-if="item.badge !== undefined && item.badge !== null" class="count-badge">
        {{ item.badge }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 8px;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 1rem;
  color: var(--color-neutral-text-soft);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  font-weight: 500;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 8px;

  &.active {
    color: var(--color-secondary);
    border-bottom-color: var(--color-secondary);
    font-weight: 600;

    .count-badge {
      background: var(--color-secondary-weak);
      color: var(--color-secondary);
    }
  }

  &:hover:not(.active) {
    color: var(--text-primary);
    background-color: var(--color-neutral-weak);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: -2px;
    border-radius: 4px;
  }
}

.tab-icon {
  display: flex;
  align-items: center;
}

.count-badge {
  background: var(--color-neutral-weak);
  color: var(--color-neutral-text-soft);
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: var(--radius-lg);
  font-weight: 600;
}
</style>
