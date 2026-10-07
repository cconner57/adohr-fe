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
    expect(wrapper.text()).toContain('sarah.jenkins@example.com')
    expect(wrapper.text()).toContain('(626) 555-1234')
    expect(wrapper.text()).toContain('123 Pine St, Pasadena, CA')
    expect(wrapper.text()).toContain('$150.00')
    expect(wrapper.text()).toContain('Paid in Full')
    expect(wrapper.text()).toContain('REC-2025-JAYL-01')
    expect(wrapper.text()).toContain('TXN-2025-JAYL-8492')
    expect(wrapper.text()).toContain('Spay / Neuter Surgical Sterilization')
  })

  it('emits print-receipt when header or footer print buttons are clicked', async () => {
    const wrapper = mount(MedicalAdopterCard, {
      props: {
        adopter: mockAdopter,
        petName: 'Jaylene',
      },
    })

    const printButtons = wrapper.findAll('button')
    expect(printButtons.length).toBeGreaterThanOrEqual(2)

    await printButtons[0].trigger('click')
    expect(wrapper.emitted('print-receipt')).toBeTruthy()
    expect(wrapper.emitted('print-receipt')?.length).toBe(1)

    await printButtons[1].trigger('click')
    expect(wrapper.emitted('print-receipt')?.length).toBe(2)
  })
})
