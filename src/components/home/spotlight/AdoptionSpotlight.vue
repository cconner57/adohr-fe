<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import PetItem from '@/components/common/pet-item/PetItem.vue'
import PetItemSkeleton from '@/components/common/pet-item/PetItemSkeleton.vue'
import Button from '@/components/common/ui/Button.vue'
import type { IPet } from '@/models/common'
import { formatDate } from '@/utils/common'

const props = defineProps<{
  pets: IPet[]
  loading: boolean
  error: string | null
}>()

const router = useRouter()

const displayedPets = computed((): IPet[] => {
  return (props.pets ?? []).slice(0, 4)
})
</script>

<template>
  <section class="adoption-spotlight" aria-label="Featured adoptable pets">
    <header class="spotlight-header">
      <p class="eyebrow">Waiting right now</p>
      <h2>Adoption <span class="display-accent">spotlight</span></h2>
    </header>

    <div v-if="loading" class="pet-list" aria-busy="true" aria-label="Loading featured pets">
      <PetItemSkeleton v-for="i in 4" :key="i" />
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
    <div v-else-if="displayedPets.length === 0" class="empty-container">
      <p class="empty-text">No spotlight pets available right now. Check back soon!</p>
      <Button title="View all adoptable pets" @click="router.push('/adopt')" color="blue" size="medium" />
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
        size="medium"
        :isSponsored="pet.sponsored?.isSponsored ?? false"
        :status="pet.details?.status ?? ''"
      />
    </div>
  </section>
</template>

<style scoped lang="css">
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
  scroll-snap-type: x mandatory;

  :deep(.pet-item),
  :deep(.pet-skeleton) {
    flex: 1 1 0;
    min-width: 250px;
    max-width: 295px;
    scroll-snap-align: start;
  }
}

@media (width <= 1140px) {
  .pet-list {
    justify-content: flex-start;
  }
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 3rem 1.5rem;
  background-color: var(--text-inverse);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--line-ink);
  text-align: center;

  .empty-text {
    font-size: 1.1rem;
    color: var(--text-secondary);
  }
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
</style>
