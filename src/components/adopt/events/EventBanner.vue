<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import Button from '@/components/common/ui/Button.vue'
import { useAdoptionEvents } from '@/composables/useAdoptionEvents'

import EventPrepDrawer from './EventPrepDrawer.vue'

const props = withDefaults(
  defineProps<{
    isFilterActive?: boolean
    showFilterButton?: boolean
    showWhatToBringButton?: boolean
    showActions?: boolean
    variant?: 'light' | 'dark' | 'forest' | 'cream'
    colorScheme?: 'light' | 'dark' | 'forest' | 'cream'
  }>(),
  {
    isFilterActive: false,
    showFilterButton: true,
    showWhatToBringButton: true,
    showActions: true,
    variant: 'light',
  },
)

const resolvedScheme = computed(() => {
  const scheme = props.colorScheme || props.variant || 'light'
  if (scheme === 'forest' || scheme === 'dark') return 'dark'
  return 'light'
})

const emit = defineEmits<{
  'toggle-filter': []
}>()

const isPrepModalOpen = ref(false)

const {
  formattedUpcomingEvents,
  hasUpcomingEvents,
  activeEventIndex,
  selectEvent,
  displayTitle,
  displayDates,
  recurrenceText,
  fetchUpcomingEvents,
} = useAdoptionEvents()

onMounted(() => {
  fetchUpcomingEvents()
})
</script>

<template>
  <aside
    v-if="hasUpcomingEvents"
    class="event-banner petsmart-banner"
    :class="[`variant-${resolvedScheme}`]"
    aria-label="Weekend Adoption Event Info"
  >
    <!-- Multiple Locations Tab Switcher (Visible when 2+ events exist) -->
    <div
      v-if="formattedUpcomingEvents.length > 1"
      class="event-location-selector"
      role="tablist"
      aria-label="Adoption Event Locations"
    >
      <div class="selector-meta">
        <span class="selector-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Locations This Weekend:</span>
        </span>
      </div>

      <div class="location-tabs">
        <button
          v-for="(ev, idx) in formattedUpcomingEvents"
          :key="ev.id || idx"
          type="button"
          role="tab"
          :aria-selected="idx === activeEventIndex"
          class="location-tab-btn"
          :class="{ active: idx === activeEventIndex }"
          @click="selectEvent(idx)"
        >
          <span class="tab-info">
            <span class="tab-dot" aria-hidden="true"></span>
            <span class="tab-name">{{ ev.locationName }}</span>
          </span>
          <span class="tab-badge">{{ ev.recurrenceText }}</span>
        </button>
      </div>
    </div>

    <div class="banner-content">
      <div class="banner-main">
        <div class="banner-badge">
          <span class="live-dot" aria-hidden="true"></span>
          <span>{{ recurrenceText }}</span>
        </div>
        <div class="text-block">
          <h3 class="banner-title">{{ displayTitle }}</h3>
          <p class="banner-subtitle">
            <strong>{{ displayDates }}</strong>
          </p>
        </div>
      </div>

      <div v-if="(showFilterButton || showWhatToBringButton) && showActions" class="banner-actions">
        <button
          v-if="showFilterButton"
          type="button"
          class="filter-toggle-btn"
          :class="{ active: isFilterActive }"
          :aria-pressed="isFilterActive"
          @click="emit('toggle-filter')"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>{{ isFilterActive ? 'Showing: Pets Attending Event' : 'Pets Attending Event' }}</span>
        </button>

        <Button
          v-if="showWhatToBringButton"
          title="What to Bring"
          variant="secondary"
          :color="resolvedScheme === 'dark' ? 'white' : 'blue'"
          size="small"
          class="what-to-bring-btn"
          @click="isPrepModalOpen = true"
        />
      </div>
    </div>

    <EventPrepDrawer
      :isOpen="isPrepModalOpen"
      @close="isPrepModalOpen = false"
    />
  </aside>
</template>

<style scoped src="./EventBanner.css"></style>
