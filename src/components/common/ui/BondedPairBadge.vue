<script setup lang="ts">
defineProps<{
  bondedWithNames?: string[] | null
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <div class="bonded-badge" :class="`bonded-badge--${size || 'sm'}`">
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
    <span>
      Bonded Pair{{ bondedWithNames && bondedWithNames.length > 0 ? ` with ${bondedWithNames.join(' & ')}` : '' }}
    </span>
  </div>
</template>

<style scoped lang="css">
.bonded-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background-color: oklch(from var(--color-danger) 94% 0.05 h);
  color: oklch(from var(--color-danger) 40% 0.18 h);
  border: 1px solid oklch(from var(--color-danger) 75% 0.12 h);
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: var(--radius-full);
  width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
    color: var(--color-danger);
  }

  &--sm {
    padding: 3px 8px;
    font-size: 0.68rem;
  }

  &--md {
    padding: 5px 12px;
    font-size: 0.78rem;
  }
}
</style>
