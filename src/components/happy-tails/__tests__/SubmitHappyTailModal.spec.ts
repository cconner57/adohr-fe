import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import SubmitHappyTailModal from '../SubmitHappyTailModal.vue'

describe('SubmitHappyTailModal.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders modal dialog when isOpen is true', () => {
    const wrapper = mount(SubmitHappyTailModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Share Your Happy Tail')
    expect(wrapper.find('#ht-pet-name').exists()).toBe(true)
  })

  it('does not render dialog when isOpen is false', () => {
    const wrapper = mount(SubmitHappyTailModal, {
      props: {
        isOpen: false,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(SubmitHappyTailModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    })

    const closeBtn = wrapper.find('.modal-close')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('validates required fields before submitting', async () => {
    const wrapper = mount(SubmitHappyTailModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.form-error').exists()).toBe(true)
    expect(wrapper.find('.form-error').text()).toContain('pet’s name')
  })
})
