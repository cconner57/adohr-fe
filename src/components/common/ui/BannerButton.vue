<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    imgSrc?: string
    icon?: 'adopt' | 'foster' | 'donate' | 'paw' | 'home-heart' | 'heart'
    title: string
    subtitle: string
    color: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    imgSrc: '',
    icon: undefined,
    title: 'Adopt a Pet',
    subtitle: 'Find your perfect companion',
    color: 'blue',
    type: 'button',
  },
)

const imgSrcComputed = computed(() => (props.imgSrc && props.imgSrc.length ? props.imgSrc : ''))
</script>

<template>
  <button
    class="banner-button"
    :class="{
      'button-color-blue': props.color === 'blue',
      'button-color-green': props.color === 'green',
      'button-color-purple': props.color === 'purple',
    }"
    :type="props.type"
  >
    <svg
      v-if="props.icon === 'adopt' || props.icon === 'paw'"
      class="banner-icon"
      width="48"
      height="48"
      viewBox="0 0 128 128"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="28" cy="44" rx="11" ry="14" />
      <ellipse cx="100" cy="44" rx="11" ry="14" />
      <ellipse cx="52" cy="28" rx="11" ry="14" />
      <ellipse cx="76" cy="28" rx="11" ry="14" />
      <path d="M64 56c-20 0-36 15-36 32 0 11 9 20 22 20h28c13 0 22-9 22-20 0-17-16-32-36-32" />
    </svg>

    <svg
      v-else-if="props.icon === 'foster' || props.icon === 'home-heart'"
      class="banner-icon"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M12 3L2 12h3v8h14v-8h3L12 3zm0 5.5c1.4 0 2.5 1.1 2.5 2.5 0 1.9-2.5 3.8-2.5 3.8s-2.5-1.9-2.5-3.8c0-1.4 1.1-2.5 2.5-2.5z"
      />
    </svg>

    <svg
      v-else-if="props.icon === 'donate' || props.icon === 'heart'"
      class="banner-icon"
      width="48"
      height="48"
      viewBox="0 0 128 128"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M64 112 20 64c-10-12-10-30 4-40s30-4 40 12c10-16 26-22 40-12s14 28 4 40z" />
    </svg>

    <img v-else-if="imgSrcComputed" :src="imgSrcComputed" :alt="props.title" height="48" width="48" />

    <div class="banner-text">
      <span class="banner-title">{{ props.title }}</span>
      <p>{{ props.subtitle }}</p>
    </div>
  </button>
</template>

<style scoped lang="css">
.banner-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border-radius: var(--radius-md);
  cursor: pointer;
  min-height: 160px;
  height: auto;
  width: 100%;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  color: var(--text-inverse);
  overflow: hidden;

  @media (width <= 440px) {
    width: 100%;
  }
}

.banner-text {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.banner-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  color: #ffffff;
}

img {
  border-radius: var(--radius-md);
}

.button-color-blue img,
.button-color-green img,
.button-color-purple img {
  filter: brightness(0) invert(1);
}

.banner-title,
h5 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: inherit;
  display: block;
}

p {
  margin: 0;
  font-size: 1rem;
  color: inherit;
}
</style>
