import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import Donate from '../Donate.vue'

describe('Donate.vue', () => {
  beforeAll(() => {
    class MockIntersectionObserver {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  it('renders the donate page and includes the site Footer', () => {
    const wrapper = mount(Donate, {
      global: {
        directives: {
          'scroll-reveal': {},
        },
        stubs: {
          RouterLink: true,
          Footer: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Help a rescue find a')
    expect(wrapper.findComponent({ name: 'Footer' }).exists()).toBe(true)
  })

  it('disables donation checkout and sponsor buttons pending Stripe integration', () => {
    const wrapper = mount(Donate, {
      global: {
        directives: {
          'scroll-reveal': {},
        },
        stubs: {
          RouterLink: true,
          Footer: true,
        },
      },
    })

    // Sponsor care ledger buttons (5 buttons)
    const sponsorBtns = wrapper.findAll('.sponsor-btn')
    expect(sponsorBtns.length).toBe(5)
    sponsorBtns.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeDefined()
      expect(btn.attributes('aria-disabled')).toBe('true')
    })

    // Monthly recurring VIP button
    const vipBtn = wrapper.find('.vip-cta')
    expect(vipBtn.exists()).toBe(true)
    expect(vipBtn.text()).toContain('Join the Pack')
    expect(vipBtn.attributes('disabled')).toBeDefined()
    expect(vipBtn.attributes('aria-disabled')).toBe('true')

    // One-time online donation button
    const onlineBtn = wrapper.findAll('.way-card button.way-cta').find(b => b.text().includes('Donate Online'))
    expect(onlineBtn).toBeDefined()
    expect(onlineBtn!.attributes('disabled')).toBeDefined()
    expect(onlineBtn!.attributes('aria-disabled')).toBe('true')

    // Copy EIN tool button should remain enabled
    const copyBtn = wrapper.find('.copy-btn')
    expect(copyBtn.exists()).toBe(true)
    expect(copyBtn.attributes('disabled')).toBeUndefined()
  })
})
