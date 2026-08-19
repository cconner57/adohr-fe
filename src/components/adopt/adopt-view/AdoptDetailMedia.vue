<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  petPhotoUrl: string
  petName: string
  petId: string
}>()

const imgError = ref(false)
const isImageLoaded = ref(false)

function onImgError() {
  imgError.value = true
}

function onImgLoad() {
  isImageLoaded.value = true
}

watch(
  () => props.petPhotoUrl,
  () => {
    imgError.value = false
    isImageLoaded.value = false
  },
)
</script>

<template>
  <div class="adopt-detail__media">
    <div
      v-if="petPhotoUrl && !imgError && !isImageLoaded"
      class="img-placeholder"
      aria-hidden="true"
    ></div>
    <img
      v-if="petPhotoUrl && !imgError"
      :src="petPhotoUrl"
      :alt="petName"
      loading="lazy"
      :style="{ viewTransitionName: 'pet-' + petId }"
      :class="{ loaded: isImageLoaded }"
      @load="onImgLoad"
      @error="onImgError"
    />
    <div v-else class="img-fallback" aria-hidden="true"></div>
  </div>
</template>

<style scoped lang="css">
.adopt-detail__media {
  position: relative;
  flex: 3;
  width: 0;
  min-width: 0;
  height: 600px;

  @media (width <= 1024px) {
    width: 100%;
    height: 400px;
    flex: auto;
  }
}

.img-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    110deg,
    hsl(from var(--color-gray-50) h s 97%) 8%,
    hsl(from var(--color-gray-50) h s 92%) 18%,
    hsl(from var(--color-gray-50) h s 97%) 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
  box-shadow: var(--shadow-lg);
}

img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  opacity: 0;
  transition: opacity 300ms ease-in-out;

  &.loaded {
    opacity: 1;
  }
}

.img-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  background: url('/images/paw.svg') center/100px 100px no-repeat
    oklch(from var(--color-primary) 88% 0.03 h);
  box-shadow: var(--shadow-lg);
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
