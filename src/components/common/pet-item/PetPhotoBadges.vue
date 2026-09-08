<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    isAttendingWeekend?: boolean
    attendingScheduleText?: string
    attendingDaysText?: string
    attendingLocationText?: string
    status?: string
    isComingSoon?: boolean
    isSponsored?: boolean
    isSpecialNeeds?: boolean
    specialNeedsText?: string
    isBonded?: boolean
    bondedWithNames?: string[] | null
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    isAttendingWeekend: false,
    attendingScheduleText: '',
    attendingDaysText: '',
    attendingLocationText: '',
    status: '',
    isComingSoon: false,
    isSponsored: false,
    isSpecialNeeds: false,
    specialNeedsText: '',
    isBonded: false,
    bondedWithNames: null,
    size: 'md',
  },
)

const attendingInfo = computed(() => {
  if (props.attendingDaysText || props.attendingLocationText) {
    return {
      days: props.attendingDaysText || 'Sat & Sun',
      location: props.attendingLocationText || '',
    }
  }
  const text = props.attendingScheduleText || ''
  if (!text) return null
  if (text.includes(' · ')) {
    const parts = text.split(' · ')
    return {
      location: parts[0].replace(/^at\s+/i, '').trim(),
      days: parts[1].trim(),
    }
  }
  const match = text.match(/^(?:at\s+)?(.+?)\s+((?:sat|sun|weekend|saturday|sunday).*)$/i)
  if (match) {
    return {
      location: match[1].trim(),
      days: match[2].trim(),
    }
  }
  return {
    days: text,
    location: '',
  }
})

const hasWeekendBadge = computed(() =>
  Boolean(props.isAttendingWeekend || props.attendingScheduleText || props.attendingDaysText),
)

const statusBadge = computed(() => {
  const normalizedStatus = props.status.trim().toLowerCase()
  switch (normalizedStatus) {
    case 'intake':
    case 'intake-processing':
    case 'intake processing':
    case 'coming-soon':
    case 'coming soon':
      return { text: 'Coming Soon', class: 'badge-coming-soon', visible: true, isComingSoon: true }
    case 'adoption-pending':
    case 'adoption pending':
    case 'pending':
      return { text: 'Adoption Pending', class: 'badge-warning', visible: true, isComingSoon: false }
    case 'foster':
    case 'foster needed':
      return { text: 'Foster Needed', class: 'badge-secondary', visible: true, isComingSoon: false }
    case 'hold':
    case 'medical hold':
      return { text: 'On Hold', class: 'badge-danger', visible: true, isComingSoon: false }
    default:
      if (props.isComingSoon) {
        return { text: 'Coming Soon', class: 'badge-coming-soon', visible: true, isComingSoon: true }
      }
      return { text: '', class: '', visible: false, isComingSoon: false }
  }
})

interface IPhotoBadge {
  id: string
  text: string
  class: string
  icon: 'coming-soon' | 'star' | 'special-needs' | 'bonded' | 'status'
  ariaLabel: string
}

const singleTopBadge = computed<IPhotoBadge | null>(() => {
  if (hasWeekendBadge.value) return null
  if (statusBadge.value.visible) {
    return {
      id: 'status',
      text: statusBadge.value.text,
      class: statusBadge.value.class,
      icon: statusBadge.value.isComingSoon ? 'coming-soon' : 'status',
      ariaLabel: statusBadge.value.text,
    }
  }
  if (props.isSponsored) {
    return {
      id: 'sponsored',
      text: 'Sponsored',
      class: 'badge-sponsored',
      icon: 'star',
      ariaLabel: 'Adoption fee sponsored',
    }
  }
  return null
})

const bottomDockBadges = computed<IPhotoBadge[]>(() => {
  const badges: IPhotoBadge[] = []
  if (statusBadge.value.visible && singleTopBadge.value?.id !== 'status') {
    badges.push({
      id: 'status',
      text: statusBadge.value.text,
      class: statusBadge.value.class,
      icon: statusBadge.value.isComingSoon ? 'coming-soon' : 'status',
      ariaLabel: statusBadge.value.text,
    })
  }
  if (props.isSponsored && singleTopBadge.value?.id !== 'sponsored') {
    badges.push({
      id: 'sponsored',
      text: 'Sponsored',
      class: 'badge-sponsored',
      icon: 'star',
      ariaLabel: 'Adoption fee sponsored',
    })
  }
  if (props.isSpecialNeeds) {
    const isDetailView = props.size === 'lg'
    const rawText = isDetailView ? props.specialNeedsText?.trim() || '' : ''
    let formattedText = 'Special Needs'
    if (rawText) {
      formattedText = /^special\s*needs:?/i.test(rawText) ? rawText : `Special Needs: ${rawText}`
    }
    badges.push({
      id: 'special-needs',
      text: formattedText,
      class: 'badge-special-needs',
      icon: 'special-needs',
      ariaLabel: props.specialNeedsText ? `Special Needs: ${props.specialNeedsText}` : 'Special Needs',
    })
  }
  if (props.isBonded) {
    badges.push({
      id: 'bonded',
      text: props.bondedWithNames && props.bondedWithNames.length > 0 ? `Bonded with ${props.bondedWithNames.join(' & ')}` : 'Bonded Pair',
      class: 'badge-bonded',
      icon: 'bonded',
      ariaLabel: 'Bonded pair',
    })
  }
  return badges
})

const expandedBadgeId = ref<string | null>(null)

function toggleDockBadge(id: string) {
  expandedBadgeId.value = expandedBadgeId.value === id ? null : id
}

function collapseDockBadge() {
  expandedBadgeId.value = null
}
</script>

<template>
  <div class="pet-photo-badges" :class="`size-${size}`">
    <!-- Top Slot: Strictly 1 primary badge -->
    <div v-if="hasWeekendBadge || singleTopBadge" class="badge-stack">
      <div
        v-if="hasWeekendBadge"
        class="image-badge weekend-badge"
        :aria-label="props.attendingScheduleText || 'Attending PetSmart this weekend'"
      >
        <div class="badge-days-row">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span class="days-text">{{ attendingInfo?.days || 'Sat & Sun' }}</span>
        </div>
        <div v-if="attendingInfo?.location" class="badge-loc-row">
          <span class="loc-text">{{ attendingInfo.location }}</span>
        </div>
      </div>

      <div
        v-else-if="singleTopBadge"
        class="image-badge chip-badge top-chip-badge"
        :class="singleTopBadge.class"
        :aria-label="singleTopBadge.ariaLabel"
      >
        <svg
          v-if="singleTopBadge.icon === 'coming-soon'"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <svg
          v-else-if="singleTopBadge.icon === 'star'"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>{{ singleTopBadge.text }}</span>
      </div>
    </div>

    <!-- Bottom Dock: Expanding Icon Circles -->
    <div
      v-if="bottomDockBadges.length > 0"
      class="bottom-badge-dock"
      @mouseleave="collapseDockBadge"
    >
      <button
        v-for="badge in bottomDockBadges"
        :key="badge.id"
        type="button"
        class="dock-badge"
        :class="[badge.class, { 'is-expanded': expandedBadgeId === badge.id }]"
        :aria-label="badge.ariaLabel"
        :aria-expanded="expandedBadgeId === badge.id"
        @click.stop="toggleDockBadge(badge.id)"
      >
        <svg
          v-if="badge.icon === 'coming-soon'"
          class="dock-badge-icon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <svg
          v-else-if="badge.icon === 'star'"
          class="dock-badge-icon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg
          v-else-if="badge.icon === 'special-needs'"
          class="dock-badge-icon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <svg
          v-else-if="badge.icon === 'bonded'"
          class="dock-badge-icon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <svg
          v-else
          class="dock-badge-icon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span class="dock-badge-label">{{ badge.text }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped src="./PetPhotoBadges.css"></style>
