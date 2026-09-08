import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PetSmartEventBanner from '../PetSmartEventBanner.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('PetSmartEventBanner.vue', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders event header information with resilient defaults', () => {
    const wrapper = mount(PetSmartEventBanner, {
      props: {
        showFilterButton: true,
        isFilterActive: false,
      },
    })

    expect(wrapper.text()).toContain('PetSmart Pasadena')
    expect(wrapper.text()).toContain('3347 E Foothill Blvd')
    expect(wrapper.text()).toContain('Every Sat & Sun (12 PM – 4 PM)')
  })

  it('emits toggle-filter when the filter button is clicked', async () => {
    const wrapper = mount(PetSmartEventBanner, {
      props: {
        showFilterButton: true,
        isFilterActive: false,
      },
    })

    const filterBtn = wrapper.find('.filter-toggle-btn')
    expect(filterBtn.exists()).toBe(true)
    await filterBtn.trigger('click')

    expect(wrapper.emitted('toggle-filter')).toBeTruthy()
  })

  it('opens prep modal when What to Bring is clicked', async () => {
    const wrapper = mount(PetSmartEventBanner, {
      props: {
        showFilterButton: false,
      },
    })

    const buttons = wrapper.findAllComponents({ name: 'Button' })
    const prepBtn = buttons.find((b) => b.props('title') === 'What to Bring')
    expect(prepBtn).toBeTruthy()
    await prepBtn!.trigger('click')

    expect(wrapper.findComponent({ name: 'EventPrepModal' }).props('isOpen')).toBe(true)
  })

  it('applies variant-dark class when variant is dark', () => {
    const wrapper = mount(PetSmartEventBanner, {
      props: {
        variant: 'dark',
      },
    })

    expect(wrapper.find('.petsmart-banner').classes()).toContain('variant-dark')
  })
})
