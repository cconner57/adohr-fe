import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import type { IPet } from '@/models/common'
import { usePetStore } from '@/stores/pets'

export const usePets = () => {
  const store = usePetStore()
  const { currentPets, isFetching: loading, lastFetched } = storeToRefs(store)

  const SESSION_CACHE_KEY = 'adohr_spotlight_pets'
  let initialCache: IPet[] = []
  try {
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_CACHE_KEY) : null
    if (cached) {
      initialCache = JSON.parse(cached)
    }
  } catch {
    // Ignore storage parse failure
  }
  const cachedPets = ref<IPet[]>(initialCache)

  const spotlightPets = computed(() => {
    const featured = currentPets.value.filter((p) => p.profileSettings?.isSpotlightFeatured)
    if (lastFetched.value > 0) {
      return featured
    }
    return featured.length > 0 ? featured : cachedPets.value
  })

  watch(
    [() => currentPets.value, lastFetched],
    ([pets, fetchedAt]) => {
      const featured = pets.filter((p) => p.profileSettings?.isSpotlightFeatured)
      if (featured.length > 0 && typeof window !== 'undefined') {
        cachedPets.value = featured
        try {
          sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(featured))
        } catch {
          // Ignore storage quota error
        }
      } else if (fetchedAt > 0 && typeof window !== 'undefined') {
        cachedPets.value = []
        try {
          sessionStorage.removeItem(SESSION_CACHE_KEY)
        } catch {
          // Ignore storage error
        }
      }
    },
    { immediate: true },
  )

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

