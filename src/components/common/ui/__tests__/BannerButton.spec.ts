import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BannerButton from '../BannerButton.vue'

describe('BannerButton', () => {
  it('renders default button properties', () => {
    const wrapper = mount(BannerButton, {
      props: {
        title: 'Adopt a Pet',
        subtitle: 'Find your perfect companion',
        color: 'blue',
      },
    })

    expect(wrapper.find('h5').text()).toBe('Adopt a Pet')
    expect(wrapper.find('p').text()).toBe('Find your perfect companion')
    expect(wrapper.classes()).toContain('button-color-blue')
  })

  it('renders inline SVG when icon="foster" is specified', () => {
    const wrapper = mount(BannerButton, {
      props: {
        icon: 'foster',
        title: 'Foster a pet',
        subtitle: 'Provide temporary care and save a life',
        color: 'purple',
      },
    })

    const svg = wrapper.find('svg.banner-icon')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('renders inline SVG when icon="adopt" is specified', () => {
    const wrapper = mount(BannerButton, {
      props: {
        icon: 'adopt',
        title: 'Adopt a pet',
        subtitle: 'Find your companion',
        color: 'blue',
      },
    })

    const svg = wrapper.find('svg.banner-icon')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 128 128')
  })

  it('renders inline SVG when icon="donate" is specified', () => {
    const wrapper = mount(BannerButton, {
      props: {
        icon: 'donate',
        title: 'Donate',
        subtitle: 'Help animals',
        color: 'green',
      },
    })

    const svg = wrapper.find('svg.banner-icon')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 128 128')
  })

  it('falls back to img when only imgSrc is specified', () => {
    const wrapper = mount(BannerButton, {
      props: {
        imgSrc: '/images/custom.png',
        title: 'Custom Action',
        subtitle: 'Custom subtitle',
        color: 'blue',
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/images/custom.png')
    expect(img.attributes('alt')).toBe('Custom Action')
  })
})
