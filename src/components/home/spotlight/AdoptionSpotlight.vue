<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { IPet } from '../../../models/common.ts'
import { useIsMobile } from '../../../utils/useIsMobile.ts'
import PetItem from '../../common/pet-item/PetItem.vue'
import Spinner from '../../common/ui/Spinner.vue'

const props = defineProps<{
  pets: IPet[]
  loading: boolean
  error: string | null
}>()

const isMobile = useIsMobile()

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
      <p>Unable to load spotlight pets.</p>
    </div>
    <div v-else class="pet-list">
      <PetItem
        v-for="pet in displayedPets"
        :key="pet.id"
        :name="pet.name"
        :id="(pet.slug || pet.id).toLowerCase()"
        :photo="pet.photos?.find((p) => p.isPrimary)?.url || null"
        :description="pet.descriptions?.spotlight || ''"
        :size="isMobile ? 'large' : 'medium'"
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
  min-height: 100px;
  width: 100%;
  color: var(--color-danger);
  font-weight: 500;
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
  gap: clamp(1.25rem, 2.5vw, 2rem);
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 8px 4px 16px;
  -webkit-overflow-scrolling: touch;
  justify-content: flex-start;
}

@media (width <= 430px) {
  .pet-list {
    justify-content: center;
  }
}
</style>
