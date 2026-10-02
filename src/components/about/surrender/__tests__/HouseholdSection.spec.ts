import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSurrenderStore } from '@/stores/surrender'

import HouseholdSection from '../HouseholdSection.vue'

describe('HouseholdSection.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders pet name and breed fields with appropriate labels', () => {
    const wrapper = mount(HouseholdSection, {
      props: {
        selectedAnimal: 'Dog',
        touched: {},
        handleBlur: vi.fn(),
        hasAttemptedSubmit: false,
      },
    })

    expect(wrapper.text()).toContain("Dog's Name")
    expect(wrapper.text()).toContain("Dog's Breed (optional)")
  })

  it('binds animalBreed to surrender store formState', async () => {
    const handleBlur = vi.fn()
    const wrapper = mount(HouseholdSection, {
      props: {
        selectedAnimal: 'Dog',
        touched: {},
        handleBlur,
        hasAttemptedSubmit: false,
      },
    })

    const surrenderStore = useSurrenderStore()
    expect(surrenderStore.formState.animalBreed).toBe('')

    const breedInput = wrapper
      .findAllComponents({ name: 'InputField' })
      .find((w) => w.props('label')?.includes('Breed'))

    expect(breedInput).toBeDefined()
    await breedInput?.vm.$emit('update:modelValue', 'Golden Retriever')

    expect(surrenderStore.formState.animalBreed).toBe('Golden Retriever')
  })
})
