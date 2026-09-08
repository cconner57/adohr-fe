import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import type { IAttendingPetSummary, IPublicAdoptionEvent } from '@/models/events'
import { fetchWithRetry, withPublicOrgId } from '@/utils/api'

// Module-level cache to share event state across components (Home, Adopt, etc.)
const events = ref<IPublicAdoptionEvent[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isFetched = ref(false)
const selectedEventIndex = ref(0)
let activeFetchPromise: Promise<void> | null = null

const DEFAULT_EVENT_TITLE = 'Meet Our Adoptable Pets at PetSmart Pasadena'
const DEFAULT_LOCATION_NAME = 'PetSmart Pasadena'
const DEFAULT_ADDRESS = '3347 E Foothill Blvd, Pasadena'
const DEFAULT_RECURRENCE = 'Sat & Sun (12 PM – 4 PM)'
const DEFAULT_MAPS_URL = 'https://maps.google.com/?q=PetSmart+3347+E+Foothill+Blvd+Pasadena+CA+91107'

export const DEFAULT_ADOPTION_EVENTS: IPublicAdoptionEvent[] = [
  {
    id: 'evt-petsmart-pasadena',
    title: 'Meet Our Adoptable Pets at PetSmart Pasadena',
    locationName: 'PetSmart Pasadena',
    location: 'PetSmart Pasadena, 3347 E Foothill Blvd, Pasadena',
    address: '3347 E Foothill Blvd, Pasadena',
    startDate: '',
    endDate: '',
    startTime: '12:00',
    endTime: '16:00',
    recurrenceText: 'Sat & Sun (12 PM – 4 PM)',
    googleMapsUrl: 'https://maps.google.com/?q=PetSmart+3347+E+Foothill+Blvd+Pasadena+CA+91107',
    type: 'adoption-event',
    status: 'scheduled',
  },
]

export interface IFormattedAdoptionEvent {
  id: string
  title: string
  locationName: string
  address: string
  dates: string
  recurrenceText: string
  directionsUrl: string
  attendingPetIds: string[]
  attendingPets: IAttendingPetSummary[]
  rawEvent?: IPublicAdoptionEvent
}

export interface IPetAttendanceSchedule {
  petId: string
  days: string[]
  dayFullNames: string[]
  locationName: string
  scheduleText: string
  shortDayText: string
  isAttendingSat: boolean
  isAttendingSun: boolean
  isAttendingBoth: boolean
  displayLocation?: string
}

export function formatTime12h(timeStr?: string): string {
  if (!timeStr) return ''
  const trimmed = timeStr.trim()
  if (trimmed.toLowerCase().includes('am') || trimmed.toLowerCase().includes('pm')) return trimmed
  const [hoursStr, minsStr] = trimmed.split(':')
  const hours = parseInt(hoursStr, 10)
  if (isNaN(hours)) return trimmed
  const mins = minsStr !== undefined ? minsStr : '00'
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  return mins === '00' ? `${h12} ${ampm}` : `${h12}:${mins} ${ampm}`
}

export function isAdoptionEventType(event?: IPublicAdoptionEvent | null): boolean {
  if (!event) return false
  const type = (event.type || event.eventType || '').trim().toLowerCase()
  const title = (event.title || '').trim().toLowerCase()
  return type.includes('adoption') || title.includes('adoption') || title.includes('petsmart')
}

export function calculateFallbackWeekendDates(referenceDate = new Date()): string {
  const currentDay = referenceDate.getDay()
  const daysUntilSat = (6 - currentDay + 7) % 7
  const isWeekendNow = currentDay === 0 || currentDay === 6
  const satDate = new Date(referenceDate)
  if (currentDay === 6) satDate.setDate(referenceDate.getDate())
  else if (currentDay === 0) satDate.setDate(referenceDate.getDate() - 1)
  else satDate.setDate(referenceDate.getDate() + daysUntilSat)

  const sunDate = new Date(satDate)
  sunDate.setDate(satDate.getDate() + 1)
  const satFormatted = satDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const sunFormatted = sunDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const prefix = isWeekendNow ? 'This Weekend · ' : 'Next Weekend · '
  return `${prefix}Sat, ${satFormatted} & Sun, ${sunFormatted}`
}

export function normalizeLocationToken(locStr?: string): string {
  if (!locStr) return ''
  const cleaned = locStr
    .toLowerCase()
    .replace(/\bca\b|\bcalifornia\b/g, '')
    .replace(/[^\w\s]/g, ' ')
    .trim()

  const tokens = cleaned
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .sort()

  return tokens.join(' ')
}

export function getEventGroupKey(ev: IPublicAdoptionEvent): string {
  const title = (ev.title || '').trim()
  const loc = normalizeLocationToken(ev.locationName || ev.location || '')
  const startTime = (ev.startTime || '').trim()
  const endTime = (ev.endTime || '').trim()
  const timeKey = `${startTime}-${endTime}`
  const baseKey = loc ? `${title}:::${loc}` : title
  return timeKey !== '-' ? `${baseKey}:::${timeKey}` : baseKey
}

export function resolveLocationName(ev: IPublicAdoptionEvent): string {
  const loc = (ev.locationName || ev.location || '').trim()
  if (loc) return loc
  const title = (ev.title || '').trim()
  return title && !title.toLowerCase().startsWith('meet') ? title : DEFAULT_LOCATION_NAME
}

export function resolveLocationAddress(ev: IPublicAdoptionEvent, locName: string): string {
  if (ev.address && ev.address.trim()) return ev.address.trim()
  if (ev.location && ev.location.trim()) return ev.location.trim()
  if (locName && locName !== DEFAULT_LOCATION_NAME) return locName
  return DEFAULT_ADDRESS
}

function parseSortTime(dateStr?: string): number {
  if (!dateStr) return 0
  const t = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`).getTime()
  return isNaN(t) ? 0 : t
}

export function formatMergedEventDates(startDateStr?: string, endDateStr?: string, datesList: string[] = []): string {
  const validDates = (datesList.length > 0 ? datesList : [startDateStr, endDateStr])
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d.includes('T') ? d : `${d}T00:00:00`))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())

  if (validDates.length === 0) return calculateFallbackWeekendDates()

  const first = validDates[0]
  const diffDays = Math.ceil((first.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const prefix = diffDays >= -1 && diffDays <= 6 ? 'This Weekend · ' : 'Next Weekend · '

  const uniqueDateMap = new Map<string, Date>()
  for (const d of validDates) {
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!uniqueDateMap.has(key)) uniqueDateMap.set(key, d)
  }
  const uniqueDates = Array.from(uniqueDateMap.values())

  if (uniqueDates.length === 1) {
    return `${prefix}${uniqueDates[0].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
  }
  if (uniqueDates.length === 2) {
    const d1 = uniqueDates[0].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const d2 = uniqueDates[1].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    return `${prefix}${d1} & ${d2}`
  }
  return `${prefix}${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${validDates[validDates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

export function formatEventDates(event: IPublicAdoptionEvent): string {
  return formatMergedEventDates(event.startDate, event.endDate)
}

export function formatMergedRecurrence(groupEvents: IPublicAdoptionEvent[]): string {
  const days = new Set<string>()
  let startTime = ''
  let endTime = ''

  for (const ev of groupEvents) {
    if (ev.startTime && !startTime) startTime = ev.startTime
    if (ev.endTime && !endTime) endTime = ev.endTime
    if (ev.startDate) {
      const d = new Date(ev.startDate.includes('T') ? ev.startDate : `${ev.startDate}T00:00:00`)
      if (!isNaN(d.getTime())) days.add(d.toLocaleDateString('en-US', { weekday: 'short' }))
    }
  }

  const timeStr = startTime && endTime ? ` (${formatTime12h(startTime)} – ${formatTime12h(endTime)})` : ' (12 PM – 4 PM)'
  if (days.has('Sat') && days.has('Sun')) return `Sat & Sun${timeStr}`
  if (days.has('Sat')) return `Saturday${timeStr}`
  if (days.has('Sun')) return `Sunday${timeStr}`
  return `Weekend${timeStr}`
}

export function combineConsecutiveEvents(rawEvents: IPublicAdoptionEvent[]): IFormattedAdoptionEvent[] {
  const adoptionEvents = rawEvents.filter(isAdoptionEventType)
  if (adoptionEvents.length === 0) return []

  const venueGroups = new Map<string, IPublicAdoptionEvent[]>()
  for (const ev of adoptionEvents) {
    const groupKey = getEventGroupKey(ev)
    if (!venueGroups.has(groupKey)) venueGroups.set(groupKey, [])
    venueGroups.get(groupKey)!.push(ev)
  }

  const results: IFormattedAdoptionEvent[] = []
  venueGroups.forEach((groupEvents) => {
    groupEvents.sort((a, b) => parseSortTime(a.startDate) - parseSortTime(b.startDate))
    const sample = groupEvents.find((e) => (e.location && e.location.trim()) || (e.locationName && e.locationName.trim())) || groupEvents[0]
    const locName = resolveLocationName(sample)
    const venueAddress = resolveLocationAddress(sample, locName)

    const datesList: string[] = []
    const attendingPetIdSet = new Set<string>()
    const attendingPetsMap = new Map<string, IAttendingPetSummary>()

    for (const ev of groupEvents) {
      if (ev.startDate) datesList.push(ev.startDate)
      if (ev.endDate && ev.endDate !== ev.startDate) datesList.push(ev.endDate)
      ev.attendingPetIds?.forEach((id) => attendingPetIdSet.add(id))
      ev.attendingPets?.forEach((pet) => {
        if (pet.id) attendingPetsMap.set(pet.id, pet)
      })
    }

    let title = sample.title?.trim() || `Meet Our Adoptable Pets at ${locName}`
    if (title.toLowerCase().includes('petsmart') && !title.toLowerCase().startsWith('meet')) {
      title = `Meet Our Adoptable Pets at ${title}`
    } else if (!title.toLowerCase().startsWith('meet') && !title.toLowerCase().includes('adoption')) {
      title = `Meet Our Adoptable Pets at ${locName}`
    }

    results.push({
      id: sample.id || `venue-${locName.toLowerCase().replace(/\s+/g, '-')}`,
      title, locationName: locName, address: venueAddress,
      dates: formatMergedEventDates(sample.startDate, sample.endDate, datesList),
      recurrenceText: formatMergedRecurrence(groupEvents),
      directionsUrl: sample.googleMapsUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(`${locName} ${venueAddress}`.trim())}`,
      attendingPetIds: Array.from(attendingPetIdSet), attendingPets: Array.from(attendingPetsMap.values()), rawEvent: sample,
    })
  })
  return results
}

export function formatAdoptionEvent(event?: IPublicAdoptionEvent | null): IFormattedAdoptionEvent {
  if (!event) {
    return {
      id: 'default-petsmart', title: DEFAULT_EVENT_TITLE, locationName: DEFAULT_LOCATION_NAME, address: DEFAULT_ADDRESS,
      dates: calculateFallbackWeekendDates(), recurrenceText: DEFAULT_RECURRENCE, directionsUrl: DEFAULT_MAPS_URL,
      attendingPetIds: [], attendingPets: [],
    }
  }
  const combined = combineConsecutiveEvents([event])
  if (combined.length > 0) return combined[0]
  const locName = resolveLocationName(event)
  const addr = resolveLocationAddress(event, locName)
  return {
    id: event.id || 'event',
    title: event.title?.trim() || `Meet Our Adoptable Pets at ${locName}`,
    locationName: locName, address: addr,
    dates: formatMergedEventDates(event.startDate, event.endDate),
    recurrenceText: formatMergedRecurrence([event]),
    directionsUrl: event.googleMapsUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(`${locName} ${addr}`.trim())}`,
    attendingPetIds: event.attendingPetIds || [], attendingPets: event.attendingPets || [], rawEvent: event,
  }
}

export function computePetAttendanceMap(
  adoptionEvents: IPublicAdoptionEvent[],
): Map<string, IPetAttendanceSchedule> {
  const map = new Map<string, IPetAttendanceSchedule>()
  const validEvents = adoptionEvents.filter((e) => e && e.status !== 'cancelled' && isAdoptionEventType(e))

  // Determine if there are multiple events with different locations
  const locationTokens = new Set<string>()
  for (const ev of validEvents) {
    const token = normalizeLocationToken(resolveLocationName(ev))
    if (token) locationTokens.add(token)
  }
  const hasMultipleLocations = locationTokens.size > 1

  for (const ev of validEvents) {
    const petIds = new Set<string>()
    ev.attendingPetIds?.forEach((id) => id && petIds.add(String(id).trim()))
    ev.attendingPets?.forEach((p) => p?.id && petIds.add(String(p.id).trim()))
    if (petIds.size === 0) continue

    let dayShort = 'Sat'
    let dayFull = 'Saturday'
    if (ev.startDate) {
      const d = new Date(ev.startDate.includes('T') ? ev.startDate : `${ev.startDate}T00:00:00`)
      if (!isNaN(d.getTime())) {
        dayShort = d.toLocaleDateString('en-US', { weekday: 'short' })
        dayFull = d.toLocaleDateString('en-US', { weekday: 'long' })
      }
    }

    const locName = resolveLocationName(ev)
    for (const petId of petIds) {
      if (!map.has(petId)) {
        map.set(petId, {
          petId,
          days: [dayShort],
          dayFullNames: [dayFull],
          locationName: locName,
          scheduleText: '',
          shortDayText: '',
          isAttendingSat: dayShort === 'Sat',
          isAttendingSun: dayShort === 'Sun',
          isAttendingBoth: false,
        })
      } else {
        const existing = map.get(petId)!
        if (!existing.days.includes(dayShort)) {
          existing.days.push(dayShort)
          existing.dayFullNames.push(dayFull)
        }
        if (dayShort === 'Sat') existing.isAttendingSat = true
        if (dayShort === 'Sun') existing.isAttendingSun = true
        if (locName && !existing.locationName.includes(locName)) {
          existing.locationName = `${existing.locationName} & ${locName}`
        }
      }
    }
  }

  map.forEach((item) => {
    const hasSat = item.days.includes('Sat')
    const hasSun = item.days.includes('Sun')
    if (hasSat && hasSun) {
      item.isAttendingBoth = true
      item.shortDayText = 'Sat & Sun'
    } else if (hasSat) {
      item.shortDayText = 'Saturday Only'
    } else if (hasSun) {
      item.shortDayText = 'Sunday Only'
    } else {
      item.shortDayText = item.days.join(', ')
    }

    if (!hasMultipleLocations) {
      const venue = item.locationName.toLowerCase().includes('petco') ? 'Petco' : 'PetSmart'
      item.displayLocation = venue
      item.scheduleText = `At ${venue} ${item.shortDayText}`
    } else {
      const loc = item.locationName.trim() || 'PetSmart'
      const prefix = loc.toLowerCase().startsWith('at ') ? '' : 'At '
      item.displayLocation = loc.replace(/^at\s+/i, '')
      item.scheduleText = `${prefix}${loc} · ${item.shortDayText}`
    }
  })

  return map
}

function extractEventList(payload: unknown): IPublicAdoptionEvent[] {
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload)) return payload
  const rec = payload as Record<string, unknown>
  const list = rec.events || rec.data || rec.items || (rec.data && typeof rec.data === 'object' ? (rec.data as Record<string, unknown>).events || (rec.data as Record<string, unknown>).data || (rec.data as Record<string, unknown>).items : null)
  return Array.isArray(list) ? list as IPublicAdoptionEvent[] : []
}

export function useAdoptionEvents() {
  const fetchUpcomingEvents = async (force = false): Promise<void> => {
    if (isFetched.value && !force) return
    if (activeFetchPromise && !force) return activeFetchPromise

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

        if (rawPayload) {
          events.value = extractEventList(rawPayload)
            .filter((e) => e && e.status !== 'cancelled')
            .filter(isAdoptionEventType)
        } else {
          error.value = 'Could not load live calendar events'
        }
      } catch {
        error.value = 'Could not load live calendar events'
      } finally {
        isLoading.value = false
        isFetched.value = true
        activeFetchPromise = null
      }
    })()

    return activeFetchPromise
  }

  const upcomingEvents = computed<IPublicAdoptionEvent[]>(() => {
    const adoptionEvents = events.value.filter(isAdoptionEventType)
    if (adoptionEvents.length === 0) return []
    const now = Date.now()
    const upcoming = adoptionEvents
      .filter((e) => {
        const endIso = e.endDate || e.startDate
        const eventEnd = new Date(endIso.includes('T') ? endIso : `${endIso}T23:59:59`).getTime()
        return !isNaN(eventEnd) && eventEnd >= now
      })
      .sort((a, b) => parseSortTime(a.startDate) - parseSortTime(b.startDate))

    return upcoming.length > 0 ? upcoming : adoptionEvents
  })

  const formattedUpcomingEvents = computed<IFormattedAdoptionEvent[]>(() => combineConsecutiveEvents(upcomingEvents.value))

  const activeEventIndex = computed(() => {
    return selectedEventIndex.value >= formattedUpcomingEvents.value.length ? 0 : Math.max(0, selectedEventIndex.value)
  })

  const activeEvent = computed<IFormattedAdoptionEvent>(() => formattedUpcomingEvents.value[activeEventIndex.value] || formatAdoptionEvent(null))
  const nextEvent = computed<IPublicAdoptionEvent | null>(() => upcomingEvents.value[activeEventIndex.value] || upcomingEvents.value[0] || null)

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
  events.value = []
  isLoading.value = false
  error.value = null
  isFetched.value = false
  selectedEventIndex.value = 0
  activeFetchPromise = null
}
