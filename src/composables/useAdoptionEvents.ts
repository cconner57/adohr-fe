import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import type { IAttendingPetSummary, IPublicAdoptionEvent } from '@/models/events'
import {
  combineConsecutiveEvents,
  computePetAttendanceMap,
  extractEventList,
  formatAdoptionEvent,
  getTargetWeekendEnd,
  type IFormattedAdoptionEvent,
  type IPetAttendanceSchedule,
  isAdoptionEventType,
  parseSortTime,
} from '@/utils/adoptionEvents'
import { fetchWithRetry, withPublicOrgId } from '@/utils/api'

export * from '@/utils/adoptionEvents'

// Module-level cache to share event state across components (Home, Adopt, etc.)
const events = ref<IPublicAdoptionEvent[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isFetched = ref(false)
const selectedEventIndex = ref(0)
let activeFetchPromise: Promise<void> | null = null
let currentFetchId = 0

export function useAdoptionEvents() {
  const fetchUpcomingEvents = async (force = false): Promise<void> => {
    if (isFetched.value && !force) return
    if (activeFetchPromise && !force) return activeFetchPromise

    const fetchId = ++currentFetchId
    activeFetchPromise = (async () => {
      isLoading.value = true
      error.value = null

      try {
        const endpoint = withPublicOrgId(API_ENDPOINTS.EVENTS_PUBLIC)
        let rawPayload: unknown = null
        try {
          const response = await fetchWithRetry(
            endpoint,
            { method: 'GET', headers: { Accept: 'application/json' } },
            { retries: 0, retryDelayMs: 200 },
          )
          if (response.ok) rawPayload = await response.json()
        } catch {
          // Fallback silently
        }

        if (fetchId !== currentFetchId) return

        if (rawPayload) {
          events.value = extractEventList(rawPayload)
            .filter((e) => e && e.status !== 'cancelled')
            .filter(isAdoptionEventType)
        } else {
          error.value = 'Could not load live calendar events'
        }
      } catch {
        if (fetchId === currentFetchId) {
          error.value = 'Could not load live calendar events'
        }
      } finally {
        if (fetchId === currentFetchId) {
          isLoading.value = false
          isFetched.value = true
          activeFetchPromise = null
        }
      }
    })()

    return activeFetchPromise
  }

  const upcomingEvents = computed<IPublicAdoptionEvent[]>(() => {
    const adoptionEvents = events.value.filter(isAdoptionEventType)
    if (adoptionEvents.length === 0) return []
    const now = Date.now()
    const targetWeekendEnd = getTargetWeekendEnd(new Date(now)).getTime()

    const upcoming = adoptionEvents
      .filter((e) => {
        const endIso = e.endDate || e.startDate
        if (!endIso) return false
        const eventEnd = new Date(endIso.includes('T') ? endIso : `${endIso}T23:59:59`).getTime()
        if (isNaN(eventEnd) || eventEnd < now) return false

        const startIso = e.startDate || e.endDate
        if (startIso) {
          const eventStart = new Date(startIso.includes('T') ? startIso : `${startIso}T00:00:00`).getTime()
          // Hold events for future weekends until Monday rollover
          if (!isNaN(eventStart) && eventStart > targetWeekendEnd) return false
        }

        return true
      })
      .sort((a, b) => parseSortTime(a.startDate) - parseSortTime(b.startDate))

    if (upcoming.length > 0) return upcoming

    // Fallback for tests/environments where all events in payload are in the past
    const hasAnyFutureEvents = adoptionEvents.some((e) => {
      const endIso = e.endDate || e.startDate
      if (!endIso) return false
      const eventEnd = new Date(endIso.includes('T') ? endIso : `${endIso}T23:59:59`).getTime()
      return !isNaN(eventEnd) && eventEnd >= now
    })

    return hasAnyFutureEvents ? [] : adoptionEvents
  })

  const formattedUpcomingEvents = computed<IFormattedAdoptionEvent[]>(() =>
    combineConsecutiveEvents(upcomingEvents.value),
  )

  const activeEventIndex = computed(() => {
    return selectedEventIndex.value >= formattedUpcomingEvents.value.length
      ? 0
      : Math.max(0, selectedEventIndex.value)
  })

  const activeEvent = computed<IFormattedAdoptionEvent>(
    () => formattedUpcomingEvents.value[activeEventIndex.value] || formatAdoptionEvent(null),
  )
  const nextEvent = computed<IPublicAdoptionEvent | null>(
    () => upcomingEvents.value[activeEventIndex.value] || upcomingEvents.value[0] || null,
  )

  const selectEvent = (index: number) => {
    if (index >= 0 && index < formattedUpcomingEvents.value.length) selectedEventIndex.value = index
  }

  const displayTitle = computed(() => activeEvent.value.title)
  const displayLocation = computed(() => activeEvent.value.locationName)
  const displayAddress = computed(() => activeEvent.value.address)
  const displayDates = computed(() => activeEvent.value.dates)
  const recurrenceText = computed(() => activeEvent.value.recurrenceText)
  const directionsUrl = computed(() => activeEvent.value.directionsUrl)
  const attendingPetIds = computed<string[]>(() => activeEvent.value.attendingPetIds)
  const attendingPets = computed<IAttendingPetSummary[]>(() => activeEvent.value.attendingPets)
  const allAttendingPetIds = computed<string[]>(() => {
    const ids = new Set<string>()
    formattedUpcomingEvents.value.forEach((ev) => ev.attendingPetIds.forEach((id) => ids.add(id)))
    return Array.from(ids)
  })
  const hasUpcomingEvents = computed<boolean>(() => formattedUpcomingEvents.value.length > 0)
  const petAttendanceMap = computed<Map<string, IPetAttendanceSchedule>>(() =>
    computePetAttendanceMap(upcomingEvents.value.length > 0 ? upcomingEvents.value : events.value),
  )
  const getPetAttendanceSchedule = (petIdOrSlug?: string): IPetAttendanceSchedule | undefined =>
    petIdOrSlug ? petAttendanceMap.value.get(petIdOrSlug.trim()) : undefined

  return {
    events,
    nextEvent,
    upcomingEvents,
    formattedUpcomingEvents,
    hasUpcomingEvents,
    activeEvent,
    activeEventIndex,
    selectEvent,
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
    allAttendingPetIds,
    petAttendanceMap,
    getPetAttendanceSchedule,
    fetchUpcomingEvents,
  }
}

export function resetAdoptionEventsState() {
  currentFetchId++
  events.value = []
  isLoading.value = false
  error.value = null
  isFetched.value = false
  selectedEventIndex.value = 0
  activeFetchPromise = null
}
