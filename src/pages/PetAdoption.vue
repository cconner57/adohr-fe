<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive } from 'vue'
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
} = storeToRefs(adoptionStore)
const { selectedPet } = storeToRefs(petStore)

const { prevStep, resetForm } = adoptionStore

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
    globalThis.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
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
const secondPetName = computed(() => {
  if (!formState.value.secondPetId) return null
  return petStore.currentPets.find((p) => p.id === formState.value.secondPetId)?.name
})
</script>

<template>
  <section class="page-shell">
    <section v-if="!isSubmitted" class="form-card" aria-labelledby="form-title">
      <ApplicationHeader
        :header-title="species === 'cat' ? 'Cat' : 'Dog'"
        :header-text="headerText"
      />
      <AdoptionSteps v-if="!isCatIntroStep" :currentStep="visibleStep" :steps="adoptionSteps" />
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

      <div v-if="hasAttemptedSubmit && validationErrors.length > 0" class="validation-summary">
        <p class="summary-title">Please complete the following required fields:</p>
        <div class="tags">
          <span v-for="err in validationErrors" :key="err" class="tag is-danger">{{ err }}</span>
        </div>
      </div>

      <div v-if="submissionError" class="validation-summary error-summary">
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

    <FormSubmitted
      v-else
      @reset="handleReset"
      title="Application Submitted"
      text="Thank you for your application! We will review it as soon as possible."
      form-type="adoption"
    />
  </section>
</template>

<style scoped lang="css">
.page-shell {
  min-height: 100vh;
  background-color: var(--color-primary);
  padding: 9rem var(--layout-padding-side) 64px;
  container-type: inline-size;
  container-name: shell;

  @media (width <= 440px) {
    padding: 6rem 16px 32px;
  }

  .form-card {
    max-width: 1600px;
    margin: 0 auto;
    background: var(--text-inverse);
    color: var(--text-primary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    box-shadow: var(--shadow-lg);
    padding: 48px 48px 32px;

    @container shell (max-width: 800px) {
      padding: 32px 24px;
    }

    fieldset {
      border: 0;
      margin: 24px 0;
      padding: 0;

      .section-title {
        font-weight: 800;
        font-size: 1.15rem;
        letter-spacing: -0.01em;
        margin: 18px 0 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      }
    }

    .cat-name-display {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.6rem;
      margin: 0 auto 2rem;
      padding: 0.6rem 1.4rem;
      width: fit-content;
      max-width: 100%;
      border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      border-radius: var(--radius-full);

      h2 {
        font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-secondary);
      }

      p {
        font-size: 1.3rem;
        font-weight: 800;
        letter-spacing: -0.015em;
        color: var(--color-secondary);
      }
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 28px;
      padding-top: 24px;
      border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

      @media (width <= 600px) {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }

    .second-pet-selection {
      max-width: 600px;
      margin: 1rem auto 2rem;
      padding: 1.5rem;
      background: oklch(from var(--color-secondary) 97% 0.015 h);
      border-radius: var(--radius-lg);
      text-align: center;
      border: 1px dashed oklch(from var(--color-secondary) 62% 0.12 h);

      .selection-text {
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;

      @container shell (max-width: 650px) {
        grid-template-columns: 1fr;
      }
    }

    .validation-summary {
      background-color: var(--color-danger-surface, oklch(from var(--color-danger) 98% 0.02 h));
      border: 1px solid var(--color-danger);
      color: var(--color-danger);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: center;

      .summary-title {
        font-weight: 700;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
      }

      .tag.is-danger {
        background-color: var(--color-danger-weak, oklch(from var(--color-danger) 96% 0.04 h));
        color: var(--color-danger);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.9rem;
        font-weight: 600;
      }
    }
  }
}
</style>
