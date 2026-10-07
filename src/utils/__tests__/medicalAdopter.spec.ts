import { describe, expect, it } from 'vitest'

import type { IPetMedicalPortalData } from '@/models/common'
import {
  buildAdopterPaymentInfo,
  formatCurrency,
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

    expect(result.adopterName).toBe('Sarah Jenkins')
    expect(result.email).toBe('sarah.jenkins@example.com')
    expect(result.phone).toBe('626-555-1234')
    expect(result.address).toBe('123 Pine St, Pasadena, CA')
    expect(result.adoptionFee).toBe('$150.00')
    expect(result.paymentStatus).toBe('Paid in Full')
    expect(result.paymentMethod).toBe('Credit Card')
    expect(result.transactionId).toBe('TXN-LUNA-99')
    expect(result.receiptNumber).toBe('REC-2025-LUNA-01')
    expect(result.itemizedFees).toHaveLength(5)
  })

  it('falls back to verified session data when portalData is minimal', () => {
    const mockData: Partial<IPetMedicalPortalData> = {
      name: 'Jaylene',
      slug: 'jaylene',
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

    expect(result.adopterName).toBe('Miller Family')
    expect(result.email).toBe('miller@example.com')
    expect(result.phone).toBe('310-555-9876')
    expect(result.adoptionFee).toBe('$150.00')
    expect(result.paymentStatus).toBe('Paid in Full')
    expect(result.receiptNumber).toContain('REC-2025-JAYL')
    expect(result.itemizedFees?.[0].label).toContain('Jaylene')
  })

  it('provides safe defaults when both portalData and session are empty', () => {
    const result = buildAdopterPaymentInfo(null)

    expect(result.adopterName).toBe('Registered Adopter')
    expect(result.email).toBe('On file with ADOHR')
    expect(result.phone).toBe('On file with ADOHR')
    expect(result.adoptionFee).toBe('$150.00')
    expect(result.paymentStatus).toBe('Paid in Full')
    expect(result.itemizedFees).toHaveLength(5)
  })
})
