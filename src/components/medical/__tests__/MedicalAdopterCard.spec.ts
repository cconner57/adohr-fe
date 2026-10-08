import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { IAdopterPaymentInfo } from '@/models/common'

import MedicalAdopterCard from '../MedicalAdopterCard.vue'

describe('MedicalAdopterCard.vue', () => {
  const mockAdopter: IAdopterPaymentInfo = {
    adopterName: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '(626) 555-1234',
    address: '123 Pine St, Pasadena, CA',
    adoptionFee: '$150.00',
    paymentStatus: 'Paid in Full',
    paymentDate: 'May 15, 2025',
    paymentMethod: 'Credit Card (ending in 4242)',
    transactionId: 'TXN-2025-JAYL-8492',
    receiptNumber: 'REC-2025-JAYL-01',
    itemizedFees: [
      { label: 'Adoption Placement Fee (Jaylene)', amount: '$150.00', included: false },
      { label: 'Spay / Neuter Surgical Sterilization', amount: 'Included', included: true },
      { label: 'Core Vaccinations & Rabies Vaccine', amount: 'Included', included: true },
      { label: 'Microchip Implantation & Lifetime Registration', amount: 'Included', included: true },
      { label: 'Veterinary Intake Examination', amount: 'Included', included: true },
    ],
  }

  it('renders adopter contact details, payment information, and itemized fee schedule', () => {
    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: mockAdopter,
        petName: 'Jaylene',
      },
    })

    expect(wrapper.text()).toContain('Adopter & Payment Record')
    expect(wrapper.text()).toContain('Sarah Jenkins')
    expect(wrapper.text()).toContain('Contact Email Address')
    expect(wrapper.text()).toContain('sarah.jenkins@example.com')
    expect(wrapper.text()).not.toContain('(626) 555-1234')
    expect(wrapper.text()).not.toContain('123 Pine St, Pasadena, CA')
    expect(wrapper.text()).toContain('$150.00')
    expect(wrapper.text()).toContain('Paid in Full')
    expect(wrapper.text()).toContain('REC-2025-JAYL-01')
    expect(wrapper.text()).toContain('TXN-2025-JAYL-8492')
    expect(wrapper.text()).toContain('Spay / Neuter Surgical Sterilization')
  })

  it('emits print-receipt when the footer print payment receipt button is clicked', async () => {
    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: mockAdopter,
        petName: 'Jaylene',
      },
    })

    const printButton = wrapper.find('button.print-receipt-action-btn')
    expect(printButton.exists()).toBe(true)
    expect(printButton.text()).toContain('Print Payment Receipt')

    // Confirm only one print button exists on the card
    const allButtons = wrapper.findAll('button')
    expect(allButtons.length).toBe(1)

    await printButton.trigger('click')
    expect(wrapper.emitted('print-receipt')).toBeTruthy()
    expect(wrapper.emitted('print-receipt')?.length).toBe(1)
  })

  it('renders Zelle Confirmation ID when zelleConfirmationId is present', () => {
    const zelleAdopter: IAdopterPaymentInfo = {
      ...mockAdopter,
      paymentMethod: 'Zelle',
      transactionId: '',
      zelleConfirmationId: 'BACapdp7gdkg',
    }
    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: zelleAdopter,
        petName: 'Jaylene',
      },
    })

    expect(wrapper.text()).toContain('Zelle Confirmation ID')
    expect(wrapper.text()).toContain('BACapdp7gdkg')
    expect(wrapper.text()).not.toContain('Transaction ID')
  })

  it('renders adoption family card and photo when both contractUrl and familyPhotoUrl are provided', () => {
    const adopterWithPhotoAndContract: IAdopterPaymentInfo = {
      ...mockAdopter,
      familyPhotoUrl: 'https://api.adoption-os.com/pets/jaylene/adoption/family_photo.jpg',
      contractUrl: 'https://adoption-os.com/contract/signed-token-123?view=true',
    }

    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: adopterWithPhotoAndContract,
        petName: 'Jaylene',
      },
    })

    const photoCard = wrapper.find('.family-photo-card')
    expect(photoCard.exists()).toBe(true)

    const img = wrapper.find('img.family-photo-img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://api.adoption-os.com/pets/jaylene/adoption/family_photo.jpg')
    expect(img.attributes('alt')).toContain('Sarah Jenkins')
    expect(img.attributes('alt')).toContain('Jaylene')

    expect(wrapper.find('.family-badge').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Forever Family Photo')
    expect(wrapper.text()).toContain('Welcome Home, Jaylene!')
    expect(wrapper.text()).toContain('May 15, 2025')
    expect(wrapper.text()).toContain('View Signed Adoption Contract')

    expect(wrapper.find('.family-photo-fallback').exists()).toBe(false)
    expect(wrapper.find('a.family-photo-zoom').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Full Size')
  })

  it('renders "No image available" fallback box if contract is available but no family photo is provided', () => {
    const adopterNoPhoto: IAdopterPaymentInfo = {
      ...mockAdopter,
      familyPhotoUrl: null,
      contractUrl: 'https://adoption-os.com/contract/signed-token-123?view=true',
    }

    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: adopterNoPhoto,
        petName: 'Jaylene',
      },
    })

    expect(wrapper.find('.family-photo-card').exists()).toBe(true)
    expect(wrapper.find('img.family-photo-img').exists()).toBe(false)
    expect(wrapper.find('.family-photo-fallback').exists()).toBe(true)
    expect(wrapper.text()).toContain('No image available')
    expect(wrapper.text()).toContain('Welcome Home, Jaylene!')
    expect(wrapper.text()).toContain('View Signed Adoption Contract')
  })

  it('renders "No image available" fallback box if contract is available and family photo encounters loading error', async () => {
    const adopterWithBrokenPhoto: IAdopterPaymentInfo = {
      ...mockAdopter,
      familyPhotoUrl: 'https://example.com/broken-photo.jpg',
      contractUrl: 'https://adoption-os.com/contract/signed-token-123?view=true',
    }

    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: adopterWithBrokenPhoto,
        petName: 'Jaylene',
      },
    })

    expect(wrapper.find('.family-photo-card').exists()).toBe(true)

    const img = wrapper.find('img.family-photo-img')
    expect(img.exists()).toBe(true)
    await img.trigger('error')

    expect(wrapper.find('.family-photo-card').exists()).toBe(true)
    expect(wrapper.find('img.family-photo-img').exists()).toBe(false)
    expect(wrapper.find('.family-photo-fallback').exists()).toBe(true)
    expect(wrapper.text()).toContain('No image available')
    expect(wrapper.text()).toContain('Welcome Home, Jaylene!')
  })

  it('does not render adoption family section if contractUrl is not provided, even if familyPhotoUrl exists', () => {
    const adopterWithoutContract: IAdopterPaymentInfo = {
      ...mockAdopter,
      familyPhotoUrl: 'https://api.adoption-os.com/pets/jaylene/adoption/family_photo.jpg',
      contractUrl: null,
    }

    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: adopterWithoutContract,
        petName: 'Jaylene',
      },
    })

    expect(wrapper.find('.family-photo-card').exists()).toBe(false)
    expect(wrapper.find('a.contract-link').exists()).toBe(false)
    expect(wrapper.find('a.panel-contract-link').exists()).toBe(false)
    expect(wrapper.find('.family-contract').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('View Signed Adoption Contract')
    expect(wrapper.text()).not.toContain('View Signed Contract')
    expect(wrapper.text()).not.toContain('Adoption Contract')
  })

  it('renders contract link in family section when contractUrl is provided and does not duplicate it in adopter panel', () => {
    const adopterWithContract: IAdopterPaymentInfo = {
      ...mockAdopter,
      familyPhotoUrl: 'https://api.adoption-os.com/pets/jaylene/adoption/family_photo.jpg',
      contractUrl: 'https://adoption-os.com/contract/signed-token-123?view=true',
    }

    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: adopterWithContract,
        petName: 'Jaylene',
      },
    })

    const link = wrapper.find('a.contract-link')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://adoption-os.com/contract/signed-token-123?view=true')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.text()).toContain('View Signed Adoption Contract')

    expect(wrapper.find('a.panel-contract-link').exists()).toBe(false)
    expect(wrapper.find('.adopter-panel').text()).not.toContain('Adoption Contract')
  })
})
