import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Select from '../Select.vue'

describe('Select.vue', () => {
  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ]

  it('renders correctly with placeholder', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options,
        placeholder: 'Choose me',
      },
    })
    expect(wrapper.text()).toContain('Choose me')
  })

  it('opens menu on click', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options },
      global: { stubs: { Teleport: true } },
    })

    await wrapper.find('.select-trigger').trigger('click')
    expect(wrapper.find('.options-menu').isVisible()).toBe(true)
    expect(wrapper.text()).toContain('Option 1')
  })

  it('selects an option', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options },
      global: { stubs: { Teleport: true } },
    })

    await wrapper.find('.select-trigger').trigger('click')
    await wrapper.findAll('.option-item')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['opt1'])
    // It should close after selection (single mode)
    expect(wrapper.find('.options-menu').isVisible()).toBe(false)
  })

  it('handles multiple selection', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: ['opt1'], // Initial value
        options,
        multiple: true,
      },
      global: { stubs: { Teleport: true } },
    })

    await wrapper.find('.select-trigger').trigger('click')
    // Select Option 2
    await wrapper.findAll('.option-item')[1].trigger('click')

    // Should emit updated array
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['opt1', 'opt2']])

    // Should NOT close
    expect(wrapper.find('.options-menu').isVisible()).toBe(true)
  })

  it('closes on escape', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options },
      global: { stubs: { Teleport: true } },
    })

    await wrapper.find('.select-trigger').trigger('click')
    expect(wrapper.find('.options-menu').isVisible()).toBe(true)

    await wrapper.find('.select-trigger').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.options-menu').isVisible()).toBe(false)
  })

  it('selects option via keyboard typeahead search', async () => {
    const dateOptions = [
      { label: 'January (01)', value: '01' },
      { label: 'October (10)', value: '10' },
      { label: 'November (11)', value: '11' },
    ]
    const wrapper = mount(Select, {
      props: { modelValue: null, options: dateOptions },
      global: { stubs: { Teleport: true } },
    })

    // Type 'o' to select October
    await wrapper.find('.select-trigger').trigger('keydown', { key: 'o' })
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['10'])
  })

  it('navigates options with arrow keys and selects with Enter', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options },
      global: { stubs: { Teleport: true } },
    })

    // Open with Enter
    await wrapper.find('.select-trigger').trigger('keydown', { key: 'Enter' })
    expect(wrapper.find('.options-menu').isVisible()).toBe(true)

    // Arrow down to Option 2
    await wrapper.find('.select-trigger').trigger('keydown', { key: 'ArrowDown' })
    // Press Enter to select
    await wrapper.find('.select-trigger').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['opt2'])
  })
})
