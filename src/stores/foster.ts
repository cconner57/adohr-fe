import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import { FOSTER_PAGES } from '@/constants/fosterQuestions'
import type { IFosterFormState, TFosterSpecies } from '@/models/foster-form'
import { getApiErrorMessage, PUBLIC_ORG_ID, withPublicOrgId } from '@/utils/api'

const FOSTER_STORAGE_KEY = 'adohr_foster_form_v1'

interface IFosterPersistedState {
  speciesPreference: TFosterSpecies
  currentStep: number
  answers: Record<string, string>
}

const defaultState = (): IFosterFormState => ({
  speciesPreference: '',
  currentStep: 1,
  answers: {},
  isSubmitted: false,
  isSubmitting: false,
  apiError: null,
})

const toSnakeCase = (input: string) => {
  const cleaned = input
    .replace(/\([^)]*\)/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase()

  if (!cleaned) return ''

  return cleaned.split(/\s+/).slice(0, 8).join('_')
}

const createReadableAnswerKeyMap = () => {
  const keyMap = new Map<string, string>()
  const usedKeys = new Set<string>()

  FOSTER_PAGES.forEach((page) => {
    page.questions.forEach((question) => {
      const labelKey = toSnakeCase(question.label)
      const baseKey = labelKey ? `p${page.id}_${labelKey}` : `p${page.id}_field_${question.id}`

      let uniqueKey = baseKey
      let counter = 2
      while (usedKeys.has(uniqueKey)) {
        uniqueKey = `${baseKey}_${counter}`
        counter += 1
      }

      usedKeys.add(uniqueKey)
      keyMap.set(question.id, uniqueKey)
    })
  })

  return keyMap
}

const readableAnswerKeyMap = createReadableAnswerKeyMap()

const toReadableAnswers = (answers: Record<string, string>) => {
  return Object.entries(answers).reduce<Record<string, string>>((acc, [id, value]) => {
    const fallbackKey = `field_${id.replace(/\W+/g, '_').toLowerCase()}`
    const readableKey = readableAnswerKeyMap.get(id) ?? fallbackKey
    acc[readableKey] = value
    return acc
  }, {})
}

const parsePersisted = (raw: string | null): IFosterPersistedState | null => {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as IFosterPersistedState
    if (!parsed || typeof parsed !== 'object') return null

    const currentStep = Number(parsed.currentStep)
    if (!Number.isFinite(currentStep)) return null

    if (!parsed.answers || typeof parsed.answers !== 'object') return null

    return {
      speciesPreference: parsed.speciesPreference ?? '',
      currentStep,
      answers: parsed.answers,
    }
  } catch {
    return null
  }
}

export const useFosterStore = defineStore('foster', () => {
  const state = ref<IFosterFormState>(defaultState())

  const hasSavedProgress = ref(false)

  const loadProgress = () => {
    const persisted = parsePersisted(localStorage.getItem(FOSTER_STORAGE_KEY))
    if (!persisted) {
      hasSavedProgress.value = false
      return
    }

    const rawStep = Math.max(1, Number(persisted.currentStep) || 1)
    let mappedStep = 1
    if (rawStep >= 10) mappedStep = 4
    else if (rawStep >= 6) mappedStep = 3
    else if (rawStep >= 4) mappedStep = 2
    else mappedStep = rawStep
    state.value.currentStep = Math.min(4, Math.max(1, mappedStep))
    state.value.answers = persisted.answers
    hasSavedProgress.value = true
  }

  const setSpeciesPreference = (value: TFosterSpecies) => {
    state.value.speciesPreference = value
  }

  const setAnswer = (id: string, value: string) => {
    state.value.answers[id] = value
  }

  const saveProgressOnNext = () => {
    const payload: IFosterPersistedState = {
      speciesPreference: state.value.speciesPreference,
      currentStep: state.value.currentStep,
      answers: state.value.answers,
    }

    localStorage.setItem(FOSTER_STORAGE_KEY, JSON.stringify(payload))
    hasSavedProgress.value = true
  }

  const goToNextStep = () => {
    if (state.value.currentStep >= 4) return

    saveProgressOnNext()
    state.value.currentStep += 1
  }

  const goToPreviousStep = () => {
    if (state.value.currentStep <= 1) return
    state.value.currentStep -= 1
  }

  const startNewForm = () => {
    localStorage.removeItem(FOSTER_STORAGE_KEY)
    state.value = defaultState()
    hasSavedProgress.value = false
  }

  const submitApplication = async () => {
    state.value.apiError = null
    state.value.isSubmitting = true

    try {
      const fullName = (state.value.answers.q1 ?? '').trim()
      const nameParts = fullName.split(/\s+/).filter(Boolean)
      const firstName = nameParts[0] ?? ''
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''
      const email = (state.value.answers.q5 ?? '').trim()

      const response = await fetch(withPublicOrgId(API_ENDPOINTS.FOSTER_APPLICATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': PUBLIC_ORG_ID,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          speciesPreference: state.value.speciesPreference,
          answers: toReadableAnswers(state.value.answers),
        }),
      })

      if (!response.ok) {
        const fallbackMessage =
          response.status === 503 || response.status >= 500
            ? 'Our application service is temporarily unavailable. Please try again in a few minutes.'
            : 'Unable to submit foster application right now. Please try again.'

        state.value.apiError = await getApiErrorMessage(response, fallbackMessage)
        return false
      }

      localStorage.removeItem(FOSTER_STORAGE_KEY)
      state.value.isSubmitted = true
      hasSavedProgress.value = false
      return true
    } catch {
      state.value.apiError = 'Network error. Please try again later.'
      return false
    } finally {
      state.value.isSubmitting = false
    }
  }

  const progressLabel = computed(() => `Stage ${state.value.currentStep} of 4`)

  const hasSavedDraft = computed(() => {
    return Boolean(
      hasSavedProgress.value ||
      state.value.speciesPreference ||
      Object.keys(state.value.answers).length > 0,
    )
  })

  const persistState = () => {
    saveProgressOnNext()
  }

  const clearPersistedState = () => {
    startNewForm()
  }

  return {
    state,
    hasSavedProgress,
    hasSavedDraft,
    progressLabel,
    loadProgress,
    persistState,
    clearPersistedState,
    setSpeciesPreference,
    setAnswer,
    saveProgressOnNext,
    goToNextStep,
    goToPreviousStep,
    startNewForm,
    submitApplication,
  }
})
