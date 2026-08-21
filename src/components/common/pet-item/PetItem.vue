<script setup lang="ts">
import { computed, type PropType, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useMetrics } from '../../../composables/useMetrics'
import { goToAdopt } from '../../../utils/navigate.ts'
import BondedPairBadge from '../ui/BondedPairBadge.vue'
import Button from '../ui/Button.vue'
import Capsules from '../ui/Capsules.vue'
import SpecialNeedsBadge from '../ui/SpecialNeedsBadge.vue'

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
})
const router = useRouter()

const r2BaseUrl = computed(() => (import.meta.env.VITE_R2_PUBLIC_URL as string) ?? '')
const photoSrc = computed(() => {
  if (!props.photo) return ''
  const r2Key = props.photo.replace(/^pets\//, '')
  return `${r2BaseUrl.value}/${r2Key}`
})

const imgError = ref(false)
const isImageLoaded = ref(false)
const statusBadge = computed(() => {
  const normalizedStatus = props.status.trim().toLowerCase()
  switch (normalizedStatus) {
    case 'intake':
    case 'intake-processing':
    case 'intake processing':
    case 'coming-soon':
    case 'coming soon':
      return { text: 'Coming Soon', class: 'badge-coming-soon', visible: true, isComingSoon: true }
    case 'adoption-pending':
    case 'adoption pending':
    case 'pending':
      return { text: 'Adoption Pending', class: 'badge-warning', visible: true, isComingSoon: false }
    case 'foster':
    case 'foster needed':
      return { text: 'Foster Needed', class: 'badge-secondary', visible: true, isComingSoon: false }
    case 'hold':
    case 'medical hold':
      return { text: 'On Hold', class: 'badge-danger', visible: true, isComingSoon: false }
    default:
      if (props.isComingSoon) {
        return { text: 'Coming Soon', class: 'badge-coming-soon', visible: true, isComingSoon: true }
      }
      return { text: '', class: '', visible: false, isComingSoon: false }
  }
})
const buttonTitle = computed(() => (props.isComingSoon || statusBadge.value.isComingSoon ? `Learn More` : `Meet ${props.name}`))

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
      
      <div class="badge-stack">
        <div
          v-if="statusBadge.visible"
          class="image-badge"
          :class="statusBadge.class"
          :aria-label="statusBadge.text"
        >
          <svg
            v-if="statusBadge.isComingSoon"
            width="12"
            height="12"
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
          {{ statusBadge.text }}
        </div>
        <div
          v-if="props.isSponsored"
          class="image-badge sponsored-badge"
          aria-label="Adoption fee sponsored"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          Sponsored
        </div>
        <div
          v-if="props.isAttendingWeekend"
          class="image-badge weekend-badge"
          aria-label="Attending PetSmart this weekend"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          At PetSmart Sat &amp; Sun
        </div>
      </div>
    </div>
    <div class="info-section">
      <h3>{{ props.name }}</h3>

      <div v-if="props.capsules.length > 0" class="capsules">
        <template v-for="capText in props.capsules" :key="capText">
          <Capsules v-if="capText && capText !== 'Invalid Date'" size="sm">{{ capText }}</Capsules>
        </template>
      </div>

      <p v-if="props.description">{{ props.description }}</p>

      <div v-if="props.isBonded || props.isSpecialNeeds" class="card-badges">
        <BondedPairBadge
          v-if="props.isBonded"
          :bondedWithNames="props.bondedWithNames"
          size="sm"
        />

        <SpecialNeedsBadge
          v-if="props.isSpecialNeeds"
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
