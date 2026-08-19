<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  petPhotoUrl: string
  petName: string
  petId: string
  photos?: Array<{ url: string; isPrimary?: boolean; caption?: string }>
  videos?: Array<{ url: string; thumbnail?: string }>
}>()

const r2BaseUrl = computed(() => (import.meta.env.VITE_R2_PUBLIC_URL as string) ?? '')

const resolvedPhotos = computed(() => {
  if (props.photos && props.photos.length > 0) {
    return props.photos.map((p) => {
      const key = p.url.replace(/^pets\//, '')
      return {
        url: `${r2BaseUrl.value}/${key}`,
        caption: p.caption,
      }
    })
  }
  if (props.petPhotoUrl) {
    return [{ url: props.petPhotoUrl }]
  }
  return []
})

const activeIndex = ref(0)
const isLightboxOpen = ref(false)
const imgError = ref(false)
const isImageLoaded = ref(false)

const activePhoto = computed(() => {
  if (resolvedPhotos.value.length === 0) return null
  return resolvedPhotos.value[activeIndex.value] || resolvedPhotos.value[0]
})

function onImgError() {
  imgError.value = true
}

function onImgLoad() {
  isImageLoaded.value = true
}

function nextLightboxPhoto() {
  if (resolvedPhotos.value.length > 1) {
    activeIndex.value = (activeIndex.value + 1) % resolvedPhotos.value.length
  }
}

function prevLightboxPhoto() {
  if (resolvedPhotos.value.length > 1) {
    activeIndex.value =
      (activeIndex.value - 1 + resolvedPhotos.value.length) % resolvedPhotos.value.length
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return
  if (e.key === 'Escape') isLightboxOpen.value = false
  if (e.key === 'ArrowRight') nextLightboxPhoto()
  if (e.key === 'ArrowLeft') prevLightboxPhoto()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

watch(
  () => props.petPhotoUrl,
  () => {
    imgError.value = false
    isImageLoaded.value = false
    activeIndex.value = 0
  },
)
</script>

<template>
  <div class="adopt-detail__media-wrapper">
    <div class="adopt-detail__media">
      <div
        v-if="activePhoto && !imgError && !isImageLoaded"
        class="img-placeholder"
        aria-hidden="true"
      ></div>

      <img
        v-if="activePhoto && !imgError"
        :src="activePhoto.url"
        :alt="petName"
        loading="lazy"
        :style="{ viewTransitionName: 'pet-' + petId }"
        :class="{ loaded: isImageLoaded }"
        @load="onImgLoad"
        @error="onImgError"
        @click="isLightboxOpen = true"
        tabindex="0"
        role="button"
        :aria-label="`Zoom photo of ${petName}`"
      />

      <div v-else class="img-fallback" aria-hidden="true"></div>

      <button
        v-if="activePhoto && !imgError"
        type="button"
        class="zoom-trigger-btn"
        aria-label="Open full-screen photo gallery"
        @click="isLightboxOpen = true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
    </div>

    <!-- Multi-photo thumbnails strip if more than 1 photo -->
    <div v-if="resolvedPhotos.length > 1" class="thumbnail-strip" role="tablist" aria-label="Pet photos">
      <button
        v-for="(photo, idx) in resolvedPhotos"
        :key="photo.url"
        type="button"
        class="thumb-btn"
        :class="{ active: activeIndex === idx }"
        :aria-selected="activeIndex === idx"
        @click="activeIndex = idx"
      >
        <img :src="photo.url" :alt="`${petName} photo ${idx + 1}`" loading="lazy" />
      </button>
    </div>

    <!-- Native Full-Screen Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="isLightboxOpen && activePhoto"
        class="lightbox-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="`Full screen photo of ${petName}`"
        @click.self="isLightboxOpen = false"
      >
        <button
          type="button"
          class="lightbox-close-btn"
          aria-label="Close full-screen photo"
          @click="isLightboxOpen = false"
        >
          &times;
        </button>

        <button
          v-if="resolvedPhotos.length > 1"
          type="button"
          class="lightbox-nav-btn prev"
          aria-label="Previous photo"
          @click="prevLightboxPhoto"
        >
          &#8249;
        </button>

        <div class="lightbox-content">
          <img :src="activePhoto.url" :alt="petName" class="lightbox-img" />
          <div v-if="resolvedPhotos.length > 1" class="lightbox-counter">
            {{ activeIndex + 1 }} / {{ resolvedPhotos.length }}
          </div>
        </div>

        <button
          v-if="resolvedPhotos.length > 1"
          type="button"
          class="lightbox-nav-btn next"
          aria-label="Next photo"
          @click="nextLightboxPhoto"
        >
          &#8250;
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="css">
.adopt-detail__media-wrapper {
  flex: 3;
  width: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (width <= 1024px) {
    width: 100%;
    flex: auto;
  }
}

.adopt-detail__media {
  position: relative;
  width: 100%;
  height: 560px;
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background-color: var(--color-primary-weak);

  @media (width <= 1024px) {
    height: 400px;
  }

  @media (width <= 480px) {
    height: 320px;
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: var(--radius-lg, 16px);
    opacity: 0;
    transition: opacity 300ms ease-in-out, scale 0.3s ease;
    cursor: zoom-in;

    &.loaded {
      opacity: 1;
    }

    &:hover {
      scale: 1.02;
    }
  }

  .zoom-trigger-btn {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: oklch(from var(--text-inverse) 95% c h / 90%);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 20%));
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(4px);
    box-shadow: var(--shadow-sm);
    transition: all 0.15s ease;

    &:hover {
      background-color: var(--text-inverse);
      scale: 1.08;
    }
  }
}

.img-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg, 16px);
  background: linear-gradient(
    110deg,
    hsl(from var(--color-gray-50) h s 97%) 8%,
    hsl(from var(--color-gray-50) h s 92%) 18%,
    hsl(from var(--color-gray-50) h s 97%) 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}

.img-fallback {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-weak);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--color-primary-border);
    mask: url('/images/paw.svg') no-repeat;
    mask-position: center center;
    mask-size: 140px 140px;
  }
}

.thumbnail-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  scroll-snap-type: x mandatory;

  .thumb-btn {
    all: unset;
    width: 64px;
    height: 64px;
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    flex-shrink: 0;
    scroll-snap-align: start;
    transition: border-color 0.15s ease, opacity 0.15s ease;
    opacity: 0.7;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      opacity: 1;
    }

    &.active {
      border-color: var(--color-primary);
      opacity: 1;
      box-shadow: 0 0 0 2px var(--color-primary-border);
    }
  }
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  background-color: oklch(0% 0 0deg / 90%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal, 2000);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease-out;

  .lightbox-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    max-width: 90vw;
    max-height: 90vh;

    .lightbox-img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: var(--radius-md, 12px);
      box-shadow: var(--shadow-xl);
    }

    .lightbox-counter {
      color: var(--text-inverse);
      font-family: var(--font-mono);
      font-size: 0.85rem;
      background: oklch(0% 0 0deg / 50%);
      padding: 4px 12px;
      border-radius: var(--radius-full);
    }
  }

  .lightbox-close-btn {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: transparent;
    border: none;
    color: var(--text-inverse);
    font-size: 2.5rem;
    line-height: 1;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: var(--radius-sm);
    z-index: 10;

    &:hover {
      color: var(--color-secondary);
    }
  }

  .lightbox-nav-btn {
    position: absolute;
    top: 50%;
    translate: 0 -50%;
    background: oklch(100% 0 0deg / 15%);
    border: 1px solid oklch(100% 0 0deg / 30%);
    color: var(--text-inverse);
    font-size: 2.5rem;
    line-height: 1;
    cursor: pointer;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease;
    z-index: 10;

    &.prev {
      left: 1.5rem;
    }

    &.next {
      right: 1.5rem;
    }

    &:hover {
      background: oklch(100% 0 0deg / 35%);
    }

    @media (width <= 480px) {
      width: 40px;
      height: 40px;
      font-size: 1.8rem;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
