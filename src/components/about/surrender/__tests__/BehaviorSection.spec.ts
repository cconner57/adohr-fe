import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSurrenderStore } from '@/stores/surrender'

import BehaviorSection from '../BehaviorSection.vue'

describe('BehaviorSection.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('disables explanation fields when controlling answers are No or not Yes', () => {
    const wrapper = mount(BehaviorSection, {
      props: {
        touched: {},
        handleBlur: vi.fn(),
        hasAttemptedSubmit: false,
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    // Defaults are 'No' on mounted
    expect(surrenderStore.formState.animalScaredOfAnything).toBe('No')
    expect(surrenderStore.formState.animalEscapedBefore).toBe('No')

    const textareas = wrapper.findAllComponents({ name: 'InputTextArea' })
    // index 1: scared explanation
    expect(textareas[1].props('disabled')).toBe(true)
    // index 4: car riding explanation
    expect(textareas[4].props('disabled')).toBe(true)
    // index 5: escaped explanation
    expect(textareas[5].props('disabled')).toBe(true)
  })

  it('enables car riding explanation only when Yes is selected, and disables/clears when changed to No', async () => {
    const wrapper = mount(BehaviorSection, {
      props: {
        touched: {},
        handleBlur: vi.fn(),
        hasAttemptedSubmit: false,
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    const textareas = wrapper.findAllComponents({ name: 'InputTextArea' })
    const carExplanation = textareas[4]

    expect(carExplanation.props('disabled')).toBe(true)

    // Select 'Yes' via InputSelectGroup
    const selectGroups = wrapper.findAllComponents({ name: 'InputSelectGroup' })
    const carSelectGroup = selectGroups.find((w) => w.props('label')?.includes('riding in cars'))
    carSelectGroup?.vm.$emit('update:modelValue', 'Yes')
    await wrapper.vm.$nextTick()

    expect(surrenderStore.formState.animalProblemsRidingInCar).toBe('Yes')
    expect(carExplanation.props('disabled')).toBe(false)

    // Set an explanation value
    surrenderStore.formState.animalProblemsRidingInCarExplanation = 'Gets motion sick'

    // Change to 'No' via the InputSelectGroup
    carSelectGroup?.vm.$emit('update:modelValue', 'No')
    await wrapper.vm.$nextTick()

    expect(surrenderStore.formState.animalProblemsRidingInCar).toBe('No')
    expect(surrenderStore.formState.animalProblemsRidingInCarExplanation).toBe('')
    expect(carExplanation.props('disabled')).toBe(true)
  })

  it('enables escaped explanation only when Yes is selected, and disables/clears when changed to No', async () => {
    const wrapper = mount(BehaviorSection, {
      props: {
        touched: {},
        handleBlur: vi.fn(),
        hasAttemptedSubmit: false,
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    const textareas = wrapper.findAllComponents({ name: 'InputTextArea' })
    const escapeExplanation = textareas[5]

    expect(escapeExplanation.props('disabled')).toBe(true)

    // Select 'Yes' via ButtonToggle
    const toggles = wrapper.findAllComponents({ name: 'ButtonToggle' })
    const escapeToggle = toggles.find((w) => w.props('label')?.includes('escaped your property'))
    escapeToggle?.vm.$emit('update:modelValue', 'Yes')
    await wrapper.vm.$nextTick()

    expect(surrenderStore.formState.animalEscapedBefore).toBe('Yes')
    expect(escapeExplanation.props('disabled')).toBe(false)

    // Set an explanation value
    surrenderStore.formState.animalEscapedBeforeExplanation = 'Jumped over the fence'

    // Change to 'No' via ButtonToggle
    escapeToggle?.vm.$emit('update:modelValue', 'No')
    await wrapper.vm.$nextTick()

    expect(surrenderStore.formState.animalEscapedBefore).toBe('No')
    expect(surrenderStore.formState.animalEscapedBeforeExplanation).toBe('')
    expect(escapeExplanation.props('disabled')).toBe(true)
  })
})
