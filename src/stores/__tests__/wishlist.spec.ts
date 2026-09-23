import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MOCK_WISHLIST } from '@/constants/mockWishlist'
import { PUBLIC_ORG_ID } from '@/utils/api'

import { normalizeWishlistItem, useWishlistStore } from '../wishlist'

describe('useWishlistStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('normalizeWishlistItem', () => {
    it('normalizes raw API item fields to both contract and backwards-compatible properties', () => {
      const normalized = normalizeWishlistItem({
        id: 'item-101',
        title: 'Puppy Formula Milk Replacer',
        category: 'food',
        priority: 'urgent',
        description: 'Critical for orphaned puppies',
        priceEstimate: '$24.99',
        icon: 'bottle',
        url: 'https://chewy.com/item-101',
      })

      expect(normalized.id).toBe('item-101')
      expect(normalized.title).toBe('Puppy Formula Milk Replacer')
      expect(normalized.name).toBe('Puppy Formula Milk Replacer')
      expect(normalized.category).toBe('food')
      expect(normalized.priority).toBe('urgent')
      expect(normalized.description).toBe('Critical for orphaned puppies')
      expect(normalized.priceEstimate).toBe('$24.99')
      expect(normalized.estimatedCost).toBe('$24.99')
      expect(normalized.icon).toBe('bottle')
      expect(normalized.url).toBe('https://chewy.com/item-101')
    })

    it('falls back to defaults when optional fields are missing', () => {
      const normalized = normalizeWishlistItem({
        id: 'item-empty',
      })

      expect(normalized.id).toBe('item-empty')
      expect(normalized.name).toBe('Care Item')
      expect(normalized.title).toBe('Care Item')
      expect(normalized.category).toBe('comfort')
      expect(normalized.priority).toBe('medium')
      expect(normalized.description).toBe('')
      expect(normalized.priceEstimate).toBe('')
      expect(normalized.estimatedCost).toBe('')
      expect(normalized.icon).toBe('heart')
      expect(normalized.url).toBe('')
    })

    it('supports existing mock format with name and estimatedCost', () => {
      const normalized = normalizeWishlistItem({
        id: 'mock-1',
        name: 'Soft Bed',
        category: 'comfort',
        priority: 'high',
        description: 'Cozy washable bed',
        estimatedCost: '$30',
        icon: 'bed',
      })

      expect(normalized.name).toBe('Soft Bed')
      expect(normalized.title).toBe('Soft Bed')
      expect(normalized.estimatedCost).toBe('$30')
      expect(normalized.priceEstimate).toBe('$30')
      expect(normalized.icon).toBe('bed')
    })
  })

  describe('fetchWishlist', () => {
    it('fetches items from public wishlist API with orgId and header', async () => {
      const mockApiItems = [
        {
          id: 'item-1',
          title: 'Kitten Nursing Bottles',
          category: 'food',
          priority: 'urgent',
          description: 'Special nursing bottles',
          priceEstimate: '$12',
          icon: 'bottle',
          url: 'https://chewy.com/bottles',
        },
        {
          id: 'item-2',
          title: 'Orthopedic Dog Bed',
          category: 'comfort',
          priority: 'high',
          description: 'Memory foam bed for seniors',
          priceEstimate: '$45',
          icon: 'bed',
          url: 'https://amazon.com/bed',
        },
      ]

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          count: 2,
          items: mockApiItems,
        }),
      })
      vi.stubGlobal('fetch', fetchMock)

      const store = useWishlistStore()
      await store.fetchWishlist()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [calledUrl, calledInit] = fetchMock.mock.calls[0]
      expect(calledUrl).toContain(`orgId=${PUBLIC_ORG_ID}`)
      expect(calledInit.headers['X-Org-Id']).toBe(PUBLIC_ORG_ID)

      expect(store.items).toHaveLength(2)
      expect(store.items[0].title).toBe('Kitten Nursing Bottles')
      expect(store.items[0].priceEstimate).toBe('$12')
      expect(store.items[0].url).toBe('https://chewy.com/bottles')
      expect(store.urgentItems).toHaveLength(1)
      expect(store.urgentItems[0].title).toBe('Kitten Nursing Bottles')
      expect(store.filteredByCategory('comfort')).toHaveLength(1)
    })

    it('passes category query parameter when filtering', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          count: 0,
          items: [],
        }),
      })
      vi.stubGlobal('fetch', fetchMock)

      const store = useWishlistStore()
      await store.fetchWishlist('medical')

      const [calledUrl] = fetchMock.mock.calls[0]
      expect(calledUrl).toContain('category=medical')
    })

    it('falls back to mock wishlist if API request fails with network error', async () => {
      const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'))
      vi.stubGlobal('fetch', fetchMock)

      const store = useWishlistStore()
      await store.fetchWishlist()

      expect(store.items.length).toBeGreaterThan(0)
      expect(store.items.length).toBe(MOCK_WISHLIST.length)
      expect(store.items[0].title).toBe(MOCK_WISHLIST[0].name)
    })

    it('falls back to mock wishlist if API returns non-200 status', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      })
      vi.stubGlobal('fetch', fetchMock)

      const store = useWishlistStore()
      await store.fetchWishlist()

      expect(store.items.length).toBeGreaterThan(0)
      expect(store.items.length).toBe(MOCK_WISHLIST.length)
    })

    it('falls back to mock wishlist if API returns empty list', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ count: 0, items: [] }),
      })
      vi.stubGlobal('fetch', fetchMock)

      const store = useWishlistStore()
      await store.fetchWishlist()

      expect(store.items.length).toBe(MOCK_WISHLIST.length)
    })
  })
})
