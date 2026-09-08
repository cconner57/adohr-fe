import { reactive, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import type { IPet } from '@/models/common'
import { getApiErrorMessage, PUBLIC_ORG_ID, withPublicOrgId } from '@/utils/api'

type TInquirySource = 'schedule_meet' | 'request_info'

interface IInquiryFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export function usePetInquiry(pet: IPet, source: TInquirySource) {
  const formData = reactive<IInquiryFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const apiError = ref<string | null>(null)

  async function submitInquiry(extraFields: Record<string, unknown> = {}) {
    apiError.value = null
    isSubmitting.value = true

    try {
      const response = await fetch(withPublicOrgId(API_ENDPOINTS.PET_INQUIRY), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': PUBLIC_ORG_ID,
        },
        body: JSON.stringify({
          orgId: PUBLIC_ORG_ID,
          fax_number: '',
          source,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          petId: pet.id,
          petName: pet.name,
          ...extraFields,
        }),
      })

      if (!response.ok) {
        apiError.value = await getApiErrorMessage(
          response,
          'Something went wrong. Please try again.',
        )
        return false
      }

      isSubmitted.value = true
      return true
    } catch {
      apiError.value = 'Network error. Please try again later.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { formData, isSubmitting, isSubmitted, apiError, submitInquiry }
}
