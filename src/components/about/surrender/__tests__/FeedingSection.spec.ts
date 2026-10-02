import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSurrenderStore } from '@/stores/surrender'

import FeedingSection from '../FeedingSection.vue'

describe('FeedingSection.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('defaults treats question to "No" and disables treats explanation input initially', () => {
    const wrapper = mount(FeedingSection, {
      props: {
        touched: {},
        handleBlur: vi.fn(),
        hasAttemptedSubmit: false,
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    expect(surrenderStore.formState.animalFoodTreats).toBe('No')

    const inputField = wrapper.findComponent({ name: 'InputField' })
    expect(inputField.props('disabled')).toBe(true)
    expect(wrapper.find('input[placeholder="Answer"]').attributes('disabled')).toBeDefined()
  })

  it('enables treats explanation input when "Yes" is toggled', async () => {
    const wrapper = mount(FeedingSection, {
      props: {
        touched: {},
        handleBlur: vi.fn(),
        hasAttemptedSubmit: false,
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    const toggle = wrapper.findComponent({ name: 'ButtonToggle' })
    toggle.vm.$emit('update:modelValue', 'Yes')
    await wrapper.vm.$nextTick()

    expect(surrenderStore.formState.animalFoodTreats).toBe('Yes')
    const inputField = wrapper.findComponent({ name: 'InputField' })
    expect(inputField.props('disabled')).toBe(false)
    expect(wrapper.find('input[placeholder="Answer"]').attributes('disabled')).toBeUndefined()
  })

  it('clears explanation and disables input when toggled back to "No"', async () => {
    const wrapper = mount(FeedingSection, {
      props: {
        touched: {},
        handleBlur: vi.fn(),
        hasAttemptedSubmit: false,
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    const toggle = wrapper.findComponent({ name: 'ButtonToggle' })
    toggle.vm.$emit('update:modelValue', 'Yes')
    surrenderStore.formState.animalFoodTreatsExplanation = 'Peanut butter treats'
    await wrapper.vm.$nextTick()

    toggle.vm.$emit('update:modelValue', 'No')
    await wrapper.vm.$nextTick()

    expect(surrenderStore.formState.animalFoodTreats).toBe('No')
    expect(surrenderStore.formState.animalFoodTreatsExplanation).toBe('')
    const inputField = wrapper.findComponent({ name: 'InputField' })
    expect(inputField.props('disabled')).toBe(true)
  })
})
