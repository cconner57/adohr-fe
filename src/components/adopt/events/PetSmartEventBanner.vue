<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import Button from '../../common/ui/Button.vue'
import EventPrepModal from './EventPrepModal.vue'

withDefaults(
  defineProps<{
    isFilterActive?: boolean
    showFilterButton?: boolean
    variant?: 'light' | 'dark'
  }>(),
  {
    isFilterActive: false,
    showFilterButton: true,
    variant: 'light',
  },
)

const emit = defineEmits<{
  'toggle-filter': []
}>()

const router = useRouter()
const isPrepModalOpen = ref(false)

// Automated client-side calculation of the upcoming Saturday & Sunday dates
const nextEventDates = computed(() => {
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sun, 1 = Mon, ... 6 = Sat
  
  const daysUntilSat = (6 - currentDay + 7) % 7
  // If today is Sunday, we can either refer to today or the upcoming weekend
  const isWeekendNow = currentDay === 0 || currentDay === 6
  
  const satDate = new Date(now)
  if (currentDay === 6) {
    // Today is Saturday
    satDate.setDate(now.getDate())
  } else if (currentDay === 0) {
    // Today is Sunday, Sat was yesterday
    satDate.setDate(now.getDate() - 1)
  } else {
    satDate.setDate(now.getDate() + daysUntilSat)
  }

  const sunDate = new Date(satDate)
  sunDate.setDate(satDate.getDate() + 1)

  const satFormatted = satDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const sunFormatted = sunDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  if (isWeekendNow) {
    return `This Weekend · Sat, ${satFormatted} & Sun, ${sunFormatted}`
  }
  return `Next Weekend · Sat, ${satFormatted} & Sun, ${sunFormatted}`
})

const handleDirections = () => {
  window.open(
    'https://maps.google.com/?q=PetSmart+3347+E+Foothill+Blvd+Pasadena+CA+91107',
    '_blank',
    'noopener,noreferrer',
  )
}

const handleFastTrack = () => {
  isPrepModalOpen.value = false
  router.push('/adopt')
}
</script>

<template>
  <aside class="petsmart-banner" :class="[`variant-${variant}`]" aria-label="Weekend Adoption Event Info">
    <div class="banner-badge">
      <span class="live-dot" aria-hidden="true"></span>
      <span>Every Sat &amp; Sun (12 PM &ndash; 4 PM)</span>
    </div>

    <div class="banner-content">
      <div class="text-block">
        <h3 class="banner-title">Meet Our Adoptable Pets at PetSmart Pasadena</h3>
        <p class="banner-subtitle">
          <strong>{{ nextEventDates }}</strong> &bull; 3347 E Foothill Blvd, Pasadena (Hastings Ranch)
        </p>
      </div>

      <div class="banner-actions">
        <button
          v-if="showFilterButton"
          type="button"
          class="filter-toggle-btn"
          :class="{ active: isFilterActive }"
          @click="emit('toggle-filter')"
          :aria-pressed="isFilterActive"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>{{ isFilterActive ? 'Showing: Attending Weekend' : 'Attending This Weekend' }}</span>
        </button>

        <Button
          title="What to Bring"
          :variant="variant === 'dark' ? 'secondary' : 'secondary'"
          :color="variant === 'dark' ? 'white' : 'blue'"
          size="small"
          @click="isPrepModalOpen = true"
        />

        <Button
          title="Directions ↗"
          :color="variant === 'dark' ? 'orange' : 'blue'"
          size="small"
          @click="handleDirections"
        />
      </div>
    </div>

    <EventPrepModal
      :isOpen="isPrepModalOpen"
      @close="isPrepModalOpen = false"
      @fastTrack="handleFastTrack"
    />
  </aside>
</template>

<style scoped lang="css">
.petsmart-banner {
  background: var(--text-inverse);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  border-left: 5px solid var(--color-primary);
  border-radius: var(--radius-lg, 16px);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  &.variant-dark {
    background: linear-gradient(135deg, oklch(from var(--color-primary) 30% 0.08 h), oklch(from var(--color-primary) 20% 0.05 h));
    border: 1.5px solid oklch(100% 0 0deg / 22%);
    border-left: 6px solid var(--color-warning);
    color: var(--text-inverse);
    box-shadow: var(--shadow-lg);
    margin-bottom: 0;

    .banner-badge {
      background-color: oklch(100% 0 0deg / 15%);
      color: var(--color-warning);

      .live-dot {
        background-color: var(--color-warning);
        box-shadow: 0 0 0 2px oklch(from var(--color-warning) l c h / 35%);
      }
    }

    .banner-content {
      .text-block {
        .banner-title {
          color: var(--text-inverse);
        }

        .banner-subtitle {
          color: oklch(100% 0 0deg / 85%);

          strong {
            color: var(--color-warning);
          }
        }
      }

      .banner-actions {
        .filter-toggle-btn {
          background-color: oklch(100% 0 0deg / 12%);
          border-color: oklch(100% 0 0deg / 22%);
          color: var(--text-inverse);

          &:hover {
            background-color: oklch(100% 0 0deg / 20%);
            border-color: var(--color-warning);
            color: var(--color-warning);
          }

          &.active {
            background-color: var(--color-warning);
            color: var(--color-primary);
            border-color: var(--color-warning);
          }
        }
      }
    }
  }

  .banner-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-primary-strong);
    background-color: var(--color-primary-weak);
    padding: 3px 9px;
    border-radius: var(--radius-full);
    width: fit-content;

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: var(--color-secondary);
      box-shadow: 0 0 0 2px oklch(from var(--color-secondary) l c h / 25%);
      animation: pulse 2s infinite;
    }
  }

  .banner-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;

    .text-block {
      flex: 1 1 320px;

      .banner-title {
        font-size: 1.15rem;
        font-weight: 800;
        letter-spacing: -0.015em;
        color: var(--text-primary);
        margin: 0 0 4px;
      }

      .banner-subtitle {
        font-size: 0.88rem;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.45;

        strong {
          color: var(--color-secondary);
        }
      }
    }

    .banner-actions {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      flex-wrap: wrap;

      .filter-toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: var(--radius-md, 8px);
        font-size: 0.84rem;
        font-weight: 600;
        cursor: pointer;
        background-color: oklch(from var(--text-primary) l c h / 4%);
        border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
        color: var(--text-primary);
        transition: all 0.15s ease;

        &:hover {
          background-color: var(--color-primary-weak);
          color: var(--color-primary-strong);
          border-color: var(--color-primary-border);
        }

        &.active {
          background-color: var(--color-primary);
          color: var(--text-inverse);
          border-color: var(--color-primary);
        }
      }
    }
  }

  @media (width <= 640px) {
    padding: 1rem;

    .banner-content {
      flex-direction: column;
      align-items: flex-start;

      .banner-actions {
        width: 100%;
        justify-content: flex-start;
      }
    }
  }
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}
</style>
