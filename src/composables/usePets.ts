import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import type { IPet } from '../models/common'
import { usePetStore } from '../stores/pets'

export function usePets() {
  const store = usePetStore()
  const { currentPets, isFetching: loading } = storeToRefs(store)

  const SESSION_CACHE_KEY = 'adohr_spotlight_pets'
  const cached = sessionStorage.getItem(SESSION_CACHE_KEY)
  const cachedPets = ref<IPet[]>(cached ? JSON.parse(cached) : [])

  const spotlightPets = computed(() => {
    const featured = currentPets.value.filter((p) => p.profileSettings?.isSpotlightFeatured)
    const candidates = featured.length > 0 ? featured : currentPets.value
    const freshPets = candidates.slice(0, 4)

    if (freshPets.length > 0) {
      if (JSON.stringify(freshPets) !== JSON.stringify(cachedPets.value)) {
        cachedPets.value = freshPets
        sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(freshPets))
      }
      return freshPets
    }

    return cachedPets.value
  })

  const fetchSpotlight = async () => {
    await store.fetchPets()
  }

  return {
    spotlightPets,
    loading: computed(() => loading.value && spotlightPets.value.length === 0),
    error: store.error,
    fetchSpotlight,
  }
}
