<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import InputFileUpload from '@/components/common/ui/InputFileUpload.vue'
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
</script>

<template>
  <div>
    <h2 class="section-title">Additional Information</h2>
    <div class="other-grid">
      <InputTextArea
        :label="`Please feel free to tell us any other information about the ${animalLabel.toLowerCase()} you feel is important`"
        placeholder="Answer"
        :spanFull="true"
        :modelValue="formState.additionalInformation"
        @update:modelValue="(val) => (formState.additionalInformation = String(val ?? ''))"
      />
      <InputFileUpload
        :label="`Please upload a full body picture of the ${animalLabel.toLowerCase()}`"
        :modelValue="formState.fullBodyPhotoOfAnimal"
        @update:modelValue="(val) => (formState.fullBodyPhotoOfAnimal = val)"
        :required="true"
        accept="image/*"
      />
      <InputFileUpload
        :label="`Please upload a close-up head shot of the ${animalLabel.toLowerCase()}`"
        :modelValue="formState.closeUpPhotoOfAnimalFace"
        @update:modelValue="(val) => (formState.closeUpPhotoOfAnimalFace = val)"
        accept="image/*"
      />
      <InputFileUpload
        :label="`Please upload any records you have for the ${animalLabel.toLowerCase()}`"
        :modelValue="formState.copiesOfRecords"
        @update:modelValue="(val) => (formState.copiesOfRecords = val)"
        :multiple="true"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.other-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (width >= 768px) {
  .other-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
  }
}

h5 {
  margin-bottom: 24px;
}
</style>
