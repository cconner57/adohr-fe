<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'light' | 'dark' | 'forest' | 'cream'
    colorScheme?: 'light' | 'dark' | 'forest' | 'cream'
    showActions?: boolean
  }>(),
  {
    variant: 'light',
    showActions: true,
  },
)

const resolvedScheme = computed(() => {
  const scheme = props.colorScheme || props.variant || 'light'
  if (scheme === 'forest' || scheme === 'dark') return 'dark'
  return 'light'
})
</script>

<template>
  <div
    class="event-banner-skeleton petsmart-banner"
    :class="[`variant-${resolvedScheme}`]"
    role="status"
    aria-label="Loading upcoming adoption events..."
  >
    <!-- Top Location Selector Skeleton -->
    <div class="skeleton-location-selector" aria-hidden="true">
      <div class="skeleton-selector-label">
        <span class="skeleton-pill skeleton-label-pill"></span>
      </div>
      <div class="skeleton-tabs">
        <span class="skeleton-pill skeleton-tab-pill active"></span>
        <span class="skeleton-pill skeleton-tab-pill secondary"></span>
      </div>
    </div>

    <!-- Main Banner Body Skeleton -->
    <div class="skeleton-banner-content" aria-hidden="true">
      <div class="skeleton-main">
        <!-- Live / Schedule Badge -->
        <div class="skeleton-badge"></div>

        <!-- Event Title -->
        <div class="skeleton-title"></div>

        <!-- Date & Subtitle -->
        <div class="skeleton-subtitle"></div>

        <!-- Location / Address -->
        <div class="skeleton-address"></div>
      </div>

      <!-- Action Buttons Skeleton (optional, desktop) -->
      <div v-if="showActions" class="skeleton-actions">
        <div class="skeleton-btn-pill"></div>
        <div class="skeleton-btn-pill sm"></div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./EventBannerSkeleton.css"></style>
