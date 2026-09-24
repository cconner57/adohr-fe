<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

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

const capitalLabel = computed(
  () => props.animalLabel.charAt(0).toUpperCase() + props.animalLabel.slice(1),
)

const surrenderOptions = computed(() => {
  const label = capitalLabel.value
  return [
    "Moved to a place that didn't allow pets",
    'Move out of state',
    'Sheds too much',
    props.animalLabel === 'dog' ? 'Housetraining problem' : 'Litterbox problem',
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
    <template v-if="props.animalLabel === 'dog'">
      <InputTextArea
        label="Why did you select this dog(s)?"
        placeholder="Share your reasons..."
        :spanFull="false"
        :modelValue="formState.dogWhySelected"
        @update:modelValue="(val) => (formState.dogWhySelected = val)"
        :hasError="
          (props.touched?.dogWhySelected && !formState.dogWhySelected) ||
          (props.hasAttemptedSubmit && !formState.dogWhySelected)
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
        :modelValue="formState.dogHeardAbout"
        @update:modelValue="(val) => (formState.dogHeardAbout = val as string[])"
        :hasError="
          (props.touched?.dogHeardAbout && formState.dogHeardAbout.length === 0) ||
          (props.hasAttemptedSubmit && formState.dogHeardAbout.length === 0)
        "
        @blur="props.handleBlur?.('dogHeardAbout')"
      />
      <InputSelectGroup
        label="Do you have a fenced backyard?"
        :options="['Yes', 'No']"
        :modelValue="formState.dogFencedBackyard"
        @update:modelValue="(val) => (formState.dogFencedBackyard = val as string)"
        :hasError="
          (props.touched?.dogFencedBackyard && !formState.dogFencedBackyard) ||
          (props.hasAttemptedSubmit && !formState.dogFencedBackyard)
        "
        @blur="props.handleBlur?.('dogFencedBackyard')"
      />
      <InputSelectGroup
        label="Do you have a pool?"
        :options="['Yes', 'No']"
        :modelValue="formState.dogHasPool"
        @update:modelValue="(val) => (formState.dogHasPool = val as string)"
        :hasError="
          (props.touched?.dogHasPool && !formState.dogHasPool) ||
          (props.hasAttemptedSubmit && !formState.dogHasPool)
        "
        @blur="props.handleBlur?.('dogHasPool')"
      />
      <InputSelectGroup
        v-if="formState.dogHasPool === 'Yes'"
        label="Is there a fence around the pool?"
        :options="['Yes', 'No']"
        :modelValue="formState.dogPoolFence"
        @update:modelValue="(val) => (formState.dogPoolFence = val as string)"
        :hasError="
          (props.touched?.dogPoolFence && !formState.dogPoolFence) ||
          (props.hasAttemptedSubmit && !formState.dogPoolFence)
        "
        @blur="props.handleBlur?.('dogPoolFence')"
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
        :modelValue="formState.dogHouseholdDescription"
        @update:modelValue="(val) => (formState.dogHouseholdDescription = val as string[])"
        :hasError="
          (props.touched?.dogHouseholdDescription && formState.dogHouseholdDescription.length === 0) ||
          (props.hasAttemptedSubmit && formState.dogHouseholdDescription.length === 0)
        "
        @blur="props.handleBlur?.('dogHouseholdDescription')"
      />
      <InputSelectGroup
        label="Where will the dog be kept most of the time?"
        :options="['Crate', 'Indoors', 'Outdoors', 'Garage', 'Patio/Porch', 'Other']"
        multiple
        :modelValue="formState.dogKeptLocation"
        @update:modelValue="(val) => (formState.dogKeptLocation = val as string[])"
        :hasError="
          (props.touched?.dogKeptLocation && formState.dogKeptLocation.length === 0) ||
          (props.hasAttemptedSubmit && formState.dogKeptLocation.length === 0)
        "
        @blur="props.handleBlur?.('dogKeptLocation')"
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
        :modelValue="formState.dogSleepingLocation"
        @update:modelValue="(val) => (formState.dogSleepingLocation = val as string[])"
        :hasError="
          (props.touched?.dogSleepingLocation && formState.dogSleepingLocation.length === 0) ||
          (props.hasAttemptedSubmit && formState.dogSleepingLocation.length === 0)
        "
        @blur="props.handleBlur?.('dogSleepingLocation')"
      />
      <InputSelectGroup
        label="Where will your pet be when you are not at home?"
        :options="['Outside', 'Inside', 'Crate', 'Other']"
        multiple
        :modelValue="formState.dogAloneLocation"
        @update:modelValue="(val) => (formState.dogAloneLocation = val as string[])"
        :hasError="
          (props.touched?.dogAloneLocation && formState.dogAloneLocation.length === 0) ||
          (props.hasAttemptedSubmit && formState.dogAloneLocation.length === 0)
        "
        @blur="props.handleBlur?.('dogAloneLocation')"
      />
      <InputField
        v-model="formState.dogExercisePotty"
        label="What will you do for exercise and potty breaks?"
        name="dogExercisePotty"
        placeholder="Describe your plans"
        required
        :hasError="
          (props.touched?.dogExercisePotty && !formState.dogExercisePotty) ||
          (props.hasAttemptedSubmit && !formState.dogExercisePotty)
        "
        @blur="props.handleBlur?.('dogExercisePotty')"
      />
      <InputField
        v-model="formState.dogCareResponsible"
        label="Who will be responsible for feeding and caring for the dog?"
        name="dogCareResponsible"
        placeholder="Name(s)"
        required
        :hasError="
          (props.touched?.dogCareResponsible && !formState.dogCareResponsible) ||
          (props.hasAttemptedSubmit && !formState.dogCareResponsible)
        "
        @blur="props.handleBlur?.('dogCareResponsible')"
      />
      <InputField
        v-model="formState.dogAnnualExpense"
        label="How much money do you expect to spend on the dog in an average year?"
        name="dogAnnualExpense"
        placeholder="Estimated amount"
        required
        :hasError="
          (props.touched?.dogAnnualExpense && !formState.dogAnnualExpense) ||
          (props.hasAttemptedSubmit && !formState.dogAnnualExpense)
        "
        @blur="props.handleBlur?.('dogAnnualExpense')"
      />
      <InputField
        v-model="formState.dogTravelArrangements"
        label="What arrangements will you make for your dog while you are traveling?"
        name="dogTravelArrangements"
        placeholder="Describe your arrangements"
        required
        :hasError="
          (props.touched?.dogTravelArrangements && !formState.dogTravelArrangements) ||
          (props.hasAttemptedSubmit && !formState.dogTravelArrangements)
        "
        @blur="props.handleBlur?.('dogTravelArrangements')"
      />
      <InputSelectGroup
        label="We don't always know if a dog is potty trained. Are you willing to potty train your pet?"
        :options="['Yes', 'No']"
        :modelValue="formState.dogWillingToPottyTrain"
        @update:modelValue="(val) => (formState.dogWillingToPottyTrain = val as string)"
        :hasError="
          (props.touched?.dogWillingToPottyTrain && !formState.dogWillingToPottyTrain) ||
          (props.hasAttemptedSubmit && !formState.dogWillingToPottyTrain)
        "
        @blur="props.handleBlur?.('dogWillingToPottyTrain')"
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
        :modelValue="formState.dogTrainingExperience"
        @update:modelValue="(val) => (formState.dogTrainingExperience = val as string[])"
        :hasError="
          (props.touched?.dogTrainingExperience && formState.dogTrainingExperience.length === 0) ||
          (props.hasAttemptedSubmit && formState.dogTrainingExperience.length === 0)
        "
        @blur="props.handleBlur?.('dogTrainingExperience')"
      />
      <InputSelectGroup
        label="Are you willing to commit to a training class/program if needed?"
        :options="['Yes', 'No']"
        :modelValue="formState.dogWillingTrainingClass"
        @update:modelValue="(val) => (formState.dogWillingTrainingClass = val as string)"
        :hasError="
          (props.touched?.dogWillingTrainingClass && !formState.dogWillingTrainingClass) ||
          (props.hasAttemptedSubmit && !formState.dogWillingTrainingClass)
        "
        @blur="props.handleBlur?.('dogWillingTrainingClass')"
      />
      <InputSelectGroup
        label="Please check types of confinement you can provide."
        :options="['Crate', 'Fenced Yard', 'Kennel Run', 'Other']"
        multiple
        :modelValue="formState.dogConfinementTypes"
        @update:modelValue="(val) => (formState.dogConfinementTypes = val as string[])"
        :hasError="
          (props.touched?.dogConfinementTypes && formState.dogConfinementTypes.length === 0) ||
          (props.hasAttemptedSubmit && formState.dogConfinementTypes.length === 0)
        "
        @blur="props.handleBlur?.('dogConfinementTypes')"
      />
      <InputSelectGroup
        label="How long are you willing to allow time for bonding?"
        :options="['One Week', 'Two Weeks', 'One Month', 'Other']"
        :modelValue="formState.dogBondingTime"
        @update:modelValue="(val) => (formState.dogBondingTime = val as string)"
        :hasError="
          (props.touched?.dogBondingTime && !formState.dogBondingTime) ||
          (props.hasAttemptedSubmit && !formState.dogBondingTime)
        "
        @blur="props.handleBlur?.('dogBondingTime')"
      />
      <InputSelectGroup
        label="Have you ever been denied pet ownership from a rescue organization?"
        :options="['Yes', 'No']"
        :modelValue="formState.dogDeniedOwnership"
        @update:modelValue="(val) => (formState.dogDeniedOwnership = val as string)"
        :hasError="
          (props.touched?.dogDeniedOwnership && !formState.dogDeniedOwnership) ||
          (props.hasAttemptedSubmit && !formState.dogDeniedOwnership)
        "
        @blur="props.handleBlur?.('dogDeniedOwnership')"
      />
    </template>
    <InputField
      v-model="formState.bredAnimalDescription"
      label="If you have ever bred an animal, please describe the circumstances"
      name="bredAnimalDescription"
      placeholder="Describe the circumstances"
      required
      :hasError="
        (props.touched?.bredAnimalDescription && !formState.bredAnimalDescription) ||
        (props.hasAttemptedSubmit && !formState.bredAnimalDescription)
      "
      @blur="props.handleBlur?.('bredAnimalDescription')"
    />
    <InputField
      v-model="formState.ownedDeclawedOrDebarked"
      label="Have you ever owned a declawed cat or a debarked dog?"
      name="ownedDeclawedOrDebarked"
      placeholder="Yes/No and details"
      required
      :hasError="
        (props.touched?.ownedDeclawedOrDebarked && !formState.ownedDeclawedOrDebarked) ||
        (props.hasAttemptedSubmit && !formState.ownedDeclawedOrDebarked)
      "
      @blur="props.handleBlur?.('ownedDeclawedOrDebarked')"
    />
    <InputField
      v-model="formState.movedWithPet"
      label="Have you ever moved with a pet?"
      name="movedWithPet"
      placeholder="Yes/No and details"
      required
      :hasError="
        (props.touched?.movedWithPet && !formState.movedWithPet) ||
        (props.hasAttemptedSubmit && !formState.movedWithPet)
      "
      @blur="props.handleBlur?.('movedWithPet')"
    />
    <InputField
      v-model="formState.ownedSpecialNeedsPet"
      label="Have you ever owned a special needs pet?"
      name="ownedSpecialNeedsPet"
      placeholder="Yes/No and details"
      required
      :hasError="
        (props.touched?.ownedSpecialNeedsPet && !formState.ownedSpecialNeedsPet) ||
        (props.hasAttemptedSubmit && !formState.ownedSpecialNeedsPet)
      "
      @blur="props.handleBlur?.('ownedSpecialNeedsPet')"
    />
    <InputField
      v-model="formState.mobilityDevice"
      label="Does anyone in your home use a mobility device?"
      name="mobilityDevice"
      placeholder="Yes/No and details"
      required
      :hasError="
        (props.touched?.mobilityDevice && !formState.mobilityDevice) ||
        (props.hasAttemptedSubmit && !formState.mobilityDevice)
      "
      @blur="props.handleBlur?.('mobilityDevice')"
    />
    <InputField
      v-model="formState.foodTypeBrand"
      :label="`What type and brand of food do you plan on feeding your new ${props.animalLabel}?`"
      name="foodTypeBrand"
      placeholder="Type and Brand"
      required
      :hasError="
        (props.touched?.foodTypeBrand && !formState.foodTypeBrand) ||
        (props.hasAttemptedSubmit && !formState.foodTypeBrand)
      "
      @blur="props.handleBlur?.('foodTypeBrand')"
    />
    <InputSelectGroup
      class="full-width"
      label="Check all that apply. Under what conditions would you NOT KEEP your new pet?"
      :options="surrenderOptions"
      multiple
      :modelValue="formState.surrenderConditions"
      @update:modelValue="(val) => (formState.surrenderConditions = val as string[])"
      :hasError="
        (props.touched?.surrenderConditions && formState.surrenderConditions.length === 0) ||
        (props.hasAttemptedSubmit && formState.surrenderConditions.length === 0)
      "
      @blur="props.handleBlur?.('surrenderConditions')"
    />
    <InputField
      v-model="formState.surrenderPlan"
      :label="`What would you do with your ${props.animalLabel} if you could not keep it for the above reason(s)?`"
      name="surrenderPlan"
      placeholder="Details"
      required
      :hasError="
        (props.touched?.surrenderPlan && !formState.surrenderPlan) ||
        (props.hasAttemptedSubmit && !formState.surrenderPlan)
      "
      @blur="props.handleBlur?.('surrenderPlan')"
    />

    <InputField
      v-model="formState.affordVetCare"
      :label="`Can you afford regular veterinary care for this ${props.animalLabel} - including yearly vaccinations, annual physical exams, dental care, etc. ($300 or more per year)?`"
      name="affordVetCare"
      placeholder="Yes/No"
      required
      :hasError="
        (props.touched?.affordVetCare && !formState.affordVetCare) ||
        (props.hasAttemptedSubmit && !formState.affordVetCare)
      "
      @blur="props.handleBlur?.('affordVetCare')"
    />
    <InputField
      v-model="formState.affordEmergencyCost"
      label="Can you afford serious injury or illness costs ($1000 or more)?"
      name="affordEmergencyCost"
      placeholder="Yes/No"
      required
      :hasError="
        (props.touched?.affordEmergencyCost && !formState.affordEmergencyCost) ||
        (props.hasAttemptedSubmit && !formState.affordEmergencyCost)
      "
      @blur="props.handleBlur?.('affordEmergencyCost')"
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
