<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAdoptionStore } from '../../../stores/adoption'
import { formatPhoneNumber, sanitizeName } from '../../../utils/validators'
import ButtonToggle from '../../common/ui/ButtonToggle.vue'
import InputField from '../../common/ui/InputField.vue'
import InputSelectGroup from '../../common/ui/InputSelectGroup.vue'

const { animalLabel = 'cat' } = defineProps<{
  touched: Record<string, boolean>
  // eslint-disable-next-line no-unused-vars
  handleBlur: (_field: string) => void
  hasAttemptedSubmit?: boolean
  animalLabel?: string
}>()

const adoptionStore = useAdoptionStore()
const { formState } = storeToRefs(adoptionStore)
</script>

<template>
  <div class="home-section">
    <h2 class="section-title">Housing Information</h2>
    <InputSelectGroup
      label="Home Type"
      :options="['Home', 'Apartment', 'Condo', 'Townhouse', 'Other']"
      :modelValue="formState.homeType"
      @update:modelValue="(val) => (formState.homeType = val as string)"
      :hasError="
        (touched.homeType && !formState.homeType) || (hasAttemptedSubmit && !formState.homeType)
      "
      @blur="handleBlur('homeType')"
    />
    <InputSelectGroup
      label="Do you own or rent your home?"
      :options="['Own', 'Rent', 'Lease']"
      :modelValue="formState.homeOwnership"
      @update:modelValue="(val) => (formState.homeOwnership = val as string)"
      :hasError="
        (touched.homeOwnership && !formState.homeOwnership) ||
        (hasAttemptedSubmit && !formState.homeOwnership)
      "
      @blur="handleBlur('homeOwnership')"
    />
    <template v-if="formState.homeOwnership === 'Rent' || formState.homeOwnership === 'Lease'">
      <InputField
        :modelValue="formState.landlordName"
        @update:modelValue="(val) => (formState.landlordName = sanitizeName(val))"
        label="Landlord's Name"
        name="landlordName"
        placeholder="Enter landlord's name"
        required
        :hasError="
          (touched.landlordName && !formState.landlordName) ||
          (hasAttemptedSubmit && !formState.landlordName)
        "
        @blur="handleBlur('landlordName')"
      />
      <InputField
        :modelValue="formState.landlordPhoneNumber"
        @update:modelValue="(val) => (formState.landlordPhoneNumber = formatPhoneNumber(val))"
        label="Landlord's Phone Number"
        name="landlordPhoneNumber"
        placeholder="123-456-7890"
        type="tel"
        maxlength="12"
        required
        :hasError="
          (touched.landlordPhoneNumber && !formState.landlordPhoneNumber) ||
          (hasAttemptedSubmit && !formState.landlordPhoneNumber)
        "
        @blur="handleBlur('landlordPhoneNumber')"
      />
      <InputField
        v-model="formState.allowPets"
        label="Are pets allowed by your lease?"
        name="allowPets"
        placeholder="Yes/No, explain if needed"
        required
        :hasError="
          (touched.allowPets && !formState.allowPets) ||
          (hasAttemptedSubmit && !formState.allowPets)
        "
        @blur="handleBlur('allowPets')"
      />
    </template>
    <InputField
      v-model="formState.breedRestrictionsWeightLimit"
      label="Are there any breed restrictions or weight limits?"
      name="breedRestrictions"
      placeholder="List any restrictions"
      required
      :hasError="
        (touched.breedRestrictionsWeightLimit && !formState.breedRestrictionsWeightLimit) ||
        (hasAttemptedSubmit && !formState.breedRestrictionsWeightLimit)
      "
      @blur="handleBlur('breedRestrictionsWeightLimit')"
    />
    <InputField
      v-model="formState.monthlyFee"
      label="Is there a pet deposit or monthly fee?"
      name="monthlyFee"
      placeholder="Yes/No (Amount)"
      required
      :hasError="
        (touched.monthlyFee && !formState.monthlyFee) ||
        (hasAttemptedSubmit && !formState.monthlyFee)
      "
      @blur="handleBlur('monthlyFee')"
    />
    <InputField
      v-model="formState.allergies"
      :label="`Does anyone in the household have ${animalLabel} allergies?`"
      name="allergies"
      placeholder="Yes/No"
      required
      :hasError="
        (touched.allergies && !formState.allergies) || (hasAttemptedSubmit && !formState.allergies)
      "
      @blur="handleBlur('allergies')"
    />
    <ButtonToggle
      label="Is the person filling out this application the primary owner/leaseholder/renter?"
      :modelValue="formState.primaryOwner"
      @update:modelValue="(val) => (formState.primaryOwner = val as boolean)"
      true-value="Yes"
      false-value="No"
      :hasError="
        (hasAttemptedSubmit && !formState.primaryOwner) ||
        (touched.primaryOwner && !formState.primaryOwner)
      "
    />
    <InputField
      v-model="formState.yearsAtAddress"
      label="How long have you lived at this address?"
      name="yearsAtAddress"
      placeholder="Years at Address"
      required
      :hasError="
        (touched.yearsAtAddress && !formState.yearsAtAddress) ||
        (hasAttemptedSubmit && !formState.yearsAtAddress)
      "
      @blur="handleBlur('yearsAtAddress')"
    />
    <InputField
      v-model="formState.previousAddress"
      label="What city/state were you in before this and how long did you live there?"
      name="previousAddress"
      placeholder="Previous Address"
      required
      :hasError="
        (touched.previousAddress && !formState.previousAddress) ||
        (hasAttemptedSubmit && !formState.previousAddress)
      "
      @blur="handleBlur('previousAddress')"
    />
    <InputField
      v-model="formState.expectToMove"
      label="Do you expect to move in the next few months? When/Where?"
      name="expectToMove"
      placeholder="Expect to Move"
      required
      :hasError="
        (touched.expectToMove && !formState.expectToMove) ||
        (hasAttemptedSubmit && !formState.expectToMove)
      "
      @blur="handleBlur('expectToMove')"
    />
    <InputField
      v-model="formState.travelPlan"
      :label="`Do you travel a great deal? What do you plan to do with your ${animalLabel} when you do travel?`"
      name="travelPlan"
      placeholder="Travel Plan"
      required
      :hasError="
        (touched.travelPlan && !formState.travelPlan) ||
        (hasAttemptedSubmit && !formState.travelPlan)
      "
      @blur="handleBlur('travelPlan')"
    />
    <InputSelectGroup
      :label="`Check all that apply. Will the ${animalLabel} have access to:`"
      :options="['Balcony', 'Patio', 'Garage', 'Yard', 'Doggie Door', 'None of these']"
      :modelValue="formState.catAccess"
      @update:modelValue="(val) => (formState.catAccess = val as string[])"
      multiple
      :hasError="
        (touched.catAccess && formState.catAccess.length === 0) ||
        (hasAttemptedSubmit && formState.catAccess.length === 0)
      "
      @blur="handleBlur('catAccess')"
    />
    <InputSelectGroup
      :label="`This ${animalLabel} will be:`"
      :options="['Indoor Only', 'Mostly Indoor', 'Mostly Outdoor', 'Outdoor Only']"
      :modelValue="formState.catIndoorOutdoor"
      @update:modelValue="(val) => (formState.catIndoorOutdoor = val as string)"
      :hasError="
        (touched.catIndoorOutdoor && !formState.catIndoorOutdoor) ||
        (hasAttemptedSubmit && !formState.catIndoorOutdoor)
      "
      @blur="handleBlur('catIndoorOutdoor')"
    />
  </div>
</template>

<style scoped lang="css">
.home-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (width >= 768px) {
  .home-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    align-items: start;
  }
}
</style>
