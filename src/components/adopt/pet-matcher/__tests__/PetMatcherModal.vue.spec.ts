import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PetMatcherModal from '../PetMatcherModal.vue'

describe('PetMatcherModal.vue', () => {
  it('renders step 1 when open', () => {
    const wrapper = mount(PetMatcherModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Find Your Perfect Pet Match')
    expect(wrapper.text()).toContain('Step 1 of 4')
    expect(wrapper.text()).toContain('A Dog or Puppy')
    expect(wrapper.text()).toContain('A Cat or Kitten')
  })

  it('navigates through steps on next button click', async () => {
    const wrapper = mount(PetMatcherModal, {
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
    const nextBtn = buttons.find((b) => b.props('title') === 'Next Step →')
    expect(nextBtn).toBeTruthy()
    await nextBtn!.trigger('click')

    expect(wrapper.text()).toContain('Step 2 of 4')
    expect(wrapper.text()).toContain('Couch Potato / Chill')
  })
})
