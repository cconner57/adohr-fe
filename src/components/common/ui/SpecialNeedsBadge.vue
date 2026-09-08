<script setup lang="ts">
defineProps<{
  text?: string | null
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <div class="special-needs-badge" :class="`special-needs-badge--${size || 'sm'}`">
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
    <span>
      {{ text ? `Special Needs: ${text}` : 'Special Needs' }}
    </span>
  </div>
</template>

<style scoped lang="css">
.special-needs-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background-color: oklch(94% 0.06 310);
  color: oklch(35% 0.14 310);
  border: 1px solid oklch(76% 0.12 310);
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: var(--radius-full);
  width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
    color: oklch(45% 0.18 310);
  }

  &.special-needs-badge--sm {
    padding: 3px 8px;
    font-size: 0.68rem;
  }

  &.special-needs-badge--md {
    padding: 5px 12px;
    font-size: 0.78rem;
  }
}
</style>
