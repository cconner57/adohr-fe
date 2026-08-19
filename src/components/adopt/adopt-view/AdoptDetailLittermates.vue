<script setup lang="ts">
import type { IPet } from '../../../models/common.ts'
import { formatDate } from '../../../utils/common.ts'
import PetItem from '../../common/pet-item/PetItem.vue'

defineProps<{
  pet: IPet
  littermates: IPet[]
}>()
</script>

<template>
  <section v-if="littermates && littermates.length > 0" class="adopt-detail__littermates" aria-label="Littermates">
    <div class="littermates-header">
      <p class="eyebrow">Family Ties</p>
      <h2>Meet {{ pet.name }}'s Littermates</h2>
      <p class="litter-desc">
        {{ pet.litterName ? `${pet.litterName} Litter · ` : '' }}These brothers and sisters were rescued together and are also looking for their forever homes.
      </p>
    </div>

    <div class="littermates-grid">
      <PetItem
        v-for="littermate in littermates"
        :key="littermate.id"
        :id="littermate.slug || littermate.id"
        :name="littermate.name"
        :description="littermate.descriptions?.fun ?? ''"
        :capsules="[
          littermate?.species ?? '',
          littermate?.sex ?? '',
          littermate?.physical?.dateOfBirth ? formatDate(littermate.physical.dateOfBirth, true) : '',
        ]"
        :photo="littermate.photos?.find((p) => p.isPrimary)?.url"
        :isSponsored="littermate.sponsored?.isSponsored ?? false"
        :status="littermate.details?.status ?? ''"
      />
    </div>
  </section>
</template>

<style scoped lang="css">
.adopt-detail__littermates {
  margin-top: 20px;
  background-color: var(--text-inverse);
  padding: 32px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  width: 100%;

  .littermates-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

    .eyebrow {
      font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
      font-size: 0.74rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-secondary);
      margin-bottom: 6px;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.015em;
      margin-bottom: 8px;
    }

    .litter-desc {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .littermates-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: flex-start;

    @media (width <= 640px) {
      justify-content: center;
    }
  }
}
</style>
