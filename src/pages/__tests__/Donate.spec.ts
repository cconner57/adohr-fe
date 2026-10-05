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

  it('links donation checkout and care item sponsorship to Adoption-OS donation portal', () => {
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

    // Sponsor care ledger links (5 items)
    const sponsorLinks = wrapper.findAll('.sponsor-btn')
    expect(sponsorLinks.length).toBe(5)
    expect(sponsorLinks[0].attributes('href')).toBe(
      'https://adoption-os.com/donate/adohr?item=vaccines&amount=25&mode=one_time',
    )
    expect(sponsorLinks[1].attributes('href')).toBe(
      'https://adoption-os.com/donate/adohr?item=microchip&amount=60&mode=one_time',
    )
    expect(sponsorLinks[2].attributes('href')).toBe(
      'https://adoption-os.com/donate/adohr?item=spay_neuter&amount=150&mode=one_time',
    )
    expect(sponsorLinks[3].attributes('href')).toBe(
      'https://adoption-os.com/donate/adohr?item=foster_care&amount=300&mode=one_time',
    )
    expect(sponsorLinks[4].attributes('href')).toBe(
      'https://adoption-os.com/donate/adohr?item=emergency_vet&amount=500&mode=one_time',
    )
    sponsorLinks.forEach((link) => {
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })

    // Monthly recurring VIP button / link
    const vipLink = wrapper.find('.vip-cta')
    expect(vipLink.exists()).toBe(true)
    expect(vipLink.text()).toContain('Join the Pack')
    expect(vipLink.attributes('href')).toBe(
      'https://adoption-os.com/donate/adohr?mode=monthly&amount=25',
    )
    expect(vipLink.attributes('target')).toBe('_blank')
    expect(vipLink.attributes('rel')).toBe('noopener noreferrer')

    // One-time online donation link
    const onlineLink = wrapper.findAll('.way-card a.way-cta').find(b => b.text().includes('Donate Online'))
    expect(onlineLink).toBeDefined()
    expect(onlineLink!.attributes('href')).toBe(
      'https://adoption-os.com/donate/adohr?mode=one_time',
    )
    expect(onlineLink!.attributes('target')).toBe('_blank')
    expect(onlineLink!.attributes('rel')).toBe('noopener noreferrer')

    // Copy EIN tool button should remain enabled
    const copyBtn = wrapper.find('.copy-btn')
    expect(copyBtn.exists()).toBe(true)
    expect(copyBtn.attributes('disabled')).toBeUndefined()

    // Copy Zelle email tool button should remain enabled
    const copyZelleBtn = wrapper.find('.copy-zelle-btn')
    expect(copyZelleBtn.exists()).toBe(true)
    expect(copyZelleBtn.attributes('disabled')).toBeUndefined()
  })

  it('does not render the coming soon notice banner', () => {
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

    const notice = wrapper.find('.online-giving-notice')
    expect(notice.exists()).toBe(false)
  })

  it('copies Zelle email to clipboard when Copy Zelle button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText,
      },
    })

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

    const copyZelleBtn = wrapper.find('.copy-zelle-btn')
    expect(copyZelleBtn.text()).toBe('Copy Zelle Email')

    await copyZelleBtn.trigger('click')

    expect(writeText).toHaveBeenCalledWith('donate@adohr.org')
    expect(copyZelleBtn.text()).toBe('✓ Copied!')
  })
})
