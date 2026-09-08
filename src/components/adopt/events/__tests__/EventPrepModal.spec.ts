import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import EventPrepModal from '../EventPrepModal.vue'

describe('EventPrepModal.vue', () => {
  it('does not render when isOpen is false', () => {
    const wrapper = mount(EventPrepModal, {
      props: {
        isOpen: false,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    expect(wrapper.find('.event-prep-modal').exists()).toBe(false)
  })

  it('renders cat checklist by default and toggles to dogs checklist', async () => {
    const wrapper = mount(EventPrepModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    // Default: Cat
    expect(wrapper.text()).toContain('Cats & Kittens')
    expect(wrapper.text()).toContain('Secure Cat Carrier (Hard or Soft-Sided)')
    expect(wrapper.text()).toContain('first week')

    // Find dog toggle button
    const buttons = wrapper.findAll('.species-toggle-btn')
    const dogBtn = buttons.find((b) => b.text().includes('Dogs'))
    expect(dogBtn).toBeTruthy()
    await dogBtn!.trigger('click')

    // Expect dog checklist
    expect(wrapper.text()).toContain('Leash, Collar & Harness')
    expect(wrapper.text()).toContain('Resident Dogs')
    expect(wrapper.text()).toContain('Dog Pro-Tip')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(EventPrepModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    const closeBtn = wrapper.find('.close-btn')
    expect(closeBtn.exists()).toBe(true)
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits fastTrack when Fast-Track Pre-Approval button is clicked', async () => {
    const wrapper = mount(EventPrepModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    const fastTrackBtn = wrapper
      .findAllComponents({ name: 'Button' })
      .find((b) => b.props('title') === 'Fast-Track Pre-Approval')

    expect(fastTrackBtn).toBeTruthy()
    await fastTrackBtn!.trigger('click')

    expect(wrapper.emitted('fastTrack')).toBeTruthy()
  })
})
