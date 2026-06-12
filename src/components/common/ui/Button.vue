<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text'
    theme?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger' | 'neutral'
    color?: 'green' | 'blue' | 'purple' | 'green-weak' | 'orange' | 'white'
    onClick?: () => void
    size?: 'small' | 'medium' | 'large'
    align?: 'center' | 'start' | 'between'
    title?: string
    fullWidth?: boolean
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    align: 'center',
  },
)

const resolvedTheme = computed(() => {
  if (props.theme) return props.theme

  switch (props.color) {
    case 'green':
    case 'green-weak':
      return 'primary'
    case 'blue':
      return 'secondary'
    case 'purple':
      return 'tertiary'
    case 'orange':
      return 'warning'
    case 'white':
      return 'neutral'
    default:
      return 'primary'
  }
})

const resolvedVariant = computed(() => {
  if (['primary', 'secondary', 'tertiary', 'text'].includes(props.variant)) {
    // Legacy support: if color is white/neutral and variant is primary, it should look like tertiary/neutral
    if (props.color === 'white' && props.variant === 'primary') {
      return 'tertiary'
    }
    return props.variant
  }
  return 'primary'
})

const classes = computed(() => {
  const base = [
    `variant-${resolvedVariant.value}`,
    `theme-${resolvedTheme.value}`,
    props.size,
    `justify-${props.align}`,
  ]

  if (props.color === 'green-weak') base.push('legacy-green-weak')
  if (props.fullWidth) base.push('w-full')
  if (props.disabled || props.loading) base.push('button-disabled')

  return base.join(' ')
})
</script>

<template>
  <button
    :class="classes"
    @click="props.onClick && props.onClick()"
    :disabled="props.disabled || props.loading"
  >
    <span v-if="props.loading" class="spinner"></span
    ><slot v-else
      ><span>{{ props.title }}</span></slot
    >
  </button>
</template>

<style scoped lang="css">
button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 700;
  letter-spacing: 0.01em;
  border-radius: var(--radius-full);
  transition:
    translate var(--transition-normal),
    box-shadow var(--transition-normal),
    background-color var(--transition-normal),
    color var(--transition-normal),
    border-color var(--transition-normal);
  white-space: nowrap;
  border: 1.5px solid transparent;

  &:hover:not(:disabled) {
    cursor: pointer;
    translate: 0 -2px;
  }

  &:active:not(:disabled) {
    translate: 0 0;
  }
}

.small {
  height: 36px;
  min-width: 80px;
  padding: 0 18px;
  font-size: 0.85rem;
}

.medium {
  height: 44px;
  min-width: 120px;
  padding: 0 24px;
  font-size: 0.95rem;
}

.large {
  height: 54px;
  min-width: 180px;
  padding: 0 36px;
  font-size: 1.05rem;
}

.justify-center {
  justify-content: center;
}

.justify-start {
  justify-content: flex-start;
}

.justify-between {
  justify-content: space-between;
}

.w-full {
  width: 100%;
  display: flex;
}

/* Filled buttons carry an ink outline + lifted shadow — the "sticker" feel */
.variant-primary {
  color: var(--text-inverse);
  border-color: oklch(from var(--text-primary) l c h / 60%);
}

.variant-primary:hover:not(:disabled) {
  box-shadow: 0 6px 0 -2px oklch(from var(--text-primary) l c h / 75%);
}

.variant-primary:active:not(:disabled) {
  box-shadow: 0 2px 0 -1px oklch(from var(--text-primary) l c h / 75%);
}

.variant-primary.theme-primary {
  background-color: var(--color-primary);
}

.variant-primary.theme-secondary {
  background-color: var(--color-secondary);
}

.variant-primary.theme-tertiary {
  background-color: var(--color-tertiary);
}

.variant-primary.theme-warning {
  background-color: var(--color-warning-strong);
}

.variant-primary.theme-danger {
  background-color: var(--color-danger);
}

.variant-primary.theme-neutral {
  background-color: var(--color-neutral);
}

.variant-secondary {
  background-color: transparent;
  border-color: currentcolor;
}

.variant-secondary.theme-primary {
  color: var(--color-primary);
}

.variant-secondary.theme-secondary {
  color: var(--color-secondary);
}

.variant-secondary.theme-tertiary {
  color: var(--color-tertiary);
}

.variant-secondary.theme-warning {
  color: var(--color-warning-strong);
}

.variant-secondary.theme-danger {
  color: var(--color-danger);
}

.variant-secondary.theme-neutral {
  color: var(--text-primary);
  border-color: var(--line-ink-strong);
}

.variant-secondary:hover:not(:disabled) {
  background-color: oklch(from currentcolor l c h / 8%);
}

.variant-tertiary {
  background-color: var(--color-white);
  border-color: var(--line-ink-strong);
  color: var(--text-primary);
}

.variant-tertiary.theme-primary {
  color: var(--text-primary);
}

.variant-tertiary:hover:not(:disabled) {
  border-color: var(--text-primary);
  background-color: var(--color-neutral-surface);
  box-shadow: 0 6px 0 -2px oklch(from var(--text-primary) l c h / 30%);
}

.variant-text {
  background: none;
  border: none;
  box-shadow: none !important;
  padding: 0;
  min-width: 0;
  height: auto;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 5px;
}

.variant-text:hover:not(:disabled) {
  translate: 0 0;
  color: var(--color-secondary);
}

.variant-text.theme-primary {
  color: var(--color-primary);
}

.variant-text.theme-secondary {
  color: var(--color-secondary);
}

.variant-text.theme-tertiary {
  color: var(--color-tertiary);
}

.variant-text.theme-neutral {
  color: var(--text-primary);
}

.legacy-green-weak {
  background-color: var(--color-primary-weak);
  color: var(--color-primary);
  border: none;
}

.legacy-green-weak:hover:not(:disabled) {
  background-color: var(--color-primary-border);
}

.button-disabled {
  filter: grayscale(100%);
  opacity: 0.55;
  cursor: not-allowed;
  translate: 0 0 !important;
  box-shadow: none !important;
}

.spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  display: inline-block;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
