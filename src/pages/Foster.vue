<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import FormSubmitted from '@/components/common/form-submitted/FormSubmitted.vue'
import Button from '@/components/common/ui/Button.vue'
import InputSelectGroup from '@/components/common/ui/InputSelectGroup.vue'
import FosterAgreement from '@/components/foster/FosterAgreement.vue'
import FosterQuestionCard from '@/components/foster/FosterQuestionCard.vue'
import AdoptionSteps from '@/components/pet-adoption/adoption-steps/AdoptionSteps.vue'
import ApplicationHeader from '@/components/volunteer/application-header/ApplicationHeader.vue'
import { FOSTER_PAGES } from '@/constants/fosterQuestions'
import type { IFosterQuestion, TFosterSpecies } from '@/models/foster-form'
import { useFosterStore } from '@/stores/foster'

const router = useRouter()
const fosterStore = useFosterStore()
const { state, hasSavedDraft } = storeToRefs(fosterStore)
const { clearPersistedState } = fosterStore

const validationError = ref<string | null>(null)
const attemptedValidation = ref(false)

onMounted(() => {
  fosterStore.loadProgress()
})

const currentPage = computed(() => FOSTER_PAGES[state.value.currentStep - 1])

const currentVisibleQuestions = computed(() => {
  const species = state.value.speciesPreference
  const page = currentPage.value
  const housingStatus = (state.value.answers.q11 ?? '').trim()
  const hasCurrentPets = (state.value.answers.q30_hasCurrentPets ?? '').trim()
  const hasPastPets = (state.value.answers.q40_hasPastPets ?? '').trim()

  return page.questions.filter((q) => {
    if (q.id === 'q12') return housingStatus === 'Rent' || housingStatus === 'Live with family'
    if (page.id === 4 && q.id !== 'q30_hasCurrentPets') return hasCurrentPets === 'Yes'
    if (page.id === 5 && q.id !== 'q40_hasPastPets') return hasPastPets === 'Yes'

    const scope = q.speciesScope ?? 'all'
    if (scope === 'all') return true
    if (species === 'both') return true
    return scope === species
  })
})

const isQuestionRequired = (question: IFosterQuestion) => {
  if (currentPage.value.id === 4) {
    return (
      question.id === 'q30_hasCurrentPets' ||
      state.value.answers.q30_hasCurrentPets?.trim() === 'Yes'
    )
  }
  if (currentPage.value.id === 5) {
    return (
      question.id === 'q40_hasPastPets' || state.value.answers.q40_hasPastPets?.trim() === 'Yes'
    )
  }
  return !!question.required
}

const getTodayLocalIsoDate = () => {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10)
}

const getSpeciesText = () => {
  const pref = state.value.speciesPreference
  if (pref === 'cat') return 'cat'
  if (pref === 'dog') return 'dog'
  return 'pet'
}

const questionLabel = (question: IFosterQuestion) => {
  if (question.id === 'q39') {
    const pref = state.value.speciesPreference
    if (pref === 'cat') return 'Has your current pet(s) lived with other cats before?'
    if (pref === 'dog') return 'Has your current pet(s) lived with other dogs before?'
    return 'Has your current pet(s) lived with other dogs and cats before?'
  }
  const speciesText = getSpeciesText()
  return question.label
    .replace(/this species/g, speciesText)
    .replace(/This species/g, speciesText.charAt(0).toUpperCase() + speciesText.slice(1))
}

const getQuestionValidationIssue = (question: IFosterQuestion) => {
  const value = state.value.answers[question.id] ?? ''
  const label = questionLabel(question).replace(/^Page\s+\d+:\s*/, '')

  if (isQuestionRequired(question) && !value.trim()) return label
  if (question.type === 'email' && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
    return label

  if (question.id === 'q2' && value.trim()) {
    const date = new Date(`${value}T00:00:00`)
    const now = new Date()
    let age = now.getFullYear() - date.getFullYear()
    if (
      now.getMonth() < date.getMonth() ||
      (now.getMonth() === date.getMonth() && now.getDate() < date.getDate())
    )
      age--
    if (age < 18) return label
  }

  if (
    (question.id === 'q94_date' || question.id === 'q95_date') &&
    value.trim() &&
    value !== getTodayLocalIsoDate()
  ) {
    return `Acknowledgment date must be today`
  }

  return null
}

const validationErrors = computed(() => {
  if (!attemptedValidation.value) return []
  const issues = new Set<string>()
  if (state.value.currentStep === 1 && !state.value.speciesPreference)
    issues.add('Foster Preference')
  currentVisibleQuestions.value.forEach((q) => {
    const issue = getQuestionValidationIssue(q)
    if (issue) issues.add(issue)
  })
  return Array.from(issues)
})

const validateCurrentPage = () => {
  attemptedValidation.value = true
  if (validationErrors.value.length > 0) return false
  attemptedValidation.value = false
  validationError.value = null
  return true
}

const onNext = () => {
  if (validateCurrentPage()) {
    fosterStore.goToNextStep()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    setTimeout(() => {
      const errorSummary = document.querySelector('.validation-summary') as HTMLElement
      if (errorSummary) errorSummary.focus()
    }, 0)
  }
}

const onBack = () => {
  fosterStore.goToPreviousStep()
  attemptedValidation.value = false
  validationError.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const onSubmit = async () => {
  if (validateCurrentPage()) {
    await fosterStore.submitApplication()
    validationError.value = state.value.apiError ?? null
  }
}

const onReset = async () => {
  fosterStore.startNewForm()
  await router.push('/')
}

const handleClearDraft = () => {
  clearPersistedState()
}

watch(
  () => [state.value.speciesPreference, state.value.answers],
  () => {
    fosterStore.persistState()
  },
  { deep: true },
)

const getInputType = (type: string) => {
  if (['email', 'tel', 'date', 'number'].includes(type)) return type
  return 'text'
}

const fosterStepLabels = [
  'Profile',
  'Home',
  'Environment',
  'Pets',
  'History',
  'Skills',
  'Care',
  'Commitment',
  'Scenarios',
  'Agreement',
]
</script>

<template>
  <section class="page-shell">
    <div v-if="!state.isSubmitted" class="form-container">
      <form
        class="form-card"
        :style="{ '--step-prefix': `'${String(state.currentStep).padStart(2, '0')}'` }"
        aria-label="Foster Application"
        novalidate
        @submit.prevent
      >
        <ApplicationHeader
          header-title="Foster"
          :header-text="
            state.currentStep === 1 ? 'Thank you for opening your home to a rescue pet.' : undefined
          "
        />

        <section class="progress-panel">
          <AdoptionSteps :currentStep="state.currentStep - 1" :steps="fosterStepLabels" />
        </section>

        <!-- Draft Auto-Save Banner -->
        <div v-if="hasSavedDraft" class="draft-badge-bar">
          <span class="draft-indicator">
            <span class="dot"></span>
            Draft auto-saved · Step {{ state.currentStep }} of {{ fosterStepLabels.length }}
          </span>
          <button type="button" class="clear-draft-btn" @click="handleClearDraft">
            Clear Draft
          </button>
        </div>

        <fieldset v-if="state.currentStep === 1" class="section-block species">
          <legend class="section-title">Foster Preference</legend>
          <p class="section-copy">What species are you currently available to foster?</p>
          <InputSelectGroup
            label=""
            :options="[
              { label: 'Cats', value: 'cat' },
              { label: 'Dogs', value: 'dog' },
              { label: 'Both', value: 'both' },
            ]"
            :modelValue="state.speciesPreference"
            :hasError="attemptedValidation && state.currentStep === 1 && !state.speciesPreference"
            @update:modelValue="
              (val) => fosterStore.setSpeciesPreference((val as TFosterSpecies) ?? '')
            "
          />
        </fieldset>

        <fieldset class="section-block">
          <legend v-if="state.currentStep < 10" class="section-title">
            {{ currentPage.title.replace(/^Page\s+\d+:\s*/, '') }}
          </legend>
          <legend v-else class="section-title">
            Foster Care Agreement & Release
          </legend>

          <div v-if="state.currentStep < 10" class="questions-grid">
            <FosterQuestionCard
              v-for="question in currentVisibleQuestions"
              :key="question.id"
              :question="question"
              :modelValue="state.answers[question.id] ?? ''"
              :hasError="attemptedValidation && !!getQuestionValidationIssue(question)"
              :inputType="getInputType(question.type)"
              :questionLabel="questionLabel(question)"
              @update:modelValue="(val) => fosterStore.setAnswer(question.id, val)"
              :class="{
                'full-row':
                  (state.currentStep === 4 && question.id === 'q30_hasCurrentPets') ||
                  (state.currentStep === 5 && question.id === 'q40_hasPastPets'),
              }"
            />
          </div>

          <FosterAgreement
            v-else
            :answers="state.answers"
            :getVisibleQuestion="(id) => currentVisibleQuestions.find((q) => q.id === id)"
            :questionHasError="(q) => attemptedValidation && !!getQuestionValidationIssue(q)"
            @update-answer="(id, val) => fosterStore.setAnswer(id, val)"
          />
        </fieldset>

        <div
          v-if="attemptedValidation && validationErrors.length > 0"
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

        <div v-if="validationError" class="validation-summary error-alert" role="alert">
          <p class="summary-title">Submission Error</p>
          <p>{{ validationError }}</p>
        </div>

        <footer class="actions">
          <Button
            type="button"
            title="Back"
            color="white"
            size="large"
            @click="onBack"
            :disabled="state.currentStep === 1"
            style="border: 1px solid var(--color-primary); color: var(--color-primary)"
          />
          <Button
            v-if="state.currentStep < 10"
            type="button"
            title="Next"
            color="green"
            size="large"
            @click="onNext"
          />
          <Button
            v-else
            type="button"
            title="Submit Application"
            color="green"
            size="large"
            @click="onSubmit"
            :loading="state.isSubmitting"
          />
        </footer>
      </form>
    </div>
    <FormSubmitted v-else formType="foster" @reset="onReset" />
  </section>
</template>

<style scoped src="./Foster.css"></style>
