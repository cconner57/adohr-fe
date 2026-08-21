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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
