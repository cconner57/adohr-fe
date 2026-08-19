<script setup lang="ts">
import type { SurrenderFormState } from '../../../models/surrender-form.ts'
import InputFileUpload from '../../common/ui/InputFileUpload.vue'
import InputTextArea from '../../common/ui/InputTextArea.vue'

const { formState } = defineProps<{
  formState: SurrenderFormState
  touched: Record<string, boolean>
  handleBlur: (_field: string) => void // eslint-disable-line no-unused-vars
  hasAttemptedSubmit: boolean
}>()
</script>

<template>
  <div>
    <h2 class="section-title">Additional Information</h2>
    <div class="other-grid">
      <InputTextArea
        label="Please feel free to tell us any other information about the pet you feel is important"
        placeholder="Answer"
        :spanFull="true"
        :modelValue="formState.additionalInformation"
        @update:modelValue="(val) => (formState.additionalInformation = val as string)"
      />
      <InputFileUpload
        label="Please upload a full body picture of the pet"
        :modelValue="formState.fullBodyPhotoOfAnimal"
        @update:modelValue="(val) => (formState.fullBodyPhotoOfAnimal = val)"
        :required="true"
        accept="image/*"
      />
      <InputFileUpload
        label="Please upload a up close head shot of the pet"
        :modelValue="formState.closeUpPhotoOfAnimalFace"
        @update:modelValue="(val) => (formState.closeUpPhotoOfAnimalFace = val)"
        accept="image/*"
      />
      <InputFileUpload
        label="Please upload any records you have for the pet"
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
