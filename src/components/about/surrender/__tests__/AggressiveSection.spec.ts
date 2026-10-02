import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useSurrenderStore } from '@/stores/surrender'

import AggressiveSection from '../AggressiveSection.vue'

describe('AggressiveSection.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('defaults to "No" and disables explanation fields initially', () => {
    const wrapper = mount(AggressiveSection, {
      props: {
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    expect(surrenderStore.formState.animalEverAttackedPeople).toBe('No')
    expect(surrenderStore.formState.animalEverAttackedOtherCats).toBe('No')

    const textareas = wrapper.findAll('textarea')
    expect(textareas).toHaveLength(2)
    expect(textareas[0].attributes('disabled')).toBeDefined()
    expect(textareas[1].attributes('disabled')).toBeDefined()
  })

  it('enables explanation when toggle is set to "Yes"', async () => {
    const wrapper = mount(AggressiveSection, {
      props: {
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    surrenderStore.formState.animalEverAttackedPeople = 'Yes'
    await wrapper.vm.$nextTick()

    const textareas = wrapper.findAll('textarea')
    expect(textareas[0].attributes('disabled')).toBeUndefined()
  })

  it('clears explanation and disables textarea when toggle is changed back to "No"', async () => {
    const wrapper = mount(AggressiveSection, {
      props: {
        selectedAnimal: 'Dog',
      },
    })

    const surrenderStore = useSurrenderStore()
    surrenderStore.formState.animalEverAttackedPeople = 'Yes'
    surrenderStore.formState.animalEverAttackedPeopleExplanation = 'Broke out and bit a visitor'
    await wrapper.vm.$nextTick()

    const toggle = wrapper.findComponent({ name: 'ButtonToggle' })
    toggle.vm.$emit('update:modelValue', 'No')
    await wrapper.vm.$nextTick()

    expect(surrenderStore.formState.animalEverAttackedPeople).toBe('No')
    expect(surrenderStore.formState.animalEverAttackedPeopleExplanation).toBe('')

    const textareas = wrapper.findAll('textarea')
    expect(textareas[0].attributes('disabled')).toBeDefined()
  })
})
