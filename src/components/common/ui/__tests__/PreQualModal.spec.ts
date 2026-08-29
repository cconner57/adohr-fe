import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PreQualModal from '../PreQualModal.vue'

describe('PreQualModal.vue', () => {
  it('renders readiness check items when open', () => {
    const wrapper = mount(PreQualModal, {
      props: {
        isOpen: true,
        petName: 'Luna',
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Adoption Pre-Qualification')
    expect(wrapper.text()).toContain('21+ Years of Age')
    expect(wrapper.text()).toContain('Housing & Landlord Approval')
    expect(wrapper.text()).toContain('Veterinary & Lifetime Care Commitment')
    expect(wrapper.text()).toContain('All Household Members Onboard')
    expect(wrapper.text()).toContain('Tax-Deductible Adoption Donation & Placement Policy')
  })

  it('renders dog-specific care criteria (fenced yard)', () => {
    const wrapper = mount(PreQualModal, {
      props: {
        isOpen: true,
        species: 'dog',
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    expect(wrapper.text()).toContain('securely fenced yard')
  })

  it('renders cat-specific care criteria (lifetime indoor shelter) and in-store center info', () => {
    const wrapper = mount(PreQualModal, {
      props: {
        isOpen: true,
        species: 'cat',
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    expect(wrapper.text()).toContain('lifetime indoor shelter')
    expect(wrapper.text()).toContain('Cat Adoption Center')
  })

  it('disables proceed button until all criteria are checked', async () => {
    const wrapper = mount(PreQualModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    const buttons = wrapper.findAllComponents({ name: 'Button' })
    const proceedBtn = buttons.find((b) => b.props('title') === "I'm Ready to Apply →")
    expect(proceedBtn?.props('disabled')).toBe(true)

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    // Check first 5 checkboxes (age, housing, care, household, donation)
    for (let i = 0; i < 5; i++) {
      await checkboxes[i].setValue(true)
    }

    const updatedButtons = wrapper.findAllComponents({ name: 'Button' })
    const updatedProceedBtn = updatedButtons.find((b) => b.props('title') === "I'm Ready to Apply →")
    expect(updatedProceedBtn?.props('disabled')).toBe(false)
  })

  it('emits proceed with fastTrack status when clicked', async () => {
    const wrapper = mount(PreQualModal, {
      props: {
        isOpen: true,
        isWeekendFastTrack: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    for (let i = 0; i < 5; i++) {
      await checkboxes[i].setValue(true)
    }

    const buttons = wrapper.findAllComponents({ name: 'Button' })
    const proceedBtn = buttons.find((b) => b.props('title') === "I'm Ready to Apply →")
    await proceedBtn?.trigger('click')

    expect(wrapper.emitted('proceed')).toBeTruthy()
    expect(wrapper.emitted('proceed')?.[0]).toEqual([{ isFastTrack: true }])
  })
})
