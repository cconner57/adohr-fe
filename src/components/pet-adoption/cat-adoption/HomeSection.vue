<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAdoptionStore } from '../../../stores/adoption'
import { formatPhoneNumber, sanitizeName } from '../../../utils/validators'
import ButtonToggle from '../../common/ui/ButtonToggle.vue'
import InputField from '../../common/ui/InputField.vue'
import InputSelectGroup from '../../common/ui/InputSelectGroup.vue'

const props = withDefaults(
  defineProps<{
    touched: Record<string, boolean>
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
  <div class="home-section-container">
    <h2 class="section-title">Housing Information</h2>

    <div class="home-section">
      <InputSelectGroup
        label="Do you own or rent your home?"
        :options="['Own', 'Rent', 'Lease']"
        :modelValue="formState.homeOwnership"
        @update:modelValue="(val) => (formState.homeOwnership = val as string)"
        :hasError="
          (props.touched.homeOwnership && !formState.homeOwnership) ||
          (props.hasAttemptedSubmit && !formState.homeOwnership)
        "
        @blur="props.handleBlur('homeOwnership')"
      />
      <InputSelectGroup
        label="Home Type"
        :options="['Home', 'Apartment', 'Condo', 'Townhouse', 'Other']"
        :modelValue="formState.homeType"
        @update:modelValue="(val) => (formState.homeType = val as string)"
        :hasError="
          (props.touched.homeType && !formState.homeType) || (props.hasAttemptedSubmit && !formState.homeType)
        "
        @blur="props.handleBlur('homeType')"
      />

      <div
        v-if="formState.homeOwnership === 'Rent' || formState.homeOwnership === 'Lease'"
        class="landlord-fields"
      >
        <InputField
          :modelValue="formState.landlordName"
          @update:modelValue="(val) => (formState.landlordName = sanitizeName(val))"
          label="Landlord's Name"
          name="landlordName"
          placeholder="Enter landlord's name"
          required
          :hasError="
            (props.touched.landlordName && !formState.landlordName) ||
            (props.hasAttemptedSubmit && !formState.landlordName)
          "
          @blur="props.handleBlur('landlordName')"
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
            (props.touched.landlordPhoneNumber && !formState.landlordPhoneNumber) ||
            (props.hasAttemptedSubmit && !formState.landlordPhoneNumber)
          "
          @blur="props.handleBlur('landlordPhoneNumber')"
        />
        <InputField
          v-model="formState.allowPets"
          label="Are pets allowed by your lease?"
          name="allowPets"
          placeholder="Yes/No, explain if needed"
          required
          :hasError="
            (props.touched.allowPets && !formState.allowPets) ||
            (props.hasAttemptedSubmit && !formState.allowPets)
          "
          @blur="props.handleBlur('allowPets')"
        />
        <InputField
          v-model="formState.monthlyFee"
          label="Is there a pet deposit or monthly fee?"
          name="monthlyFee"
          placeholder="Yes/No (Amount)"
          required
          :hasError="
            (props.touched.monthlyFee && !formState.monthlyFee) ||
            (props.hasAttemptedSubmit && !formState.monthlyFee)
          "
          @blur="props.handleBlur('monthlyFee')"
        />
        <InputField
          v-model="formState.breedRestrictionsWeightLimit"
          label="Are there any breed restrictions or weight limits?"
          name="breedRestrictions"
          placeholder="List any restrictions"
          required
          :hasError="
            (props.touched.breedRestrictionsWeightLimit && !formState.breedRestrictionsWeightLimit) ||
            (props.hasAttemptedSubmit && !formState.breedRestrictionsWeightLimit)
          "
          @blur="props.handleBlur('breedRestrictionsWeightLimit')"
        />
      </div>

      <ButtonToggle
        label="Is the person filling out this application the primary owner/leaseholder/renter?"
        :modelValue="formState.primaryOwner"
        @update:modelValue="(val) => (formState.primaryOwner = val as boolean)"
        true-value="Yes"
        false-value="No"
        :hasError="
          (props.hasAttemptedSubmit && !formState.primaryOwner) ||
          (props.touched.primaryOwner && !formState.primaryOwner)
        "
      />
      <InputField
        v-model="formState.allergies"
        :label="`Does anyone in the household have ${props.animalLabel} allergies?`"
        name="allergies"
        placeholder="Yes/No"
        required
        :hasError="
          (props.touched.allergies && !formState.allergies) || (props.hasAttemptedSubmit && !formState.allergies)
        "
        @blur="props.handleBlur('allergies')"
      />

      <InputField
        v-model="formState.previousAddress"
        label="What city/state were you in before this and how long did you live there?"
        name="previousAddress"
        placeholder="Previous Address"
        required
        :hasError="
          (props.touched.previousAddress && !formState.previousAddress) ||
          (props.hasAttemptedSubmit && !formState.previousAddress)
        "
        @blur="props.handleBlur('previousAddress')"
      />
      <InputField
        v-model="formState.yearsAtAddress"
        label="How long have you lived at this address?"
        name="yearsAtAddress"
        placeholder="Years at Address"
        required
        :hasError="
          (props.touched.yearsAtAddress && !formState.yearsAtAddress) ||
          (props.hasAttemptedSubmit && !formState.yearsAtAddress)
        "
        @blur="props.handleBlur('yearsAtAddress')"
      />

      <InputField
        v-model="formState.travelPlan"
        :label="`Do you travel a great deal? What do you plan to do with your ${props.animalLabel} when you do travel?`"
        name="travelPlan"
        placeholder="Travel Plan"
        required
        :hasError="
          (props.touched.travelPlan && !formState.travelPlan) ||
          (props.hasAttemptedSubmit && !formState.travelPlan)
        "
        @blur="props.handleBlur('travelPlan')"
      />
      <InputField
        v-model="formState.expectToMove"
        label="Do you expect to move in the next few months? When/Where?"
        name="expectToMove"
        placeholder="Expect to Move"
        required
        :hasError="
          (props.touched.expectToMove && !formState.expectToMove) ||
          (props.hasAttemptedSubmit && !formState.expectToMove)
        "
        @blur="props.handleBlur('expectToMove')"
      />

      <InputSelectGroup
        :label="`This ${props.animalLabel} will be:`"
        :options="['Indoor Only', 'Mostly Indoor', 'Mostly Outdoor', 'Outdoor Only']"
        :modelValue="formState.catIndoorOutdoor"
        @update:modelValue="(val) => (formState.catIndoorOutdoor = val as string)"
        :hasError="
          (props.touched.catIndoorOutdoor && !formState.catIndoorOutdoor) ||
          (props.hasAttemptedSubmit && !formState.catIndoorOutdoor)
        "
        @blur="props.handleBlur('catIndoorOutdoor')"
      />
      <InputSelectGroup
        :label="`Check all that apply. Will the ${props.animalLabel} have access to:`"
        :options="['Balcony', 'Patio', 'Garage', 'Yard', 'Doggie Door', 'None of these']"
        :modelValue="formState.catAccess"
        @update:modelValue="(val) => (formState.catAccess = val as string[])"
        multiple
        :hasError="
          (props.touched.catAccess && formState.catAccess.length === 0) ||
          (props.hasAttemptedSubmit && formState.catAccess.length === 0)
        "
        @blur="props.handleBlur('catAccess')"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.home-section-container {
  width: 100%;
}

.home-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.landlord-fields {
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

  .landlord-fields {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}
</style>
