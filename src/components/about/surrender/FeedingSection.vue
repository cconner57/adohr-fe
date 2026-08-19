<script setup lang="ts">
import { onMounted } from 'vue'

import type { SurrenderFormState } from '../../../models/surrender-form.ts'
import ButtonToggle from '../../common/ui/ButtonToggle.vue'
import InputField from '../../common/ui/InputField.vue'
import InputSelectGroup from '../../common/ui/InputSelectGroup.vue'

const { formState, touched, handleBlur, hasAttemptedSubmit, selectedAnimal } = defineProps<{
  formState: SurrenderFormState
  touched: Record<string, boolean>
  handleBlur: (_field: string) => void // eslint-disable-line no-unused-vars
  hasAttemptedSubmit: boolean
  selectedAnimal: string
}>()

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
        :label="`Does the ${selectedAnimal.toLowerCase()} get treats?`"
        :modelValue="formState.animalFoodTreats"
        @update:modelValue="(val) => (formState.animalFoodTreats = val as any)"
      />
      <InputField
        :label="`If yes, what treats does the ${selectedAnimal.toLowerCase()} like?`"
        placeholder="Answer"
        :modelValue="formState.animalFoodTreatsExplanation"
        @update:modelValue="(val) => (formState.animalFoodTreatsExplanation = val as string)"
      />
      <InputSelectGroup
        :label="`What type of food does the ${selectedAnimal.toLowerCase()} eat?`"
        :options="['Canned', 'Dry', 'Soft', 'Table scraps', 'Raw', 'Home cooked']"
        :modelValue="formState.animalTypeOfFood"
        @update:modelValue="(val) => (formState.animalTypeOfFood = val as any)"
        :hasError="
          (touched.animalTypeOfFood && !formState.animalTypeOfFood) ||
          (hasAttemptedSubmit && !formState.animalTypeOfFood)
        "
        @blur="handleBlur('animalTypeOfFood')"
        :multiple="true"
      />
      <InputSelectGroup
        :label="`How many times a day is the ${selectedAnimal.toLowerCase()} fed?`"
        :options="['1 time', '2 times', '3 times', 'Free feeds']"
        :modelValue="formState.animalEatingFrequency"
        @update:modelValue="(val) => (formState.animalEatingFrequency = val as any)"
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
        @update:modelValue="(val) => (formState.animalAmountOfFood = val as any)"
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
