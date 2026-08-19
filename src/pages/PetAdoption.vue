<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

import FormSubmitted from '@/components/common/form-submitted/FormSubmitted.vue'
import Button from '@/components/common/ui/Button.vue'
import InputField from '@/components/common/ui/InputField.vue'
import Select from '@/components/common/ui/Select.vue'
import AdoptionSteps from '@/components/pet-adoption/adoption-steps/AdoptionSteps.vue'
import CatAdoptionInfoSection from '@/components/pet-adoption/cat-adoption/CatAdoptionInfoSection.vue'
import CurrentPetsSection from '@/components/pet-adoption/cat-adoption/CurrentPetsSection.vue'
import GeneralSection from '@/components/pet-adoption/cat-adoption/GeneralSection.vue'
import HomeSection from '@/components/pet-adoption/cat-adoption/HomeSection.vue'
import NewCatSection from '@/components/pet-adoption/cat-adoption/NewCatSection.vue'
import OtherSection from '@/components/pet-adoption/cat-adoption/OtherSection.vue'
import PastPetsSection from '@/components/pet-adoption/cat-adoption/PastPetsSection.vue'
import SummarySection from '@/components/pet-adoption/cat-adoption/SummarySection.vue'
import ApplicationHeader from '@/components/volunteer/application-header/ApplicationHeader.vue'
import { useMetrics } from '@/composables/useMetrics'
import { useAdoptionStore } from '@/stores/adoption'
import { usePetStore } from '@/stores/pets'
import { vibrate } from '@/utils/haptics'

const router = useRouter()
const adoptionStore = useAdoptionStore()
const petStore = usePetStore()

const {
  formState,
  step,
  isSubmitting,
  isSubmitted,
  hasAttemptedSubmit,
  validationErrors,
  submissionError,
  hasSavedDraft,
} = storeToRefs(adoptionStore)
const { selectedPet } = storeToRefs(petStore)

const { prevStep, resetForm, clearPersistedState } = adoptionStore

const { submitMetric } = useMetrics()

const species = computed(() => selectedPet.value?.species ?? 'cat')
const animalLabel = computed(() => (species.value === 'dog' ? 'dog' : 'cat'))
const isCatFlow = computed(() => species.value === 'cat')
const isCatIntroStep = computed(() => isCatFlow.value && step.value === 0)
const visibleStep = computed(() => (isCatFlow.value ? Math.max(step.value - 1, 0) : step.value))

const isKitten = computed(() => {
  const fullPet = petStore.currentPets.find((p) => p.id === selectedPet.value?.id)
  const dob = fullPet?.physical.dateOfBirth
  if (!dob) return false
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  return new Date(dob) > sixMonthsAgo
})
const adoptionSteps = computed(() => {
  if (species.value === 'dog') {
    return ['General', 'Home', 'New Dog', 'Past Pets', 'Other', 'Summary']
  }

  return ['General', 'Home', 'New Cat', 'Current Pets', 'Past Pets', 'Other', 'Summary']
})
const finalStep = computed(() => (isCatFlow.value ? 7 : 6))

const availablePetsOptions = computed(() => {
  if (!selectedPet.value) return []
  return petStore.currentPets
    .filter(
      (p) =>
        p.species.toLowerCase() === selectedPet.value?.species.toLowerCase() &&
        p.id !== selectedPet.value?.id,
    )
    .map((p) => ({ label: p.name, value: p.id }))
})

const headerText = computed(() => {
  if (species.value === 'cat') {
    if (!isCatIntroStep.value) {
      return undefined
    }

    return 'This application is intended as a means to match the right cat with the right home. The more detail you provide, the better. Most adoptable pets are spayed/neutered, vaccinated, and microchipped. For younger kittens, we offer a foster-to-adopt program where you take them home now and return for scheduled vet care until they are ready for official adoption. Typical adoption fees are $300 for kittens and $250 for adults. Adoption fees are tax-deductible donations, not purchase prices. Thank you for considering adoption!'
  }

  return 'This application is intended as a means to match the right dog with the right home. The more detail you provide, the better. Most adoptable pets are spayed/neutered, vaccinated, and microchipped. Typical adoption fees are $450 for puppies, $400 for adults, and $350 for seniors. Adoption fees are tax-deductible donations, not purchase prices. Thank you for considering adoption!'
})

onMounted(async () => {
  if (selectedPet.value) {
    submitMetric('pet_view', {
      petId: selectedPet.value.id,
      petName: selectedPet.value.petName,
      species: selectedPet.value.species,
    })
    submitMetric('form_start', { form: 'adoption', petId: selectedPet.value.id })
  }

  // Ensure currentPets is populated for second pet selection
  if (petStore.currentPets.length === 0) {
    await petStore.fetchPetsList()
  }
})

const touched = reactive<Record<string, boolean>>({})

const handleBlur = (field: string) => {
  touched[field] = true
}

const handleSubmit = async () => {
  if (!adoptionStore.isStepValid) {
    hasAttemptedSubmit.value = true
    setTimeout(() => {
      const errorSummary = document.querySelector('.validation-summary') as HTMLElement
      if (errorSummary) errorSummary.focus()
    }, 0)
    return
  }

  if (step.value < finalStep.value) {
    adoptionStore.nextStep()
    globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    submitMetric('form_submit', { form: 'adoption', petId: selectedPet.value?.id })
    console.log('Submitting form...')
    vibrate(50)
    const isSubmissionSuccessful = await adoptionStore.submitApplication()
    if (isSubmissionSuccessful) {
      petStore.clearSelectedPet()
    }
    globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleReset = async () => {
  await router.push('/')
  resetForm()
}

const handleClearDraft = () => {
  clearPersistedState()
  resetForm()
}

watch(
  formState,
  () => {
    adoptionStore.persistState()
  },
  { deep: true },
)

const secondPetName = computed(() => {
  if (!formState.value.secondPetId) return null
  return petStore.currentPets.find((p) => p.id === formState.value.secondPetId)?.name
})
</script>

<template>
  <section class="page-shell">
    <div v-if="!isSubmitted" class="dossier">
      <aside class="rail" aria-label="Application progress">
        <p class="rail-code">Intake · Adoption</p>
        <AdoptionSteps
          v-if="!isCatIntroStep"
          :currentStep="visibleStep"
          :steps="adoptionSteps"
          vertical
        />
        <p v-else class="rail-note">
          Read the introduction, then begin — your answers help us make the right match.
        </p>
        <p v-if="!isCatIntroStep" class="rail-count">
          Step {{ visibleStep + 1 }} of {{ adoptionSteps.length }}
        </p>
      </aside>
      <section class="form-card" aria-labelledby="form-title">
        <ApplicationHeader
          :header-title="species === 'cat' ? 'Cat' : 'Dog'"
          :header-text="headerText"
        />

        <!-- Draft Auto-Save Banner -->
        <div v-if="hasSavedDraft" class="draft-badge-bar">
          <span class="draft-indicator">
            <span class="dot"></span>
            Draft auto-saved · Step {{ visibleStep + 1 }} of {{ adoptionSteps.length }}
          </span>
          <button type="button" class="clear-draft-btn" @click="handleClearDraft">
            Clear Draft
          </button>
        </div>
        <div v-show="!isCatIntroStep" class="cat-name-display">
          <h2>Adopting Pet{{ secondPetName ? 's' : '' }}:</h2>
          <p>
            <template v-if="selectedPet?.id === 'unspecified'">
              Custom: {{ formState.generalPetName || '' }}
            </template>
            <template v-else>
              {{ selectedPet?.petName || selectedPet?.name
              }}{{ secondPetName ? ` & ${secondPetName}` : '' }}
            </template>
          </p>
        </div>
        <CatAdoptionInfoSection v-show="isCatIntroStep" :is-kitten="isKitten" />
        <GeneralSection
          v-show="(!isCatFlow && step === 0) || (isCatFlow && step === 1)"
          v-model="formState"
          :touched="touched"
          :handleBlur="handleBlur"
          :hasAttemptedSubmit="hasAttemptedSubmit"
        />
        <HomeSection
          v-show="(!isCatFlow && step === 1) || (isCatFlow && step === 2)"
          v-model="formState"
          :touched="touched"
          :handleBlur="handleBlur"
          :hasAttemptedSubmit="hasAttemptedSubmit"
          :animalLabel="animalLabel"
        />
        <NewCatSection
          v-show="(!isCatFlow && step === 2) || (isCatFlow && step === 3)"
          v-model="formState"
          :touched="touched"
          :handleBlur="handleBlur"
          :hasAttemptedSubmit="hasAttemptedSubmit"
          :animalLabel="animalLabel"
        />
        <CurrentPetsSection
          v-show="(!isCatFlow && step === 3) || (isCatFlow && step === 4)"
          v-model="formState"
          :touched="touched"
          :handleBlur="handleBlur"
          :hasAttemptedSubmit="hasAttemptedSubmit"
          :animalLabel="animalLabel"
        />
        <PastPetsSection
          v-show="(!isCatFlow && step === 4) || (isCatFlow && step === 5)"
          v-model="formState"
          :touched="touched"
          :handleBlur="handleBlur"
          :hasAttemptedSubmit="hasAttemptedSubmit"
        />
        <OtherSection
          v-show="(!isCatFlow && step === 5) || (isCatFlow && step === 6)"
          v-model="formState"
          :touched="touched"
          :handleBlur="handleBlur"
          :hasAttemptedSubmit="hasAttemptedSubmit"
          :animalLabel="animalLabel"
        />
        <SummarySection
          v-show="(!isCatFlow && step === 6) || (isCatFlow && step === 7)"
          v-model="formState"
          :touched="touched"
          :handleBlur="handleBlur"
          :hasAttemptedSubmit="hasAttemptedSubmit"
          :animalLabel="animalLabel"
        />

        <div
          v-if="hasAttemptedSubmit && validationErrors.length > 0"
          class="validation-summary"
          tabindex="-1"
          role="alert"
          aria-live="assertive"
        >
          <p class="summary-title">Please complete the following required fields:</p>
          <div class="tags">
            <span v-for="err in validationErrors" :key="err" class="tag is-danger">{{ err }}</span>
          </div>
        </div>

        <div
          v-if="submissionError"
          class="validation-summary error-summary"
          tabindex="-1"
          role="alert"
          aria-live="assertive"
        >
          <p class="summary-title">There was an error submitting your application:</p>
          <p class="error-message">{{ submissionError }}</p>
        </div>

        <!-- General Application Flow: Required Interested Pet Name -->
        <div v-if="step === 0 && selectedPet?.id === 'unspecified'" class="second-pet-selection">
          <InputField
            v-model="formState.generalPetName"
            :label="`Which ${animalLabel} are you interested in?`"
            placeholder="Enter pet name"
            required
            fullWidth
            :has-error="
              hasAttemptedSubmit && (!formState.generalPetName || !formState.generalPetName.trim())
            "
            @blur="handleBlur('generalPetName')"
          />
        </div>

        <!-- Specific Pet Flow: Optional Second Pet Selection -->
        <div
          v-else-if="
            step === 0 && selectedPet?.id !== 'unspecified' && availablePetsOptions.length > 0
          "
          class="second-pet-selection"
        >
          <p class="selection-text">
            Would you like to add a second {{ animalLabel }} to this application?
          </p>
          <Select
            v-model="formState.secondPetId"
            :options="[{ label: 'None', value: '' }, ...availablePetsOptions]"
            placeholder="Select a second pet (optional)"
            fullWidth
          />
        </div>

        <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {{
            `Step ${visibleStep + 1} of ${adoptionSteps.length}: ${adoptionSteps[visibleStep] || 'Application'}`
          }}
        </div>

        <div class="actions">
          <Button
            @click="prevStep"
            title="Back"
            :color="'white'"
            size="large"
            style="border: 1px solid var(--color-primary); color: var(--color-primary)"
            :disabled="step === 0 || isSubmitted"
          />
          <Button
            @click="handleSubmit"
            type="submit"
            :title="step < finalStep ? 'Next' : 'Submit Application'"
            color="green"
            size="large"
            :loading="step === finalStep && isSubmitting"
            :disabled="isSubmitted || isSubmitting"
          />
        </div>
      </section>
    </div>

    <FormSubmitted
      v-else
      @reset="handleReset"
      title="Application Submitted"
      text="Thank you for your application! We will review it as soon as possible."
      form-type="adoption"
    />
  </section>
</template>

<style scoped src="./PetAdoption.css"></style>
