<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

import ButtonToggle from '@/components/common/ui/ButtonToggle.vue'
import InputField from '@/components/common/ui/InputField.vue'
import InputSelectGroup from '@/components/common/ui/InputSelectGroup.vue'
import { useSurrenderStore } from '@/stores/surrender'

const props = defineProps<{
  touched: Record<string, boolean>
  // eslint-disable-next-line no-unused-vars
  handleBlur: (field: string) => void
  hasAttemptedSubmit: boolean
  selectedAnimal?: string
}>()

const surrenderStore = useSurrenderStore()
const { formState } = surrenderStore
const { selectedAnimal: storeAnimal } = storeToRefs(surrenderStore)

const animalLabel = computed(() => {
  if (props.selectedAnimal) return props.selectedAnimal
  if (!storeAnimal.value) return 'Pet'
  return storeAnimal.value.charAt(0).toUpperCase() + storeAnimal.value.slice(1)
})

onMounted(() => {
  if (!formState.animalFoodTreats) {
    formState.animalFoodTreats = 'No'
  }
})
</script>

<template>
  <div>
    <h2 class="section-title">Feeding</h2>
    <div class="feeding-grid">
      <ButtonToggle
        :label="`Does the ${animalLabel.toLowerCase()} get treats?`"
        :modelValue="formState.animalFoodTreats"
        @update:modelValue="(val) => (formState.animalFoodTreats = String(val ?? ''))"
      />
      <InputField
        :label="`If yes, what treats does the ${animalLabel.toLowerCase()} like?`"
        placeholder="Answer"
        :modelValue="formState.animalFoodTreatsExplanation"
        @update:modelValue="(val) => (formState.animalFoodTreatsExplanation = String(val ?? ''))"
      />
      <InputSelectGroup
        :label="`What type of food does the ${animalLabel.toLowerCase()} eat?`"
        :options="['Canned', 'Dry', 'Soft', 'Table scraps', 'Raw', 'Home cooked']"
        :modelValue="formState.animalTypeOfFood"
        @update:modelValue="
          (val) => (formState.animalTypeOfFood = Array.isArray(val) ? val.join(', ') : String(val ?? ''))
        "
        :hasError="
          (touched.animalTypeOfFood && !formState.animalTypeOfFood) ||
          (hasAttemptedSubmit && !formState.animalTypeOfFood)
        "
        @blur="handleBlur('animalTypeOfFood')"
        :multiple="true"
      />
      <InputSelectGroup
        :label="`How many times a day is the ${animalLabel.toLowerCase()} fed?`"
        :options="['1 time', '2 times', '3 times', 'Free feeds']"
        :modelValue="formState.animalEatingFrequency"
        @update:modelValue="
          (val) => (formState.animalEatingFrequency = Array.isArray(val) ? val.join(', ') : String(val ?? ''))
        "
        :hasError="
          (touched.animalEatingFrequency && !formState.animalEatingFrequency) ||
          (hasAttemptedSubmit && !formState.animalEatingFrequency)
        "
        @blur="handleBlur('animalEatingFrequency')"
      />
      <InputSelectGroup
        :label="`How much is fed per feeding?`"
        :options="[
          '1 cup',
          '1 1/2 cups',
          '2 cups',
          '2 1/2 cups',
          'Not sure, just fill the bowl up',
          'Other',
        ]"
        :modelValue="formState.animalAmountOfFood"
        @update:modelValue="
          (val) => (formState.animalAmountOfFood = Array.isArray(val) ? val.join(', ') : String(val ?? ''))
        "
        :hasError="
          (touched.animalAmountOfFood && !formState.animalAmountOfFood) ||
          (hasAttemptedSubmit && !formState.animalAmountOfFood)
        "
        @blur="handleBlur('animalAmountOfFood')"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.feeding-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (width >= 768px) {
  .feeding-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
  }
}

h5 {
  margin-bottom: 24px;
}
</style>
