import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import Wishlist from '../Wishlist.vue'

describe('Wishlist.vue', () => {
  beforeAll(() => {
    class MockIntersectionObserver {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the page and has disabled Amazon and Chewy wishlist buttons', () => {
    const wrapper = mount(Wishlist, {
      global: {
        directives: {
          'scroll-reveal': {},
        },
        stubs: {
          Footer: true,
          WishlistIcon: true,
        },
      },
    })

    const amazonBtn = wrapper.find('.amazon-btn')
    const chewyBtn = wrapper.find('.chewy-btn')

    expect(amazonBtn.exists()).toBe(true)
    expect(chewyBtn.exists()).toBe(true)

    expect(amazonBtn.element.tagName).toBe('BUTTON')
    expect(chewyBtn.element.tagName).toBe('BUTTON')

    expect(amazonBtn.attributes('disabled')).toBeDefined()
    expect(chewyBtn.attributes('disabled')).toBeDefined()

    expect(amazonBtn.text()).toContain('Coming Soon')
    expect(chewyBtn.text()).toContain('Coming Soon')
  })

  it('renders exactly 2 help steps and excludes Ship Directly', () => {
    const wrapper = mount(Wishlist, {
      global: {
        directives: {
          'scroll-reveal': {},
        },
        stubs: {
          Footer: true,
          WishlistIcon: true,
        },
      },
    })

    const steps = wrapper.findAll('.step-card')
    expect(steps).toHaveLength(2)
    expect(steps[0].text()).toContain('Browse or Shop Online')
    expect(steps[1].text()).toContain('Drop Off Locally')
    expect(wrapper.text()).not.toContain('Ship Directly')
  })
})
