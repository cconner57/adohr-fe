import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import type { IAdopterPaymentInfo } from '@/models/common'

import MedicalPaymentReceiptModal from '../MedicalPaymentReceiptModal.vue'

describe('MedicalPaymentReceiptModal.vue', () => {
  const mockAdopter: IAdopterPaymentInfo = {
    adopterName: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '(626) 555-1234',
    address: '123 Pine St, Pasadena, CA',
    adoptionFee: '$150.00',
    paymentStatus: 'Paid in Full',
    paymentDate: 'May 15, 2025',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-2025-JAYL-8492',
    receiptNumber: 'REC-2025-JAYL-01',
    itemizedFees: [
      { label: 'Adoption Placement Fee (Jaylene)', amount: '$150.00', included: false },
      { label: 'Spay / Neuter Surgical Sterilization', amount: 'Included', included: true },
      { label: 'Core Vaccinations & Rabies Vaccine', amount: 'Included', included: true },
    ],
  }

  it('renders official receipt header, organization details, and metadata', () => {
    const wrapper = mount(MedicalPaymentReceiptModal, {
      props: {
        isOpen: true,
        adopter: mockAdopter,
        petName: 'Jaylene',
        species: 'Cat',
        microchipId: '985141002345678',
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    expect(wrapper.text()).toContain('A DREAM OF HOME RESCUE')
    expect(wrapper.text()).toContain('REC-2025-JAYL-01')
    expect(wrapper.text()).toContain('Sarah Jenkins')
    expect(wrapper.text()).toContain('Jaylene')
    expect(wrapper.text()).toContain('Cat')
    expect(wrapper.text()).toContain('985141002345678')
    expect(wrapper.text()).toContain('$150.00')
    expect(wrapper.text()).toContain('PAID IN FULL')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(MedicalPaymentReceiptModal, {
      props: {
        isOpen: true,
        adopter: mockAdopter,
        petName: 'Jaylene',
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    const closeBtn = wrapper.find('.close-btn')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('triggers window.print and emits print event when print button is clicked', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

    const wrapper = mount(MedicalPaymentReceiptModal, {
      props: {
        isOpen: true,
        adopter: mockAdopter,
        petName: 'Jaylene',
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    const printBtn = wrapper.find('.toolbar-btn.primary')
    await printBtn.trigger('click')

    expect(printSpy).toHaveBeenCalled()
    expect(wrapper.emitted('print')).toBeTruthy()

    printSpy.mockRestore()
  })

  it('renders Zelle Confirmation ID label and value when zelleConfirmationId is present', () => {
    const zelleAdopter: IAdopterPaymentInfo = {
      ...mockAdopter,
      paymentMethod: 'Zelle',
      transactionId: '',
      zelleConfirmationId: 'BACapdp7gdkg',
    }
    const wrapper = mount(MedicalPaymentReceiptModal, {
      props: {
        isOpen: true,
        adopter: zelleAdopter,
        petName: 'Jaylene',
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Zelle Confirmation ID:')
    expect(wrapper.text()).toContain('BACapdp7gdkg')
    expect(wrapper.text()).not.toContain('Transaction Reference:')
  })
})
