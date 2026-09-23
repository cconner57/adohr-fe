import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useHappyTailsStore } from '@/stores/happyTails'

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

  it('validates invalid email when entered', async () => {
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

    await wrapper.find('#ht-pet-name').setValue('Luna')
    await wrapper.find('#ht-adopter-name').setValue('Sarah')
    await wrapper.find('#ht-adopter-email').setValue('invalid-email')
    await wrapper.find('#ht-story').setValue('This is a wonderful story about our rescued kitten.')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.form-error').exists()).toBe(true)
    expect(wrapper.find('.form-error').text()).toContain('valid email')
  })

  it('submits form successfully when required fields are filled', async () => {
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

    const store = useHappyTailsStore()
    const submitSpy = vi.spyOn(store, 'submitHappyTail').mockResolvedValue({ status: 'success' })

    await wrapper.find('#ht-pet-name').setValue('Luna')
    await wrapper.find('#ht-adopter-name').setValue('Sarah Jenkins')
    await wrapper.find('#ht-adopter-email').setValue('sarah@example.com')
    await wrapper.find('#ht-story').setValue('Luna settled in immediately and loves playing with catnip mice.')
    await wrapper.find('form').trigger('submit.prevent')

    expect(submitSpy).toHaveBeenCalled()
    expect(wrapper.emitted('submitted')).toBeTruthy()
  })
})
