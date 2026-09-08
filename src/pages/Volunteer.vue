<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import FormSubmitted from '@/components/common/form-submitted/FormSubmitted.vue'
import Button from '@/components/common/ui/Button.vue'
import HoneypotField from '@/components/common/ui/HoneypotField.vue'
import InputField from '@/components/common/ui/InputField.vue'
import InputTextArea from '@/components/common/ui/InputTextArea.vue'
import AdoptionSteps from '@/components/pet-adoption/adoption-steps/AdoptionSteps.vue'
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
  apiError,
  isFormValid,
  hasSavedDraft,
} = storeToRefs(volunteerStore)
const { submit, resetForm, clearPersistedState } = volunteerStore

const currentStep = ref(0)
const volunteerSteps = ['Personal Info', 'Interests', 'Availability', 'Agreement']

const { touched, handleBlur, touchAll } = useFormState([
  'firstName', 'lastName', 'address', 'city', 'zip', 'phoneNumber', 'birthday', 'email',
  'allergies', 'emergencyContactName', 'emergencyContactPhone', 'interestReason',
  'positionPreferences', 'availability', 'nameFull', 'signatureDate', 'signatureData',
  'parentName', 'parentSignatureDate', 'parentSignatureData',
])

watch(
  formState,
  () => {
    volunteerStore.persistState()
  },
  { deep: true },
)

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

const step0Errors = computed(() => {
  const errs: string[] = []
  const f = formState.value
  if (!f.firstName) errs.push('First Name is required')
  if (!f.lastName) errs.push('Last Name is required')
  if (!f.address) errs.push('Address is required')
  if (!f.city) errs.push('City is required')
  if (!f.zip || f.zip.length < 5) errs.push('Valid 5-digit Zip code is required')
  if (!f.phoneNumber || f.phoneNumber.length < 10) errs.push('Valid Phone Number is required')
  if (!f.birthday) errs.push('Birthday is required')
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.push('Valid Email is required')
  if (!f.emergencyContactName) errs.push('Emergency Contact Name is required')
  if (!f.emergencyContactPhone) errs.push('Emergency Contact Phone is required')
  if (f.allergies === null) errs.push('Please answer the allergies question')
  if (f.allergies === true && !f.allergiesDetails?.trim()) errs.push('Please specify allergy details')
  return errs
})

const step1Errors = computed(() => {
  const errs: string[] = []
  if (!formState.value.interestReason?.trim()) errs.push('Please share why you are interested in volunteering')
  if (!formState.value.positionPreferences?.length) errs.push('Please select at least one preferred position')
  return errs
})

const step2Errors = computed(() => {
  const errs: string[] = []
  if (!formState.value.availability?.length) errs.push('Please select at least one shift availability')
  return errs
})

const step3Errors = computed(() => {
  const errs: string[] = []
  const f = formState.value
  if (!f.nameFull?.trim()) errs.push('Full legal name is required for signature')
  if (!f.signatureDate) errs.push('Signature date is required')
  if (!f.signatureData) errs.push('Digital signature is required')
  if (volunteerAge.value !== null && volunteerAge.value < 21) {
    if (!f.parentName?.trim()) errs.push('Parent/Guardian name is required (under 21)')
    if (!f.parentSignatureDate) errs.push('Parent/Guardian signature date is required')
    if (!f.parentSignatureData) errs.push('Parent/Guardian signature is required')
  }
  return errs
})

const stepHasError = ref(false)

const handleNextStep = () => {
  stepHasError.value = false
  if (currentStep.value === 0 && step0Errors.value.length > 0) {
    stepHasError.value = true
    touchAll()
    window.scrollTo({ top: 180, behavior: 'smooth' })
    return
  }
  if (currentStep.value === 1 && step1Errors.value.length > 0) {
    stepHasError.value = true
    touched.interestReason = true
    touched.positionPreferences = true
    window.scrollTo({ top: 180, behavior: 'smooth' })
    return
  }
  if (currentStep.value === 2 && step2Errors.value.length > 0) {
    stepHasError.value = true
    touched.availability = true
    window.scrollTo({ top: 180, behavior: 'smooth' })
    return
  }

  if (currentStep.value < volunteerSteps.length - 1) {
    currentStep.value++
    window.scrollTo({ top: 180, behavior: 'smooth' })
  }
}

const handlePrevStep = () => {
  stepHasError.value = false
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 180, behavior: 'smooth' })
  }
}

const handleSubmit = async () => {
  if (step3Errors.value.length > 0 || !isFormValid.value) {
    stepHasError.value = true
    touchAll()
    await nextTick()
    const errorSummary = document.querySelector('.validation-summary') as HTMLElement
    if (errorSummary) errorSummary.focus()
    return
  }

  const success = await submit()
  if (success) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const router = useRouter()

const handleReset = async () => {
  await router.push('/')
  resetForm()
}

const handleClearDraft = () => {
  clearPersistedState()
  resetForm()
  currentStep.value = 0
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
      <form
        class="form-card"
        :style="{ '--step-prefix': `'${String(currentStep + 1).padStart(2, '0')}'` }"
        aria-label="Volunteer Application"
        @submit.prevent="handleSubmit"
      >
        <ApplicationHeader
          header-title="Volunteer"
          header-text="A Dream of Home Rescue (ADOHR) is an all-volunteer, nonprofit dedicated to helping homeless cats and dogs find loving, permanent homes. Most volunteer shifts take place at our PetSmart partner location in Pasadena, plus occasional events and vet transport. Volunteers must be 21 or older (or have a parent/guardian co-sign). Join us and make a meaningful impact!"
        />

        <div class="stepper-wrapper" v-scroll-reveal>
          <AdoptionSteps :currentStep="currentStep" :steps="volunteerSteps" />
        </div>

        <div v-if="hasSavedDraft" class="draft-badge-bar">
          <span class="draft-indicator">
            <span class="dot"></span>
            Draft auto-saved · Step {{ currentStep + 1 }} of {{ volunteerSteps.length }}
          </span>
          <button type="button" class="clear-draft-btn" @click="handleClearDraft">
            Clear Draft
          </button>
        </div>

        <!-- STEP 0: Personal Information -->
        <fieldset v-show="currentStep === 0" class="volunteer-grid" aria-labelledby="pi">
          <legend id="pi" class="section-title">Personal Information</legend>
          <HoneypotField v-model="formState.fax_number as string" />

          <InputField
            :modelValue="formState.firstName"
            @update:modelValue="(v: unknown) => (formState.firstName = sanitizeName(v as string))"
            label="First Name" placeholder="First name" autocomplete="given-name" name="firstName" maxlength="50"
            :hasError="touched.firstName && !formState.firstName" @blur="handleBlur('firstName')"
          />
          <InputField
            :modelValue="formState.lastName"
            @update:modelValue="(v: unknown) => (formState.lastName = sanitizeName(v as string))"
            label="Last Name" placeholder="Last name" autocomplete="family-name" name="lastName" maxlength="50"
            :hasError="touched.lastName && !formState.lastName" @blur="handleBlur('lastName')"
          />
          <InputField
            :modelValue="formState.address"
            @update:modelValue="(v: unknown) => (formState.address = sanitizeAddress(v as string))"
            label="Address" placeholder="Address" autocomplete="street-address" name="address" maxlength="100"
            :hasError="touched.address && !formState.address" @blur="handleBlur('address')"
          />
          <InputField
            :modelValue="formState.city"
            @update:modelValue="(v: unknown) => (formState.city = sanitizeCity(v as string))"
            label="City" placeholder="City" autocomplete="address-level2" name="city" maxlength="50"
            :hasError="touched.city && !formState.city" @blur="handleBlur('city')"
          />
          <InputField
            :modelValue="formState.zip"
            @update:modelValue="(v: unknown) => (formState.zip = sanitizeZip(v as string))"
            label="Zip" placeholder="91107" type="text" inputmode="numeric" autocomplete="postal-code" name="zip" maxlength="5"
            :hasError="touched.zip && (!formState.zip || formState.zip.length < 5)" @blur="handleBlur('zip')"
          />
          <InputField
            :modelValue="formState.phoneNumber"
            @update:modelValue="(v: unknown) => (formState.phoneNumber = formatPhoneNumber(v as string))"
            label="Phone Number" placeholder="626-555-0199" type="tel" inputmode="tel" autocomplete="tel" name="phoneNumber" maxlength="14"
            :hasError="touched.phoneNumber && (!formState.phoneNumber || formState.phoneNumber.length < 10)" @blur="handleBlur('phoneNumber')"
          />
          <InputField
            v-model="formState.birthday"
            label="Birthday" placeholder="mm/dd/yyyy" type="date" autocomplete="bday" name="birthday" max="9999-12-31"
            :hasError="touched.birthday && !formState.birthday" @blur="handleBlur('birthday')"
          />
          <InputField
            :modelValue="formState.email"
            @update:modelValue="(v: unknown) => (formState.email = String(v).trim())"
            label="Email" placeholder="Email address" autocomplete="email" name="email" type="email" inputmode="email" maxlength="100"
            :hasError="touched.email && (!formState.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email))" @blur="handleBlur('email')"
          />
          <InputField
            :modelValue="formState.emergencyContactName"
            @update:modelValue="(v: unknown) => (formState.emergencyContactName = sanitizeName(v as string))"
            label="Emergency Contact Person" placeholder="Contact Name" name="emergencyContactName" autocomplete="off" maxlength="100"
            :hasError="touched.emergencyContactName && !formState.emergencyContactName" @blur="handleBlur('emergencyContactName')"
          />
          <InputField
            :modelValue="formState.emergencyContactPhone"
            @update:modelValue="(v: unknown) => (formState.emergencyContactPhone = formatPhoneNumber(v as string))"
            label="Emergency Contact Phone Number" placeholder="(626) 555-0199" type="tel" inputmode="tel" name="emergencyContactPhone" autocomplete="off" maxlength="14"
            :hasError="touched.emergencyContactPhone && !formState.emergencyContactPhone" @blur="handleBlur('emergencyContactPhone')"
          />

          <Allergies v-model="formState.allergies" :class="{ 'has-error': touched.allergies && formState.allergies === null }" />
          <InputField
            :modelValue="formState.allergiesDetails ?? ''"
            @update:modelValue="(v: unknown) => (formState.allergiesDetails = v as string)"
            label="Allergy Details" placeholder="Specify allergies (e.g., dander, penicillin)" name="allergiesDetails" autocomplete="off"
            :disabled="formState.allergies !== true"
          />
        </fieldset>

        <!-- STEP 1: Experience & Interests -->
        <fieldset v-show="currentStep === 1" class="volunteer-stack" aria-labelledby="exp">
          <legend id="exp" class="section-title">Experience & Interests</legend>
          <InputTextArea
            v-model="formState.volunteerExperience"
            label="Volunteer Experience (if any):" placeholder="Describe any past rescue or shelter experience" name="volunteerExperience" maxlength="500"
          />
          <InputTextArea
            v-model="formState.interestReason"
            label="Why are you interested in volunteering:" placeholder="Tell us what drew you to ADOHR and what you hope to contribute" name="interestReason" maxlength="500"
            :class="{ 'has-error': touched.interestReason && !formState.interestReason }" @blur="handleBlur('interestReason')"
          />
          <PositionPreferences
            v-model="formState.positionPreferences"
            :hasError="touched.positionPreferences && formState.positionPreferences.length === 0"
          />
        </fieldset>

        <!-- STEP 2: Availability -->
        <fieldset v-show="currentStep === 2" class="volunteer-stack" aria-labelledby="avail">
          <legend id="avail" class="section-title">Shift Availability</legend>
          <Availability
            v-model="formState.availability"
            :hasError="touched.availability && formState.availability.length === 0"
          />
        </fieldset>

        <!-- STEP 3: Agreement & Waiver -->
        <fieldset v-show="currentStep === 3" class="volunteer-stack" aria-labelledby="waiv">
          <legend id="waiv" class="section-title">Agreement & Waiver</legend>
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
        </fieldset>

        <!-- Error Summary -->
        <div v-if="stepHasError" class="validation-summary" role="alert" tabindex="-1" aria-live="assertive">
          <p class="summary-title">Please complete the required fields on this step:</p>
          <div class="tags">
            <span
              v-for="err in (currentStep === 0 ? step0Errors : currentStep === 1 ? step1Errors : currentStep === 2 ? step2Errors : step3Errors)"
              :key="err"
              class="tag is-danger"
            >
              {{ err }}
            </span>
          </div>
        </div>

        <div v-if="apiError" class="validation-summary error-alert">
          <p class="summary-title">Submission Error</p>
          <p>{{ apiError }}</p>
        </div>

        <!-- Wizard Navigation Controls -->
        <footer class="actions">
          <Button
            type="button"
            title="Back"
            color="white"
            size="large"
            @click="handlePrevStep"
            :disabled="currentStep === 0 || isSubmitting"
            style="border: 1px solid var(--color-primary); color: var(--color-primary)"
          />
          <Button
            v-if="currentStep < volunteerSteps.length - 1"
            type="button"
            title="Next"
            color="green"
            size="large"
            @click="handleNextStep"
            :disabled="isSubmitting"
          />
          <Button
            v-else
            type="submit"
            title="Submit Application"
            color="green"
            size="large"
            :loading="isSubmitting"
          />
        </footer>
      </form>
    </div>

    <FormSubmitted v-if="isSubmitted" @reset="handleReset" formType="volunteer" />
  </section>
</template>

<style scoped src="./Volunteer.css"></style>
