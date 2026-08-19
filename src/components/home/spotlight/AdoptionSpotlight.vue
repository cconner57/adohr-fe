<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import type { IPet } from '../../../models/common.ts'
import { formatDate } from '../../../utils/common.ts'
import { useIsMobile } from '../../../utils/useIsMobile.ts'
import PetItem from '../../common/pet-item/PetItem.vue'
import Button from '../../common/ui/Button.vue'
import Spinner from '../../common/ui/Spinner.vue'

const props = defineProps<{
  pets: IPet[]
  loading: boolean
  error: string | null
}>()

const isMobile = useIsMobile()
const router = useRouter()

const randomPet = ref<IPet | null>(null)
watch(
  [() => props.pets, isMobile],
  ([newPets, newIsMobile], [oldPets, oldIsMobile]) => {
    if (!newIsMobile) return

    const hasPets = newPets && newPets.length > 0
    if (!hasPets) return

    const justSwitchedToMobile = !oldIsMobile
    const justLoadedPets = !oldPets || oldPets.length === 0

    if (justSwitchedToMobile || justLoadedPets) {
      randomPet.value = newPets[Math.floor(Math.random() * newPets.length)]
    }
  },
  { immediate: true },
)

const displayedPets = computed((): IPet[] => {
  if (isMobile.value) {
    return randomPet.value ? [randomPet.value] : []
  }
  return props.pets
})
</script>

<template>
  <section class="adoption-spotlight">
    <header class="spotlight-header">
      <p class="eyebrow">Waiting right now</p>
      <h2>Adoption <span class="display-accent">spotlight</span></h2>
    </header>

    <div v-if="loading" class="loader-container">
      <Spinner />
    </div>
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
        <h3>Spotlight unavailable</h3>
        <p>We're having trouble loading the featured pets right now, but you can still view all of our adoptable friends.</p>
        <Button title="View all pets" @click="router.push('/adopt')" color="blue" size="medium" />
      </div>
    </div>
    <div v-else class="pet-list">
      <PetItem
        v-for="pet in displayedPets"
        :key="pet.id"
        :name="pet.name"
        :id="(pet.slug || pet.id).toLowerCase()"
        :photo="pet.photos?.find((p) => p.isPrimary)?.url || null"
        :capsules="[
          pet?.species ?? '',
          pet?.sex ?? '',
          pet?.physical?.dateOfBirth ? formatDate(pet?.physical?.dateOfBirth ?? '', true) : '',
        ]"
        :size="isMobile ? 'large' : 'medium'"
        :isSponsored="pet.sponsored?.isSponsored ?? false"
        :status="pet.details?.status ?? ''"
      />
    </div>
  </section>
</template>

<style scoped lang="css">
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
  width: 100%;
  padding: 2rem;
  background-color: var(--text-inverse);
  border: 1px dashed oklch(from var(--color-danger) l c h / 30%);
  border-radius: var(--radius-lg);
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 420px;
  gap: 12px;

  .error-icon {
    color: var(--color-danger);
    margin-bottom: 8px;
    opacity: 0.8;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  p {
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
}

.adoption-spotlight {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  width: 100%;
}

.spotlight-header {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  .eyebrow {
    color: var(--color-secondary);
  }

  h2 {
    font-size: var(--font-size-h2);
    color: var(--text-primary);
  }
}

.pet-list {
  display: flex;
  justify-content: space-between;
  gap: clamp(1rem, 2vw, 2rem);
  width: 100%;
  padding: 8px 4px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  :deep(.pet-item) {
    flex: 1 1 0;
    min-width: 250px;
    max-width: 295px;
  }
}

@media (width <= 1140px) {
  .pet-list {
    justify-content: flex-start;
  }
}

@media (width <= 430px) {
  .pet-list {
    justify-content: center;
  }
}
</style>
