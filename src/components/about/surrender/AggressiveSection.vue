<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

import ButtonToggle from '@/components/common/ui/ButtonToggle.vue'
import InputTextArea from '@/components/common/ui/InputTextArea.vue'
import { useSurrenderStore } from '@/stores/surrender'

const props = defineProps<{
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
        :label="`Has the ${animalLabel.toLowerCase()} ever attacked or bit a person?`"
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
        :label="`Has the ${animalLabel.toLowerCase()} ever attacked or bit another animal?`"
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
