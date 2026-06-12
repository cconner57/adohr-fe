<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import FormSubmitted from '@/components/common/form-submitted/FormSubmitted.vue'
import Button from '@/components/common/ui/Button.vue'
import HoneypotField from '@/components/common/ui/HoneypotField.vue'
import InputField from '@/components/common/ui/InputField.vue'
import InputTextArea from '@/components/common/ui/InputTextArea.vue'
import {
  Agreement,
  Allergies,
  ApplicationHeader,
  Availability,
  PositionPreferences,
} from '@/components/volunteer/index'
import { useFormState } from '@/composables/useFormState'
import { useMetrics } from '@/composables/useMetrics'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useVolunteerStore } from '@/stores/volunteer'
import {
  formatPhoneNumber,
  sanitizeAddress,
  sanitizeCity,
  sanitizeName,
  sanitizeZip,
} from '@/utils/validators'

const { submitMetric } = useMetrics()
const { vScrollReveal } = useScrollReveal()

onMounted(() => {
  submitMetric('form_start', { form: 'volunteer' })
})

const volunteerStore = useVolunteerStore()
const {
  formState,
  isSubmitted,
  isSubmitting,
  hasAttemptedSubmit,
  apiError,
  validationErrors,
  isFormValid,
} = storeToRefs(volunteerStore)
const { submit, resetForm } = volunteerStore

const { touched, handleBlur, touchAll } = useFormState([
  'firstName',
  'lastName',
  'address',
  'city',
  'zip',
  'phoneNumber',
  'birthday',
  'email',
  'allergies',
  'emergencyContactName',
  'emergencyContactPhone',
  'interestReason',
  'positionPreferences',
  'availability',
  'nameFull',
  'signatureDate',
  'signatureData',
  'parentName',
  'parentSignatureDate',
  'parentSignatureData',
])

const handleSubmit = async () => {
  if (!isFormValid.value) {
    touchAll()
    await nextTick()
    const errorSummary = document.querySelector('.validation-summary') as HTMLElement
    if (errorSummary) {
      errorSummary.focus()
    }
  }

  const success = await submit()

  if (success) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const volunteerAge = computed(() => {
  if (!formState.value.birthday) return null

  const birthDate = formState.value.birthday.includes('-')
    ? new Date(`${formState.value.birthday}T00:00:00`)
    : new Date(formState.value.birthday)

  if (Number.isNaN(birthDate.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
})

const router = useRouter()

const handleReset = async () => {
  await router.push('/')
  resetForm()
}

watch(
  () => formState.value.allergies,
  (newVal) => {
    if (newVal !== true) {
      formState.value.allergiesDetails = ''
    }
  },
)
</script>

<template>
  <section class="page-shell">
    <div v-if="!isSubmitted" class="form-container">
      <form class="form-card" aria-label="Volunteer Application" @submit.prevent="handleSubmit">
        <ApplicationHeader
          header-title="Volunteer"
          header-text="A Dream of Home Rescue (ADOHR) is an all-volunteer, nonprofit dedicated to helping homeless cats
    and kittens find loving, permanent homes. Most volunteer shifts take place at our PetSmart partner
    location in Pasadena, plus occasional events and approved vet transport support. We’re looking for responsible volunteers to help with
    feeding and cleaning, socializing cats and kittens, supporting adoptions, and light
    administrative tasks. Volunteers must be 21 or older. If under 21, a parent or guardian must
    sign the waiver below. Join us and help change a life. You’ll connect with amazing animals, work
    alongside caring volunteers, and make a meaningful impact."
        />
        <fieldset class="volunteer-grid" aria-labelledby="pi" v-scroll-reveal>
          <legend id="pi" class="section-title">Personal Information</legend>

          <HoneypotField v-model="formState.fax_number as string" />

          <InputField
            :modelValue="formState.firstName"
            @update:modelValue="
              (val: unknown) => (formState.firstName = sanitizeName(val as string))
            "
            label="First Name"
            placeholder="First name"
            autocomplete="given-name"
            name="firstName"
            maxlength="50"
            :hasError="touched.firstName && !formState.firstName"
            @blur="handleBlur('firstName')"
          />
          <InputField
            :modelValue="formState.lastName"
            @update:modelValue="
              (val: unknown) => (formState.lastName = sanitizeName(val as string))
            "
            label="Last Name"
            placeholder="Last name"
            autocomplete="family-name"
            name="lastName"
            maxlength="50"
            :hasError="touched.lastName && !formState.lastName"
            @blur="handleBlur('lastName')"
          />
          <InputField
            :modelValue="formState.address"
            @update:modelValue="
              (val: unknown) => (formState.address = sanitizeAddress(val as string))
            "
            label="Address"
            placeholder="Address"
            autocomplete="street-address"
            name="address"
            maxlength="100"
            :hasError="touched.address && !formState.address"
            @blur="handleBlur('address')"
          />
          <InputField
            :modelValue="formState.city"
            @update:modelValue="(val: unknown) => (formState.city = sanitizeCity(val as string))"
            label="City"
            placeholder="City"
            autocomplete="address-level2"
            name="city"
            maxlength="50"
            :hasError="touched.city && !formState.city"
            @blur="handleBlur('city')"
          />
          <InputField
            :modelValue="formState.zip"
            @update:modelValue="(val: unknown) => (formState.zip = sanitizeZip(val as string))"
            label="Zip"
            placeholder="Zip"
            type="text"
            autocomplete="postal-code"
            name="zip"
            maxlength="5"
            :hasError="touched.zip && !formState.zip"
            @blur="handleBlur('zip')"
          />
          <InputField
            :modelValue="formState.phoneNumber"
            @update:modelValue="
              (val: unknown) => (formState.phoneNumber = formatPhoneNumber(val as string))
            "
            label="Phone Number"
            placeholder="Phone"
            type="tel"
            autocomplete="tel"
            name="phoneNumber"
            maxlength="13"
            :hasError="touched.phoneNumber && !formState.phoneNumber"
            @blur="handleBlur('phoneNumber')"
          />
          <InputField
            v-model="formState.birthday"
            label="Birthday"
            placeholder="mm/dd/yyyy"
            type="date"
            autocomplete="bday"
            name="birthday"
            max="9999-12-31"
            :hasError="touched.birthday && !formState.birthday"
            @blur="handleBlur('birthday')"
          />
          <InputField
            :modelValue="formState.email"
            @update:modelValue="(val: unknown) => (formState.email = String(val).trim())"
            label="Email"
            placeholder="Email address"
            autocomplete="email"
            name="email"
            type="text"
            inputmode="email"
            maxlength="100"
            :hasError="
              touched.email &&
              (!formState.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email))
            "
            @blur="handleBlur('email')"
          />

          <InputField
            :modelValue="formState.emergencyContactName"
            @update:modelValue="
              (val: unknown) => (formState.emergencyContactName = sanitizeName(val as string))
            "
            label="Emergency Contact Person"
            placeholder="Name"
            name="emergencyContactName"
            autocomplete="off"
            maxlength="100"
            :hasError="touched.emergencyContactName && !formState.emergencyContactName"
            @blur="handleBlur('emergencyContactName')"
          />
          <InputField
            :modelValue="formState.emergencyContactPhone"
            @update:modelValue="
              (val: unknown) => (formState.emergencyContactPhone = formatPhoneNumber(val as string))
            "
            label="Emergency Contact Phone Number"
            placeholder="Phone Number"
            type="tel"
            name="emergencyContactPhone"
            autocomplete="off"
            maxlength="13"
            :hasError="touched.emergencyContactPhone && !formState.emergencyContactPhone"
            @blur="handleBlur('emergencyContactPhone')"
          />

          <Allergies
            v-model="formState.allergies"
            :class="{ 'has-error': touched.allergies && !formState.allergies }"
          />

          <InputField
            :modelValue="formState.allergiesDetails ?? ''"
            @update:modelValue="(val: unknown) => (formState.allergiesDetails = val as string)"
            label="Allergy Details"
            placeholder="Specify allergies (e.g., peanuts, penicillin)"
            name="allergiesDetails"
            autocomplete="off"
            :disabled="formState.allergies !== true"
          />
        </fieldset>

        <fieldset class="volunteer-stack" aria-labelledby="exp" v-scroll-reveal>
          <legend id="exp" class="section-title">Experience & Interests</legend>

          <InputTextArea
            v-model="formState.volunteerExperience"
            label="Volunteer Experience (if any):"
            placeholder="Briefly describe"
            name="volunteerExperience"
            maxlength="500"
          />

          <InputTextArea
            v-model="formState.interestReason"
            label="Why are you interested in being a volunteer:"
            placeholder="Your reason"
            name="interestReason"
            maxlength="500"
            :class="{ 'has-error': touched.interestReason && !formState.interestReason }"
            @blur="handleBlur('interestReason')"
          />

          <PositionPreferences
            v-model="formState.positionPreferences"
            :hasError="touched.positionPreferences && formState.positionPreferences.length === 0"
          />
        </fieldset>

        <div v-scroll-reveal>
          <Availability
            v-model="formState.availability"
            :hasError="touched.availability && formState.availability.length === 0"
          />

          <Agreement
            :name="formState.firstName + ' ' + formState.lastName"
            v-model:fullName="formState.nameFull"
            :age="volunteerAge"
            v-model:signature="formState.signatureData"
            v-model:signatureDate="formState.signatureDate"
            v-model:parentName="formState.parentName"
            v-model:parentSignature="formState.parentSignatureData"
            v-model:parentDate="formState.parentSignatureDate"
            :hasNameError="touched.nameFull && !formState.nameFull"
            :hasDateError="touched.signatureDate && !formState.signatureDate"
            :hasSignatureError="touched.signatureData && !formState.signatureData"
            :hasParentNameError="touched.parentName && !formState.parentName"
            :hasParentDateError="touched.parentSignatureDate && !formState.parentSignatureDate"
            :hasParentSignatureError="touched.parentSignatureData && !formState.parentSignatureData"
          />

          <div v-if="apiError" class="validation-summary error-alert">
            <p class="summary-title">Submission Error</p>
            <p>{{ apiError }}</p>
          </div>

          <div
            v-if="hasAttemptedSubmit && !isFormValid && validationErrors.length > 0"
            class="validation-summary"
            role="alert"
            tabindex="-1"
          >
            <p class="summary-title">Please complete the following required fields:</p>
            <div class="tags">
              <span v-for="err in validationErrors" :key="err" class="tag is-danger">{{
                err
              }}</span>
            </div>
          </div>

          <div class="actions">
            <Button
              type="submit"
              title="Submit Application"
              color="green"
              size="large"
              :loading="isSubmitting"
            />
          </div>
        </div>
      </form>
    </div>

    <FormSubmitted v-if="isSubmitted" @reset="handleReset" formType="volunteer" />
  </section>
</template>

<style scoped src="./Volunteer.css"></style>
