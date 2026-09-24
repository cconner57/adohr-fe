<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAdoptionStore } from '../../../stores/adoption'
import InputField from '../../common/ui/InputField.vue'
import InputSelectGroup from '../../common/ui/InputSelectGroup.vue'
import InputTextArea from '../../common/ui/InputTextArea.vue'

const props = withDefaults(
  defineProps<{
    touched?: Record<string, boolean>
    // eslint-disable-next-line no-unused-vars
    handleBlur: (_field: string) => void
    hasAttemptedSubmit?: boolean
    animalLabel?: string
  }>(),
  { animalLabel: 'cat' },
)

const adoptionStore = useAdoptionStore()
const { formState } = storeToRefs(adoptionStore)
</script>

<template>
  <div class="new-cat-section">
    <h2 class="section-title">
      {{ props.animalLabel === 'dog' ? 'Dog Match & Preferences' : 'Cat Match & Preferences' }}
    </h2>
    <InputField
      v-model="formState.catPreferenceBreed"
      label="Preferred breed, age, or gender?"
      name="catPreferenceBreed"
      placeholder="e.g. Siamese, Kitten, Female"
      required
      :hasError="
        (props.touched?.catPreferenceBreed && !formState.catPreferenceBreed) ||
        (props.hasAttemptedSubmit && !formState.catPreferenceBreed)
      "
      @blur="props.handleBlur?.('catPreferenceBreed')"
    />
    <InputField
      v-model="formState.catPreferencePhysical"
      label="Preferred size, hair length, or color?"
      name="catPreferencePhysical"
      placeholder="e.g. Short hair, Orange tabby"
      required
      :hasError="
        (props.touched?.catPreferencePhysical && !formState.catPreferencePhysical) ||
        (props.hasAttemptedSubmit && !formState.catPreferencePhysical)
      "
      @blur="props.handleBlur?.('catPreferencePhysical')"
    />
    <InputField
      v-model="formState.catPreferencePersonality"
      label="Preferred personality or energy level?"
      name="catPreferencePersonality"
      placeholder="e.g. Cuddly, Playful, Chill"
      required
      :hasError="
        (props.touched?.catPreferencePersonality && !formState.catPreferencePersonality) ||
        (props.hasAttemptedSubmit && !formState.catPreferencePersonality)
      "
      @blur="props.handleBlur?.('catPreferencePersonality')"
    />
    <InputField
      v-model="formState.catPreferenceNotWant"
      label="Any traits you specifically NOT want?"
      name="catPreferenceNotWant"
      placeholder="e.g. Aggressive, Super high energy"
      required
      :hasError="
        (props.touched?.catPreferenceNotWant && !formState.catPreferenceNotWant) ||
        (props.hasAttemptedSubmit && !formState.catPreferenceNotWant)
      "
      @blur="props.handleBlur?.('catPreferenceNotWant')"
    />
    <InputTextArea
      :label="`Why are you interested in adopting a new ${props.animalLabel}?`"
      placeholder="Share your motivation..."
      :modelValue="formState.whyInterested"
      @update:modelValue="(val) => (formState.whyInterested = val)"
      :hasError="
        (props.touched?.whyInterested && !formState.whyInterested) ||
        (props.hasAttemptedSubmit && !formState.whyInterested)
      "
      @blur="props.handleBlur?.('whyInterested')"
      :spanFull="false"
    />
    <div class="spacer desktop-only"></div>
    <InputSelectGroup
      label="Primary reason for adoption:"
      :options="[
        'Companion for me',
        'Companion for family/children',
        'Companion for another pet',
        'For protection',
        'A gift',
      ]"
      :modelValue="formState.adoptionReason"
      @update:modelValue="(val) => (formState.adoptionReason = val as string)"
      :hasError="
        (props.touched?.adoptionReason && !formState.adoptionReason) ||
        (props.hasAttemptedSubmit && !formState.adoptionReason)
      "
      @blur="props.handleBlur?.('adoptionReason')"
    />
    <InputSelectGroup
      :label="`Have you owned a ${props.animalLabel} before?`"
      :options="['Yes', 'No', 'Not as an adult']"
      :modelValue="formState.ownCatBefore"
      @update:modelValue="(val) => (formState.ownCatBefore = val as string)"
      :hasError="
        (props.touched?.ownCatBefore && !formState.ownCatBefore) ||
        (props.hasAttemptedSubmit && !formState.ownCatBefore)
      "
      @blur="props.handleBlur?.('ownCatBefore')"
    />
    <InputSelectGroup
      :label="`Have you owned a ${props.animalLabel === 'dog' ? 'puppy' : 'kitten'} before?`"
      :options="['Yes', 'No', 'Not as an adult']"
      :modelValue="formState.ownKittenBefore"
      @update:modelValue="(val) => (formState.ownKittenBefore = val as string)"
      :hasError="
        (props.touched?.ownKittenBefore && !formState.ownKittenBefore) ||
        (props.hasAttemptedSubmit && !formState.ownKittenBefore)
      "
      @blur="props.handleBlur?.('ownKittenBefore')"
    />
    <InputSelectGroup
      label="Do you currently have a veterinarian?"
      :options="['Yes', 'No', 'I need a recommendation']"
      :modelValue="formState.alreadyHaveVeterinarian"
      @update:modelValue="(val) => (formState.alreadyHaveVeterinarian = val as string)"
      :hasError="
        (props.touched?.alreadyHaveVeterinarian && !formState.alreadyHaveVeterinarian) ||
        (props.hasAttemptedSubmit && !formState.alreadyHaveVeterinarian)
      "
      @blur="props.handleBlur?.('alreadyHaveVeterinarian')"
    />
    <InputTextArea
      :label="`Where in the house will the ${props.animalLabel} be allowed?`"
      placeholder="e.g. Everywhere, Bedrooms only..."
      :modelValue="formState.catAllowedHomeArea"
      @update:modelValue="(val) => (formState.catAllowedHomeArea = val)"
      :hasError="
        (props.touched?.catAllowedHomeArea && !formState.catAllowedHomeArea) ||
        (props.hasAttemptedSubmit && !formState.catAllowedHomeArea)
      "
      :spanFull="false"
    />
    <InputTextArea
      :label="`How many hours a day will the ${props.animalLabel} be alone?`"
      placeholder="Please include typical work schedule..."
      :modelValue="formState.catHomeAloneHours"
      @update:modelValue="(val) => (formState.catHomeAloneHours = val)"
      :hasError="
        (props.touched?.catHomeAloneHours && !formState.catHomeAloneHours) ||
        (props.hasAttemptedSubmit && !formState.catHomeAloneHours)
      "
      :spanFull="false"
    />
    <InputTextArea
      label="How will you correct undesirable behavior?"
      placeholder="e.g. Redirecting, Spray bottle, Positive reinforcement..."
      :modelValue="formState.catDisciplineType"
      @update:modelValue="(val) => (formState.catDisciplineType = val)"
      :hasError="
        (props.touched?.catDisciplineType && !formState.catDisciplineType) ||
        (props.hasAttemptedSubmit && !formState.catDisciplineType)
      "
      :spanFull="false"
    />
    <InputTextArea
      :label="`If the ${props.animalLabel} escapes, what will you do?`"
      placeholder="Search plan..."
      :modelValue="formState.catEscapeSteps"
      @update:modelValue="(val) => (formState.catEscapeSteps = val)"
      :hasError="
        (props.touched?.catEscapeSteps && !formState.catEscapeSteps) ||
        (props.hasAttemptedSubmit && !formState.catEscapeSteps)
      "
      :spanFull="false"
    />
  </div>
</template>

<style scoped lang="css">
.new-cat-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (width <= 768px) {
  .new-cat-section {
    grid-template-columns: 1fr;
  }

  .desktop-only {
    display: none;
  }
}

.section-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
