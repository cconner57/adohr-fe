<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AdoptDetail from '@/components/adopt/adopt-view/AdoptDetail.vue'
import AdoptSummary from '@/components/adopt/adopt-view/AdoptSummary.vue'
import AdoptPageHeader from '@/components/adopt/AdoptPageHeader.vue'
import EventBanner from '@/components/adopt/events/EventBanner.vue'
import FilterPanel from '@/components/adopt/FilterPanel.vue'
import PetMatcherModal, { type IMatcherCriteria } from '@/components/adopt/pet-matcher/PetMatcherModal.vue'
import PetItemSkeleton from '@/components/common/pet-item/PetItemSkeleton.vue'
import { useAdoptionEvents } from '@/composables/useAdoptionEvents'
import { useFavorites } from '@/composables/useFavorites'
import type { IPet } from '@/models/common'
import { usePetStore } from '@/stores/pets'
import { getPetSpecialNeeds } from '@/utils/petNormalizer'

const { attendingPetIds, fetchUpcomingEvents } = useAdoptionEvents()
const { isFavorite, favoriteCount } = useFavorites()

const props = defineProps<{ id?: string }>()
const route = useRoute()
const store = usePetStore()
const { currentPets, isFetching } = storeToRefs(store)

const id = computed(() => props.id ?? (route.params.id as string | undefined))
const detailPet = ref<IPet | null>(null)
const isFilterPanelOpen = ref(false)
const isMatcherOpen = ref(false)
const isAttendingWeekendOnly = ref(false)
const isFavoritesOnly = ref(false)
const searchQuery = ref('')

const toggleFavoritesOnly = () => {
  isFavoritesOnly.value = !isFavoritesOnly.value
}

const activeFilter = ref('All')
const advancedFilters = ref({
  age: [] as string[],
  size: [] as string[],
  sex: '',
  goodWith: [] as string[],
  special: [] as string[],
})

const applyAdvancedFilters = (newFilters: typeof advancedFilters.value) => {
  advancedFilters.value = newFilters
  isFilterPanelOpen.value = false
}

const clearFilters = () => {
  advancedFilters.value = {
    age: [],
    size: [],
    sex: '',
    goodWith: [],
    special: [],
  }
  searchQuery.value = ''
  isAttendingWeekendOnly.value = false
  isFavoritesOnly.value = false
}

const resetAllFilters = () => {
  activeFilter.value = 'All'
  clearFilters()
  isFilterPanelOpen.value = false
}

const handleMatcherApply = (criteria: IMatcherCriteria) => {
  if (criteria.species !== 'All') {
    activeFilter.value = criteria.species
  } else {
    activeFilter.value = 'All'
  }

  advancedFilters.value.goodWith = [...criteria.goodWith]
}

const applyRouteQueryFilters = (q: typeof route.query) => {
  if (q.filter === 'weekend' || q.weekend === 'true' || q.weekendOnly === 'true') {
    isAttendingWeekendOnly.value = true
  } else if (q.filter === 'saved' || q.saved === 'true' || q.filter === 'favorites' || q.favorites === 'true') {
    isFavoritesOnly.value = true
  } else if (q.filter === 'sponsored' || q.sponsored === 'true') {
    if (!advancedFilters.value.special.includes('sponsored')) {
      advancedFilters.value.special.push('sponsored')
    }
  }
}

onMounted(() => {
  fetchUpcomingEvents()
  if (!id.value) {
    store.fetchPetsList()
  }
  applyRouteQueryFilters(route.query)
})

watch(
  () => route.query,
  (q) => {
    applyRouteQueryFilters(q)
  },
)

const filteredPets = computed(() => {
  let result = currentPets.value

  // 1. Text Search Filter (name & breed)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter((p: IPet) => {
      const nameMatch = p.name?.toLowerCase().includes(q)
      const breedMatch = p.physical?.breed?.toLowerCase().includes(q)
      const speciesMatch = p.species?.toLowerCase().includes(q)
      return nameMatch || breedMatch || speciesMatch
    })
  }

  // 2. Species Tab Filter
  if (activeFilter.value !== 'All') {
    result = result.filter(
      (p: IPet) => p.species.toLowerCase() === activeFilter.value.toLowerCase(),
    )
  }

  // 3. Attending Weekend Filter
  if (isAttendingWeekendOnly.value) {
    const activeIds = attendingPetIds.value
    if (activeIds && activeIds.length > 0) {
      result = result.filter(
        (p: IPet) =>
          activeIds.includes(p.id) ||
          (p.slug && activeIds.includes(p.slug)) ||
          Boolean(p.isAttendingWeekend),
      )
    } else {
      result = result.filter((p: IPet, index: number) => {
        return Boolean(
          p.isAttendingWeekend ?? (p.details?.status === 'available' && index % 3 === 0),
        )
      })
    }
  }

  // 3b. Favorites Filter
  if (isFavoritesOnly.value) {
    result = result.filter((p: IPet) => isFavorite(p.slug || p.id))
  }

  // 4. Advanced Filters (age, size, sex, goodWith, special tags)
  const { age, size, sex, goodWith, special } = advancedFilters.value

  if (age.length > 0) {
    result = result.filter((p: IPet) => p.physical.ageGroup && age.includes(p.physical.ageGroup))
  }

  if (size.length > 0) {
    result = result.filter((p: IPet) => p.physical.size && size.includes(p.physical.size))
  }

  if (sex) {
    result = result.filter((p: IPet) => p.sex && p.sex.toLowerCase() === sex)
  }

  if (goodWith.length > 0) {
    result = result.filter((p: IPet) => {
      return goodWith.some((trait) => {
        if (trait === 'kids') return p.behavior.isGoodWithKids
        if (trait === 'dogs') return p.behavior.isGoodWithDogs
        if (trait === 'cats') return p.behavior.isGoodWithCats
        return false
      })
    })
  }

  if (special && special.length > 0) {
    result = result.filter((p: IPet) => {
      return special.every((tag) => {
        if (tag === 'special-needs') {
          return getPetSpecialNeeds(p).isSpecialNeeds
        }
        if (tag === 'bonded') {
          return Boolean(p.behavior?.bonded?.isBonded)
        }
        if (tag === 'sponsored') {
          return Boolean(p.sponsored?.isSponsored)
        }
        if (tag === 'saved') {
          return isFavorite(p.slug || p.id)
        }
        if (tag === 'coming-soon') {
          const norm = p.details?.status?.trim().toLowerCase() ?? ''
          return norm === 'intake' || norm === 'intake-processing' || norm === 'intake processing'
        }
        return true
      })
    })
  }

  return [...result].sort((a: IPet, b: IPet) => {
    const nameA = a.name || ''
    const nameB = b.name || ''
    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' })
  })
})

const setFilter = (filter: string) => {
  if (!document.startViewTransition) {
    activeFilter.value = filter
    return
  }

  document.startViewTransition(async () => {
    activeFilter.value = filter
    await nextTick()
  })
}

const pet = computed(() => {
  if (detailPet.value) return detailPet.value

  const param = id.value
  if (!param) return undefined
  return currentPets.value.find((p: IPet) => p.id === param || p.slug === param)
})

watch(
  id,
  async (param) => {
    detailPet.value = null
    if (!param) return

    detailPet.value = await store.fetchPetDetail(param)
  },
  { immediate: true },
)

watch(id, () => {
  isFilterPanelOpen.value = false
})

watch(pet, (currentPet) => {
  if (currentPet) {
    isFilterPanelOpen.value = false
  }
})

const filterCount = computed(
  () => Object.values(advancedFilters.value).flat().filter(Boolean).length,
)

const removeFilter = (category: 'age' | 'size' | 'sex' | 'goodWith' | 'special', value: string) => {
  if (category === 'sex') {
    advancedFilters.value.sex = ''
  } else if (category === 'age') {
    advancedFilters.value.age = advancedFilters.value.age.filter((v) => v !== value)
  } else if (category === 'size') {
    advancedFilters.value.size = advancedFilters.value.size.filter((v) => v !== value)
  } else if (category === 'goodWith') {
    advancedFilters.value.goodWith = advancedFilters.value.goodWith.filter((v) => v !== value)
  } else if (category === 'special') {
    advancedFilters.value.special = advancedFilters.value.special.filter((v) => v !== value)
  }
}
</script>

<template>
  <div class="adopt">
    <div class="content-wrapper">
      <AdoptPageHeader
        :pet="!!pet"
        :activeFilter="activeFilter"
        :isFilterPanelOpen="isFilterPanelOpen"
        :filterCount="filterCount"
        :advancedFilters="advancedFilters"
        :searchQuery="searchQuery"
        :isFavoritesOnly="isFavoritesOnly"
        :favoriteCount="favoriteCount"
        @update:search-query="searchQuery = $event"
        @set-filter="setFilter"
        @toggle-filters="isFilterPanelOpen = !isFilterPanelOpen"
        @toggle-favorites="toggleFavoritesOnly"
        @reset-filters="resetAllFilters"
        @remove-filter="removeFilter"
        @clear-advanced-filters="clearFilters"
        @open-matcher="isMatcherOpen = true"
      />

      <!-- Filter Options Box -->
      <FilterPanel
        v-if="!pet"
        :isOpen="isFilterPanelOpen"
        :currentFilters="advancedFilters"
        @close="isFilterPanelOpen = false"
        @apply="applyAdvancedFilters"
        @clear="clearFilters"
      />

      <!-- Weekend Event Banner (below filter options box) -->
      <EventBanner
        v-if="!pet"
        :isFilterActive="isAttendingWeekendOnly"
        :showFilterButton="true"
        :showWhatToBringButton="true"
        colorScheme="light"
        @toggle-filter="isAttendingWeekendOnly = !isAttendingWeekendOnly"
      />

      <main aria-live="polite">
        <span class="sr-only">{{ filteredPets.length }} pets found</span>
        <div v-if="isFetching" class="skeleton-grid" aria-label="Loading adoptable pets...">
          <PetItemSkeleton v-for="n in 8" :key="`skeleton-${n}`" />
        </div>
        <template v-else>
          <AdoptDetail v-if="pet" :pet="pet!" />
          <AdoptSummary v-else-if="filteredPets.length > 0" :pets="filteredPets" />
          <div v-else class="empty-state">
            <div class="empty-icon-wrap" aria-hidden="true">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
                <!-- Left paw print (bottom-left) -->
                <g transform="translate(8, 14.2) rotate(-14) scale(0.85)">
                  <ellipse cx="0" cy="2.5" rx="3.4" ry="2.7" />
                  <circle cx="-4" cy="-1.4" r="1.4" />
                  <circle cx="-1.5" cy="-4" r="1.5" />
                  <circle cx="1.5" cy="-4" r="1.5" />
                  <circle cx="4" cy="-1.4" r="1.4" />
                </g>
                <!-- Right paw print (top-right) -->
                <g transform="translate(16, 9.8) rotate(14) scale(0.85)">
                  <ellipse cx="0" cy="2.5" rx="3.4" ry="2.7" />
                  <circle cx="-4" cy="-1.4" r="1.4" />
                  <circle cx="-1.5" cy="-4" r="1.5" />
                  <circle cx="1.5" cy="-4" r="1.5" />
                  <circle cx="4" cy="-1.4" r="1.4" />
                </g>
              </svg>
            </div>
            <h2>No pets found</h2>
            <p>We couldn't find any friends matching your current search and filters.</p>
            <div class="empty-actions">
              <button v-if="filterCount > 0 || searchQuery || isAttendingWeekendOnly" class="reset-btn" @click="clearFilters">
                Reset all filters
              </button>
              <button class="reset-btn secondary" @click="resetAllFilters">View all pets</button>
            </div>
          </div>
        </template>
      </main>

      <PetMatcherModal
        :isOpen="isMatcherOpen"
        @close="isMatcherOpen = false"
        @apply="handleMatcherApply"
      />
    </div>
  </div>
</template>

<style scoped src="./Adopt.css"></style>

