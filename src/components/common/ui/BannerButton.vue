<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    imgSrc: string
    title: string
    subtitle: string
    color: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    imgSrc: '',
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
    <img :src="imgSrcComputed" :alt="props.title" height="48" width="48" />

    <div class="banner-text">
      <h5>{{ props.title }}</h5>
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

img {
  border-radius: var(--radius-md);
}

.button-color-blue img,
.button-color-green img,
.button-color-purple img {
  filter: brightness(0) invert(1);
}

h5 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: inherit;
}

p {
  margin: 0;
  font-size: 1rem;
  color: inherit;
}
</style>
