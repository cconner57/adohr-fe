import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { useDemoMode } from '../composables/useDemoMode'
import { useMetrics } from '../composables/useMetrics'
import { API_ENDPOINTS } from '../constants/api'
import type { IPublicVolunteerLocation, IVolunteerFormState } from '../models/volunteer-form'
import { getApiErrorMessage, PUBLIC_ORG_ID, withPublicOrgId } from '../utils/api'
import { calculateAgeInYears } from '../utils/date'
import { getVolunteerValidationErrors } from './validation/volunteerValidation'

const calculateVolunteerAge = (birthday: string): number | null => {
  return calculateAgeInYears(birthday)
}

export const useVolunteerStore = defineStore('volunteer', () => {
  const { isDemoMode } = useDemoMode()
  const isSubmitted = ref(false)
  const hasAttemptedSubmit = ref(false)
  const apiError = ref<string | null>(null)

  const formState = reactive<IVolunteerFormState>({
    fax_number: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phoneNumber: '',
    birthday: '',
    age: null,
    allergies: null,
    allergiesDetails: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    volunteerExperience: '',
    interestReason: '',
    preferredLocationId: '',
    preferredLocationName: '',
    positionPreferences: [],
    availability: [],
    nameFull: '',
    signatureData: null,
    signatureDate: '',
    parentName: '',
    parentSignatureData: null,
    parentSignatureDate: '',
  })

  const validationErrors = computed(() => {
    return getVolunteerValidationErrors(formState)
  })

  const isFormValid = computed(() => {
    if (isDemoMode.value) return true
    return validationErrors.value.length === 0
  })

  const isSubmitting = ref(false)
  const locations = ref<IPublicVolunteerLocation[]>([])
  const isLoadingLocations = ref(false)
  const locationsLoadFailed = ref(false)

  const locationOptions = computed(() => {
    if (locationsLoadFailed.value) {
      return [{ value: 'unknown', label: 'Unknown' }]
    }
    return [
      { value: 'any', label: 'Any Location' },
      ...locations.value.map((loc) => ({ value: loc.id, label: loc.name })),
    ]
  })

  const setPreferredLocation = (locationId: string) => {
    if (locationsLoadFailed.value) return
    if (locationId === 'any') {
      formState.preferredLocationId = 'any'
      formState.preferredLocationName = 'Any Location'
      return
    }
    const match = locations.value.find((loc) => loc.id === locationId)
    if (match) {
      formState.preferredLocationId = match.id
      formState.preferredLocationName = match.name
    } else {
      formState.preferredLocationId = ''
      formState.preferredLocationName = ''
    }
  }

  const fetchPublicLocations = async () => {
    isLoadingLocations.value = true
    locationsLoadFailed.value = false
    try {
      const response = await fetch(
        withPublicOrgId(`${API_ENDPOINTS.PUBLIC_LOCATIONS}?for=volunteer`),
        {
          headers: { 'X-Org-Id': PUBLIC_ORG_ID },
        },
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch public locations: ${response.status}`)
      }
      const json = await response.json()
      let rawLocations: unknown = null
      if (Array.isArray(json?.locations)) {
        rawLocations = json.locations
      } else if (Array.isArray(json?.data?.locations)) {
        rawLocations = json.data.locations
      }
      if (!Array.isArray(rawLocations)) {
        throw new Error('Malformed locations payload')
      }
      locations.value = rawLocations as IPublicVolunteerLocation[]
      if (locations.value.length === 0) {
        if (!formState.preferredLocationId || formState.preferredLocationId === 'unknown') {
          formState.preferredLocationId = 'any'
          formState.preferredLocationName = 'Any Location'
        }
      } else if (
        formState.preferredLocationId &&
        formState.preferredLocationId !== 'any' &&
        !locations.value.some((loc) => loc.id === formState.preferredLocationId)
      ) {
        formState.preferredLocationId = ''
        formState.preferredLocationName = ''
      }
    } catch {
      locationsLoadFailed.value = true
      locations.value = []
      formState.preferredLocationId = 'unknown'
      formState.preferredLocationName = 'Unknown'
    } finally {
      isLoadingLocations.value = false
    }
  }

  const STORAGE_KEY = 'adohr_volunteer_form_draft_v1'

  const hasSavedDraft = computed(() => {
    return Boolean(formState.firstName || formState.email || formState.phoneNumber)
  })

  const clearPersistedState = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear persisted volunteer draft', e)
    }
  }

  const persistState = () => {
    try {
      const payload = JSON.stringify(formState)
      sessionStorage.setItem(STORAGE_KEY, payload)
      localStorage.setItem(STORAGE_KEY, payload)
    } catch (e) {
      console.error('Failed to persist volunteer form state', e)
    }
  }

  const initFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        Object.assign(formState, parsed)
        if (formState.preferredLocationId === 'unknown') {
          formState.preferredLocationId = ''
          formState.preferredLocationName = ''
        }
      }
    } catch (e) {
      console.error('Failed to restore volunteer form state', e)
    }
  }

  initFromStorage()

  const clearFormData = () => {
    formState.fax_number = ''
    formState.email = ''
    formState.firstName = ''
    formState.lastName = ''
    formState.address = ''
    formState.city = ''
    formState.zip = ''
    formState.phoneNumber = ''
    formState.birthday = ''
    formState.age = null
    formState.allergies = null
    formState.allergiesDetails = ''
    formState.emergencyContactName = ''
    formState.emergencyContactPhone = ''
    formState.volunteerExperience = ''
    formState.interestReason = ''
    formState.preferredLocationId = locationsLoadFailed.value ? 'unknown' : ''
    formState.preferredLocationName = locationsLoadFailed.value ? 'Unknown' : ''
    formState.positionPreferences = []
    formState.availability = []
    formState.nameFull = ''
    formState.signatureData = null
    formState.signatureDate = ''
    formState.parentName = ''
    formState.parentSignatureData = null
    formState.parentSignatureDate = ''
  }

  const submit = async () => {
    hasAttemptedSubmit.value = true
    apiError.value = null

    if (!isFormValid.value && !isDemoMode.value) return false

    isSubmitting.value = true

    if (isDemoMode.value) {
      console.log('Demo Mode: Simulating submission success')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      isSubmitted.value = true
      clearFormData()
      isSubmitting.value = false
      return true
    }

    const payload: Partial<IVolunteerFormState> = {
      ...formState,
    }
    const derivedAge = calculateVolunteerAge(formState.birthday)

    payload.age = derivedAge

    if (derivedAge !== null && derivedAge >= 21) {
      delete payload.parentName
      delete payload.parentSignatureData
      delete payload.parentSignatureDate
    }

    try {
      const response = await fetch(withPublicOrgId(API_ENDPOINTS.VOLUNTEER_APPLICATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': PUBLIC_ORG_ID,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const fallbackMessage =
          response.status === 400 || response.status >= 500
            ? 'There was an error on the server. Please try again later.'
            : `Server Error (${response.status})`

        apiError.value = await getApiErrorMessage(response, fallbackMessage)
        return false
      }

      const result = await response.json()
      if (result.error) {
        apiError.value = result.error
        return false
      }

      const { submitMetric } = useMetrics()
      submitMetric('form_submit', { form: 'volunteer' })

      isSubmitted.value = true
      clearFormData()
      clearPersistedState()
      return true
    } catch (error) {
      console.error('Network error:', error)
      apiError.value = 'Network error. Please try again later.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const resetForm = () => {
    isSubmitted.value = false
    hasAttemptedSubmit.value = false
    apiError.value = null
    clearFormData()
    clearPersistedState()
  }

  return {
    formState,
    isSubmitted,
    isSubmitting,
    isLoadingLocations,
    locationsLoadFailed,
    locationOptions,
    hasAttemptedSubmit,
    apiError,
    validationErrors,
    isFormValid,
    hasSavedDraft,
    fetchPublicLocations,
    setPreferredLocation,
    persistState,
    clearPersistedState,
    submit,
    resetForm,
  }
})
