import { defineStore } from 'pinia'
import { computed, reactive, ref, toRaw } from 'vue'

import { useDemoMode } from '../composables/useDemoMode'
import { useMetrics } from '../composables/useMetrics'
import { API_ENDPOINTS } from '../constants/api'
import type { SurrenderFormState } from '../models/surrender-form'
import { getApiErrorMessage, PUBLIC_ORG_ID, withPublicOrgId } from '../utils/api'
import { getSurrenderValidationErrors } from './validation/surrenderValidation'

const getInitialSurrenderFormState = (): SurrenderFormState => ({
  fax_number: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  whenToSurrenderAnimal: '',
  animalName: '',
  animalSex: '',
  animalAge: '',
  animalOwnershipDuration: '',
  animalLocationFound: '',
  animalWhySurrendered: '',
  householdMembers: [{ age: '', gender: 'Female', count: 1 }],
  otherPetsInHousehold: '',
  animalsBehaviorTowardsKnownPeople: '',
  animalsBehaviorTowardsStrangers: '',
  animalsBehaviorTowardsKnownAnimals: '',
  commentsOnBehavior: '',
  animalsReactionToNewPeople: '',
  animalHouseTrained: '',
  animalSpendMajorityOfTime: '',
  animalLeftAloneDuration: '',
  animalWhenLeftAlone: '',
  animalLeftAloneBehaviors: '',
  animalHowItPlays: '',
  animalToysItLikes: '',
  animalGamesItLikes: '',
  animalScaredOfAnything: '',
  animalScaredOfAnythingExplanation: '',
  animalBadHabits: '',
  animalAllowedOnFurniture: '',
  animalSleepAtNight: '',
  animalBehaviorFoodOthers: '',
  animalBehaviorToysOthers: '',
  animalProblemsRidingInCar: '',
  animalProblemsRidingInCarExplanation: '',
  animalEscapedBefore: '',
  animalEscapedBeforeExplanation: '',
  animalEverAttackedPeople: '',
  animalEverAttackedPeopleExplanation: '',
  animalEverAttackedOtherCats: '',
  animalEverAttackedOtherCatsExplanation: '',
  animalEverAttackedOtherDogs: '',
  animalEverAttackedOtherDogsExplanation: '',
  animalVeterinarianList: '',
  animalVeterinarianYearlyVisits: '',
  animalSpayedNeutered: '',
  animalVaccinationHistory: '',
  animalVaccinationsCurrent: '',
  animalTestedHeartworm: '',
  animalTestedHeartwormExplanation: '',
  animalHeartwormPrevention: '',
  animalHeartwormPreventionExplanation: '',
  animalMicrochipped: '',
  animalMicrochippedExplanation: '',
  animalVetOrGroomerBehavior: '',
  animalVetMuzzled: '',
  animalPastOrPresentHealthProblems: '',
  animalPastOrPresentHealthProblemsExplanation: '',
  animalCurrentMedications: '',
  animalCurrentMedicationsExplanation: '',
  animalTypeOfFood: '',
  animalEatingFrequency: '',
  animalAmountOfFood: '',
  animalFoodTreats: '',
  animalFoodTreatsExplanation: '',
  additionalInformation: '',
  fullBodyPhotoOfAnimal: '',
  closeUpPhotoOfAnimalFace: '',
  copiesOfRecords: '',
})

export const useSurrenderStore = defineStore('surrender', () => {
  const { isDemoMode } = useDemoMode()
  const step = ref(0)
  const isSubmitted = ref(false)
  const isSubmitting = ref(false)
  const submissionError = ref<string | null>(null)
  const hasAttemptedSubmit = ref(false)
  const selectedAnimal = ref<'dog' | 'cat' | null>(null)

  const formState = reactive<SurrenderFormState>(getInitialSurrenderFormState())

  const STORAGE_KEY = 'adohr_surrender_form_draft_v1'

  const hasSavedDraft = computed(() => {
    return Boolean(
      selectedAnimal.value ||
      formState.firstName ||
      formState.email ||
      formState.animalName ||
      formState.phoneNumber,
    )
  })

  const clearPersistedState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear surrender draft', e)
    }
  }

  const serializableTextFields = () => {
    const raw = toRaw(formState)
    const {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      fullBodyPhotoOfAnimal: _fullBodyPhotoOfAnimal,
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      closeUpPhotoOfAnimalFace: _closeUpPhotoOfAnimalFace,
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      copiesOfRecords: _copiesOfRecords,
      ...textFields
    } = raw
    const serialized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(textFields)) {
      serialized[key] =
        Array.isArray(value) && value.every((v) => typeof v === 'string') ? value.join(', ') : value
    }
    return serialized
  }

  const persistState = () => {
    try {
      const payload = JSON.stringify({
        step: step.value,
        selectedAnimal: selectedAnimal.value,
        formState: serializableTextFields(),
      })
      localStorage.setItem(STORAGE_KEY, payload)
    } catch (e) {
      console.error('Failed to persist surrender form state', e)
    }
  }

  const initFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        step.value = parsed.step || 0
        selectedAnimal.value = parsed.selectedAnimal || null
        Object.assign(formState, parsed.formState)
      }
    } catch (e) {
      console.error('Failed to restore surrender form state', e)
    }
  }

  initFromStorage()

  const validationErrors = computed(() => {
    return getSurrenderValidationErrors({
      step: step.value,
      selectedAnimal: selectedAnimal.value,
      formState,
    })
  })

  const isStepValid = computed(() => {
    if (isDemoMode.value) return true
    if (step.value === 0) return !!selectedAnimal.value
    if (step.value === 1) return validationErrors.value.length === 0
    return true
  })

  const { submitMetric } = useMetrics()

  const nextStep = () => {
    hasAttemptedSubmit.value = true
    if (!isStepValid.value) return false

    if (step.value === 3 && selectedAnimal.value === 'dog') {
      step.value += 2
    } else {
      step.value++
    }

    submitMetric('form_step', { form: 'surrender', step: step.value })
    persistState()
    hasAttemptedSubmit.value = false
    return true
  }

  const prevStep = () => {
    if (step.value > 0) {
      if (step.value === 5 && selectedAnimal.value === 'dog') {
        step.value -= 2
      } else {
        step.value--
      }
      persistState()
    }
  }

  const clearFormData = () => {
    Object.assign(formState, getInitialSurrenderFormState())
    selectedAnimal.value = null
  }

  const resetForm = () => {
    step.value = 0
    isSubmitted.value = false
    hasAttemptedSubmit.value = false
    submissionError.value = null
    clearFormData()
    clearPersistedState()
  }

  const isFile = (val: unknown): val is File => {
    return val instanceof File
  }

  const hasFiles = () => {
    const raw = toRaw(formState)
    if (isFile(raw.fullBodyPhotoOfAnimal)) return true
    if (isFile(raw.closeUpPhotoOfAnimalFace)) return true
    if (Array.isArray(raw.copiesOfRecords) && raw.copiesOfRecords.some(isFile)) return true
    return false
  }

  const buildFormData = () => {
    const raw = toRaw(formState)
    const fd = new FormData()
    fd.append('orgId', PUBLIC_ORG_ID)
    fd.append('data', JSON.stringify({ orgId: PUBLIC_ORG_ID, ...serializableTextFields() }))

    const fullBody = toRaw(raw.fullBodyPhotoOfAnimal)
    const closeUp = toRaw(raw.closeUpPhotoOfAnimalFace)
    const records = toRaw(raw.copiesOfRecords)

    if (isFile(fullBody)) fd.append('fullBodyPhoto', fullBody)
    if (isFile(closeUp)) fd.append('closeUpPhoto', closeUp)
    if (Array.isArray(records)) {
      for (const file of records) {
        const rawFile = toRaw(file)
        if (isFile(rawFile)) fd.append('records', rawFile)
      }
    }
    return fd
  }

  const submitApplication = async () => {
    if (isSubmitting.value) return
    isSubmitting.value = true
    submissionError.value = null

    try {
      if (isDemoMode.value) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        isSubmitted.value = true
        clearFormData()
        clearPersistedState()
        return
      }

      isSubmitted.value = false
      const useMultipart = hasFiles()
      const response = await fetch(withPublicOrgId(API_ENDPOINTS.SURRENDER_APPLICATION), {
        method: 'POST',
        headers: {
          ...(useMultipart ? {} : { 'Content-Type': 'application/json' }),
          'X-Org-Id': PUBLIC_ORG_ID,
        },
        body: useMultipart
          ? buildFormData()
          : JSON.stringify({ orgId: PUBLIC_ORG_ID, ...serializableTextFields() }),
      })

      if (!response.ok) {
        throw new Error(
          await getApiErrorMessage(response, 'There was an error submitting your application.'),
        )
      }

      submitMetric('form_submit', { form: 'surrender' })
      isSubmitted.value = true
      clearFormData()
      clearPersistedState()
    } catch (error) {
      console.error('Error submitting form:', error)
      submissionError.value =
        error instanceof Error
          ? error.message
          : 'There was an error submitting your application. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formState,
    step,
    isSubmitted,
    isSubmitting,
    submissionError,
    hasAttemptedSubmit,
    selectedAnimal,
    validationErrors,
    isStepValid,
    hasSavedDraft,
    persistState,
    clearPersistedState,
    nextStep,
    prevStep,
    submitApplication,
    resetForm,
  }
})
