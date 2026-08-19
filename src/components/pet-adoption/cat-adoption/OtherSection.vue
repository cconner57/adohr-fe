<script setup lang="ts">
import { computed } from 'vue'

import type { FormState } from '../../../models/adopt-form.ts'
import InputField from '../../common/ui/InputField.vue'
import InputSelectGroup from '../../common/ui/InputSelectGroup.vue'
import InputTextArea from '../../common/ui/InputTextArea.vue'

const { modelValue, animalLabel = 'cat' } = defineProps<{
  modelValue: FormState
  touched?: Record<string, boolean>
  // eslint-disable-next-line no-unused-vars
  handleBlur: (_field: string) => void
  hasAttemptedSubmit?: boolean
  animalLabel?: string
}>()

const capitalLabel = computed(() => animalLabel.charAt(0).toUpperCase() + animalLabel.slice(1))

const surrenderOptions = computed(() => {
  const label = capitalLabel.value
  return [
    "Moved to a place that didn't allow pets",
    'Move out of state',
    'Sheds too much',
    animalLabel === 'dog' ? 'Housetraining problem' : 'Litterbox problem',
    'Kids ignored pet',
    'Required prescription food or medication',
    `${label} has seizures`,
    `${label} whines/cries/plays loudly at night`,
    `${label} chews clothing/shoes`,
    'New baby',
    'Allergy',
    "Pets didn't get along",
    'Scratches/chews furniture',
    'Pees on furniture',
    'Bit or snapped at another animal',
    'Bit or snapped at a person',
    'Escapes from yard/house',
    'Divorce/Separation',
    'Unemployment or financial hardship',
    'None of the above',
  ]
})
</script>

<template>
  <div class="other-section">
    <h2 class="section-title">Care & Household Routine</h2>
    <template v-if="animalLabel === 'dog'">
      <InputTextArea
        label="Why did you select this dog(s)?"
        placeholder="Share your reasons..."
        :spanFull="false"
        :modelValue="modelValue.dogWhySelected"
        @update:modelValue="(val) => (modelValue.dogWhySelected = val)"
        :hasError="
          (touched?.dogWhySelected && !modelValue.dogWhySelected) ||
          (hasAttemptedSubmit && !modelValue.dogWhySelected)
        "
      />
      <InputSelectGroup
        label="Where did you hear about this dog?"
        :options="[
          'Adoption Event',
          'Website',
          'Petfinders/Adopt-A-Pet',
          'Friend',
          'Social Media',
          'Other',
        ]"
        multiple
        :modelValue="modelValue.dogHeardAbout"
        @update:modelValue="(val) => (modelValue.dogHeardAbout = val as string[])"
        :hasError="
          (touched?.dogHeardAbout && modelValue.dogHeardAbout.length === 0) ||
          (hasAttemptedSubmit && modelValue.dogHeardAbout.length === 0)
        "
        @blur="handleBlur?.('dogHeardAbout')"
      />
      <InputSelectGroup
        label="Do you have a fenced backyard?"
        :options="['Yes', 'No']"
        :modelValue="modelValue.dogFencedBackyard"
        @update:modelValue="(val) => (modelValue.dogFencedBackyard = val as string)"
        :hasError="
          (touched?.dogFencedBackyard && !modelValue.dogFencedBackyard) ||
          (hasAttemptedSubmit && !modelValue.dogFencedBackyard)
        "
        @blur="handleBlur?.('dogFencedBackyard')"
      />
      <InputSelectGroup
        label="Do you have a pool?"
        :options="['Yes', 'No']"
        :modelValue="modelValue.dogHasPool"
        @update:modelValue="(val) => (modelValue.dogHasPool = val as string)"
        :hasError="
          (touched?.dogHasPool && !modelValue.dogHasPool) ||
          (hasAttemptedSubmit && !modelValue.dogHasPool)
        "
        @blur="handleBlur?.('dogHasPool')"
      />
      <InputSelectGroup
        v-if="modelValue.dogHasPool === 'Yes'"
        label="Is there a fence around the pool?"
        :options="['Yes', 'No']"
        :modelValue="modelValue.dogPoolFence"
        @update:modelValue="(val) => (modelValue.dogPoolFence = val as string)"
        :hasError="
          (touched?.dogPoolFence && !modelValue.dogPoolFence) ||
          (hasAttemptedSubmit && !modelValue.dogPoolFence)
        "
        @blur="handleBlur?.('dogPoolFence')"
      />
      <InputSelectGroup
        label="Please check all that apply"
        :options="[
          'Busy household (children, in and out a lot, visits by friends)',
          'Noisy (TV, stereo, machinery, tools, children playing, dogs barking)',
          'Quiet homebodies (come home, stay home)',
          'Lots of children in the neighborhood',
          'Live on a busy street',
        ]"
        multiple
        :modelValue="modelValue.dogHouseholdDescription"
        @update:modelValue="(val) => (modelValue.dogHouseholdDescription = val as string[])"
        :hasError="
          (touched?.dogHouseholdDescription && modelValue.dogHouseholdDescription.length === 0) ||
          (hasAttemptedSubmit && modelValue.dogHouseholdDescription.length === 0)
        "
        @blur="handleBlur?.('dogHouseholdDescription')"
      />
      <InputSelectGroup
        label="Where will the dog be kept most of the time?"
        :options="['Crate', 'Indoors', 'Outdoors', 'Garage', 'Patio/Porch', 'Other']"
        multiple
        :modelValue="modelValue.dogKeptLocation"
        @update:modelValue="(val) => (modelValue.dogKeptLocation = val as string[])"
        :hasError="
          (touched?.dogKeptLocation && modelValue.dogKeptLocation.length === 0) ||
          (hasAttemptedSubmit && modelValue.dogKeptLocation.length === 0)
        "
        @blur="handleBlur?.('dogKeptLocation')"
      />
      <InputSelectGroup
        label="Where will your dog be sleeping?"
        :options="[
          'Crate',
          'Pet Bed',
          'With Owner',
          'Designated Room',
          'Outdoors',
          'Garage',
          'Patio/Porch',
        ]"
        multiple
        :modelValue="modelValue.dogSleepingLocation"
        @update:modelValue="(val) => (modelValue.dogSleepingLocation = val as string[])"
        :hasError="
          (touched?.dogSleepingLocation && modelValue.dogSleepingLocation.length === 0) ||
          (hasAttemptedSubmit && modelValue.dogSleepingLocation.length === 0)
        "
        @blur="handleBlur?.('dogSleepingLocation')"
      />
      <InputSelectGroup
        label="Where will your pet be when you are not at home?"
        :options="['Outside', 'Inside', 'Crate', 'Other']"
        multiple
        :modelValue="modelValue.dogAloneLocation"
        @update:modelValue="(val) => (modelValue.dogAloneLocation = val as string[])"
        :hasError="
          (touched?.dogAloneLocation && modelValue.dogAloneLocation.length === 0) ||
          (hasAttemptedSubmit && modelValue.dogAloneLocation.length === 0)
        "
        @blur="handleBlur?.('dogAloneLocation')"
      />
      <InputField
        v-model="modelValue.dogExercisePotty"
        label="What will you do for exercise and potty breaks?"
        name="dogExercisePotty"
        placeholder="Describe your plans"
        required
        :hasError="
          (touched?.dogExercisePotty && !modelValue.dogExercisePotty) ||
          (hasAttemptedSubmit && !modelValue.dogExercisePotty)
        "
        @blur="handleBlur?.('dogExercisePotty')"
      />
      <InputField
        v-model="modelValue.dogCareResponsible"
        label="Who will be responsible for feeding and caring for the dog?"
        name="dogCareResponsible"
        placeholder="Name(s)"
        required
        :hasError="
          (touched?.dogCareResponsible && !modelValue.dogCareResponsible) ||
          (hasAttemptedSubmit && !modelValue.dogCareResponsible)
        "
        @blur="handleBlur?.('dogCareResponsible')"
      />
      <InputField
        v-model="modelValue.dogAnnualExpense"
        label="How much money do you expect to spend on the dog in an average year?"
        name="dogAnnualExpense"
        placeholder="Estimated amount"
        required
        :hasError="
          (touched?.dogAnnualExpense && !modelValue.dogAnnualExpense) ||
          (hasAttemptedSubmit && !modelValue.dogAnnualExpense)
        "
        @blur="handleBlur?.('dogAnnualExpense')"
      />
      <InputField
        v-model="modelValue.dogTravelArrangements"
        label="What arrangements will you make for your dog while you are traveling?"
        name="dogTravelArrangements"
        placeholder="Describe your arrangements"
        required
        :hasError="
          (touched?.dogTravelArrangements && !modelValue.dogTravelArrangements) ||
          (hasAttemptedSubmit && !modelValue.dogTravelArrangements)
        "
        @blur="handleBlur?.('dogTravelArrangements')"
      />
      <InputSelectGroup
        label="We don't always know if a dog is potty trained. Are you willing to potty train your pet?"
        :options="['Yes', 'No']"
        :modelValue="modelValue.dogWillingToPottyTrain"
        @update:modelValue="(val) => (modelValue.dogWillingToPottyTrain = val as string)"
        :hasError="
          (touched?.dogWillingToPottyTrain && !modelValue.dogWillingToPottyTrain) ||
          (hasAttemptedSubmit && !modelValue.dogWillingToPottyTrain)
        "
        @blur="handleBlur?.('dogWillingToPottyTrain')"
      />
      <InputSelectGroup
        label="Do you have any experience with the following?"
        :options="[
          'Crate Training',
          'Obedience Training',
          'Modifying Behavioral Issues',
          'Potty Training',
        ]"
        multiple
        :modelValue="modelValue.dogTrainingExperience"
        @update:modelValue="(val) => (modelValue.dogTrainingExperience = val as string[])"
        :hasError="
          (touched?.dogTrainingExperience && modelValue.dogTrainingExperience.length === 0) ||
          (hasAttemptedSubmit && modelValue.dogTrainingExperience.length === 0)
        "
        @blur="handleBlur?.('dogTrainingExperience')"
      />
      <InputSelectGroup
        label="Are you willing to commit to a training class/program if needed?"
        :options="['Yes', 'No']"
        :modelValue="modelValue.dogWillingTrainingClass"
        @update:modelValue="(val) => (modelValue.dogWillingTrainingClass = val as string)"
        :hasError="
          (touched?.dogWillingTrainingClass && !modelValue.dogWillingTrainingClass) ||
          (hasAttemptedSubmit && !modelValue.dogWillingTrainingClass)
        "
        @blur="handleBlur?.('dogWillingTrainingClass')"
      />
      <InputSelectGroup
        label="Please check types of confinement you can provide."
        :options="['Crate', 'Fenced Yard', 'Kennel Run', 'Other']"
        multiple
        :modelValue="modelValue.dogConfinementTypes"
        @update:modelValue="(val) => (modelValue.dogConfinementTypes = val as string[])"
        :hasError="
          (touched?.dogConfinementTypes && modelValue.dogConfinementTypes.length === 0) ||
          (hasAttemptedSubmit && modelValue.dogConfinementTypes.length === 0)
        "
        @blur="handleBlur?.('dogConfinementTypes')"
      />
      <InputSelectGroup
        label="How long are you willing to allow time for bonding?"
        :options="['One Week', 'Two Weeks', 'One Month', 'Other']"
        :modelValue="modelValue.dogBondingTime"
        @update:modelValue="(val) => (modelValue.dogBondingTime = val as string)"
        :hasError="
          (touched?.dogBondingTime && !modelValue.dogBondingTime) ||
          (hasAttemptedSubmit && !modelValue.dogBondingTime)
        "
        @blur="handleBlur?.('dogBondingTime')"
      />
      <InputSelectGroup
        label="Have you ever been denied pet ownership from a rescue organization?"
        :options="['Yes', 'No']"
        :modelValue="modelValue.dogDeniedOwnership"
        @update:modelValue="(val) => (modelValue.dogDeniedOwnership = val as string)"
        :hasError="
          (touched?.dogDeniedOwnership && !modelValue.dogDeniedOwnership) ||
          (hasAttemptedSubmit && !modelValue.dogDeniedOwnership)
        "
        @blur="handleBlur?.('dogDeniedOwnership')"
      />
    </template>
    <InputField
      v-model="modelValue.bredAnimalDescription"
      label="If you have ever bred an animal, please describe the circumstances"
      name="bredAnimalDescription"
      placeholder="Describe the circumstances"
      required
      :hasError="
        (touched?.bredAnimalDescription && !modelValue.bredAnimalDescription) ||
        (hasAttemptedSubmit && !modelValue.bredAnimalDescription)
      "
      @blur="handleBlur?.('bredAnimalDescription')"
    />
    <InputField
      v-model="modelValue.ownedDeclawedOrDebarked"
      label="Have you ever owned a declawed cat or a debarked dog?"
      name="ownedDeclawedOrDebarked"
      placeholder="Yes/No and details"
      required
      :hasError="
        (touched?.ownedDeclawedOrDebarked && !modelValue.ownedDeclawedOrDebarked) ||
        (hasAttemptedSubmit && !modelValue.ownedDeclawedOrDebarked)
      "
      @blur="handleBlur?.('ownedDeclawedOrDebarked')"
    />
    <InputField
      v-model="modelValue.movedWithPet"
      label="Have you ever moved with a pet?"
      name="movedWithPet"
      placeholder="Yes/No and details"
      required
      :hasError="
        (touched?.movedWithPet && !modelValue.movedWithPet) ||
        (hasAttemptedSubmit && !modelValue.movedWithPet)
      "
      @blur="handleBlur?.('movedWithPet')"
    />
    <InputField
      v-model="modelValue.ownedSpecialNeedsPet"
      label="Have you ever owned a special needs pet?"
      name="ownedSpecialNeedsPet"
      placeholder="Yes/No and details"
      required
      :hasError="
        (touched?.ownedSpecialNeedsPet && !modelValue.ownedSpecialNeedsPet) ||
        (hasAttemptedSubmit && !modelValue.ownedSpecialNeedsPet)
      "
      @blur="handleBlur?.('ownedSpecialNeedsPet')"
    />
    <InputField
      v-model="modelValue.mobilityDevice"
      label="Does anyone in your home use a mobility device?"
      name="mobilityDevice"
      placeholder="Yes/No and details"
      required
      :hasError="
        (touched?.mobilityDevice && !modelValue.mobilityDevice) ||
        (hasAttemptedSubmit && !modelValue.mobilityDevice)
      "
      @blur="handleBlur?.('mobilityDevice')"
    />
    <InputField
      v-model="modelValue.foodTypeBrand"
      :label="`What type and brand of food do you plan on feeding your new ${animalLabel}?`"
      name="foodTypeBrand"
      placeholder="Type and Brand"
      required
      :hasError="
        (touched?.foodTypeBrand && !modelValue.foodTypeBrand) ||
        (hasAttemptedSubmit && !modelValue.foodTypeBrand)
      "
      @blur="handleBlur?.('foodTypeBrand')"
    />
    <InputSelectGroup
      class="full-width"
      label="Check all that apply. Under what conditions would you NOT KEEP your new pet?"
      :options="surrenderOptions"
      multiple
      :modelValue="modelValue.surrenderConditions"
      @update:modelValue="(val) => (modelValue.surrenderConditions = val as string[])"
      :hasError="
        (touched?.surrenderConditions && modelValue.surrenderConditions.length === 0) ||
        (hasAttemptedSubmit && modelValue.surrenderConditions.length === 0)
      "
      @blur="handleBlur?.('surrenderConditions')"
    />
    <InputField
      v-model="modelValue.surrenderPlan"
      :label="`What would you do with your ${animalLabel} if you could not keep it for the above reason(s)?`"
      name="surrenderPlan"
      placeholder="Details"
      required
      :hasError="
        (touched?.surrenderPlan && !modelValue.surrenderPlan) ||
        (hasAttemptedSubmit && !modelValue.surrenderPlan)
      "
      @blur="handleBlur?.('surrenderPlan')"
    />

    <InputField
      v-model="modelValue.affordVetCare"
      :label="`Can you afford regular veterinary care for this ${animalLabel} - including yearly vaccinations, annual physical exams, dental care, etc. ($300 or more per year)?`"
      name="affordVetCare"
      placeholder="Yes/No"
      required
      :hasError="
        (touched?.affordVetCare && !modelValue.affordVetCare) ||
        (hasAttemptedSubmit && !modelValue.affordVetCare)
      "
      @blur="handleBlur?.('affordVetCare')"
    />
    <InputField
      v-model="modelValue.affordEmergencyCost"
      label="Can you afford serious injury or illness costs ($1000 or more)?"
      name="affordEmergencyCost"
      placeholder="Yes/No"
      required
      :hasError="
        (touched?.affordEmergencyCost && !modelValue.affordEmergencyCost) ||
        (hasAttemptedSubmit && !modelValue.affordEmergencyCost)
      "
      @blur="handleBlur?.('affordEmergencyCost')"
    />
  </div>
</template>

<style scoped lang="css">
.other-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (width >= 768px) {
  .other-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .other-section .full-width {
    grid-column: 1 / -1;
  }
}
</style>
