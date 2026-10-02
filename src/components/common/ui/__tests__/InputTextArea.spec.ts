import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import InputTextArea from '../InputTextArea.vue'

describe('InputTextArea.vue', () => {
  it('renders label and placeholder', () => {
    const wrapper = mount(InputTextArea, {
      props: {
        label: 'Explanation',
        placeholder: 'Enter details',
        modelValue: '',
      },
    })
    expect(wrapper.find('label').text()).toBe('Explanation')
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter details')
    expect(wrapper.find('textarea').attributes('disabled')).toBeUndefined()
    expect(wrapper.classes()).not.toContain('is-disabled')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(InputTextArea, {
      props: {
        label: 'Explanation',
        placeholder: 'Enter details',
        modelValue: '',
      },
    })

    await wrapper.find('textarea').setValue('Some explanation')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Some explanation'])
  })

  it('applies disabled state when disabled prop is true', () => {
    const wrapper = mount(InputTextArea, {
      props: {
        label: 'Explanation',
        placeholder: 'Enter details',
        modelValue: '',
        disabled: true,
      },
    })

    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('applies error class and aria-invalid when hasError is true', () => {
    const wrapper = mount(InputTextArea, {
      props: {
        label: 'Explanation',
        placeholder: 'Enter details',
        modelValue: '',
        hasError: true,
      },
    })

    expect(wrapper.classes()).toContain('has-error')
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
  })

  it('renders character count when maxChars is provided', () => {
    const wrapper = mount(InputTextArea, {
      props: {
        label: 'Explanation',
        placeholder: 'Enter details',
        modelValue: 'hello',
        maxChars: 100,
      },
    })

    expect(wrapper.find('.char-count').text()).toBe('5 / 100')
    expect(wrapper.find('textarea').attributes('maxlength')).toBe('100')
  })
})
