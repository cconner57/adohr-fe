<script setup lang="ts">
import { useAdoptionEvents } from '../../../composables/useAdoptionEvents'
import type { IPet } from '../../../models/common.ts'
import { formatDate } from '../../../utils/common.ts'
import { getPetSpecialNeeds } from '../../../utils/petNormalizer'
import PetItem from '../../common/pet-item/PetItem.vue'

defineProps<{
  pets: IPet[]
}>()

const { getPetAttendanceSchedule } = useAdoptionEvents()
</script>

<template>
  <div class="adopt-summary">
    <PetItem
      v-for="(pet, index) in pets"
      :capsules="[
        pet?.species ?? '',
        pet?.sex ?? '',
        pet?.physical?.dateOfBirth ? formatDate(pet?.physical?.dateOfBirth ?? '', true) : '',
      ]"
      :description="pet.descriptions?.fun ?? ''"
      :id="pet.slug || pet.id"
      :key="pet.id"
      :name="pet.name"
      :photo="pet.photos?.find((p) => p.isPrimary)?.url || pet.photos?.[0]?.url"
      :priority="index === 0"
      :isSponsored="pet.sponsored?.isSponsored ?? false"
      :status="pet.details?.status ?? ''"
      :isBonded="Boolean(pet.behavior?.bonded?.isBonded)"
      :bondedWithNames="pet.behavior?.bonded?.bondedWith ?? null"
      :isSpecialNeeds="getPetSpecialNeeds(pet).isSpecialNeeds"
      :specialNeedsText="'Special Needs'"
      :isComingSoon="Boolean(pet.details?.status === 'intake')"
      :isAttendingWeekend="Boolean(getPetAttendanceSchedule(pet.id) || getPetAttendanceSchedule(pet.slug) || pet.isAttendingWeekend)"
      :attendingScheduleText="getPetAttendanceSchedule(pet.id)?.scheduleText || getPetAttendanceSchedule(pet.slug)?.scheduleText || ''"
      :attendingDaysText="getPetAttendanceSchedule(pet.id)?.shortDayText || getPetAttendanceSchedule(pet.slug)?.shortDayText || ''"
      :attendingLocationText="getPetAttendanceSchedule(pet.id)?.displayLocation || getPetAttendanceSchedule(pet.slug)?.displayLocation || ''"
    />
  </div>
</template>

<style scoped lang="css">
.adopt-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 30px 20px;
  justify-content: center;
}
</style>
