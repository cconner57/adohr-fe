<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    icon?: 'paw' | 'photo'
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    label: '',
    icon: 'paw',
    size: 'medium',
  },
)
</script>

<template>
  <div class="img-fallback" :class="[`size-${size}`]" aria-hidden="true">
    <div class="fallback-icon-wrap">
      <svg
        v-if="icon === 'paw'"
        viewBox="0 0 128 128"
        fill="currentColor"
        class="fallback-svg"
        aria-hidden="true"
      >
        <ellipse cx="28" cy="44" rx="11" ry="14" />
        <ellipse cx="100" cy="44" rx="11" ry="14" />
        <ellipse cx="52" cy="28" rx="11" ry="14" />
        <ellipse cx="76" cy="28" rx="11" ry="14" />
        <path d="M64 56c-20 0-36 15-36 32 0 11 9 20 22 20h28c13 0 22-9 22-20 0-17-16-32-36-32" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="fallback-svg"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.img-fallback {
  width: 100%;
  height: 100%;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  background: linear-gradient(
    135deg,
    oklch(from var(--color-primary) 96% 0.02 h),
    oklch(from var(--color-secondary) 94% 0.04 h)
  );
  color: var(--color-secondary);
  user-select: none;
}

.fallback-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: var(--radius-full);
  background-color: oklch(from var(--text-inverse) l c h / 80%);
  border: 1px solid var(--line-ink);
  box-shadow: 0 4px 12px oklch(from var(--shadow-color) l c h / 8%);
}

.fallback-svg {
  width: 30px;
  height: 30px;
  color: var(--color-secondary);
  opacity: 0.85;
}

.size-small {
  min-height: 50px;

  .fallback-icon-wrap {
    width: 32px;
    height: 32px;
  }

  .fallback-svg {
    width: 18px;
    height: 18px;
  }
}

.size-large {
  min-height: 220px;

  .fallback-icon-wrap {
    width: 76px;
    height: 76px;
  }

  .fallback-svg {
    width: 42px;
    height: 42px;
  }
}
</style>
