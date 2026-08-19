import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { useDemoMode } from '../composables/useDemoMode'
import { useMetrics } from '../composables/useMetrics'
import { API_ENDPOINTS } from '../constants/api'
import type { FormState } from '../models/adopt-form'
import { fetchWithRetry, getApiErrorMessage, withPublicOrgId } from '../utils/api'
import { usePetStore } from './pets'
import { getAdoptionValidationErrors } from './validation/adoptionValidation'

const getInitialFormState = (): FormState => ({
  fax_number: '',
  secondPetId: null,
  generalPetName: '',
  firstName: '',
  lastName: '',
  age: null,
  spouseFirstName: null,
  spouseLastName: null,
  roommatesNames: [''],
  childrenNamesAges: [{ name: '', age: '' }],
  currentPets: [{ name: '', speciesBreedSize: '', age: '', source: '', spayedNeutered: '', likesDogs: '' }],
  currentlyHavePets: null,
  pastPets: [{ name: '', speciesBreedSize: '', age: '', source: '', spayedNeutered: '', passedAwayReason: '' }],
  ownPetsBefore: null,
  email: null,
  address: null,
  addressLine2: null,
  city: null,
  state: null,
  zip: null,
  phoneNumber: null,
  cellPhoneNumber: null,
  adultMembersAgreed: null,
  homeType: null,
  homeOwnership: null,
  landlordName: null,
  landlordPhoneNumber: null,
  allowPets: null,
  breedRestrictionsWeightLimit: null,
  monthlyFee: null,
  allergies: null,
  primaryOwner: null,
  yearsAtAddress: null,
  previousAddress: null,
  expectToMove: null,
  travelPlan: null,
  catAccess: [],
  catIndoorOutdoor: null,
  catPreferenceBreed: null,
  catPreferencePhysical: null,
  catPreferencePersonality: null,
  catPreferenceNotWant: null,
  whyInterested: null,
  adoptionReason: null,
  ownCatBefore: null,
  ownKittenBefore: null,
  alreadyHaveVeterinarian: null,
  catAllowedHomeArea: null,
  catHomeAloneHours: null,
  catDisciplineType: null,
  catEscapeSteps: null,
  bredAnimalDescription: null,
  ownedDeclawedOrDebarked: null,
  movedWithPet: null,
  ownedSpecialNeedsPet: null,
  mobilityDevice: null,
  surrenderConditions: [],
  surrenderPlan: null,
  foodTypeBrand: null,
  affordVetCare: null,
  affordEmergencyCost: null,
  agreementSignature1: null,
  agreementSignature2: null,
  agreementSignature3: null,
  signatureData: null,
  dogWhySelected: null,
  dogHeardAbout: [],
  dogFencedBackyard: null,
  dogHasPool: null,
  dogPoolFence: null,
  dogHouseholdDescription: [],
  dogKeptLocation: [],
  dogSleepingLocation: [],
  dogAloneLocation: [],
  dogExercisePotty: null,
  dogCareResponsible: null,
  dogAnnualExpense: null,
  dogTravelArrangements: null,
  dogWillingToPottyTrain: null,
  dogTrainingExperience: [],
  dogWillingTrainingClass: null,
  dogConfinementTypes: [],
  dogBondingTime: null,
  dogDeniedOwnership: null,
})

export const useAdoptionStore = defineStore('adoption', () => {
  const { isDemoMode } = useDemoMode()
  const petStore = usePetStore()
  const step = ref(0)
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const hasAttemptedSubmit = ref(false)
  const submissionError = ref<string | null>(null)

  const formState = reactive<FormState>(getInitialFormState())

  const validationStep = computed(() => {
    if (petStore.selectedPet?.species === 'dog') {
      return step.value
    }
    return Math.max(step.value - 1, 0)
  })

  const validationErrors = computed(() => {
    return getAdoptionValidationErrors(
      validationStep.value,
      formState,
      petStore.selectedPet?.species ?? 'cat',
      petStore.selectedPet?.id === 'unspecified',
    )
  })

  const isStepValid = computed(() => {
    if (isDemoMode.value) return true
    return validationErrors.value.length === 0
  })

  const STORAGE_KEY = 'adohr_adoption_form_draft_v1'

  const hasSavedDraft = computed(() => {
    return Boolean(formState.firstName || formState.email || formState.address)
  })

  const clearPersistedState = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear persisted adoption draft', e)
    }
  }

  const persistState = () => {
    try {
      const payload = JSON.stringify({
        step: step.value,
        formState: formState,
      })
      sessionStorage.setItem(STORAGE_KEY, payload)
      localStorage.setItem(STORAGE_KEY, payload)
    } catch (e) {
      console.error('Failed to persist adoption form state', e)
    }
  }

  const initFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        step.value = parsed.step || 0
        Object.assign(formState, parsed.formState)
      }
    } catch (e) {
      console.error('Failed to restore adoption form state', e)
    }
  }

  initFromStorage()

  const { submitMetric } = useMetrics()

  const nextStep = () => {
    step.value++
    submitMetric('form_step', { form: 'adoption', step: step.value })
    persistState()
    hasAttemptedSubmit.value = false
    return true
  }

  const prevStep = () => {
    if (step.value > 0) {
      step.value--
      persistState()
    }
  }

  const clearFormData = () => {
    Object.assign(formState, getInitialFormState())
  }

  const resetForm = () => {
    isSubmitted.value = false
    hasAttemptedSubmit.value = false
    step.value = 0
    submissionError.value = null
    clearFormData()
    clearPersistedState()
  }

  const submitApplication = async (petId?: string) => {
    isSubmitting.value = true
    submissionError.value = null

    try {
      const payload = {
        petId: petId || petStore.selectedPet?.id,
        ...formState,
      }

      if (isDemoMode.value) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        isSubmitted.value = true
        submissionError.value = null
        clearFormData()
        clearPersistedState()
        return true
      }

      const response = await fetchWithRetry(
        withPublicOrgId(API_ENDPOINTS.ADOPTION_APPLICATION),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
        {
          retries: 1,
          retryDelayMs: 600,
          shouldRetry: (context) => {
            if (!context.response) return false
            return [408, 429, 502, 503, 504].includes(context.response.status)
          },
        },
      )

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, 'Submission failed'))
      }

      isSubmitted.value = true
      submissionError.value = null
      clearFormData()
      clearPersistedState()
      return true
    } catch (error: unknown) {
      console.error('Error submitting application:', error)
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        submissionError.value = 'Request timed out while submitting your application. Please try again.'
        return false
      }
      submissionError.value = error instanceof Error ? error.message : String(error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formState,
    step,
    isSubmitting,
    isSubmitted,
    hasAttemptedSubmit,
    validationErrors,
    isStepValid,
    submissionError,
    nextStep,
    prevStep,
    resetForm,
    persistState,
    clearPersistedState,
    hasSavedDraft,
    submitApplication,
  }
})
