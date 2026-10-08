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

  it('renders official Facebook link with secure target and rel attributes', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    const fbLink = wrapper.findAll('a.social-link').find(a => a.text().includes('Facebook'))
    expect(fbLink).toBeDefined()
    expect(fbLink!.attributes('href')).toBe('https://www.facebook.com/adohrpets')
    expect(fbLink!.attributes('target')).toBe('_blank')
    expect(fbLink!.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders official Instagram link with secure target and rel attributes', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    const igLink = wrapper.findAll('a.social-link').find(a => a.text().includes('Instagram'))
    expect(igLink).toBeDefined()
    expect(igLink!.attributes('href')).toBe('https://www.instagram.com/adohrpets')
    expect(igLink!.attributes('target')).toBe('_blank')
    expect(igLink!.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders physical street address and Charity ID / EIN', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    const text = wrapper.text()
    expect(text).toContain('Charity ID / EIN: 42-3096944')
    expect(text).toContain('3016 E Colorado Blvd, Unit 5543, Pasadena, CA 91107')
  })
})
