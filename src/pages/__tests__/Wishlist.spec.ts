import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

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
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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

  it('renders wishlist items from API response including Buy/Donate external link and urgent banner', async () => {
    const mockItems = [
      {
        id: 'item-live-1',
        title: 'Puppy Nursing Bottles',
        category: 'food',
        priority: 'urgent',
        description: 'For neonates needing bottle feeding',
        priceEstimate: '$14.99',
        icon: 'bottle',
        url: 'https://chewy.com/puppy-bottles',
      },
      {
        id: 'item-live-2',
        title: 'Fleece Blankets',
        category: 'comfort',
        priority: 'medium',
        description: 'Cozy washable fleece blankets',
        priceEstimate: '$20.00',
        icon: 'blanket',
        url: '',
      },
    ]

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 2,
        items: mockItems,
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

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

    await flushPromises()

    // Urgent banner check
    const urgentBanner = wrapper.find('.urgent-banner')
    expect(urgentBanner.exists()).toBe(true)
    expect(urgentBanner.text()).toContain('Puppy Nursing Bottles')

    // Item cards check
    const cards = wrapper.findAll('.supply-card')
    expect(cards).toHaveLength(2)

    const firstCard = cards[0]
    expect(firstCard.find('h3').text()).toBe('Puppy Nursing Bottles')
    expect(firstCard.find('.cost-badge').text()).toBe('Est. $14.99')

    const firstCardLink = firstCard.find('.item-link')
    expect(firstCardLink.exists()).toBe(true)
    expect(firstCardLink.attributes('href')).toBe('https://chewy.com/puppy-bottles')
    expect(firstCardLink.attributes('target')).toBe('_blank')

    // Second card has no URL, so no .item-link
    const secondCard = cards[1]
    expect(secondCard.find('h3').text()).toBe('Fleece Blankets')
    expect(secondCard.find('.item-link').exists()).toBe(false)
  })

  it('renders "No items at this time" empty state and hides category filters when API returns 0 items', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 0,
        items: [],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

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

    await flushPromises()

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-title').text()).toBe('No items at this time')
    expect(wrapper.find('.urgent-banner').exists()).toBe(false)
    expect(wrapper.find('.category-filters').exists()).toBe(false)
    expect(wrapper.findAll('.supply-card')).toHaveLength(0)
  })
})
