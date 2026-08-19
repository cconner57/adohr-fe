<script setup lang="ts">
defineProps<{
  pet: boolean
  activeFilter: string
  isFilterPanelOpen: boolean
  filterCount: number
  advancedFilters?: {
    age: string[]
    size: string[]
    sex: string
    goodWith: string[]
  }
}>()

const emit = defineEmits<{
  'set-filter': [filter: string]
  'toggle-filters': []
  'reset-filters': []
  'remove-filter': [category: 'age' | 'size' | 'sex' | 'goodWith', value: string]
  'clear-advanced-filters': []
}>()
</script>

<template>
  <div class="header" v-if="!pet">
    <h1>Find your new best friend</h1>
    <p>
      Search adoptable cats and dogs across Southern California. Every adoption helps us rescue
      another life.
    </p>
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
    <div class="mobile-break"></div>
    <div class="divider"></div>
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
    v-if="!pet && filterCount > 0 && advancedFilters"
    class="active-filter-chips"
    aria-label="Active filters"
  >
    <span class="active-chips-label">Filters:</span>
    <button
      v-for="ageVal in advancedFilters.age"
      :key="`age-${ageVal}`"
      class="chip-btn"
      @click="emit('remove-filter', 'age', ageVal)"
      :aria-label="`Remove ${ageVal} filter`"
    >
      {{ ageVal }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button
      v-for="sizeVal in advancedFilters.size"
      :key="`size-${sizeVal}`"
      class="chip-btn"
      @click="emit('remove-filter', 'size', sizeVal)"
      :aria-label="`Remove ${sizeVal} filter`"
    >
      {{ sizeVal }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button
      v-if="advancedFilters.sex"
      class="chip-btn"
      @click="emit('remove-filter', 'sex', advancedFilters.sex)"
      :aria-label="`Remove ${advancedFilters.sex} filter`"
    >
      {{ advancedFilters.sex }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button
      v-for="trait in advancedFilters.goodWith"
      :key="`goodWith-${trait}`"
      class="chip-btn"
      @click="emit('remove-filter', 'goodWith', trait)"
      :aria-label="`Remove good with ${trait} filter`"
    >
      Good with {{ trait }} <span class="chip-x" aria-hidden="true">✕</span>
    </button>
    <button class="chip-clear-all" @click="emit('clear-advanced-filters')">Clear all</button>
  </div>
</template>

<style scoped src="../../pages/Adopt.css"></style>
