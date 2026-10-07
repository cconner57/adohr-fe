import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Footer from '../Footer.vue'

describe('Footer.vue', () => {
  it('renders default footer with dark border-top', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.find('.footer').classes()).toContain('border-top-dark')
    expect(wrapper.text()).toContain('Every pet,')
  })

  it('applies border-top-white class when borderTopColor is white', () => {
    const wrapper = mount(Footer, {
      props: {
        borderTopColor: 'white',
      },
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.find('.footer').classes()).toContain('border-top-white')
  })

  it('renders link to official legal and 501(c)(3) verification page', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    const legalLink = wrapper.find('.footer-legal-link')
    expect(legalLink.exists()).toBe(true)
    expect(legalLink.attributes('href')).toBe('/legal.html')
    expect(legalLink.text()).toContain('501(c)(3) Legal Notice')
  })
})
