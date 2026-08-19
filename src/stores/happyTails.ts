import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { MOCK_HAPPY_TAILS } from '@/constants/mockHappyTails'
import type { IHappyTail } from '@/models/happy-tails'

export const useHappyTailsStore = defineStore('happyTails', () => {
  const items = ref<IHappyTail[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sortedItems = computed(() => {
    return [...items.value].sort((a, b) => {
      return new Date(b.adoptedDate).getTime() - new Date(a.adoptedDate).getTime()
    })
  })

  const fetchHappyTails = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Use mock data until API is ready
      items.value = MOCK_HAPPY_TAILS
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load happy tails'
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    error,
    sortedItems,
    fetchHappyTails,
  }
})
