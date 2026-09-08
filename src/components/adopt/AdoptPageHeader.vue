<script setup lang="ts">
defineProps<{
  pet: boolean
  activeFilter: string
  isFilterPanelOpen: boolean
  filterCount: number
  searchQuery?: string
  isFavoritesOnly?: boolean
  favoriteCount?: number
  advancedFilters?: {
    age: string[]
    size: string[]
    sex: string
    goodWith: string[]
    special?: string[]
  }
}>()

const emit = defineEmits<{
  'set-filter': [filter: string]
  'toggle-filters': []
  'toggle-favorites': []
  'reset-filters': []
  'remove-filter': [category: 'age' | 'size' | 'sex' | 'goodWith' | 'special', value: string]
  'clear-advanced-filters': []
  'update:search-query': [query: string]
  'open-matcher': []
}>()
</script>

<template>
  <div class="header" v-if="!pet">
    <h1>Find your new best friend</h1>
    <p>
      Search adoptable cats and dogs across Southern California. Every adoption helps us rescue
      another life.
    </p>

    <!-- Search Input Bar -->
    <div class="search-bar-wrapper">
      <svg
        class="search-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        class="search-input"
        placeholder="Search by name or breed (e.g. Mocha, Tabby, Shepherd)..."
        :value="searchQuery"
        @input="emit('update:search-query', ($event.target as HTMLInputElement).value)"
        aria-label="Search adoptable pets by name or breed"
      />
      <button
        v-if="searchQuery"
        type="button"
        class="search-clear-btn"
        aria-label="Clear search"
        @click="emit('update:search-query', '')"
      >
        ✕
      </button>
    </div>
  </div>

  <div class="filters" v-if="!pet">
    <div class="species-group">
      <button
        class="reset-btn"
        :class="{ active: activeFilter === 'All' }"
        @click="emit('reset-filters')"
      >
        View All Pets
      </button>
      <button :class="{ active: activeFilter === 'Cat' }" @click="emit('set-filter', 'Cat')">
        Cats
      </button>
      <button :class="{ active: activeFilter === 'Dog' }" @click="emit('set-filter', 'Dog')">
        Dogs
      </button>
    </div>
    
    <div class="divider"></div>

    <button
      class="matcher-trigger-btn"
      type="button"
      @click="emit('open-matcher')"
    >
      <span class="quiz-sparkle" aria-hidden="true">✨</span>
      Pet Matcher Quiz
    </button>

    <!-- Favorites Filter Button -->
    <button
      class="fav-filter-btn"
      :class="{ active: isFavoritesOnly }"
      type="button"
      @click="emit('toggle-favorites')"
      :aria-label="`Filter by favorited pets (${favoriteCount ?? 0})`"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        :fill="isFavoritesOnly ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span>Favorites</span>
      <span v-if="(favoriteCount ?? 0) > 0" class="badge">{{ favoriteCount }}</span>
    </button>

    <button
      class="filter-btn"
      :class="{ active: isFilterPanelOpen }"
      @click="emit('toggle-filters')"
      :aria-expanded="isFilterPanelOpen"
    >
      Filters
      <span v-if="filterCount" class="badge">{{ filterCount }}</span>
    </button>
  </div>

  <div
    v-if="!pet && ((filterCount > 0 && advancedFilters) || isFavoritesOnly)"
    class="active-filter-chips"
    aria-label="Active filters"
  >
    <span class="active-chips-label">Filters:</span>
    <button
      v-if="isFavoritesOnly"
      class="chip-btn chip-fav"
      @click="emit('toggle-favorites')"
      aria-label="Remove favorites filter"
    >
      ❤️ Favorites <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button
      v-for="ageVal in advancedFilters?.age || []"
      :key="`age-${ageVal}`"
      class="chip-btn"
      @click="emit('remove-filter', 'age', ageVal)"
      :aria-label="`Remove ${ageVal} filter`"
    >
      {{ ageVal }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button
      v-for="sizeVal in advancedFilters?.size || []"
      :key="`size-${sizeVal}`"
      class="chip-btn"
      @click="emit('remove-filter', 'size', sizeVal)"
      :aria-label="`Remove ${sizeVal} filter`"
    >
      {{ sizeVal }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button
      v-if="advancedFilters?.sex"
      class="chip-btn"
      @click="emit('remove-filter', 'sex', advancedFilters.sex)"
      :aria-label="`Remove ${advancedFilters.sex} filter`"
    >
      {{ advancedFilters.sex }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button
      v-for="trait in advancedFilters?.goodWith || []"
      :key="`goodWith-${trait}`"
      class="chip-btn"
      @click="emit('remove-filter', 'goodWith', trait)"
      :aria-label="`Remove good with ${trait} filter`"
    >
      Good with {{ trait }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button
      v-for="tag in advancedFilters?.special || []"
      :key="`special-${tag}`"
      class="chip-btn"
      @click="emit('remove-filter', 'special', tag)"
      :aria-label="`Remove ${tag} filter`"
    >
      {{ tag === 'special-needs' ? 'Special Needs' : tag === 'bonded' ? 'Bonded Pair' : tag === 'sponsored' ? 'Fee Sponsored' : tag === 'saved' ? 'Saved Pets' : tag === 'coming-soon' ? 'Coming Soon' : tag }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button class="chip-clear-all" @click="emit('clear-advanced-filters')">Clear all</button>
  </div>
</template>

<style scoped src="./AdoptPageHeader.css"></style>
