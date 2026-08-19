<script setup lang="ts">
import { onMounted } from 'vue'

import type { SurrenderFormState } from '../../../models/surrender-form.ts'
import ButtonToggle from '../../common/ui/ButtonToggle.vue'
import InputTextArea from '../../common/ui/InputTextArea.vue'

const { formState, selectedAnimal } = defineProps<{
  formState: SurrenderFormState
  touched: Record<string, boolean>
  handleBlur: (_field: string) => void // eslint-disable-line no-unused-vars
  hasAttemptedSubmit: boolean
  selectedAnimal: string
}>()

onMounted(() => {
  if (!formState.animalEverAttackedPeople) {
    formState.animalEverAttackedPeople = 'No'
  }
  if (!formState.animalEverAttackedOtherCats) {
    formState.animalEverAttackedOtherCats = 'No'
  }
})
</script>

<template>
  <div class="aggressive-section">
    <h2 class="section-title">Aggressive Behavior</h2>
    <div class="aggressive-grid">
      <ButtonToggle
        :label="`Has the ${selectedAnimal.toLowerCase()} ever attacked or bit a person?`"
        :modelValue="formState.animalEverAttackedPeople"
        @update:modelValue="(val) => (formState.animalEverAttackedPeople = val as string)"
      />
      <InputTextArea
        label="If yes, please explain"
        placeholder="Explanation"
        :spanFull="false"
        :modelValue="formState.animalEverAttackedPeopleExplanation"
        @update:modelValue="(val) => (formState.animalEverAttackedPeopleExplanation = val || '')"
      />
      <ButtonToggle
        :label="`Has the ${selectedAnimal.toLowerCase()} ever attacked or bit a cat?`"
        :modelValue="formState.animalEverAttackedOtherCats"
        @update:modelValue="(val) => (formState.animalEverAttackedOtherCats = val as string)"
      />
      <InputTextArea
        label="If yes, please explain"
        placeholder="Explanation"
        :spanFull="false"
        :modelValue="formState.animalEverAttackedOtherCatsExplanation"
        @update:modelValue="(val) => (formState.animalEverAttackedOtherCatsExplanation = val || '')"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.aggressive-section h5 {
  margin-bottom: 24px;
}

.aggressive-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (width >= 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
  }
}
</style>
