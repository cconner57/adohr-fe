<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAdoptionEvents } from '@/composables/useAdoptionEvents'

import Button from '../../common/ui/Button.vue'
import EventPrepModal from './EventPrepModal.vue'

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

const router = useRouter()
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

const handleFastTrack = () => {
  isPrepModalOpen.value = false
  router.push('/adopt')
}
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
          <span class="tab-dot" aria-hidden="true"></span>
          <span class="tab-name">{{ ev.locationName }}</span>
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

    <EventPrepModal
      :isOpen="isPrepModalOpen"
      @close="isPrepModalOpen = false"
      @fastTrack="handleFastTrack"
    />
  </aside>
</template>

<style scoped lang="css">
.event-banner,
.petsmart-banner {
  background: var(--text-inverse);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  border-left: 5px solid var(--color-primary);
  border-radius: var(--radius-conditional-lg, max(0px, min(var(--radius-lg, 16px), (100vw - 100%) * 9999)));
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.75rem;
  width: 100%;
  max-width: 1180px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  .event-location-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
    margin-bottom: 2px;

    .selector-meta {
      display: inline-flex;
      align-items: center;

      .selector-label {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.78rem;
        font-weight: 800;
        font-family: var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-primary-strong, #1b4332);
      }
    }

    .location-tabs {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .location-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: oklch(from var(--text-primary) l c h / 6%);
      border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 18%));
      border-radius: var(--radius-full);
      padding: 5px 13px;
      font-size: 0.83rem;
      font-weight: 700;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;

      .tab-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: var(--text-secondary);
        transition: all 0.2s ease;
      }

      .tab-name {
        letter-spacing: -0.01em;
      }

      .tab-badge {
        font-size: 0.74rem;
        opacity: 0.85;
        font-weight: 500;
        margin-left: 2px;
      }

      &:hover {
        background-color: var(--color-primary-weak);
        border-color: var(--color-primary-border);
        color: var(--color-primary-strong);
        transform: translateY(-1px);
      }

      &.active {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
        color: var(--text-inverse);
        box-shadow: 0 2px 8px oklch(from var(--color-primary) l c h / 25%);

        .tab-dot {
          background-color: var(--color-secondary);
          box-shadow: 0 0 0 2px oklch(from var(--color-secondary) l c h / 30%);
          animation: pulse 2s infinite;
        }

        .tab-badge {
          opacity: 0.95;
          color: oklch(from var(--text-inverse) l c h / 90%);
        }
      }
    }
  }

  &.variant-dark {
    background: linear-gradient(135deg, oklch(from var(--color-primary) 30% 0.08 h), oklch(from var(--color-primary) 20% 0.05 h));
    border: 1.5px solid oklch(100% 0 0deg / 22%);
    border-left: 6px solid var(--color-warning);
    color: var(--text-inverse);
    box-shadow: var(--shadow-lg);
    margin-bottom: 0;

    .event-location-selector {
      border-bottom-color: oklch(100% 0 0deg / 15%);

      .selector-meta .selector-label {
        color: var(--color-warning);
      }

      .location-tab-btn {
        background-color: oklch(100% 0 0deg / 10%);
        border-color: oklch(100% 0 0deg / 22%);
        color: var(--text-inverse);

        .tab-dot {
          background-color: oklch(100% 0 0deg / 50%);
        }

        &:hover {
          background-color: oklch(100% 0 0deg / 20%);
          border-color: var(--color-warning);
          color: var(--color-warning);
        }

        &.active {
          background-color: var(--color-warning);
          border-color: var(--color-warning);
          color: var(--color-primary);
          box-shadow: 0 2px 10px oklch(from var(--color-warning) l c h / 30%);

          .tab-dot {
            background-color: var(--color-primary);
          }

          .tab-badge {
            color: var(--color-primary);
          }
        }
      }
    }

    .banner-badge {
      background-color: oklch(100% 0 0deg / 15%);
      color: var(--color-warning);

      .live-dot {
        background-color: var(--color-warning);
        box-shadow: 0 0 0 2px oklch(from var(--color-warning) l c h / 35%);
      }
    }

    .banner-content {
      .banner-main .text-block {
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
          border: 1.5px solid oklch(100% 0 0deg / 24%);
          color: var(--text-inverse);

          &:hover {
            background-color: oklch(100% 0 0deg / 20%);
            border-color: var(--color-warning);
            color: var(--color-warning);
            transform: translateY(-1px);
          }

          &.active {
            background-color: var(--color-warning);
            color: var(--color-primary);
            border-color: var(--color-warning);
            box-shadow: 0 2px 10px oklch(from var(--color-warning) l c h / 30%);
          }
        }

        :deep(.what-to-bring-btn),
        :deep(button.what-to-bring-btn),
        :deep(.what-to-bring-btn span) {
          background-color: oklch(100% 0 0deg / 16%) !important;
          color: #ffffff !important;
          border: 1.5px solid oklch(100% 0 0deg / 50%) !important;

          &:hover {
            background-color: oklch(100% 0 0deg / 30%) !important;
            border-color: #ffffff !important;
            color: #ffffff !important;
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

    .banner-main {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      flex: 1 1 320px;

      .text-block {
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
    }

    .banner-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;

      .filter-toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        height: 36px;
        padding: 0 16px;
        border-radius: var(--radius-full);
        font-family: var(--font-body);
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        cursor: pointer;
        background-color: oklch(from var(--text-primary) l c h / 4%);
        border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
        color: var(--text-primary);
        transition: all 0.2s ease;
        white-space: nowrap;

        &:hover {
          background-color: var(--color-primary-weak);
          color: var(--color-primary-strong);
          border-color: var(--color-primary-border);
          transform: translateY(-1px);
        }

        &.active {
          background-color: var(--color-primary);
          color: var(--text-inverse);
          border-color: var(--color-primary);
          box-shadow: 0 2px 8px oklch(from var(--color-primary) l c h / 25%);
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
