import { computed, ref } from 'vue'

import { API_BASE_URL } from '@/constants/api'
import type {
  IMedicalVerificationForm,
  IPetMedicalDocument,
  IPetMedicalPortalData,
  IVerifyMedicalPayload,
} from '@/models/common'
import { parseApiErrorMessage, PUBLIC_ORG_ID, withPublicOrgId } from '@/utils/api'
import { formatPhoneNumber } from '@/utils/validators'

const VERIFIED_STORAGE_PREFIX = 'adohr_medical_verified_'
const TOKEN_STORAGE_PREFIX = 'adohr_medical_token_'

async function extractVerificationError(response: Response | null): Promise<string> {
  const defaultMsg = 'No adoption file matches the provided credentials.'
  if (!response) return defaultMsg

  try {
    const errorJson = await response.json()
    return parseApiErrorMessage(errorJson, defaultMsg)
  } catch {
    if (response.status === 401) return defaultMsg
    if (response.status === 429) return 'Too many requests. Please slow down.'
    if (response.status === 422) return 'Validation failed. Please check the entered details.'
    return defaultMsg
  }
}

export const getMockMedicalDocuments = (petName: string): IPetMedicalDocument[] => [
  {
    id: 'doc-rabies',
    title: `${petName}'s Rabies Certificate`,
    category: 'vaccination',
    fileName: `${petName.toLowerCase()}_rabies_certificate.pdf`,
    fileUrl: '#',
    fileSizeBytes: 245000,
    uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    veterinarian: 'Dr. Sarah Jenkins, DVM',
    notes: '1-Year Rabies vaccination certificate with registered serial tag.',
  },
  {
    id: 'doc-spay-neuter',
    title: `${petName}'s Spay / Neuter Certificate`,
    category: 'spay_neuter',
    fileName: `${petName.toLowerCase()}_sterilization_proof.pdf`,
    fileUrl: '#',
    fileSizeBytes: 312000,
    uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    veterinarian: 'Pasadena Veterinary Surgical Group',
    notes: 'Official spay/neuter sterilization certificate and surgery summary.',
  },
  {
    id: 'doc-intake-exam',
    title: 'Intake Veterinary Examination & Bloodwork',
    category: 'intake_exam',
    fileName: `${petName.toLowerCase()}_intake_exam_records.pdf`,
    fileUrl: '#',
    fileSizeBytes: 580000,
    uploadedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    veterinarian: 'ADOHR Veterinary Care Team',
    notes: 'Comprehensive intake exam, fecal test, and heartworm/FeLV screening results.',
  },
  {
    id: 'doc-vaccine-history',
    title: 'Complete Preventive Care & Vaccine History',
    category: 'vaccination',
    fileName: `${petName.toLowerCase()}_vaccination_history.pdf`,
    fileUrl: '#',
    fileSizeBytes: 410000,
    uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    veterinarian: 'ADOHR Veterinary Clinic',
    notes: 'Chronological immunization ledger showing all administered core vaccines.',
  },
]

export function useMedicalRecords() {
  const isVerifying = ref(false)
  const verificationError = ref<string | null>(null)

  const isVerifiedForPet = (petIdOrSlug?: string | null): boolean => {
    if (!petIdOrSlug) return false
    const key = `${VERIFIED_STORAGE_PREFIX}${petIdOrSlug.trim().toLowerCase()}`
    return sessionStorage.getItem(key) === 'true'
  }

  const getVerifiedToken = (petIdOrSlug?: string | null): string | null => {
    if (!petIdOrSlug) return null
    const key = `${TOKEN_STORAGE_PREFIX}${petIdOrSlug.trim().toLowerCase()}`
    return sessionStorage.getItem(key)
  }

  const setVerifiedToken = (petIdOrSlug: string, token: string) => {
    const normalized = petIdOrSlug.trim().toLowerCase()
    sessionStorage.setItem(`${VERIFIED_STORAGE_PREFIX}${normalized}`, 'true')
    sessionStorage.setItem(`${TOKEN_STORAGE_PREFIX}${normalized}`, token)
  }

  const clearVerification = (petIdOrSlug?: string | null) => {
    if (!petIdOrSlug) return
    const normalized = petIdOrSlug.trim().toLowerCase()
    sessionStorage.removeItem(`${VERIFIED_STORAGE_PREFIX}${normalized}`)
    sessionStorage.removeItem(`${TOKEN_STORAGE_PREFIX}${normalized}`)
  }

  const validateVerificationForm = (
    form: IMedicalVerificationForm,
  ): { isValid: boolean; error?: string } => {
    if (!form.petName?.trim()) {
      return { isValid: false, error: "Please enter your pet's name." }
    }
    if (!form.adopterLastName?.trim()) {
      return { isValid: false, error: "Please enter the adopter's last name." }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email?.trim() || !emailRegex.test(form.email.trim())) {
      return { isValid: false, error: 'Please enter a valid email address.' }
    }
    const rawDigits = form.phoneNumber?.replace(/\D/g, '') || ''
    if (rawDigits.length < 10) {
      return { isValid: false, error: 'Please enter a valid 10-digit phone number.' }
    }
    if (!form.adoptionMonth) {
      return { isValid: false, error: 'Please select the adoption month.' }
    }
    if (!form.adoptionYear) {
      return { isValid: false, error: 'Please enter or select the adoption year.' }
    }
    const yearNum = Number(form.adoptionYear)
    const currentYear = new Date().getFullYear()
    if (Number.isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear) {
      return { isValid: false, error: `Adoption year must be between 2000 and ${currentYear}.` }
    }

    return { isValid: true }
  }

  const verifyAccess = async (
    targetPetIdOrSlug: string | null,
    form: IMedicalVerificationForm,
  ): Promise<{ success: boolean; petSlug?: string; verifiedToken?: string; error?: string }> => {
    verificationError.value = null
    const validation = validateVerificationForm(form)
    if (!validation.isValid) {
      verificationError.value = validation.error ?? 'Invalid input'
      return { success: false, error: verificationError.value }
    }

    isVerifying.value = true

    try {
      const rawDigits = form.phoneNumber.replace(/\D/g, '')
      const payload: IVerifyMedicalPayload = {
        petName: form.petName.trim().toLowerCase(),
        adopterLastName: form.adopterLastName.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: rawDigits,
        adoptionMonth: form.adoptionMonth.trim(),
        adoptionYear: form.adoptionYear.trim(),
      }

      const petSlug = form.petName.trim().toLowerCase().replace(/\s+/g, '-')
      const slugOrId = targetPetIdOrSlug || petSlug

      const candidateEndpoints = [
        withPublicOrgId(`${API_BASE_URL}/api/pets/${slugOrId}/medical/verify`),
        withPublicOrgId(`${API_BASE_URL}/v1/pets/${slugOrId}/medical/verify`),
        withPublicOrgId(`${API_BASE_URL}/pets/${slugOrId}/medical/verify`),
        withPublicOrgId(`${API_BASE_URL}/api/pets/medical/verify`),
        withPublicOrgId(`${API_BASE_URL}/v1/pets/medical/verify`),
        withPublicOrgId(`${API_BASE_URL}/pets/medical/verify`),
        withPublicOrgId(`${API_BASE_URL}/api/v1/pets/${slugOrId}/medical/verify`),
        withPublicOrgId(`${API_BASE_URL}/api/v1/pets/medical/verify`),
      ]

      let response: Response | null = null

      for (const ep of candidateEndpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Org-Id': PUBLIC_ORG_ID,
            },
            body: JSON.stringify(payload),
          })
          response = res
          if (res.status !== 404 && res.status !== 405) {
            break
          }
        } catch {
          // Continue to next candidate endpoint
        }
      }

      if (!response || !response.ok) {
        const errorMsg = await extractVerificationError(response)
        verificationError.value = errorMsg
        return { success: false, error: errorMsg }
      }

      const json = await response.json()
      const resData = (json.data ?? json) as {
        success?: boolean
        petSlug?: string
        verifiedToken?: string
      }

      const verifiedPetSlug =
        resData.petSlug || targetPetIdOrSlug || petSlug
      const token = resData.verifiedToken || 'verified'

      setVerifiedToken(verifiedPetSlug, token)

      return { success: true, petSlug: verifiedPetSlug, verifiedToken: token }
    } catch {
      const errorMsg =
        'An error occurred while connecting to the verification service. Please try again.'
      verificationError.value = errorMsg
      return { success: false, error: errorMsg }
    } finally {
      isVerifying.value = false
    }
  }

  const fetchMedicalRecords = async (
    petIdOrSlug: string,
  ): Promise<IPetMedicalPortalData | null> => {
    const token = getVerifiedToken(petIdOrSlug)
    if (!token) {
      clearVerification(petIdOrSlug)
      return null
    }

    try {
      const candidateEndpoints = [
        withPublicOrgId(`${API_BASE_URL}/api/pets/${petIdOrSlug}/medical`),
        withPublicOrgId(`${API_BASE_URL}/v1/pets/${petIdOrSlug}/medical`),
        withPublicOrgId(`${API_BASE_URL}/pets/${petIdOrSlug}/medical`),
        withPublicOrgId(`${API_BASE_URL}/api/v1/pets/${petIdOrSlug}/medical`),
      ]

      let response: Response | null = null

      for (const ep of candidateEndpoints) {
        try {
          const res = await fetch(ep, {
            headers: {
              'Content-Type': 'application/json',
              'X-Org-Id': PUBLIC_ORG_ID,
              Authorization: `Bearer ${token}`,
            },
          })
          if (res.status !== 404 && res.status !== 405) {
            response = res
            break
          }
        } catch {
          // Continue to next
        }
      }

      if (!response || !response.ok) {
        clearVerification(petIdOrSlug)
        return null
      }

      const json = await response.json()
      const portalData = (json.data ?? json) as IPetMedicalPortalData
      return portalData
    } catch (err) {
      console.error('Failed to fetch pet medical records:', err)
      return null
    }
  }

  const downloadDocument = (doc: IPetMedicalDocument) => {
    if (!doc.fileUrl || doc.fileUrl === '#') {
      const mockPdfContent = `%PDF-1.4\n%ADOHR Official Veterinary Record\nPet Document: ${doc.title}\nDate: ${new Date().toLocaleDateString()}\nVeterinarian: ${doc.veterinarian || 'ADOHR Veterinary Team'}\nNotes: ${doc.notes || 'Official Medical Record'}\n%%EOF`
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = doc.fileName || `${doc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
      return
    }

    const link = document.createElement('a')
    link.href = doc.fileUrl
    link.download = doc.fileName || `${doc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes <= 0) return 'PDF Document'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return {
    isVerifying: computed(() => isVerifying.value),
    verificationError: computed(() => verificationError.value),
    formatPhoneNumber,
    formatFileSize,
    isVerifiedForPet,
    getVerifiedToken,
    setVerifiedToken,
    clearVerification,
    validateVerificationForm,
    verifyAccess,
    fetchMedicalRecords,
    downloadDocument,
  }
}
