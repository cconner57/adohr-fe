import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { useDemoMode } from '../composables/useDemoMode'
import { useMetrics } from '../composables/useMetrics'
import { API_ENDPOINTS } from '../constants/api'
import type { FormState } from '../models/adopt-form'
import { fetchWithRetry, getApiErrorMessage, withPublicOrgId } from '../utils/api'
import { usePetStore } from './pets'
import { getAdoptionValidationErrors } from './validation/adoptionValidation'

export const useAdoptionStore = defineStore('adoption', () => {
  const { isDemoMode } = useDemoMode()
  const petStore = usePetStore()
  const step = ref(0)
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const hasAttemptedSubmit = ref(false)
  const submissionError = ref<string | null>(null)

  const formState = reactive<FormState>({
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

    currentPets: [
      { name: '', speciesBreedSize: '', age: '', source: '', spayedNeutered: '', likesDogs: '' },
    ],
    currentlyHavePets: null,
    pastPets: [
      {
        name: '',
        speciesBreedSize: '',
        age: '',
        source: '',
        spayedNeutered: '',
        passedAwayReason: '',
      },
    ],
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

  const validationStep = computed(() => {
    if (petStore.selectedPet?.species === 'dog') {
      return step.value
    }

    // Cat applications now start with an informational intro step.
    return step.value === 0 ? -1 : step.value - 1
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
  const ADOPTION_SUBMIT_TIMEOUT_MS = 20000

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
    formState.fax_number = ''
    formState.secondPetId = null
    formState.generalPetName = ''
    formState.firstName = ''
    formState.lastName = ''
    formState.age = null
    formState.spouseFirstName = null
    formState.spouseLastName = null
    formState.roommatesNames = ['']
    formState.childrenNamesAges = [{ name: '', age: '' }]
    formState.currentPets = [
      { name: '', speciesBreedSize: '', age: '', source: '', spayedNeutered: '', likesDogs: '' },
    ]
    formState.currentlyHavePets = null
    formState.pastPets = [
      {
        name: '',
        speciesBreedSize: '',
        age: '',
        source: '',
        spayedNeutered: '',
        passedAwayReason: '',
      },
    ]
    formState.ownPetsBefore = null
    formState.email = null
    formState.address = null
    formState.addressLine2 = null
    formState.city = null
    formState.state = null
    formState.zip = null
    formState.phoneNumber = null
    formState.cellPhoneNumber = null
    formState.adultMembersAgreed = null
    formState.homeType = null
    formState.homeOwnership = null
    formState.landlordName = null
    formState.landlordPhoneNumber = null
    formState.allowPets = null
    formState.breedRestrictionsWeightLimit = null
    formState.monthlyFee = null
    formState.allergies = null
    formState.primaryOwner = null
    formState.yearsAtAddress = null
    formState.previousAddress = null
    formState.expectToMove = null
    formState.travelPlan = null
    formState.catAccess = []
    formState.catIndoorOutdoor = null
    formState.catPreferenceBreed = null
    formState.catPreferencePhysical = null
    formState.catPreferencePersonality = null
    formState.catPreferenceNotWant = null
    formState.whyInterested = null
    formState.adoptionReason = null
    formState.ownCatBefore = null
    formState.ownKittenBefore = null
    formState.alreadyHaveVeterinarian = null
    formState.catAllowedHomeArea = null
    formState.catHomeAloneHours = null
    formState.catDisciplineType = null
    formState.catEscapeSteps = null
    formState.bredAnimalDescription = null
    formState.ownedDeclawedOrDebarked = null
    formState.movedWithPet = null
    formState.ownedSpecialNeedsPet = null
    formState.mobilityDevice = null
    formState.surrenderConditions = []
    formState.surrenderPlan = null
    formState.foodTypeBrand = null
    formState.affordVetCare = null
    formState.affordEmergencyCost = null
    formState.agreementSignature1 = null
    formState.agreementSignature2 = null
    formState.agreementSignature3 = null
    formState.signatureData = null
    formState.dogWhySelected = null
    formState.dogHeardAbout = []
    formState.dogFencedBackyard = null
    formState.dogHasPool = null
    formState.dogPoolFence = null
    formState.dogHouseholdDescription = []
    formState.dogKeptLocation = []
    formState.dogSleepingLocation = []
    formState.dogAloneLocation = []
    formState.dogExercisePotty = null
    formState.dogCareResponsible = null
    formState.dogAnnualExpense = null
    formState.dogTravelArrangements = null
    formState.dogWillingToPottyTrain = null
    formState.dogTrainingExperience = []
    formState.dogWillingTrainingClass = null
    formState.dogConfinementTypes = []
    formState.dogBondingTime = null
    formState.dogDeniedOwnership = null
  }

  const resetForm = () => {
    step.value = 0
    isSubmitted.value = false
    hasAttemptedSubmit.value = false
    submissionError.value = null
    clearFormData()
    clearPersistedState()
  }

  const submitApplication = async () => {
    if (isSubmitting.value || isSubmitted.value) return false

    isSubmitting.value = true
    try {
      if (isDemoMode.value) {
        // Simulate API call for Demo Mode
        await new Promise((resolve) => setTimeout(resolve, 1500))
        isSubmitted.value = true
        clearFormData()
        clearPersistedState()
        return true
      }

      // Prepare payload matching backend AdoptionApplication struct
      const payload = {
        petId: petStore.selectedPet?.id === 'unspecified' ? null : petStore.selectedPet?.id || null,
        secondPetId: formState.secondPetId,
        petName:
          petStore.selectedPet?.id === 'unspecified'
            ? formState.generalPetName
            : petStore.selectedPet?.petName || petStore.selectedPet?.name || null,
        secondPetName:
          petStore.currentPets.find((p) => p.id === formState.secondPetId)?.name || null,
        firstName: formState.firstName,
        lastName: formState.lastName,
        age: Number(formState.age), // Ensure number
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

        catAccess: formState.catAccess.length > 0 ? formState.catAccess.join(', ') : null, // Convert array to string as backend expects *string
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
        surrenderConditions: formState.surrenderConditions, // Backend expects []string, usually
        surrenderPlan: formState.surrenderPlan,
        foodTypeBrand: formState.foodTypeBrand,
        affordVetCare: formState.affordVetCare,
        affordEmergencyCost: formState.affordEmergencyCost,

        agreementSignature1: formState.agreementSignature1,
        agreementSignature2: formState.agreementSignature2,
        agreementSignature3: formState.agreementSignature3,
        signatureData: formState.signatureData,

        dogWhySelected: formState.dogWhySelected,
        dogHeardAbout: formState.dogHeardAbout,
        dogFencedBackyard: formState.dogFencedBackyard,
        dogHasPool: formState.dogHasPool,
        dogPoolFence: formState.dogPoolFence,
        dogHouseholdDescription: formState.dogHouseholdDescription,
        dogKeptLocation: formState.dogKeptLocation,
        dogSleepingLocation: formState.dogSleepingLocation,
        dogAloneLocation: formState.dogAloneLocation,
        dogExercisePotty: formState.dogExercisePotty,
        dogCareResponsible: formState.dogCareResponsible,
        dogAnnualExpense: formState.dogAnnualExpense,
        dogTravelArrangements: formState.dogTravelArrangements,
        dogWillingToPottyTrain: formState.dogWillingToPottyTrain,
        dogTrainingExperience: formState.dogTrainingExperience,
        dogWillingTrainingClass: formState.dogWillingTrainingClass,
        dogConfinementTypes: formState.dogConfinementTypes,
        dogBondingTime: formState.dogBondingTime,
        dogDeniedOwnership: formState.dogDeniedOwnership,

        fax_number: formState.fax_number, // Honeypot
      }

      // Convert catAccess array to single string if needed, but backend struct has it as *string
      // Re-verifying struct: CatAccess *string `json:"catAccess"`
      // Frontend is string[]. Must join it. Done above.

      const response = await fetchWithRetry(
        withPublicOrgId(API_ENDPOINTS.ADOPTION_APPLICATION),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(ADOPTION_SUBMIT_TIMEOUT_MS),
        },
        {
          retries: 1,
          retryDelayMs: 800,
          shouldRetry: ({ response: _res, error }) => {
            if (
              error instanceof Error &&
              (error.name === 'TimeoutError' || error instanceof TypeError)
            ) {
              return true
            }

            if (!_res) {
              return false
            }

            return [408, 429, 502, 503, 504].includes(_res.status)
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
        submissionError.value =
          'Request timed out while submitting your application. Please try again.'
        return false
      }

      const message = error instanceof Error ? error.message : String(error)
      submissionError.value = message
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
