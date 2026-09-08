import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FilterPanel from '../FilterPanel.vue'

describe('FilterPanel.vue', () => {
  const defaultFilters = {
    age: [],
    size: [],
    sex: '',
    goodWith: [],
    special: [],
  }

  it('renders filter drawer when open', () => {
    const wrapper = mount(FilterPanel, {
      props: {
        isOpen: true,
        currentFilters: defaultFilters,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    })

    expect(wrapper.text()).toContain('Filter Pets')
    expect(wrapper.text()).toContain('Age')
    expect(wrapper.text()).toContain('Size')
    expect(wrapper.text()).toContain('Sex')
    expect(wrapper.text()).toContain('Good With')
    expect(wrapper.text()).toContain('Special Tags')
    expect(wrapper.text()).toContain('Fee Sponsored')
    expect(wrapper.text()).toContain('Saved Pets')
  })

  it('emits clear event when Clear All is clicked', async () => {
    const wrapper = mount(FilterPanel, {
      props: {
        isOpen: true,
        currentFilters: defaultFilters,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    })

    const buttons = wrapper.findAllComponents({ name: 'Button' })
    const clearBtn = buttons.find((b) => b.props('title') === 'Clear All')
    expect(clearBtn).toBeTruthy()
    await clearBtn!.trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('emits apply and close events when Show Results is clicked', async () => {
    const wrapper = mount(FilterPanel, {
      props: {
        isOpen: true,
        currentFilters: defaultFilters,
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    })

    const buttons = wrapper.findAllComponents({ name: 'Button' })
    const applyBtn = buttons.find((b) => b.props('title') === 'Show Results')
    expect(applyBtn).toBeTruthy()
    await applyBtn!.trigger('click')

    expect(wrapper.emitted('apply')).toBeTruthy()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
