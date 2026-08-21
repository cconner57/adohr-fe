<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <div class="coming-soon-badge" :class="`coming-soon-badge--${size || 'sm'}`">
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    <span>Coming Soon</span>
  </div>
</template>

<style scoped lang="css">
.coming-soon-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background-color: oklch(93% 0.06 200);
  color: oklch(32% 0.12 200);
  border: 1px solid oklch(75% 0.1 200);
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: var(--radius-full);
  width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
    color: oklch(40% 0.14 200);
  }

  &.coming-soon-badge--sm {
    padding: 3px 8px;
    font-size: 0.68rem;
  }

  &.coming-soon-badge--md {
    padding: 5px 12px;
    font-size: 0.78rem;
  }
}
</style>
