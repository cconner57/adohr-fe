import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import EventPrepDrawer from '../EventPrepDrawer.vue'

describe('EventPrepDrawer.vue', () => {
  it('does not render content when isOpen is false', () => {
    const wrapper = mount(EventPrepDrawer, {
      props: {
        isOpen: false,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    expect(wrapper.find('.prep-drawer-content').exists()).toBe(false)
  })

  it('renders cat checklist by default and toggles to dogs checklist', async () => {
    const wrapper = mount(EventPrepDrawer, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    // Default: Cat
    expect(wrapper.text()).toContain('Cat or Kitten')
    expect(wrapper.text()).toContain('Secure Cat Carrier (Hard or Soft-Sided)')

    // Find dog toggle button
    const buttons = wrapper.findAll('.switch-btn')
    const dogBtn = buttons.find((b) => b.text().includes('Dog'))
    expect(dogBtn).toBeTruthy()
    await dogBtn!.trigger('click')

    // Expect dog checklist
    expect(wrapper.text()).toContain('Leash, Collar & Harness')
    expect(wrapper.text()).toContain('Resident Dogs')
  })

  it('emits close when Got it, thanks! button is clicked', async () => {
    const wrapper = mount(EventPrepDrawer, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    const gotItBtn = wrapper
      .findAllComponents({ name: 'Button' })
      .find((b) => b.props('title') === 'Got it, thanks!')

    expect(gotItBtn).toBeTruthy()
    await gotItBtn!.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
