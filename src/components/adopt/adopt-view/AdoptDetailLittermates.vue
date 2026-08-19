<script setup lang="ts">
import { computed } from 'vue'

import type { IPet, ISibling } from '../../../models/common.ts'
import { formatDate } from '../../../utils/common.ts'
import PetItem from '../../common/pet-item/PetItem.vue'

const props = defineProps<{
  pet: IPet
  littermates?: IPet[]
}>()

interface IDisplaySibling {
  id: string
  name: string
  photo: string | null
  capsules: string[]
  description: string
  isSponsored: boolean
  status: string
}

const litterGroupName = computed(() => {
  return props.pet.litter?.groupName || props.pet.litterName || ''
})

const siblingsList = computed<IDisplaySibling[]>(() => {
  // 1. If API provides direct pet.litter.siblings
  if (props.pet.litter?.siblings && props.pet.litter.siblings.length > 0) {
    return props.pet.litter.siblings.map((sibling: ISibling) => {
      const capsules: string[] = []
      if (sibling.isMom) capsules.push('Mom')
      if (sibling.isDad) capsules.push('Dad')
      if (sibling.species) capsules.push(sibling.species)
      if (sibling.sex) capsules.push(sibling.sex)
      if (sibling.dob) capsules.push(formatDate(sibling.dob, true))
      else if (sibling.age) capsules.push(sibling.age)

      return {
        id: sibling.id,
        name: sibling.name,
        photo: sibling.photo || null,
        capsules,
        description: '',
        isSponsored: false,
        status: sibling.status || 'available',
      }
    })
  }

  // 2. Fallback to passed littermates IPet array
  if (props.littermates && props.littermates.length > 0) {
    return props.littermates.map((littermate: IPet) => ({
      id: littermate.slug || littermate.id,
      name: littermate.name,
      photo: littermate.photos?.find((p) => p.isPrimary)?.url || null,
      capsules: [
        littermate.species || '',
        littermate.sex || '',
        littermate.physical?.dateOfBirth ? formatDate(littermate.physical.dateOfBirth, true) : '',
      ].filter(Boolean),
      description: littermate.descriptions?.fun || '',
      isSponsored: littermate.sponsored?.isSponsored || false,
      status: littermate.details?.status || '',
    }))
  }

  return []
})
</script>

<template>
  <section v-if="siblingsList.length > 0" class="adopt-detail__littermates" aria-label="Littermates">
    <div class="littermates-header">
      <p class="eyebrow">Family Ties</p>
      <h2>Meet {{ pet.name }}'s Littermates</h2>
      <p class="litter-desc">
        {{ litterGroupName ? `${litterGroupName} · ` : '' }}These brothers and sisters were rescued together and are also looking for their forever homes.
      </p>
    </div>

    <div class="littermates-grid">
      <PetItem
        v-for="sibling in siblingsList"
        :key="sibling.id"
        :id="sibling.id"
        :name="sibling.name"
        :description="sibling.description"
        :capsules="sibling.capsules"
        :photo="sibling.photo"
        :isSponsored="sibling.isSponsored"
        :status="sibling.status"
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
