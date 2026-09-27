import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

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

  it('opens without calling scrollIntoView on window/elements to prevent page shifts', async () => {
    const scrollIntoViewSpy = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewSpy

    const wrapper = mount(Select, {
      props: { modelValue: null, options },
      global: { stubs: { Teleport: true } },
    })

    await wrapper.find('.select-trigger').trigger('click')
    expect(wrapper.find('.options-menu').isVisible()).toBe(true)
    expect(scrollIntoViewSpy).not.toHaveBeenCalled()
  })

  it('renders rich option metadata including thumbnail, species, sex, and age', async () => {
    const richOptions = [
      {
        label: 'Luna',
        value: 'luna-1',
        image: 'https://cdn.example.com/luna.jpg',
        species: 'Cat',
        sex: 'Female',
        age: '2 yr',
      },
    ]

    const wrapper = mount(Select, {
      props: { modelValue: null, options: richOptions },
      global: { stubs: { Teleport: true } },
    })

    await wrapper.find('.select-trigger').trigger('click')
    const img = wrapper.find('.option-pet-thumb')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://cdn.example.com/luna.jpg')

    const metaTags = wrapper.find('.option-meta-tags')
    expect(metaTags.text()).toContain('Cat')
    expect(metaTags.text()).toContain('Female')
    expect(metaTags.text()).toContain('2 yr')
  })

  it('paginates options with pageSize and shows scroll load more indicator', async () => {
    const manyOptions = Array.from({ length: 60 }, (_, i) => ({
      label: `Pet ${i + 1}`,
      value: `pet-${i + 1}`,
    }))

    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: manyOptions,
        pageSize: 25,
        loadMoreText: 'Loading more pets...',
      },
      global: { stubs: { Teleport: true } },
    })

    await wrapper.find('.select-trigger').trigger('click')
    // pageSize is 25, initially visible is pageSize + 1 = 26 items (or up to 26)
    const renderedItems = wrapper.findAll('.option-item')
    expect(renderedItems.length).toBe(26)

    const scrollTrigger = wrapper.find('.scroll-more-trigger')
    expect(scrollTrigger.exists()).toBe(true)
    expect(scrollTrigger.text()).toContain('Scroll to load more')
  })
})
