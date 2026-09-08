<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { useAdoptionEvents } from '../../../composables/useAdoptionEvents'
import { useFavorites } from '../../../composables/useFavorites'
import type { IPet } from '../../../models/common.ts'
import { getPetSpecialNeeds } from '../../../utils/petNormalizer'
import PetPhotoBadges from '../../common/pet-item/PetPhotoBadges.vue'
import Button from '../../common/ui/Button.vue'

const props = defineProps<{
  petPhotoUrl: string
  petName: string
  petId: string
  pet?: IPet
  photos?: Array<{ url: string; isPrimary?: boolean; caption?: string }>
  videos?: Array<{ url: string; thumbnail?: string }>
  isComingSoon?: boolean
  isStartAdoptionDisabled?: boolean
}>()

const { getPetAttendanceSchedule } = useAdoptionEvents()
const { isFavorite, toggleFavorite } = useFavorites()

const attendanceSchedule = computed(() => {
  if (!props.pet) return null
  return getPetAttendanceSchedule(props.pet.id) || getPetAttendanceSchedule(props.pet.slug)
})

const emit = defineEmits<{
  'start-adoption': []
  share: []
  'request-info': []
  'schedule-meet': []
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

      <button
        type="button"
        class="fav-trigger-btn"
        :class="{ 'is-fav': isFavorite(petId) }"
        :aria-label="isFavorite(petId) ? `Remove ${petName} from saved pets` : `Save ${petName} to favorites`"
        @click.stop="toggleFavorite(petId, petName)"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          :fill="isFavorite(petId) ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      <PetPhotoBadges
        v-if="pet"
        size="lg"
        :isAttendingWeekend="Boolean(attendanceSchedule || pet?.isAttendingWeekend)"
        :attendingScheduleText="attendanceSchedule?.scheduleText || ''"
        :attendingDaysText="attendanceSchedule?.shortDayText || ''"
        :attendingLocationText="attendanceSchedule?.displayLocation || ''"
        :status="pet.details?.status ?? ''"
        :isComingSoon="props.isComingSoon || pet.details?.status === 'intake'"
        :isSponsored="pet.sponsored?.isSponsored ?? false"
        :isSpecialNeeds="getPetSpecialNeeds(pet).isSpecialNeeds"
        :specialNeedsText="getPetSpecialNeeds(pet).specialNeedsText"
        :isBonded="Boolean(pet.behavior?.bonded?.isBonded)"
        :bondedWithNames="pet.behavior?.bonded?.bondedWith ?? null"
      />
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

    <!-- Primary Action Buttons Container Card -->
    <div class="adopt-detail__actions-card">
      <div class="adopt-detail__actions">
        <Button
          title="Start Adoption"
          color="blue"
          @click="emit('start-adoption')"
          :disabled="isStartAdoptionDisabled"
          :fullWidth="true"
        />
        <Button title="Share" color="green" @click="emit('share')" :fullWidth="true" />
        <Button
          title="Request Information"
          color="orange"
          @click="emit('request-info')"
          :fullWidth="true"
        />
        <Button
          title="Schedule a Meet"
          color="purple"
          @click="emit('schedule-meet')"
          :disabled="isComingSoon"
          :fullWidth="true"
        />
      </div>

      <output v-if="isComingSoon" class="coming-soon-banner">
        This pet is coming soon. You can request information now, and scheduling opens once the pet
        is available.
      </output>
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

<style scoped src="./AdoptDetailMedia.css"></style>

