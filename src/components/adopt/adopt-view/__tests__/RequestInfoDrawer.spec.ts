import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive, ref } from 'vue'

import type { IPet } from '@/models/common'

import RequestInfoDrawer from '../RequestInfoDrawer.vue'

const submitInquiry = vi.fn()
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

vi.mock('@/composables/usePetInquiry', () => {
  return {
    usePetInquiry: () => ({
      formData,
      isSubmitting: ref(false),
      isSubmitted: ref(false),
      apiError: ref(null),
      submitInquiry,
    }),
  }
})

const pet = {
  id: 'pet-1',
  name: 'Freya',
  species: 'cat',
} as IPet

const mountDrawer = () => {
  return mount(RequestInfoDrawer, {
    props: {
      pet,
      isDrawerOpen: true,
    },
    global: {
      stubs: {
        Drawer: {
          template: '<div><slot /><slot name="footer" /></div>',
        },
      },
    },
  })
}

describe('RequestInfoDrawer.vue', () => {
  beforeEach(() => {
    submitInquiry.mockReset()
    formData.firstName = ''
    formData.lastName = ''
    formData.email = ''
    formData.phone = ''
  })

  it('does not submit when required fields are missing', async () => {
    const wrapper = mountDrawer()

    await wrapper.find('button').trigger('click')

    expect(submitInquiry).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Please complete all required fields:')
  })

  it('masks the phone input while typing', async () => {
    const wrapper = mountDrawer()
    const inputs = wrapper.findAll('input')

    await inputs[3].setValue('3235551212')

    expect(formData.phone).toBe('323-555-1212')
    expect((inputs[3].element as HTMLInputElement).value).toBe('323-555-1212')
  })

  it('submits when required fields are completed and phone is blank', async () => {
    const wrapper = mountDrawer()
    const inputs = wrapper.findAll('input')
    const textarea = wrapper.find('textarea')

    await inputs[0].setValue('Chris')
    await inputs[1].setValue('Test')
    await inputs[2].setValue('test@test.com')
    await textarea.setValue('Testing request info')

    await wrapper.find('button').trigger('click')

    expect(submitInquiry).toHaveBeenCalledTimes(1)
    expect(submitInquiry).toHaveBeenCalledWith({
      message: 'Testing request info',
    })
  })
})
