import { describe, expect, it } from 'vitest'

import type { IPetMedicalPortalData } from '@/models/common'
import {
  buildAdopterPaymentInfo,
  formatCurrency,
  hasAdopterPaymentData,
  type IVerifiedAdopterSession,
} from '@/utils/medicalAdopter'

describe('medicalAdopter utility', () => {
  it('formats currency amounts correctly', () => {
    expect(formatCurrency(150)).toBe('$150.00')
    expect(formatCurrency('200')).toBe('$200.00')
    expect(formatCurrency('$175.50')).toBe('$175.50')
    expect(formatCurrency(null)).toBe('$150.00')
    expect(formatCurrency('')).toBe('$150.00')
  })

  it('builds adopter payment info from portalData when provided', () => {
    const mockData: Partial<IPetMedicalPortalData> = {
      name: 'Luna',
      slug: 'luna',
      adoption: {
        adoptedBy: 'Sarah Jenkins',
        date: '2025-05-15',
        fee: 150,
        paymentStatus: 'Paid in Full',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN-LUNA-99',
        receiptNumber: 'REC-2025-LUNA-01',
        adopterContactInfo: {
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@example.com',
          phone: '6265551234',
          address: '123 Pine St, Pasadena, CA',
        } as unknown as Record<string, unknown>,
      },
    }

    const result = buildAdopterPaymentInfo(mockData as IPetMedicalPortalData)
    expect(result).not.toBeNull()

    expect(result!.adopterName).toBe('Sarah Jenkins')
    expect(result!.email).toBe('sarah.jenkins@example.com')
    expect(result!.phone).toBe('626-555-1234')
    expect(result!.address).toBe('123 Pine St, Pasadena, CA')
    expect(result!.adoptionFee).toBe('$150.00')
    expect(result!.paymentStatus).toBe('Paid in Full')
    expect(result!.paymentMethod).toBe('Credit Card')
    expect(result!.transactionId).toBe('TXN-LUNA-99')
    expect(result!.receiptNumber).toBe('REC-2025-LUNA-01')
    expect(result!.itemizedFees).toHaveLength(5)
  })

  it('supplements verified session data when portalData has adoption records', () => {
    const mockData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      adoption: {
        adoptedBy: 'Miller Family',
      },
    }

    const session: IVerifiedAdopterSession = {
      lastName: 'Miller',
      email: 'miller@example.com',
      phone: '3105559876',
      adoptionMonth: '08',
      adoptionYear: '2025',
      adoptionDate: '2025-08-01',
    }

    const result = buildAdopterPaymentInfo(mockData as IPetMedicalPortalData, session)

    expect(result).not.toBeNull()
    expect(result?.adopterName).toBe('Miller Family')
    expect(result?.email).toBe('miller@example.com')
    expect(result?.phone).toBe('310-555-9876')
    expect(result?.adoptionFee).toBe('$150.00')
    expect(result?.paymentStatus).toBe('Paid in Full')
    expect(result?.receiptNumber).toContain('REC-2025-JAYL')
    expect(result?.itemizedFees?.[0].label).toContain('Jaylene')
  })

  it('returns null when portalData is null', () => {
    const result = buildAdopterPaymentInfo(null)
    expect(result).toBeNull()
  })

  it('returns null when portalData has no adoption or payment data', () => {
    const mockData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
    }
    const result = buildAdopterPaymentInfo(mockData as IPetMedicalPortalData)
    expect(result).toBeNull()
  })

  it('provides zelleConfirmationId and omits transactionId when zelle confirmation number exists', () => {
    const mockData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      adoption: {
        adoptedBy: 'Conner Family',
        paymentMethod: 'Zelle',
        zelleConfirmationId: 'BACapdp7gdkg',
        receiptNumber: 'REC-2025-JAYL-0576',
      },
    }

    const result = buildAdopterPaymentInfo(mockData as IPetMedicalPortalData)
    expect(result).not.toBeNull()
    expect(result?.zelleConfirmationId).toBe('BACapdp7gdkg')
    expect(result?.transactionId).toBe('')
    expect(result?.paymentMethod).toBe('Zelle')
  })

  it('provides synthesized transactionId when zelle has no confirmation number', () => {
    const mockData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      adoption: {
        adoptedBy: 'Conner Family',
        paymentMethod: 'Zelle',
        receiptNumber: 'REC-2025-JAYL-0576',
      },
    }

    const result = buildAdopterPaymentInfo(mockData as IPetMedicalPortalData)
    expect(result).not.toBeNull()
    expect(result?.zelleConfirmationId).toBeUndefined()
    expect(result?.transactionId).toContain('TXN-2025-JAYL')
  })

  it('extracts familyPhotoUrl when present on adoption or root', () => {
    const mockDataWithPhoto: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      familyPhotoUrl: 'https://media.adoption-os.com/family.jpg',
      adoption: {
        adoptedBy: 'Conner Family',
        paymentMethod: 'Credit Card',
      },
    }

    const result = buildAdopterPaymentInfo(mockDataWithPhoto as IPetMedicalPortalData)
    expect(result).not.toBeNull()
    expect(result?.familyPhotoUrl).toBe('https://media.adoption-os.com/family.jpg')

    const mockDataNoPhoto: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      adoption: {
        adoptedBy: 'Conner Family',
        paymentMethod: 'Credit Card',
      },
    }

    const resultNoPhoto = buildAdopterPaymentInfo(mockDataNoPhoto as IPetMedicalPortalData)
    expect(resultNoPhoto).not.toBeNull()
    expect(resultNoPhoto?.familyPhotoUrl).toBeNull()
  })

  it('excludes stripe fee from adoption fee paid when payment method is Stripe or card', () => {
    const mockDataWithStripeFee: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      adoption: {
        adoptedBy: 'Linda Tagle',
        fee: 250,
        feePaid: 257.78,
        paymentMethod: 'Credit Card',
      },
    }

    const result = buildAdopterPaymentInfo(mockDataWithStripeFee as IPetMedicalPortalData)
    expect(result).not.toBeNull()
    expect(result?.adoptionFee).toBe('$250.00')
  })

  it('extracts familyPhotoUrl and itemizedFees when present on payment object', () => {
    const mockDataPaymentPhoto: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      payment: {
        paymentStatus: 'Paid in Full',
        paymentMethod: 'Zelle',
        receiptNumber: 'REC-2025-JAYL-0576',
        transactionId: 'TXN-2025-JAYLEN-5423',
        familyPhotoUrl: 'https://api.adoption-os.com/pets/jaylene/adoption/family_photo.jpg',
        itemizedFees: [
          { label: 'Adoption Placement Fee', amount: '$150.00', included: false },
        ],
      },
    }

    expect(hasAdopterPaymentData(mockDataPaymentPhoto as IPetMedicalPortalData)).toBe(true)
    const result = buildAdopterPaymentInfo(mockDataPaymentPhoto as IPetMedicalPortalData)
    expect(result).not.toBeNull()
    expect(result?.familyPhotoUrl).toBe('https://api.adoption-os.com/pets/jaylene/adoption/family_photo.jpg')
    expect(result?.itemizedFees).toHaveLength(1)
    expect(result?.itemizedFees?.[0].label).toBe('Adoption Placement Fee')
  })

  it('extracts contractUrl when present on adoption, payment, or root', () => {
    const mockDataWithContract: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      contractUrl: 'https://adoption-os.com/contract/token-123?view=true',
      adoption: {
        adoptedBy: 'Chris Conner',
        paymentMethod: 'Credit Card',
      },
    }

    const result = buildAdopterPaymentInfo(mockDataWithContract as IPetMedicalPortalData)
    expect(result).not.toBeNull()
    expect(result?.contractUrl).toBe('https://adoption-os.com/contract/token-123?view=true')

    const mockDataNoContract: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      adoption: {
        adoptedBy: 'Chris Conner',
      },
    }
    const resultNoContract = buildAdopterPaymentInfo(mockDataNoContract as IPetMedicalPortalData)
    expect(resultNoContract).not.toBeNull()
    expect(resultNoContract?.contractUrl).toBeNull()
  })

  it('determines whether record is an Adoption or Foster-to-Adopt', () => {
    const adoptionData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      status: 'adopted',
      adoption: {
        adoptedBy: 'Linda Tagle',
      },
    }
    const adoptionResult = buildAdopterPaymentInfo(adoptionData as IPetMedicalPortalData)
    expect(adoptionResult?.adoptionType).toBe('Adoption')
    expect(adoptionResult?.fosterToAdopt).toBe(false)
    expect(adoptionResult?.isFosterToAdopt).toBe(false)

    const fosterData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      status: 'foster',
      adoption: {
        adoptedBy: 'Linda Tagle',
        isFosterToAdopt: true,
      },
    }
    const fosterResult = buildAdopterPaymentInfo(fosterData as IPetMedicalPortalData)
    expect(fosterResult?.adoptionType).toBe('Foster-to-Adopt')
    expect(fosterResult?.fosterToAdopt).toBe(true)
    expect(fosterResult?.isFosterToAdopt).toBe(true)

    const ftaContractData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      status: 'adopted',
      contractUrl: 'https://adoption-os.com/contract/foster-to-adopt-token',
      adoption: {
        adoptedBy: 'Linda Tagle',
      },
    }
    const ftaContractResult = buildAdopterPaymentInfo(ftaContractData as IPetMedicalPortalData)
    expect(ftaContractResult?.adoptionType).toBe('Foster-to-Adopt')
    expect(ftaContractResult?.fosterToAdopt).toBe(true)
    expect(ftaContractResult?.isFosterToAdopt).toBe(true)

    const ftaKeyData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
      fosterToAdopt: true,
      adoption: {
        adoptedBy: 'Linda Tagle',
      },
    }
    const ftaKeyResult = buildAdopterPaymentInfo(ftaKeyData as IPetMedicalPortalData)
    expect(ftaKeyResult?.adoptionType).toBe('Foster-to-Adopt')
    expect(ftaKeyResult?.fosterToAdopt).toBe(true)
    expect(ftaKeyResult?.isFosterToAdopt).toBe(true)

    const apiFTAPayload: Partial<IPetMedicalPortalData> = {
      petId: 'pet-bella-123',
      name: 'Bella',
      status: 'ADOPTED',
      fosterToAdopt: true,
      isFosterToAdopt: true,
      contractUrl: 'https://example.com/contract',
      adoption: {
        adoptedBy: 'Jane Doe',
        date: '2026-03-24',
        fosterToAdopt: true,
        isFosterToAdopt: true,
        contractUrl: 'https://example.com/contract',
      },
    }
    const apiFTAResult = buildAdopterPaymentInfo(apiFTAPayload as IPetMedicalPortalData)
    expect(apiFTAResult?.adoptionType).toBe('Foster-to-Adopt')
    expect(apiFTAResult?.fosterToAdopt).toBe(true)
    expect(apiFTAResult?.isFosterToAdopt).toBe(true)

    const apiAdoptedPayload: Partial<IPetMedicalPortalData> = {
      petId: 'pet-bella-456',
      name: 'Bella',
      status: 'ADOPTED',
      fosterToAdopt: false,
      isFosterToAdopt: false,
      contractUrl: 'https://example.com/contract',
      adoption: {
        adoptedBy: 'Jane Doe',
        date: '2026-03-24',
        fosterToAdopt: false,
        isFosterToAdopt: false,
        contractUrl: 'https://example.com/contract',
      },
    }
    const apiAdoptedResult = buildAdopterPaymentInfo(apiAdoptedPayload as IPetMedicalPortalData)
    expect(apiAdoptedResult?.adoptionType).toBe('Adoption')
    expect(apiAdoptedResult?.fosterToAdopt).toBe(false)
    expect(apiAdoptedResult?.isFosterToAdopt).toBe(false)
  })
})
