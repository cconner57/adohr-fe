import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import type { IPet } from '@/models/common'
import { usePetStore } from '@/stores/pets'

export const usePets = () => {
  const store = usePetStore()
  const { currentPets, isFetching: loading } = storeToRefs(store)

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
    const candidates = featured.length > 0 ? featured : currentPets.value
    const fresh = candidates.slice(0, 4)
    return fresh.length > 0 ? fresh : cachedPets.value
  })

  watch(
    () => currentPets.value,
    (pets) => {
      const featured = pets.filter((p) => p.profileSettings?.isSpotlightFeatured)
      const candidates = featured.length > 0 ? featured : pets
      const fresh = candidates.slice(0, 4)
      if (fresh.length > 0 && typeof window !== 'undefined') {
        cachedPets.value = fresh
        try {
          sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(fresh))
        } catch {
          // Ignore storage quota error
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

