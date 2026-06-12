<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label?: string | null
  color?: 'green' | 'blue' | 'red' | 'orange' | 'purple' | 'gray' | 'neutral' | string
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'capsule--sm'
  if (props.size === 'lg') return 'capsule--lg'
  return 'capsule--md'
})

const colorClass = computed(() => {
  const c = props.color?.toLowerCase()
  if (c === 'green' || c === 'active' || c === 'published' || c === 'sent') return 'capsule--green'
  if (c === 'blue' || c === 'completed' || c === 'adopted') return 'capsule--blue'
  if (c === 'orange' || c === 'scheduled' || c === 'warning') return 'capsule--orange'
  if (c === 'red' || c === 'danger' || c === 'rejected') return 'capsule--red'
  if (c === 'purple' || c === 'foster') return 'capsule--purple'
  if (c === 'gray' || c === 'neutral' || c === 'draft' || c === 'pending' || c === 'intake')
    return 'capsule--gray'

  // Fallback for custom colors if key not found (though CSS vars expect specific classes)
  return 'capsule--gray'
})
</script>

<template>
  <span class="capsule" :class="[sizeClass, colorClass]">
    <slot>{{ props.label }}</slot>
  </span>
</template>

<style scoped lang="css">
.capsule {
  font-family: var(--font-mono);
  border-radius: var(--radius-full);
  font-weight: 500;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 12rem;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  border: 1px solid currentcolor;
  background-color: transparent;
}

/* Kennel-card tags: hairline outline in the role color */
.capsule--green {
  color: var(--color-primary-strong);
  background-color: var(--color-primary-weak);
}

.capsule--blue {
  color: var(--color-secondary-strong);
  background-color: var(--color-secondary-weak);
}

.capsule--orange {
  color: var(--color-warning-strong);
  background-color: var(--color-warning-weak);
}

.capsule--red {
  color: var(--color-danger-strong);
  background-color: var(--color-danger-weak);
}

.capsule--purple {
  color: var(--color-tertiary-strong);
  background-color: var(--color-tertiary-weak);
}

.capsule--gray {
  color: var(--color-neutral-strong);
  background-color: transparent;
  border-color: var(--line-ink);
}

.capsule--white {
  background-color: var(--color-white);
  color: var(--color-neutral-text-soft);
  border-color: var(--line-ink);
}

/* Sizes — floors keep mono tags readable (never below ~11.5px) */
.capsule--sm {
  padding: 4px 10px;
  font-size: 0.72rem;
}

.capsule--md {
  padding: 6px 13px;
  font-size: 0.8rem;
}

.capsule--lg {
  padding: 8px 16px;
  font-size: 0.88rem;
}
</style>
