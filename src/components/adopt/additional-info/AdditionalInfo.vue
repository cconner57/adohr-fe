<script setup lang="ts">
import { computed } from 'vue'

import type { IPet } from '../../../models/common.ts'

const props = defineProps<{
  pet: IPet
}>()

const isSpayedOrNeutered = (pet: IPet) => {
  return pet?.sex === 'male' ? 'Neutered' : 'Spayed'
}

const goodWithText = computed(() => {
  const traits = props.pet.behavior
  if (!traits || (!traits.isGoodWithCats && !traits.isGoodWithDogs && !traits.isGoodWithKids)) {
    return 'N/A'
  }

  const goodWith: string[] = []
  if (traits.isGoodWithCats) goodWith.push('Other Cats')
  if (traits.isGoodWithDogs) goodWith.push('Other Dogs')
  if (traits.isGoodWithKids) goodWith.push('Kids')

  return goodWith.join(', ')
})

const normalizedBreed = computed(() => {
  const breed = props.pet.physical?.breed
  if (!breed) return 'N/A'

  const normalized = breed.trim().toLowerCase()
  if (normalized === 'unknown') return 'Unknown'
  if (normalized === 'mix') return 'Mix'

  return breed
})

const houseTrainedText = () => {
  if (props.pet.behavior?.isHouseTrained === undefined) {
    return 'N/A'
  }
  if (props.pet.behavior?.isHouseTrained) {
    return 'Yes'
  } else {
    return 'No'
  }
}
</script>

<template>
  <div class="adopt-detail__additional-info">
    <div class="adopt-detail__additional-info__item">
      <p>Breed</p>
      <p>{{ normalizedBreed }}</p>
    </div>
    <div class="adopt-detail__additional-info__item">
      <p>Color</p>
      <p>{{ pet.physical?.color ?? 'N/A' }}</p>
    </div>
    <div class="adopt-detail__additional-info__item">
      <p>Size</p>
      <p>{{ pet.physical?.size ?? 'N/A' }}</p>
    </div>
    <div class="adopt-detail__additional-info__item">
      <p>House-trained</p>
      <p>{{ houseTrainedText() }}</p>
    </div>
    <div class="adopt-detail__additional-info__item">
      <p>Health</p>
      <p>
        {{ pet.medical?.vaccinationsUpToDate ? 'Vaccinated' : 'Not Vaccinated' }},
        {{
          pet.medical?.spayedOrNeutered
            ? isSpayedOrNeutered(pet)
            : `Not ${isSpayedOrNeutered(pet)}`
        }},
        {{ pet.medical?.microchip.microchipped ? 'Microchipped' : 'Not Microchipped' }}
      </p>
    </div>
    <div class="adopt-detail__additional-info__item">
      <p>Good in a home with</p>
      <p>{{ goodWithText }}</p>
    </div>
    <div class="adopt-detail__additional-info__item">
      <p>Adoption Fee</p>
      <p v-if="pet.sponsored?.isSponsored" class="sponsored-fee">Sponsored — $0</p>
      <p v-else>{{ pet?.adoption?.fee != null ? '$' + pet.adoption.fee : '—' }}</p>
    </div>
  </div>
</template>

<style scoped lang="css">
.adopt-detail__additional-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: none;

  @media (width <= 440px) {
    flex-direction: column;
    align-items: stretch;

    p {
      font-size: 0.9rem;
      line-height: 1.5;
      text-wrap: wrap;
    }

    p:last-child {
      text-wrap: wrap;
      width: auto;
      flex: 1;
    }
  }
}

.adopt-detail__additional-info__item {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

  &:first-child {
    border-top: 1px solid var(--line-ink-strong, oklch(from var(--text-primary) l c h / 32%));
  }

  p {
    text-transform: capitalize;
    text-align: left;
  }

  & p:first-child {
    width: 200px;
    flex-shrink: 0;
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-secondary);

    @media (width <= 440px) {
      width: 110px;
      margin-right: 12px;
    }
  }

  & p:last-child {
    font-weight: 700;
    width: 300px;

    &.sponsored-fee {
      color: oklch(from var(--color-warning) 42% 0.12 h);
    }

    @media (width <= 440px) {
      width: auto;
      flex: 1;
    }
  }
}
</style>
