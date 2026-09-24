<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import ButtonToggle from '@/components/common/ui/ButtonToggle.vue'
import HoneypotField from '@/components/common/ui/HoneypotField.vue'
import InputField from '@/components/common/ui/InputField.vue'
import InputSelectGroup from '@/components/common/ui/InputSelectGroup.vue'
import InputTextArea from '@/components/common/ui/InputTextArea.vue'
import { useSurrenderStore } from '@/stores/surrender'
import {
  formatPhoneNumber,
  sanitizeAddress,
  sanitizeCity,
  sanitizeName,
  sanitizeZip,
} from '@/utils/validators'

const props = defineProps<{
  touched: Record<string, boolean>
  // eslint-disable-next-line no-unused-vars
  handleBlur: (field: string) => void
  hasAttemptedSubmit: boolean
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
  <div class="household-section">
    <h2 class="section-title">{{ animalLabel }} & Household Information</h2>
    <HoneypotField
      :model-value="formState.fax_number || null"
      @update:model-value="(val) => (formState.fax_number = val as string)"
    />
    <fieldset class="household-grid">
      <InputField
        label="First Name"
        placeholder="First Name"
        :modelValue="formState.firstName"
        @update:modelValue="(val) => (formState.firstName = sanitizeName(val))"
        :hasError="
          (touched.firstName && !formState.firstName) ||
          (hasAttemptedSubmit && !formState.firstName)
        "
        @blur="handleBlur('firstName')"
      />
      <InputField
        label="Last Name"
        placeholder="Last Name"
        :modelValue="formState.lastName"
        @update:modelValue="(val) => (formState.lastName = sanitizeName(val))"
        :hasError="
          (touched.lastName && !formState.lastName) || (hasAttemptedSubmit && !formState.lastName)
        "
        @blur="handleBlur('lastName')"
      />
      <InputField
        label="Phone Number"
        placeholder="Phone Number"
        :modelValue="formState.phoneNumber"
        @update:modelValue="(val) => (formState.phoneNumber = formatPhoneNumber(val))"
        maxlength="13"
        :hasError="
          (touched.phoneNumber && !formState.phoneNumber) ||
          (hasAttemptedSubmit && !formState.phoneNumber)
        "
        @blur="handleBlur('phoneNumber')"
      />
      <InputField
        label="Email"
        placeholder="Email"
        v-model="formState.email"
        :hasError="(touched.email && !formState.email) || (hasAttemptedSubmit && !formState.email)"
        @blur="handleBlur('email')"
      />
      <InputField
        label="Street Address"
        placeholder="Street Address"
        :modelValue="formState.streetAddress"
        @update:modelValue="(val) => (formState.streetAddress = sanitizeAddress(val))"
        :hasError="
          (touched.streetAddress && !formState.streetAddress) ||
          (hasAttemptedSubmit && !formState.streetAddress)
        "
        @blur="handleBlur('streetAddress')"
      />
      <InputField
        label="City"
        placeholder="City"
        :modelValue="formState.city"
        @update:modelValue="(val) => (formState.city = sanitizeCity(val))"
        :hasError="(touched.city && !formState.city) || (hasAttemptedSubmit && !formState.city)"
        @blur="handleBlur('city')"
      />
      <InputField
        label="State"
        placeholder="State"
        :modelValue="formState.state"
        @update:modelValue="(val) => (formState.state = sanitizeCity(val))"
        :hasError="(touched.state && !formState.state) || (hasAttemptedSubmit && !formState.state)"
        @blur="handleBlur('state')"
      />
      <InputField
        label="Zip Code"
        placeholder="Zip Code"
        :modelValue="formState.zipCode"
        @update:modelValue="(val) => (formState.zipCode = sanitizeZip(val))"
        maxlength="5"
        :hasError="
          (touched.zipCode && !formState.zipCode) || (hasAttemptedSubmit && !formState.zipCode)
        "
        @blur="handleBlur('zipCode')"
      />

      <InputTextArea
        class="full-width"
        :label="`When do you need to surrender your ${animalLabel.toLowerCase()}`"
        :placeholder="`When do you need to surrender your ${animalLabel.toLowerCase()}`"
        :modelValue="formState.whenToSurrenderAnimal"
        @update:modelValue="(val) => (formState.whenToSurrenderAnimal = val ?? '')"
        :hasError="
          (touched.whenToSurrenderAnimal && !formState.whenToSurrenderAnimal) ||
          (hasAttemptedSubmit && !formState.whenToSurrenderAnimal)
        "
        @blur="handleBlur('whenToSurrenderAnimal')"
      />
      <InputField
        :label="`${selectedAnimal}'s Name`"
        :placeholder="`${selectedAnimal}'s Name`"
        :modelValue="formState.animalName"
        @update:modelValue="(val) => (formState.animalName = val as string)"
        :hasError="
          (touched.animalName && !formState.animalName) ||
          (hasAttemptedSubmit && !formState.animalName)
        "
        @blur="handleBlur('animalName')"
      />
      <InputField
        label="Age"
        placeholder="Age"
        :modelValue="formState.animalAge"
        @update:modelValue="(val) => (formState.animalAge = val as string)"
        :hasError="
          (touched.animalAge && !formState.animalAge) ||
          (hasAttemptedSubmit && !formState.animalAge)
        "
        @blur="handleBlur('animalAge')"
      />
      <InputSelectGroup
        label="Sex"
        :options="['Male', 'Female', 'Unknown']"
        :modelValue="formState.animalSex"
        @update:modelValue="(val) => (formState.animalSex = val as string)"
        :hasError="
          (touched.animalSex && !formState.animalSex) ||
          (hasAttemptedSubmit && !formState.animalSex)
        "
        @blur="handleBlur('animalSex')"
      />

      <InputTextArea
        class="full-width"
        :label="`How long have you had your ${animalLabel.toLowerCase()}?`"
        :placeholder="`How long have you had your ${animalLabel.toLowerCase()}?`"
        :modelValue="formState.animalOwnershipDuration"
        @update:modelValue="(val) => (formState.animalOwnershipDuration = val ?? '')"
        :hasError="
          (touched.animalOwnershipDuration && !formState.animalOwnershipDuration) ||
          (hasAttemptedSubmit && !formState.animalOwnershipDuration)
        "
        @blur="handleBlur('animalOwnershipDuration')"
      />
      <InputTextArea
        class="full-width"
        :label="`Where did you get your ${animalLabel.toLowerCase()}?`"
        :placeholder="`Where did you get your ${animalLabel.toLowerCase()}?`"
        :modelValue="formState.animalLocationFound"
        @update:modelValue="(val) => (formState.animalLocationFound = val ?? '')"
        :hasError="
          (touched.animalLocationFound && !formState.animalLocationFound) ||
          (hasAttemptedSubmit && !formState.animalLocationFound)
        "
        @blur="handleBlur('animalLocationFound')"
      />
      <InputTextArea
        class="full-width"
        :label="`Why are you surrendering your ${animalLabel.toLowerCase()}?`"
        :placeholder="`Why are you surrendering your ${animalLabel.toLowerCase()}?`"
        :modelValue="formState.animalWhySurrendered"
        @update:modelValue="(val) => (formState.animalWhySurrendered = val ?? '')"
        :hasError="
          (touched.animalWhySurrendered && !formState.animalWhySurrendered) ||
          (hasAttemptedSubmit && !formState.animalWhySurrendered)
        "
        @blur="handleBlur('animalWhySurrendered')"
      />
    </fieldset>
    <div class="household-members-section">
      <h5>Including yourself, how many people live in your home?</h5>
      <p class="subtitle">Please list the age and gender of each person.</p>

      <div v-for="(member, index) in formState.householdMembers" :key="index" class="member-row">
        <div class="field-group gender-group">
          <ButtonToggle
            label="Gender"
            :modelValue="member.gender"
            @update:modelValue="(val) => (member.gender = val as 'Male' | 'Female')"
            true-value="Male"
            false-value="Female"
          />
        </div>

        <div class="field-group age-group">
          <InputField
            label="Age"
            placeholder="Age"
            :modelValue="member.age"
            @update:modelValue="
              (val) => (member.age = String(val).replace(/\D/g, '').substring(0, 3))
            "
            maxlength="3"
            class="clean-input"
            :hasError="
              (touched[`householdMembers[${index}].age`] || hasAttemptedSubmit) && !member.age
            "
            @blur="handleBlur(`householdMembers[${index}].age`)"
          />
        </div>

        <div class="field-group quantity-group">
          <InputField
            label="Quantity"
            placeholder="Qty"
            type="number"
            :modelValue="member.count"
            @update:modelValue="(val) => (member.count = Number(val))"
            min="1"
            class="clean-input"
            :hasError="
              (touched[`householdMembers[${index}].count`] || hasAttemptedSubmit) &&
              (!member.count || member.count < 1)
            "
            @blur="handleBlur(`householdMembers[${index}].count`)"
          />
        </div>

        <button
          v-if="formState.householdMembers.length > 1"
          type="button"
          class="remove-btn"
          @click="formState.householdMembers.splice(index, 1)"
          aria-label="Remove member"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            ></path>
          </svg>
        </button>
      </div>

      <button
        type="button"
        class="add-btn"
        @click="formState.householdMembers.push({ age: '', gender: 'Female', count: 1 })"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Another Person / Group
      </button>
    </div>
    <section class="full-width">
      <InputSelectGroup
        :label="`What other animals did the ${animalLabel.toLowerCase()} live with?`"
        :options="['Dogs', 'Cats', 'Other', 'No other animals']"
        :modelValue="formState.otherPetsInHousehold"
        @update:modelValue="(val) => (formState.otherPetsInHousehold = val as string)"
        :hasError="
          (touched.otherPetsInHousehold && !formState.otherPetsInHousehold) ||
          (hasAttemptedSubmit && !formState.otherPetsInHousehold)
        "
        @blur="handleBlur('otherPetsInHousehold')"
        :multiple="true"
      />
    </section>
  </div>
</template>

<style scoped src="./HouseholdSection.css"></style>

