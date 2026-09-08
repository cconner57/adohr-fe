import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive, ref } from 'vue'

import type { IPet } from '@/models/common'

import AdoptDrawer from '../AdoptDrawer.vue'

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
  name: 'Destiny',
  species: 'cat',
} as IPet

const mountDrawer = () => {
  return mount(AdoptDrawer, {
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

describe('AdoptDrawer.vue', () => {
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

  it('submits when all required fields are completed', async () => {
    const wrapper = mountDrawer()
    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Chris')
    await inputs[1].setValue('Test')
    await inputs[2].setValue('test@test.com')
    await inputs[3].setValue('1231231233')
    await inputs[4].setValue('2026-04-04')
    await inputs[5].setValue('11:00')

    await wrapper.find('button').trigger('click')

    expect(submitInquiry).toHaveBeenCalledTimes(1)
    expect(submitInquiry).toHaveBeenCalledWith({
      message: 'Preferred Date: 2026-04-04\nPreferred Time: 11:00',
    })
  })
})
