import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { useDemoMode } from '../composables/useDemoMode'
import { useMetrics } from '../composables/useMetrics'
import { API_ENDPOINTS } from '../constants/api'
import type { FormState } from '../models/adopt-form'
import { fetchWithRetry, getApiErrorMessage, PUBLIC_ORG_ID, withPublicOrgId } from '../utils/api'
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
      const resolvedPetId =
        petId ||
        (petStore.selectedPet?.id === 'unspecified' ? null : petStore.selectedPet?.id || null)

      const payload = {
        petId: resolvedPetId,
        secondPetId: formState.secondPetId || null,
        petName:
          petStore.selectedPet?.id === 'unspecified'
            ? formState.generalPetName || null
            : petStore.selectedPet?.petName || petStore.selectedPet?.name || null,
        secondPetName:
          petStore.currentPets.find((p) => p.id === formState.secondPetId)?.name || null,
        firstName: formState.firstName,
        lastName: formState.lastName,
        age: formState.age !== null && formState.age !== undefined ? Number(formState.age) : null,
        spouseFirstName: formState.spouseFirstName,
        spouseLastName: formState.spouseLastName,
        roommatesNames: formState.roommatesNames,
        childrenNamesAges: formState.childrenNamesAges,
        email: formState.email,
        address: formState.address,
        addressLine2: formState.addressLine2,
        city: formState.city,
        state: formState.state,
        zip: formState.zip,
        phoneNumber: formState.phoneNumber,
        cellPhoneNumber: formState.cellPhoneNumber,
        adultMembersAgreed: formState.adultMembersAgreed,

        homeType: formState.homeType,
        homeOwnership: formState.homeOwnership,
        landlordName: formState.landlordName,
        landlordPhoneNumber: formState.landlordPhoneNumber,
        allowPets: formState.allowPets,
        breedRestrictionsWeightLimit: formState.breedRestrictionsWeightLimit,
        monthlyFee: formState.monthlyFee,
        allergies: formState.allergies,
        primaryOwner: formState.primaryOwner,
        yearsAtAddress: formState.yearsAtAddress,
        previousAddress: formState.previousAddress,
        expectToMove: formState.expectToMove,
        travelPlan: formState.travelPlan,

        catAccess:
          formState.catAccess && formState.catAccess.length > 0
            ? formState.catAccess.join(', ')
            : null,
        catIndoorOutdoor: formState.catIndoorOutdoor,
        catPreferenceBreed: formState.catPreferenceBreed,
        catPreferencePhysical: formState.catPreferencePhysical,
        catPreferencePersonality: formState.catPreferencePersonality,
        catPreferenceNotWant: formState.catPreferenceNotWant,
        whyInterested: formState.whyInterested,
        adoptionReason: formState.adoptionReason,
        ownCatBefore: formState.ownCatBefore,
        ownKittenBefore: formState.ownKittenBefore,
        alreadyHaveVeterinarian: formState.alreadyHaveVeterinarian,
        catAllowedHomeArea: formState.catAllowedHomeArea,
        catHomeAloneHours: formState.catHomeAloneHours,
        catDisciplineType: formState.catDisciplineType,
        catEscapeSteps: formState.catEscapeSteps,

        currentPets: formState.currentPets || [],
        currentlyHavePets: formState.currentlyHavePets,

        pastPets: formState.pastPets || [],
        ownPetsBefore: formState.ownPetsBefore,

        bredAnimalDescription: formState.bredAnimalDescription,
        ownedDeclawedOrDebarked: formState.ownedDeclawedOrDebarked,
        movedWithPet: formState.movedWithPet,
        ownedSpecialNeedsPet: formState.ownedSpecialNeedsPet,
        mobilityDevice: formState.mobilityDevice,
        surrenderConditions: formState.surrenderConditions || [],
        surrenderPlan: formState.surrenderPlan,
        foodTypeBrand: formState.foodTypeBrand,
        affordVetCare: formState.affordVetCare,
        affordEmergencyCost: formState.affordEmergencyCost,

        agreementSignature1: formState.agreementSignature1,
        agreementSignature2: formState.agreementSignature2,
        agreementSignature3: formState.agreementSignature3,
        signatureData: formState.signatureData,

        dogWhySelected: formState.dogWhySelected,
        dogHeardAbout: formState.dogHeardAbout || [],
        dogFencedBackyard: formState.dogFencedBackyard,
        dogHasPool: formState.dogHasPool,
        dogPoolFence: formState.dogPoolFence,
        dogHouseholdDescription: formState.dogHouseholdDescription || [],
        dogKeptLocation: formState.dogKeptLocation || [],
        dogSleepingLocation: formState.dogSleepingLocation || [],
        dogAloneLocation: formState.dogAloneLocation || [],
        dogExercisePotty: formState.dogExercisePotty,
        dogCareResponsible: formState.dogCareResponsible,
        dogAnnualExpense: formState.dogAnnualExpense,
        dogTravelArrangements: formState.dogTravelArrangements,
        dogWillingToPottyTrain: formState.dogWillingToPottyTrain,
        dogTrainingExperience: formState.dogTrainingExperience || [],
        dogWillingTrainingClass: formState.dogWillingTrainingClass,
        dogConfinementTypes: formState.dogConfinementTypes || [],
        dogBondingTime: formState.dogBondingTime,
        dogDeniedOwnership: formState.dogDeniedOwnership,

        fax_number: formState.fax_number || '',
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
          headers: {
            'Content-Type': 'application/json',
            'X-Org-Id': PUBLIC_ORG_ID,
          },
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
