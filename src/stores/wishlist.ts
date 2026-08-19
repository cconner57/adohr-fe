import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { MOCK_WISHLIST } from '@/constants/mockWishlist'
import type { IWishlistItem, WishlistCategory } from '@/models/wishlist'

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

  const fetchWishlist = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Use mock data until API is ready
      items.value = MOCK_WISHLIST
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load wishlist'
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
