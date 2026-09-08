<script setup lang="ts">
import { computed, type PropType, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useFavorites } from '../../../composables/useFavorites'
import { useMetrics } from '../../../composables/useMetrics'
import { goToAdopt } from '../../../utils/navigate.ts'
import BondedPairBadge from '../ui/BondedPairBadge.vue'
import Button from '../ui/Button.vue'
import Capsules from '../ui/Capsules.vue'
import PetPhotoBadges from './PetPhotoBadges.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  capsules: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },
  photo: {
    type: String as PropType<string | null>,
    required: false,
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    required: false,
    default: 'medium',
  },
  priority: {
    type: Boolean,
    default: false,
  },
  isSponsored: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    required: false,
    default: '',
  },
  isBonded: {
    type: Boolean,
    default: false,
  },
  bondedWithNames: {
    type: Array as PropType<string[] | null>,
    default: null,
  },
  isSpecialNeeds: {
    type: Boolean,
    default: false,
  },
  specialNeedsText: {
    type: String,
    default: '',
  },
  isComingSoon: {
    type: Boolean,
    default: false,
  },
  isAttendingWeekend: {
    type: Boolean,
    default: false,
  },
  attendingScheduleText: {
    type: String,
    default: '',
  },
  attendingDaysText: {
    type: String,
    default: '',
  },
  attendingLocationText: {
    type: String,
    default: '',
  },
})
const router = useRouter()

const r2BaseUrl = computed(() => (import.meta.env.VITE_R2_PUBLIC_URL as string) ?? '')
const photoSrc = computed(() => {
  if (!props.photo) return ''
  const r2Key = props.photo.replace(/^pets\//, '')
  return `${r2BaseUrl.value}/${r2Key}`
})
const isComingSoonStatus = computed(() => {
  const s = props.status.trim().toLowerCase()
  return (
    s === 'intake' ||
    s === 'intake-processing' ||
    s === 'intake processing' ||
    s === 'coming-soon' ||
    s === 'coming soon' ||
    props.isComingSoon
  )
})
const buttonTitle = computed(() => (isComingSoonStatus.value ? `Learn More` : `Meet ${props.name}`))

const imgError = ref(false)
const isImageLoaded = ref(false)

function onImgError() {
  imgError.value = true
}

function onImgLoad() {
  isImageLoaded.value = true
}

watch(photoSrc, () => {
  imgError.value = false
  isImageLoaded.value = false
})

const { submitMetric } = useMetrics()
const { isFavorite, toggleFavorite } = useFavorites()

function handleAdopt() {
  submitMetric('spotlight_click', { petId: props.id, petName: props.name })
  goToAdopt(router, props.id.toLowerCase())
}
</script>

<template>
  <div class="pet-item" :style="{ viewTransitionName: `pet-card-${props.id}` }">
    <div class="img-wrapper">
      <div
        v-if="!imgError && photoSrc && !isImageLoaded"
        class="img-placeholder"
        aria-hidden="true"
      ></div>
      <img
        v-if="!imgError && photoSrc"
        :src="photoSrc"
        :alt="props.name"
        height="250"
        width="240"
        loading="lazy"
        :style="{ viewTransitionName: 'pet-' + props.id }"
        :fetchpriority="priority ? 'high' : 'auto'"
        :class="{ loaded: isImageLoaded }"
        @load="onImgLoad"
        @error="onImgError"
        @click="handleAdopt"
      />
      <div v-else class="img-fallback" aria-hidden="true" @click="handleAdopt"></div>

      <button
        type="button"
        class="fav-btn"
        :class="{ 'is-fav': isFavorite(props.id) }"
        :aria-label="isFavorite(props.id) ? `Remove ${props.name} from saved pets` : `Save ${props.name} to favorites`"
        @click.stop="toggleFavorite(props.id, props.name)"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          :fill="isFavorite(props.id) ? 'currentColor' : 'none'"
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
        :isAttendingWeekend="props.isAttendingWeekend"
        :attendingScheduleText="props.attendingScheduleText"
        :attendingDaysText="props.attendingDaysText"
        :attendingLocationText="props.attendingLocationText"
        :status="props.status"
        :isComingSoon="props.isComingSoon"
        :isSponsored="props.isSponsored"
        :isSpecialNeeds="props.isSpecialNeeds"
        :specialNeedsText="props.specialNeedsText"
        :isBonded="props.isBonded"
        :bondedWithNames="props.bondedWithNames"
      />
    </div>
    <div class="info-section">
      <h3>{{ props.name }}</h3>

      <div v-if="props.capsules.length > 0" class="capsules">
        <template v-for="capText in props.capsules" :key="capText">
          <Capsules v-if="capText && capText !== 'Invalid Date'" size="sm">{{ capText }}</Capsules>
        </template>
      </div>

      <p v-if="props.description">{{ props.description }}</p>

      <div v-if="props.isBonded" class="card-badges">
        <BondedPairBadge
          v-if="props.isBonded"
          :bondedWithNames="props.bondedWithNames"
          size="sm"
        />
      </div>

      <div class="adopt-button">
        <Button :title="buttonTitle" color="blue" @click="handleAdopt" :fullWidth="true" />
      </div>
    </div>
  </div>
</template>

<style scoped src="./PetItem.css"></style>
