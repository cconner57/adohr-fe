import type { IAttendingPetSummary, IPublicAdoptionEvent } from '@/models/events'

export const DEFAULT_EVENT_TITLE = 'Meet Our Adoptable Pets at PetSmart Pasadena'
export const DEFAULT_LOCATION_NAME = 'PetSmart Pasadena'
export const DEFAULT_ADDRESS = '3347 E Foothill Blvd, Pasadena'
export const DEFAULT_RECURRENCE = 'Sat & Sun (12 PM – 4 PM)'
export const DEFAULT_MAPS_URL = 'https://maps.google.com/?q=PetSmart+3347+E+Foothill+Blvd+Pasadena+CA+91107'

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

export function getTargetWeekendEnd(referenceDate = new Date()): Date {
  const currentDay = referenceDate.getDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const daysUntilSunday = (7 - currentDay) % 7
  const sundayEnd = new Date(referenceDate)
  sundayEnd.setDate(referenceDate.getDate() + daysUntilSunday)
  sundayEnd.setHours(23, 59, 59, 999)
  return sundayEnd
}

export function getWeekendCycleKey(dateStr?: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`)
  if (isNaN(d.getTime())) return ''
  const daysUntilSunday = (7 - d.getDay()) % 7
  const sunday = new Date(d)
  sunday.setDate(d.getDate() + daysUntilSunday)
  const yyyy = sunday.getFullYear()
  const mm = String(sunday.getMonth() + 1).padStart(2, '0')
  const dd = String(sunday.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function getEventGroupKey(ev: IPublicAdoptionEvent): string {
  const title = (ev.title || '').trim()
  const loc = normalizeLocationToken(ev.locationName || ev.location || '')
  const startTime = (ev.startTime || '').trim()
  const endTime = (ev.endTime || '').trim()
  const cycleKey = getWeekendCycleKey(ev.startDate || ev.endDate)
  const timeKey = `${startTime}-${endTime}`
  const baseKey = loc ? `${title}:::${loc}` : title
  const withTime = timeKey !== '-' ? `${baseKey}:::${timeKey}` : baseKey
  return cycleKey ? `${withTime}:::${cycleKey}` : withTime
}

export function resolveLocationName(ev: IPublicAdoptionEvent): string {
  const loc = (ev.locationName || ev.location || '').trim()
  if (loc) return loc
  const title = (ev.title || '').trim()
  return title && !title.toLowerCase().startsWith('meet') ? title : DEFAULT_LOCATION_NAME
}

export const KNOWN_VENUE_ADDRESSES: Record<string, string> = {
  pasadena: '3347 E Foothill Blvd, Pasadena, CA 91107',
  upland: '1935 N Campus Ave, Upland, CA 91784',
  monrovia: '645 W Huntington Dr, Monrovia, CA 91016',
  burbank: '3525 W Victory Blvd, Burbank, CA 91505',
}

export function resolveLocationAddress(ev: IPublicAdoptionEvent, locName: string): string {
  if (ev.address && ev.address.trim()) {
    const raw = ev.address.trim()
    const parts = [raw]
    if (ev.city && !raw.toLowerCase().includes(ev.city.toLowerCase())) parts.push(ev.city.trim())
    if (ev.state && !raw.toLowerCase().includes(ev.state.toLowerCase())) parts.push(ev.state.trim())
    if (ev.zip && !raw.includes(ev.zip)) parts.push(ev.zip.trim())
    return parts.join(', ')
  }

  const loc = (ev.location || '').trim()
  if (loc && /\d+\s+[A-Za-z]/.test(loc)) {
    const commaIndex = loc.indexOf(',')
    if (commaIndex !== -1 && /\d+/.test(loc.slice(commaIndex + 1))) {
      return loc.slice(commaIndex + 1).trim()
    }
    return loc
  }

  const normalizedLoc = `${locName} ${loc}`.toLowerCase()
  for (const [key, knownAddr] of Object.entries(KNOWN_VENUE_ADDRESSES)) {
    if (normalizedLoc.includes(key)) {
      return knownAddr
    }
  }

  if (locName === DEFAULT_LOCATION_NAME || locName.toLowerCase().includes('pasadena')) {
    return DEFAULT_ADDRESS
  }

  return ''
}

export function parseSortTime(dateStr?: string): number {
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
    const eventWithAddress = groupEvents.find((e) => (e.address && e.address.trim()) || (e.location && /\d+\s+[A-Za-z]/.test(e.location)))
    const sample = eventWithAddress || groupEvents.find((e) => (e.location && e.location.trim()) || (e.locationName && e.locationName.trim())) || groupEvents[0]
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
      title,
      locationName: locName,
      address: venueAddress,
      dates: formatMergedEventDates(sample.startDate, sample.endDate, datesList),
      recurrenceText: formatMergedRecurrence(groupEvents),
      directionsUrl: sample.googleMapsUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(`${locName} ${venueAddress}`.trim())}`,
      attendingPetIds: Array.from(attendingPetIdSet),
      attendingPets: Array.from(attendingPetsMap.values()),
      rawEvent: sample,
    })
  })
  return results
}

export function formatAdoptionEvent(event?: IPublicAdoptionEvent | null): IFormattedAdoptionEvent {
  if (!event) {
    return {
      id: 'default-petsmart',
      title: DEFAULT_EVENT_TITLE,
      locationName: DEFAULT_LOCATION_NAME,
      address: DEFAULT_ADDRESS,
      dates: calculateFallbackWeekendDates(),
      recurrenceText: DEFAULT_RECURRENCE,
      directionsUrl: DEFAULT_MAPS_URL,
      attendingPetIds: [],
      attendingPets: [],
    }
  }
  const combined = combineConsecutiveEvents([event])
  if (combined.length > 0) return combined[0]
  const locName = resolveLocationName(event)
  const addr = resolveLocationAddress(event, locName)
  return {
    id: event.id || 'event',
    title: event.title?.trim() || `Meet Our Adoptable Pets at ${locName}`,
    locationName: locName,
    address: addr,
    dates: formatMergedEventDates(event.startDate, event.endDate),
    recurrenceText: formatMergedRecurrence([event]),
    directionsUrl: event.googleMapsUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(`${locName} ${addr}`.trim())}`,
    attendingPetIds: event.attendingPetIds || [],
    attendingPets: event.attendingPets || [],
    rawEvent: event,
  }
}

export function computePetAttendanceMap(
  adoptionEvents: IPublicAdoptionEvent[],
): Map<string, IPetAttendanceSchedule> {
  const map = new Map<string, IPetAttendanceSchedule>()
  const validEvents = adoptionEvents.filter((e) => e && e.status !== 'cancelled' && isAdoptionEventType(e))

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

export function extractEventList(payload: unknown): IPublicAdoptionEvent[] {
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload)) return payload
  const rec = payload as Record<string, unknown>
  const list =
    rec.events ||
    rec.data ||
    rec.items ||
    (rec.data && typeof rec.data === 'object'
      ? (rec.data as Record<string, unknown>).events ||
        (rec.data as Record<string, unknown>).data ||
        (rec.data as Record<string, unknown>).items
      : null)
  return Array.isArray(list) ? (list as IPublicAdoptionEvent[]) : []
}
