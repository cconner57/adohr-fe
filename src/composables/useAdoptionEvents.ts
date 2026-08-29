import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import type { IAttendingPetSummary, IPublicAdoptionEvent } from '@/models/events'
import { fetchWithRetry, withPublicOrgId } from '@/utils/api'

// Module-level cache to share event state across components (Home, Adopt, etc.)
const events = ref<IPublicAdoptionEvent[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isFetched = ref(false)

const DEFAULT_EVENT_TITLE = 'Meet Our Adoptable Pets at PetSmart Pasadena'
const DEFAULT_LOCATION_NAME = 'PetSmart Pasadena'
const DEFAULT_ADDRESS = '3347 E Foothill Blvd, Pasadena'
const DEFAULT_RECURRENCE = 'Every Sat & Sun (12 PM – 4 PM)'
const DEFAULT_MAPS_URL = 'https://maps.google.com/?q=PetSmart+3347+E+Foothill+Blvd+Pasadena+CA+91107'

/**
 * Converts a time string (e.g., "12:00", "16:00", "12:00 PM") to a friendly 12-hour format.
 */
export function formatTime12h(timeStr: string | undefined): string {
  if (!timeStr) return ''
  const trimmed = timeStr.trim()
  if (trimmed.toLowerCase().includes('am') || trimmed.toLowerCase().includes('pm')) {
    return trimmed
  }

  const [hoursStr, minsStr] = trimmed.split(':')
  const hours = parseInt(hoursStr, 10)
  if (isNaN(hours)) return trimmed

  const mins = minsStr !== undefined ? minsStr : '00'
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12

  // If 00 minutes, format as "12 PM" or "4 PM", otherwise "12:30 PM"
  if (mins === '00') {
    return `${h12} ${ampm}`
  }
  return `${h12}:${mins} ${ampm}`
}

/**
 * Normalizes and checks if an event from Adoption OS is an "Adoption Event"
 */
export function isAdoptionEventType(event: IPublicAdoptionEvent | null | undefined): boolean {
  if (!event) return false
  const eventType = (event.type || event.eventType || '').trim().toLowerCase()
  const title = (event.title || '').trim().toLowerCase()

  return (
    eventType === 'adoption-event' ||
    eventType === 'adoption_event' ||
    eventType === 'adoption event' ||
    eventType === 'adoption' ||
    eventType.includes('adoption') ||
    title.includes('adoption') ||
    title.includes('petsmart')
  )
}

/**
 * Calculates the next or current weekend dates in client local time as a resilient fallback.
 */
export function calculateFallbackWeekendDates(referenceDate = new Date()): string {
  const currentDay = referenceDate.getDay() // 0 = Sun, 1 = Mon, ... 6 = Sat
  const daysUntilSat = (6 - currentDay + 7) % 7
  const isWeekendNow = currentDay === 0 || currentDay === 6

  const satDate = new Date(referenceDate)
  if (currentDay === 6) {
    satDate.setDate(referenceDate.getDate())
  } else if (currentDay === 0) {
    satDate.setDate(referenceDate.getDate() - 1)
  } else {
    satDate.setDate(referenceDate.getDate() + daysUntilSat)
  }

  const sunDate = new Date(satDate)
  sunDate.setDate(satDate.getDate() + 1)

  const satFormatted = satDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const sunFormatted = sunDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  if (isWeekendNow) {
    return `This Weekend · Sat, ${satFormatted} & Sun, ${sunFormatted}`
  }
  return `Next Weekend · Sat, ${satFormatted} & Sun, ${sunFormatted}`
}

/**
 * Formats date range from an IPublicAdoptionEvent into a user-friendly display string.
 */
export function formatEventDates(event: IPublicAdoptionEvent): string {
  try {
    // Handle both YYYY-MM-DD or full ISO strings
    const startStr = event.startDate.includes('T') ? event.startDate : `${event.startDate}T00:00:00`
    const start = new Date(startStr)
    if (isNaN(start.getTime())) {
      return calculateFallbackWeekendDates()
    }

    const now = new Date()
    const diffMs = start.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const isThisWeekend = diffDays >= -1 && diffDays <= 6

    const startFormatted = start.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

    if (event.endDate) {
      const endStr = event.endDate.includes('T') ? event.endDate : `${event.endDate}T00:00:00`
      const end = new Date(endStr)
      if (!isNaN(end.getTime()) && end.toDateString() !== start.toDateString()) {
        const endFormatted = end.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
        const prefix = isThisWeekend ? 'This Weekend · ' : 'Upcoming · '
        return `${prefix}${startFormatted} & ${endFormatted}`
      }
    }

    const prefix = isThisWeekend ? 'This Weekend · ' : ''
    return `${prefix}${startFormatted}`
  } catch {
    return calculateFallbackWeekendDates()
  }
}

export function useAdoptionEvents() {
  /**
   * Fetches public calendar adoption events from Adoption OS (Strictly Read-Only).
   * Will never mutate calendar data or request write permissions.
   */
  const fetchUpcomingEvents = async (force = false) => {
    if (isFetched.value && !force) return

    isLoading.value = true
    error.value = null

    try {
      // Strictly GET request with public organization scope
      const endpoint = withPublicOrgId(API_ENDPOINTS.EVENTS_PUBLIC)
      const response = await fetchWithRetry(
        endpoint,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
        {
          retries: 1,
          retryDelayMs: 400,
        },
      )

      if (response.ok) {
        const data = await response.json()
        let rawList: IPublicAdoptionEvent[] = []
        if (Array.isArray(data)) {
          rawList = data
        } else if (Array.isArray(data?.events)) {
          rawList = data.events
        } else if (Array.isArray(data?.data)) {
          rawList = data.data
        }

        // Filter specifically for active Adoption Event types from Adoption OS
        events.value = rawList
          .filter((e: IPublicAdoptionEvent) => e && e.status !== 'cancelled')
          .filter((e: IPublicAdoptionEvent) => isAdoptionEventType(e))
      } else {
        // Non-breaking fallback if endpoint is not yet live on backend
        error.value = `Calendar events unavailable (${response.status})`
      }
    } catch {
      // Graceful offline/network fallback
      error.value = 'Could not load live calendar events'
    } finally {
      isLoading.value = false
      isFetched.value = true
    }
  }

  // The closest upcoming active adoption event matching the Adoption Event type
  const nextEvent = computed<IPublicAdoptionEvent | null>(() => {
    const adoptionEvents = events.value.filter(isAdoptionEventType)
    if (adoptionEvents.length === 0) return null

    const now = new Date().getTime()
    const upcoming = adoptionEvents
      .filter((e) => {
        const endIso = e.endDate || e.startDate
        const endStr = endIso.includes('T') ? endIso : `${endIso}T23:59:59`
        const eventEnd = new Date(endStr).getTime()
        return !isNaN(eventEnd) && eventEnd >= now
      })
      .sort((a, b) => {
        const aStr = a.startDate.includes('T') ? a.startDate : `${a.startDate}T00:00:00`
        const bStr = b.startDate.includes('T') ? b.startDate : `${b.startDate}T00:00:00`
        return new Date(aStr).getTime() - new Date(bStr).getTime()
      })

    return upcoming[0] || adoptionEvents[0] || null
  })

  // Display fields with fallback support
  const displayTitle = computed(() => {
    if (nextEvent.value?.title) {
      if (nextEvent.value.title.toLowerCase().includes('petsmart') && !nextEvent.value.title.toLowerCase().startsWith('meet')) {
        return `Meet Our Adoptable Pets at ${nextEvent.value.title}`
      }
      return nextEvent.value.title
    }
    return DEFAULT_EVENT_TITLE
  })

  const displayLocation = computed(() => {
    if (nextEvent.value?.locationName) return nextEvent.value.locationName
    if (nextEvent.value?.location) {
      const parts = nextEvent.value.location.split(',')
      return parts[0]?.trim() || DEFAULT_LOCATION_NAME
    }
    return DEFAULT_LOCATION_NAME
  })

  const displayAddress = computed(() => {
    if (nextEvent.value?.address) return nextEvent.value.address
    if (nextEvent.value?.location) return nextEvent.value.location
    return DEFAULT_ADDRESS
  })

  const recurrenceText = computed(() => {
    if (nextEvent.value?.recurrenceText) {
      return nextEvent.value.recurrenceText
    }
    if (nextEvent.value?.startTime && nextEvent.value?.endTime) {
      const formattedStart = formatTime12h(nextEvent.value.startTime)
      const formattedEnd = formatTime12h(nextEvent.value.endTime)
      const isWeekly = nextEvent.value.repeat?.type === 'weekly' || nextEvent.value.repeats === 'Weekly'
      const freq = isWeekly ? 'Every Sat & Sun' : 'Adoption Event'
      return `${freq} (${formattedStart} – ${formattedEnd})`
    }
    return DEFAULT_RECURRENCE
  })

  const displayDates = computed(() => {
    if (nextEvent.value) {
      return formatEventDates(nextEvent.value)
    }
    return calculateFallbackWeekendDates()
  })

  const directionsUrl = computed(() => {
    if (nextEvent.value?.googleMapsUrl) {
      return nextEvent.value.googleMapsUrl
    }
    const locQuery = nextEvent.value?.location || `${nextEvent.value?.locationName ? `${nextEvent.value.locationName  } ` : ''}${nextEvent.value?.address || ''}`
    if (locQuery.trim()) {
      return `https://maps.google.com/?q=${encodeURIComponent(locQuery.trim())}`
    }
    return DEFAULT_MAPS_URL
  })

  // List of pet UUIDs attending the event
  const attendingPetIds = computed<string[]>(() => {
    return nextEvent.value?.attendingPetIds || []
  })

  // List of attending pet objects (if included in payload)
  const attendingPets = computed<IAttendingPetSummary[]>(() => {
    return nextEvent.value?.attendingPets || []
  })

  return {
    events,
    nextEvent,
    isLoading,
    error,
    isFetched,
    displayTitle,
    displayLocation,
    displayAddress,
    displayDates,
    directionsUrl,
    recurrenceText,
    attendingPetIds,
    attendingPets,
    fetchUpcomingEvents,
  }
}
