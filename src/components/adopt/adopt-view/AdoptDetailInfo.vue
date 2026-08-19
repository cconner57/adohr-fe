<script setup lang="ts">
import { computed } from 'vue'

import type { IPet } from '../../../models/common.ts'
import { calculateAge } from '../../../utils/date'
import BondedPairBadge from '../../common/ui/BondedPairBadge.vue'
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

const goodWithItems = computed(() => {
  const traits = props.pet.behavior
  if (!traits) return []

  const items: { label: string; key: 'kids' | 'dogs' | 'cats' }[] = []
  if (traits.isGoodWithKids) items.push({ label: 'Good with kids', key: 'kids' })
  if (traits.isGoodWithDogs) items.push({ label: 'Good with dogs', key: 'dogs' })
  if (traits.isGoodWithCats) items.push({ label: 'Good with cats', key: 'cats' })

  return items
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

      <BondedPairBadge
        v-if="pet.behavior?.bonded?.isBonded"
        :bondedWithNames="pet.behavior?.bonded?.bondedWith"
        size="md"
        style="margin-bottom: 12px;"
      />

      <div class="adopt-detail__traits">
        <Capsules v-if="pet?.species" :label="pet?.species" />
        <Capsules v-if="pet?.sex" :label="pet?.sex" />
        <Capsules
          v-if="pet?.physical?.dateOfBirth"
          :label="calculateAge(pet?.physical?.dateOfBirth)"
        />
      </div>

      <div class="behavior-tags" v-if="goodWithItems.length > 0">
        <div v-for="item in goodWithItems" :key="item.key" class="behavior-tag">
          <svg
            v-if="item.key === 'kids'"
            class="tag-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <svg
            v-else-if="item.key === 'dogs'"
            class="tag-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10 5.17C10 3.78 8.42 2.68 6.5 3c-2.82.47-4.11 6.01-4 7 .08.71.72 1.35 1.5 1.5 1.56.31 3.04-1.13 3.5-2.5" />
            <path d="M14 5.17C14 3.78 15.58 2.68 17.5 3c2.82.47 4.11 6.01 4 7-.08.71-.72 1.35-1.5 1.5-1.56.31-3.04-1.13-3.5-2.5" />
            <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none" />
            <path d="M11 16.5h2l-1 1-1-1z" fill="currentColor" stroke="none" />
            <path d="M4.42 11.25A13.15 13.15 0 0 0 4 14.5c0 4.42 3.58 8 8 8s8-3.58 8-8c0-1.14-.24-2.22-.66-3.2" />
          </svg>
          <svg
            v-else-if="item.key === 'cats'"
            class="tag-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-1.39 8.12.63 1.18.97 2.51.97 3.88 0 4.97-3.58 9-8 9s-8-4.03-8-9c0-1.37.34-2.7.97-3.88C3.99 10 2.17 3.58 3.57 3c1.39-.58 4.64.26 6.43 2.26.65-.17 1.33-.26 2-.26z" />
            <circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none" />
            <path d="M11 15.5h2l-1 1-1-1z" fill="currentColor" stroke="none" />
          </svg>
          <span>{{ item.label }}</span>
        </div>
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
    margin-bottom: 1.25rem;
  }

  .behavior-tag {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: var(--color-primary-weak);
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-primary-strong);
    border: 1px solid var(--color-primary-border);
    
    .tag-icon {
      color: var(--color-primary);
      stroke: var(--color-primary);
      flex-shrink: 0;
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
