<script setup lang="ts">
import { computed, type PropType, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useMetrics } from '../../../composables/useMetrics'
import { goToAdopt } from '../../../utils/navigate.ts'
import BondedPairBadge from '../ui/BondedPairBadge.vue'
import Button from '../ui/Button.vue'
import Capsules from '../ui/Capsules.vue'

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
const buttonTitle = computed(() => `Meet ${props.name}`)
const statusBadge = computed(() => {
  const normalizedStatus = props.status.trim().toLowerCase()
  switch (normalizedStatus) {
    case 'intake':
    case 'intake-processing':
    case 'intake processing':
      return { text: 'Processing', class: 'badge-tertiary', visible: true }
    case 'adoption-pending':
    case 'adoption pending':
    case 'pending':
      return { text: 'Adoption Pending', class: 'badge-warning', visible: true }
    case 'foster':
    case 'foster needed':
      return { text: 'Foster Needed', class: 'badge-secondary', visible: true }
    case 'hold':
    case 'medical hold':
      return { text: 'On Hold', class: 'badge-danger', visible: true }
    default:
      return { text: '', class: '', visible: false }
  }
})

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
      
      <BondedPairBadge
        v-if="props.isBonded"
        :bondedWithNames="props.bondedWithNames"
        size="sm"
        style="margin-bottom: 8px;"
      />

      <div v-if="props.capsules.length > 0" class="capsules">
        <template v-for="capText in props.capsules" :key="capText">
          <Capsules v-if="capText && capText !== 'Invalid Date'" size="sm">{{ capText }}</Capsules>
        </template>
      </div>
      <p v-if="props.description">{{ props.description }}</p>
      <div class="adopt-button">
        <Button :title="buttonTitle" color="blue" @click="handleAdopt" :fullWidth="true" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.pet-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-white);
  color: var(--text-primary);
  border: 1.5px solid var(--line-ink);
  box-shadow: var(--shadow-sm);
  transition:
    translate var(--transition-slow),
    box-shadow var(--transition-slow),
    border-color var(--transition-slow);

  &:hover {
    translate: 0 -6px;
    box-shadow: var(--shadow-lg);
    border-color: var(--line-ink-strong);
  }

  .img-wrapper {
    position: relative;
    width: 100%;
    height: 220px;
    flex-shrink: 0;
    overflow: hidden;

    .img-placeholder {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        110deg,
        hsl(from var(--color-gray-50) h s 97%) 8%,
        hsl(from var(--color-gray-50) h s 92%) 18%,
        hsl(from var(--color-gray-50) h s 97%) 33%
      );
      background-size: 200% 100%;
      animation: shimmer 1.2s linear infinite;
      z-index: 1;
      pointer-events: none;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      background-color: var(--color-gray-50);
      cursor: pointer;
      display: block;
      opacity: 0;
      transition:
        opacity 300ms ease-in-out,
        scale 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);

      &.loaded {
        opacity: 1;
      }
    }

    .img-fallback {
      width: 100%;
      height: 100%;
      background-color: var(--color-primary-weak);
      position: relative;
      cursor: pointer;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: var(--color-primary-border);
        mask: url('/images/paw.svg') no-repeat;
        mask-position: center center;
        mask-size: 100px 100px;
      }
    }

    .badge-stack {
      position: absolute;
      top: 0.75rem;
      left: 50%;
      translate: -50% 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      width: max-content;
      max-width: 90%;
      pointer-events: none;
    }

    .image-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background-color: var(--color-warning);
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 0.74rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 0.3rem 0.65rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--text-primary);
      white-space: nowrap;
    }

    .badge-tertiary {
      background-color: var(--color-tertiary-light);
    }
    
    .badge-warning {
      background-color: var(--color-warning);
    }
    
    .badge-secondary {
      background-color: var(--color-secondary);
      color: var(--color-white);
    }
    
    .badge-danger {
      background-color: var(--color-danger);
      color: var(--color-white);
    }

    .weekend-badge {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary-strong);
    }
  }

  &:hover .img-wrapper img {
    scale: 1.05;
  }

  .info-section {
    display: flex;
    flex-direction: column;
    padding: 4px 20px 18px;
    flex: 1;
    overflow: hidden;
    border-top: 1.5px solid var(--line-ink);
    margin-top: -12px;
    padding-top: 14px;
  }

  h3 {
    font-size: 1.6rem;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
    flex-shrink: 0;
  }

  .capsules {
    display: flex;
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
    margin-bottom: 12px;
  }

  p {
    font-size: 0.925rem;
    flex-grow: 0;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  @media (width <= 768px) {
    p {
      -webkit-line-clamp: 4;
      line-clamp: 4;
    }
  }

  .adopt-button {
    margin-top: 0;
  }

  @media (width >= 1025px) and (width <= 1440px) {
    width: 250px;
  }

  @media (width >= 1441px) {
    width: 270px;
  }
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
