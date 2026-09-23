import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ImagePlaceholder from '../ImagePlaceholder.vue'

describe('ImagePlaceholder.vue', () => {
  it('renders with default paw icon', () => {
    const wrapper = mount(ImagePlaceholder)
    expect(wrapper.find('.img-fallback').exists()).toBe(true)
    expect(wrapper.find('.fallback-svg').exists()).toBe(true)
  })

  it('renders label when provided', () => {
    const wrapper = mount(ImagePlaceholder, {
      props: { label: 'Luna' },
    })
    expect(wrapper.find('.fallback-label').text()).toBe('Luna')
  })

  it('renders photo icon when icon prop is photo', () => {
    const wrapper = mount(ImagePlaceholder, {
      props: { icon: 'photo' },
    })
    expect(wrapper.find('rect').exists()).toBe(true)
  })

  it('applies size classes correctly', () => {
    const wrapperSmall = mount(ImagePlaceholder, {
      props: { size: 'small' },
    })
    expect(wrapperSmall.find('.size-small').exists()).toBe(true)

    const wrapperLarge = mount(ImagePlaceholder, {
      props: { size: 'large' },
    })
    expect(wrapperLarge.find('.size-large').exists()).toBe(true)
  })
})
