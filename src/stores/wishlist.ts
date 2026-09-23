import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import type {
  IPublicWishlistResponse,
  IRawWishlistItem,
  IWishlistItem,
  WishlistCategory,
  WishlistPriority,
} from '@/models/wishlist'
import { PUBLIC_ORG_ID } from '@/utils/api'

export const normalizeWishlistItem = (raw: IRawWishlistItem): IWishlistItem => {
  const name = raw.title || raw.name || 'Care Item'
  const rawCost = (raw.priceEstimate || raw.estimatedCost || '').trim()
  const cleanCost = rawCost.replace(/^est\.?\s*/i, '')
  const priority = (raw.priority?.toLowerCase() || 'medium') as WishlistPriority
  const category = (raw.category?.toLowerCase() || 'comfort') as WishlistCategory

  return {
    id: String(raw.id),
    name,
    title: name,
    category,
    priority,
    description: raw.description || '',
    estimatedCost: cleanCost,
    priceEstimate: cleanCost,
    icon: raw.icon || 'heart',
    url: raw.url || '',
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<IWishlistItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const urgentItems = computed(() => {
    return items.value.filter((item) => item.priority === 'urgent')
  })

  const filteredByCategory = (category: WishlistCategory | 'all') => {
    if (category === 'all') return items.value
    return items.value.filter((item) => item.category === category)
  }

  const fetchWishlist = async (categoryFilter?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const url = new URL(API_ENDPOINTS.WISHLIST_PUBLIC)
      url.searchParams.set('orgId', PUBLIC_ORG_ID)
      if (categoryFilter && categoryFilter !== 'all') {
        url.searchParams.set('category', categoryFilter)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          'X-Org-Id': PUBLIC_ORG_ID,
        },
      })

      if (response.ok) {
        const payload: IPublicWishlistResponse = await response.json()
        const rawItems = payload.items || payload.data?.items || []
        items.value = rawItems.map(normalizeWishlistItem)
        return
      }

      items.value = []
      error.value = 'Unable to load wishlist at this time.'
    } catch {
      items.value = []
      error.value = 'Unable to load wishlist at this time.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    error,
    urgentItems,
    filteredByCategory,
    fetchWishlist,
  }
})
