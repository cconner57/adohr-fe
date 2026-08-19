<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import type { IPet } from '../../../models/common.ts'
import { calculateAge } from '../../../utils/date'
import Button from '../../common/ui/Button.vue'
import Capsules from '../../common/ui/Capsules.vue'
import AdditionalInfo from '../additional-info/AdditionalInfo.vue'

const props = defineProps<{
  pet: IPet
  isComingSoon: boolean
  isStartAdoptionDisabled: boolean
}>()

const emit = defineEmits<{
  'start-adoption': []
  share: []
  'request-info': []
  'schedule-meet': []
}>()

const router = useRouter()

const statusBadge = computed(() => {
  const normalizedStatus = props.pet.details?.status?.trim().toLowerCase() ?? ''
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
</script>

<template>
  <div class="adopt-detail__info">
    <div class="adopt-detail__info__main">
      <div class="header-top">
        <p class="eyebrow">Waiting for a home</p>
        <div v-if="statusBadge.visible" class="detail-badge" :class="statusBadge.class">{{ statusBadge.text }}</div>
      </div>
      <h1 class="text-balance">{{ pet.name }}</h1>
      <div class="adopt-detail__traits">
        <Capsules v-if="pet?.species" :label="pet?.species" />
        <Capsules v-if="pet?.sex" :label="pet?.sex" />
        <Capsules
          v-if="pet?.physical?.dateOfBirth"
          :label="calculateAge(pet?.physical?.dateOfBirth)"
        />
      </div>

      <div class="behavior-tags" v-if="pet?.behavior?.isGoodWithKids || pet?.behavior?.isGoodWithDogs || pet?.behavior?.isGoodWithCats">
        <div v-if="pet?.behavior?.isGoodWithKids" class="behavior-tag"><span class="emoji">👶</span> Good with kids</div>
        <div v-if="pet?.behavior?.isGoodWithDogs" class="behavior-tag"><span class="emoji">🐶</span> Good with dogs</div>
        <div v-if="pet?.behavior?.isGoodWithCats" class="behavior-tag"><span class="emoji">🐱</span> Good with cats</div>
      </div>

      <p>{{ pet?.descriptions?.fun }}</p>
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
      <div class="secondary-foster-cta">
        <Button title="Not ready to adopt? Interested in fostering?" variant="text" theme="neutral" @click="router.push('/foster')" />
      </div>
      <output v-if="isComingSoon" class="coming-soon-banner">
        This pet is coming soon. You can request information now, and scheduling opens once the pet
        is available.
      </output>
    </div>
    <AdditionalInfo :pet="pet" />
    <output v-if="pet.sponsored?.isSponsored" class="sponsored-banner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
      <span>
        <strong>Adoption Fee Sponsored</strong>
        <span class="sponsored-sub">A generous supporter has covered this pet's adoption fee.</span>
      </span>
    </output>
  </div>
</template>

<style scoped lang="css">
.adopt-detail__info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--text-inverse);
  color: var(--text-primary);
  padding: 32px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  flex: 2;
  width: 0;
  min-width: 0;
  height: auto;
  min-height: 600px;
  box-shadow: var(--shadow-md);

  @media (width <= 1024px) {
    width: 100%;
    min-height: auto;
    flex: auto;
  }
}

.adopt-detail__info__main {
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .detail-badge {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.3rem 0.65rem;
    border-radius: var(--radius-full);
    color: var(--text-primary);
  }
  
  .badge-tertiary { background-color: var(--color-tertiary-light); }
  .badge-warning { background-color: var(--color-warning); }
  .badge-secondary { background-color: var(--color-secondary); color: var(--color-white); }
  .badge-danger { background-color: var(--color-danger); color: var(--color-white); }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-secondary);
    margin-bottom: 6px;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.05;
    margin-bottom: 0.75rem;
  }

  & > p:not(.eyebrow) {
    line-height: 1.6;
    color: var(--text-secondary);
  }

  .adopt-detail__traits {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  }

  .behavior-tags {
    display: flex;
    flex-flow: row wrap;
    gap: 8px;
    margin-bottom: 1rem;
  }

  .behavior-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: var(--color-gray-50);
    padding: 6px 12px;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-primary);
    border: 1px solid var(--line-ink);
    
    .emoji {
      font-size: 1.1rem;
    }
  }

  .adopt-detail__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

    @media (width <= 440px) {
      display: flex;
      flex-direction: column;
    }
  }

  .secondary-foster-cta {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    
    :deep(button) {
      color: var(--text-secondary);
      font-size: 0.9rem;
      
      &:hover {
        color: var(--color-secondary);
      }
    }
  }
}

.sponsored-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background-color: oklch(from var(--color-warning) 94% 0.07 h);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: var(--text-primary);

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: oklch(from var(--color-warning) 55% 0.13 h);
  }

  span {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  strong {
    font-size: 0.9rem;
    font-weight: 700;
  }

  .sponsored-sub {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
}

.coming-soon-banner {
  display: block;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background-color: oklch(from var(--color-primary) 94% 0.025 h);
  border: 1px solid oklch(from var(--color-primary) 78% 0.05 h);
  color: oklch(from var(--color-primary) 30% 0.06 h);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.45;
}
</style>
