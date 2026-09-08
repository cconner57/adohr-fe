import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import type { IPublicAdoptionEvent } from '@/models/events'

import {
  calculateFallbackWeekendDates,
  computePetAttendanceMap,
  formatEventDates,
  formatTime12h,
  isAdoptionEventType,
  resetAdoptionEventsState,
  useAdoptionEvents,
} from '../useAdoptionEvents'

describe('useAdoptionEvents', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
    resetAdoptionEventsState()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('correctly converts 24h and 12h time strings to user-friendly format', () => {
    expect(formatTime12h('12:00')).toBe('12 PM')
    expect(formatTime12h('16:00')).toBe('4 PM')
    expect(formatTime12h('09:30')).toBe('9:30 AM')
    expect(formatTime12h('14:45')).toBe('2:45 PM')
    expect(formatTime12h('12:00 PM')).toBe('12:00 PM')
  })

  it('correctly identifies adoption event types from Adoption OS contract', () => {
    expect(
      isAdoptionEventType({
        id: 'evt-12345',
        title: 'PetSmart Adoption Fair',
        type: 'adoption-event',
        startDate: '2026-08-08',
      }),
    ).toBe(true)

    expect(
      isAdoptionEventType({
        id: '2',
        title: 'Weekend Adoption Fair',
        eventType: 'adoption_event',
        startDate: '2026-08-08',
      }),
    ).toBe(true)

    expect(
      isAdoptionEventType({
        id: '3',
        title: 'Board of Directors Meeting',
        type: 'internal-meeting',
        startDate: '2026-08-08',
      }),
    ).toBe(false)
  })

  it('calculates fallback weekend dates cleanly', () => {
    const testDate = new Date('2026-08-27T12:00:00Z') // Thursday
    const formatted = calculateFallbackWeekendDates(testDate)
    expect(formatted).toContain('Weekend')
    expect(formatted).toContain('Sat')
    expect(formatted).toContain('Sun')
  })

  it('formats custom adoption event dates properly', () => {
    const formatted = formatEventDates({
      id: '1',
      title: 'PetSmart Adoptions',
      type: 'adoption-event',
      startDate: '2026-09-12T12:00:00Z',
      endDate: '2026-09-13T16:00:00Z',
    })
    expect(formatted).toContain('Sep 12')
    expect(formatted).toContain('Sep 13')
  })

  it('gracefully handles API failure by providing safe empty states without throwing', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { formattedUpcomingEvents, hasUpcomingEvents, fetchUpcomingEvents, error } =
      useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    expect(error.value).toBe('Could not load live calendar events')
    expect(hasUpcomingEvents.value).toBe(false)
    expect(formattedUpcomingEvents.value).toHaveLength(0)
  })

  it('populates live Adoption OS events and attending pets matching the exact API contract', async () => {
    const mockApiResponse = {
      events: [
        {
          id: 'evt-12345',
          orgId: 'adohr',
          title: 'PetSmart Adoption Fair',
          type: 'adoption-event',
          startDate: '2026-08-08',
          startTime: '12:00',
          endDate: '2026-08-08',
          endTime: '16:00',
          allDay: false,
          location: 'PetSmart Pasadena, 3347 E Foothill Blvd',
          description: 'Come meet our adoptable cats and kittens looking for forever homes!',
          repeat: {
            type: 'weekly',
            every: 1,
            period: 'week',
            endType: 'never',
            endDate: '',
            endAfter: 0,
          },
          attendingPetIds: ['pet-uuid-1', 'pet-uuid-2'],
          attendingPets: [
            {
              id: 'pet-uuid-1',
              name: 'Luna',
              species: 'cat',
              sex: 'Female',
              breed: 'Domestic Short Hair',
              status: 'available',
              primaryPhoto: 'pets/pet-uuid-1/photos/photo-0.jpg',
              photos: ['pets/pet-uuid-1/photos/photo-0.jpg'],
            },
            {
              id: 'pet-uuid-2',
              name: 'Oliver',
              species: 'cat',
              sex: 'Male',
              breed: 'Tabby',
              status: 'available',
              primaryPhoto: 'pets/pet-uuid-2/photos/photo-0.jpg',
              photos: ['pets/pet-uuid-2/photos/photo-0.jpg'],
            },
          ],
          vetPets: [
            { id: 'pet-uuid-1', name: 'Luna' },
            { id: 'pet-uuid-2', name: 'Oliver' },
          ],
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response)

    const {
      displayAddress,
      displayTitle,
      recurrenceText,
      attendingPetIds,
      attendingPets,
      fetchUpcomingEvents,
    } = useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    expect(displayTitle.value).toContain('PetSmart Adoption Fair')
    expect(displayAddress.value).toContain('3347 E Foothill Blvd')
    expect(recurrenceText.value).toBe('Saturday (12 PM – 4 PM)')
    expect(attendingPetIds.value).toEqual(['pet-uuid-1', 'pet-uuid-2'])
    expect(attendingPets.value).toHaveLength(2)
    expect(attendingPets.value[0].name).toBe('Luna')
    expect(attendingPets.value[1].name).toBe('Oliver')
  })

  it('handles multiple events at different locations and times with selectEvent', async () => {
    const mockApiResponse = {
      events: [
        {
          id: 'evt-pasadena',
          title: 'PetSmart Pasadena Adoption Event',
          type: 'adoption-event',
          startDate: '2026-09-05',
          startTime: '12:00',
          endDate: '2026-09-05',
          endTime: '16:00',
          location: 'PetSmart Pasadena',
          address: '3347 E Foothill Blvd, Pasadena',
          attendingPetIds: ['pet-1'],
        },
        {
          id: 'evt-burbank',
          title: 'Petco Burbank Adoption Fair',
          type: 'adoption-event',
          startDate: '2026-09-05',
          startTime: '11:00',
          endDate: '2026-09-05',
          endTime: '15:00',
          location: 'Petco Burbank',
          address: '3525 W Victory Blvd, Burbank',
          attendingPetIds: ['pet-2', 'pet-3'],
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response)

    const {
      formattedUpcomingEvents,
      selectEvent,
      displayLocation,
      displayAddress,
      recurrenceText,
      attendingPetIds,
      allAttendingPetIds,
      fetchUpcomingEvents,
    } = useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    expect(formattedUpcomingEvents.value).toHaveLength(2)
    expect(displayLocation.value).toBe('PetSmart Pasadena')
    expect(displayAddress.value).toContain('3347 E Foothill Blvd')
    expect(recurrenceText.value).toContain('12 PM – 4 PM')
    expect(attendingPetIds.value).toEqual(['pet-1'])
    expect(allAttendingPetIds.value).toEqual(['pet-1', 'pet-2', 'pet-3'])

    // Switch to Burbank event
    selectEvent(1)
    await nextTick()

    expect(displayLocation.value).toBe('Petco Burbank')
    expect(displayAddress.value).toContain('3525 W Victory Blvd')
    expect(recurrenceText.value).toContain('11 AM – 3 PM')
    expect(attendingPetIds.value).toEqual(['pet-2', 'pet-3'])
  })

  it('combines consecutive Saturday and Sunday events when titles match exactly', async () => {
    const mockApiResponse = {
      data: [
        { id: 'evt-pasadena-sat', title: 'PetSmart - Pasadena', type: 'adoption-event', startDate: '2026-09-05', startTime: '12:00', endTime: '16:00', location: 'PetSmart - Pasadena', attendingPetIds: ['pet-1'] },
        { id: 'evt-pasadena-sun', title: 'PetSmart - Pasadena', type: 'adoption-event', startDate: '2026-09-06', startTime: '12:00', endTime: '16:00', location: 'PetSmart - Pasadena', attendingPetIds: ['pet-2'] },
        { id: 'evt-upland-sun', title: 'PetSmart - Upland', type: 'adoption-event', startDate: '2026-09-06', startTime: '12:00', endTime: '16:00', location: 'PetSmart - Upland', attendingPetIds: ['pet-3'] },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response)

    const {
      formattedUpcomingEvents,
      displayLocation,
      displayDates,
      recurrenceText,
      attendingPetIds,
      fetchUpcomingEvents,
    } = useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    // 2 events with matching title combine into 1, plus 1 Upland event = 2 tabs
    expect(formattedUpcomingEvents.value).toHaveLength(2)

    // Pasadena combined event
    expect(displayLocation.value).toBe('PetSmart - Pasadena')
    expect(displayDates.value).toContain('Sat, Sep 5 & Sun, Sep 6')
    expect(recurrenceText.value).toBe('Sat & Sun (12 PM – 4 PM)')
    expect(attendingPetIds.value).toEqual(['pet-1', 'pet-2'])
  })

  it('dynamically groups events in any city such as Monrovia and Arcadia without hardcoded lists', async () => {
    const mockApiResponse = {
      data: [
        {
          id: 'evt-monrovia-sat',
          title: 'Weekend Adoption Fair',
          type: 'adoption-event',
          startDate: '2026-09-05',
          location: 'PetSmart - Monrovia',
        },
        {
          id: 'evt-monrovia-sun',
          title: 'Weekend Adoption Fair',
          type: 'adoption-event',
          startDate: '2026-09-06',
          location: 'PetSmart - Monrovia',
        },
        {
          id: 'evt-arcadia-sun',
          title: 'Weekend Adoption Fair',
          type: 'adoption-event',
          startDate: '2026-09-06',
          location: 'Petco - Arcadia',
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response)

    const { formattedUpcomingEvents, fetchUpcomingEvents } = useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    // 2 Monrovia events combine into 1 tab, Arcadia is 2nd tab = 2 tabs total
    expect(formattedUpcomingEvents.value).toHaveLength(2)
    expect(formattedUpcomingEvents.value[0].locationName).toBe('PetSmart - Monrovia')
    expect(formattedUpcomingEvents.value[0].dates).toContain('Sat, Sep 5 & Sun, Sep 6')
    expect(formattedUpcomingEvents.value[1].locationName).toBe('Petco - Arcadia')
  })

  it('does not combine events if they have different start or end times', async () => {
    const mockApiResponse = {
      data: [
        {
          id: 'evt-pasadena-sat',
          title: 'PetSmart Adoption Event',
          type: 'adoption-event',
          startDate: '2026-09-05',
          startTime: '12:00',
          endTime: '16:00',
          location: 'PetSmart - Pasadena',
        },
        {
          id: 'evt-pasadena-sun',
          title: 'PetSmart Adoption Event',
          type: 'adoption-event',
          startDate: '2026-09-06',
          startTime: '11:00',
          endTime: '18:00',
          location: 'PetSmart - Pasadena',
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response)

    const { formattedUpcomingEvents, fetchUpcomingEvents } = useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    // 2 events with different times (12-4 vs 11-6) must NOT combine -> 2 separate tabs
    expect(formattedUpcomingEvents.value).toHaveLength(2)
    expect(formattedUpcomingEvents.value[0].recurrenceText).toBe('Saturday (12 PM – 4 PM)')
    expect(formattedUpcomingEvents.value[1].recurrenceText).toBe('Sunday (11 AM – 6 PM)')
  })

  it('combines events when location wording is permuted (e.g. PetSmart - Pasadena vs Pasadena PetSmart)', async () => {
    const mockApiResponse = {
      data: [
        { id: 'evt-1', title: 'Adoption Fair', type: 'adoption-event', startDate: '2026-09-05', startTime: '12:00', endTime: '16:00', location: 'PetSmart - Pasadena' },
        { id: 'evt-2', title: 'Adoption Fair', type: 'adoption-event', startDate: '2026-09-06', startTime: '12:00', endTime: '16:00', location: 'Pasadena PetSmart' },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response)

    const { formattedUpcomingEvents, fetchUpcomingEvents } = useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    // Permuted location wording for identical title & hours combines into 1 tab
    expect(formattedUpcomingEvents.value).toHaveLength(1)
    expect(formattedUpcomingEvents.value[0].dates).toContain('Sat, Sep 5 & Sun, Sep 6')
  })

  it('keeps events separate when titles do not match exactly, combining only identical titles', async () => {
    const mockApiResponse = {
      data: [
        { id: 'evt-1', title: 'PetSmart Adoptions', type: 'adoption-event', startDate: '2026-09-05', startTime: '12:00', endTime: '16:00', location: 'PetSmart - Pasadena' },
        { id: 'evt-2', title: 'PetSmart Adoption Pasadena', type: 'adoption-event', startDate: '2026-09-05', startTime: '12:00', endTime: '16:00', location: 'PetSmart - Pasadena' },
        { id: 'evt-3', title: 'PetSmart Adoption Pasadena', type: 'adoption-event', startDate: '2026-09-06', startTime: '12:00', endTime: '16:00', location: 'PetSmart - Pasadena' },
        { id: 'evt-4', title: 'PetSmart Adoption Upland', type: 'adoption-event', startDate: '2026-09-06', startTime: '12:00', endTime: '16:00', location: 'PetSmart - Upland' },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response)

    const { formattedUpcomingEvents, fetchUpcomingEvents } = useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    // 4 raw events with 3 distinct exact title keys (PetSmart Adoptions, PetSmart Adoption Pasadena, PetSmart Adoption Upland) = 3 tabs shown
    expect(formattedUpcomingEvents.value).toHaveLength(3)
  })

  it('correctly calculates individual pet attendance schedule for single day vs both days', async () => {
    const mockApiResponse = {
      events: [
        {
          id: 'evt-sat',
          title: 'PetSmart Adoption Fair',
          type: 'adoption-event',
          startDate: '2026-09-05', // Saturday
          startTime: '12:00',
          endDate: '2026-09-05',
          endTime: '16:00',
          location: 'PetSmart Pasadena',
          attendingPetIds: ['pet-sat-only', 'pet-both-days'],
        },
        {
          id: 'evt-sun',
          title: 'PetSmart Adoption Fair',
          type: 'adoption-event',
          startDate: '2026-09-06', // Sunday
          startTime: '12:00',
          endDate: '2026-09-06',
          endTime: '16:00',
          location: 'PetSmart Pasadena',
          attendingPetIds: ['pet-sun-only', 'pet-both-days'],
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response)

    const { getPetAttendanceSchedule, fetchUpcomingEvents } = useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    const satPet = getPetAttendanceSchedule('pet-sat-only')
    expect(satPet).toBeDefined()
    expect(satPet?.isAttendingSat).toBe(true)
    expect(satPet?.isAttendingSun).toBe(false)
    expect(satPet?.isAttendingBoth).toBe(false)
    expect(satPet?.scheduleText).toBe('At PetSmart Saturday Only')
    expect(satPet?.shortDayText).toBe('Saturday Only')

    const sunPet = getPetAttendanceSchedule('pet-sun-only')
    expect(sunPet).toBeDefined()
    expect(sunPet?.isAttendingSat).toBe(false)
    expect(sunPet?.isAttendingSun).toBe(true)
    expect(sunPet?.isAttendingBoth).toBe(false)
    expect(sunPet?.scheduleText).toBe('At PetSmart Sunday Only')
    expect(sunPet?.shortDayText).toBe('Sunday Only')

    const bothPet = getPetAttendanceSchedule('pet-both-days')
    expect(bothPet).toBeDefined()
    expect(bothPet?.isAttendingSat).toBe(true)
    expect(bothPet?.isAttendingSun).toBe(true)
    expect(bothPet?.isAttendingBoth).toBe(true)
    expect(bothPet?.scheduleText).toBe('At PetSmart Sat & Sun')
    expect(bothPet?.shortDayText).toBe('Sat & Sun')
  })

  it('specifies location on pet cards when multiple events have different locations', () => {
    const multiLocationEvents: IPublicAdoptionEvent[] = [
      { id: '1', title: 'Adoption Fair', location: 'PetSmart - Pasadena', type: 'adoption-event', startDate: '2026-09-05', attendingPetIds: ['pet-pasadena'] },
      { id: '2', title: 'Adoption Fair', location: 'PetSmart - Upland', type: 'adoption-event', startDate: '2026-09-06', attendingPetIds: ['pet-upland'] },
    ]
    const map = computePetAttendanceMap(multiLocationEvents)
    expect(map.get('pet-pasadena')?.scheduleText).toBe('At PetSmart - Pasadena · Saturday Only')
    expect(map.get('pet-upland')?.scheduleText).toBe('At PetSmart - Upland · Sunday Only')
  })
})
