import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MedicalVerificationGatekeeper from '../MedicalVerificationGatekeeper.vue'

describe('MedicalVerificationGatekeeper.vue', () => {
  it('renders pet name in header when petName prop is provided', () => {
    const wrapper = mount(MedicalVerificationGatekeeper, {
      props: {
        petName: 'Luna',
      },
    })

    expect(wrapper.text()).toContain("Access Luna's Records")
    expect(wrapper.text()).toContain('Enter your adoption details below')
  })

  it('displays error banner when errorMessage prop is provided', () => {
    const wrapper = mount(MedicalVerificationGatekeeper, {
      props: {
        errorMessage: 'Invalid adoption details provided',
      },
    })

    expect(wrapper.find('.error-banner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Invalid adoption details provided')
  })

  it('renders disabled submit button when form is incomplete', () => {
    const wrapper = mount(MedicalVerificationGatekeeper, {
      props: {
        petName: 'Luna',
      },
    })

    const submitBtn = wrapper.findComponent({ name: 'Button' })
    expect(submitBtn.props('disabled')).toBe(true)
  })
})
