import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useMedicalRecords } from '../useMedicalRecords'

describe('useMedicalRecords', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('validates verification form fields correctly', () => {
    const { validateVerificationForm } = useMedicalRecords()

    // Missing pet name
    expect(
      validateVerificationForm({
        petName: '',
        adopterLastName: 'Jenkins',
        email: 'sarah@example.com',
        phoneNumber: '6265551234',
        adoptionMonth: '05',
        adoptionYear: '2025',
      }).isValid,
    ).toBe(false)

    // Missing last name
    expect(
      validateVerificationForm({
        petName: 'Luna',
        adopterLastName: '',
        email: 'sarah@example.com',
        phoneNumber: '6265551234',
        adoptionMonth: '05',
        adoptionYear: '2025',
      }).isValid,
    ).toBe(false)

    // Invalid email
    expect(
      validateVerificationForm({
        petName: 'Luna',
        adopterLastName: 'Jenkins',
        email: 'invalid-email',
        phoneNumber: '6265551234',
        adoptionMonth: '05',
        adoptionYear: '2025',
      }).isValid,
    ).toBe(false)

    // Invalid phone number (< 10 digits)
    expect(
      validateVerificationForm({
        petName: 'Luna',
        adopterLastName: 'Jenkins',
        email: 'sarah@example.com',
        phoneNumber: '123',
        adoptionMonth: '05',
        adoptionYear: '2025',
      }).isValid,
    ).toBe(false)

    // Missing month
    expect(
      validateVerificationForm({
        petName: 'Luna',
        adopterLastName: 'Jenkins',
        email: 'sarah@example.com',
        phoneNumber: '626-555-1234',
        adoptionMonth: '',
        adoptionYear: '2025',
      }).isValid,
    ).toBe(false)

    // Valid form
    expect(
      validateVerificationForm({
        petName: 'Luna',
        adopterLastName: 'Jenkins',
        email: 'sarah@example.com',
        phoneNumber: '(626) 555-1234',
        adoptionMonth: '05',
        adoptionYear: '2025',
      }).isValid,
    ).toBe(true)
  })

  it('manages session storage persistence for verified pets and tokens', () => {
    const { isVerifiedForPet, setVerifiedToken, clearVerification, getVerifiedToken } =
      useMedicalRecords()

    expect(isVerifiedForPet('luna')).toBe(false)
    expect(getVerifiedToken('luna')).toBeNull()

    setVerifiedToken('luna', 'mock-token-123')
    expect(isVerifiedForPet('luna')).toBe(true)
    expect(isVerifiedForPet('LUNA ')).toBe(true) // case/trim resilience
    expect(getVerifiedToken('luna')).toBe('mock-token-123')

    clearVerification('luna')
    expect(isVerifiedForPet('luna')).toBe(false)
    expect(getVerifiedToken('luna')).toBeNull()
  })

  it('formats file sizes accurately', () => {
    const { formatFileSize } = useMedicalRecords()

    expect(formatFileSize(0)).toBe('PDF Document')
    expect(formatFileSize(500)).toBe('500 B')
    expect(formatFileSize(204800)).toBe('200 KB')
    expect(formatFileSize(1572864)).toBe('1.5 MB')
  })

  it('verifies access successfully when API returns 200 OK', async () => {
    const { verifyAccess, isVerifiedForPet, getVerifiedToken } = useMedicalRecords()

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        petSlug: 'luna',
        verifiedToken: 'jwt-mock-token-123',
      }),
    } as Response)

    const result = await verifyAccess('luna', {
      petName: 'Luna',
      adopterLastName: 'Jenkins',
      email: 'sarah.jenkins@example.com',
      phoneNumber: '(626) 555-1234',
      adoptionMonth: '01',
      adoptionYear: '2025',
    })

    expect(result.success).toBe(true)
    expect(result.petSlug).toBe('luna')
    expect(result.verifiedToken).toBe('jwt-mock-token-123')
    expect(isVerifiedForPet('luna')).toBe(true)
    expect(getVerifiedToken('luna')).toBe('jwt-mock-token-123')
  })

  it('handles verification failure when API returns 401 Unauthorized', async () => {
    const { verifyAccess, isVerifiedForPet } = useMedicalRecords()

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        error: 'No adoption file matches the provided credentials.',
        userMessage: 'No adoption file matches the provided credentials.',
      }),
    } as Response)

    const result = await verifyAccess('luna', {
      petName: 'Luna',
      adopterLastName: 'WrongName',
      email: 'wrong@example.com',
      phoneNumber: '(626) 555-1234',
      adoptionMonth: '01',
      adoptionYear: '2025',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('No adoption file matches the provided credentials.')
    expect(isVerifiedForPet('luna')).toBe(false)
  })

  it('fetches medical records with auth token', async () => {
    const { fetchMedicalRecords, setVerifiedToken } = useMedicalRecords()

    setVerifiedToken('luna', 'valid-token')

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          petId: 'pet_001',
          name: 'Luna',
          slug: 'luna',
          status: 'adopted',
          species: 'cat',
          photoUrl: 'https://example.com/luna.jpg',
          medical: {
            spayedOrNeutered: true,
            spayedOrNeuteredDate: '2025-01-10',
            microchip: { microchipped: true, microchipID: '12345' },
            vaccinations: {},
            documents: [],
          },
        },
      }),
    } as Response)

    const data = await fetchMedicalRecords('luna')
    expect(data).not.toBeNull()
    expect(data?.name).toBe('Luna')
    expect(data?.medical.spayedOrNeutered).toBe(true)
  })
})
