import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import {
  resetAdoptionEventsState,
  useAdoptionEvents,
} from '../useAdoptionEvents'

describe('useAdoptionEvents composable', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
    resetAdoptionEventsState()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.useRealTimers()
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

    selectEvent(1)
    await nextTick()

    expect(displayLocation.value).toBe('Petco Burbank')
    expect(displayAddress.value).toContain('3525 W Victory Blvd')
    expect(recurrenceText.value).toContain('11 AM – 3 PM')
    expect(attendingPetIds.value).toEqual(['pet-2', 'pet-3'])
  })

  it('on Sunday, does not show next Saturday events and shows only current Sunday events', async () => {
    // Fake time: Sunday Sep 27, 2026 at 09:00:00 AM
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-27T09:00:00'))

    const mockApiResponse = {
      data: [
        {
          id: 'evt-pasadena-sun-1',
          title: 'PetSmart Adoption',
          type: 'adoption-event',
          startDate: '2026-09-27',
          startTime: '12:00',
          endDate: '2026-09-27',
          endTime: '16:00',
          location: 'PetSmart - Pasadena',
        },
        {
          id: 'evt-upland-sun-1',
          title: 'PetSmart Adoption',
          type: 'adoption-event',
          startDate: '2026-09-27',
          startTime: '12:00',
          endDate: '2026-09-27',
          endTime: '16:00',
          location: 'PetSmart - Upland',
        },
        {
          id: 'evt-pasadena-sat-2',
          title: 'PetSmart Adoptions',
          type: 'adoption-event',
          startDate: '2026-10-03',
          startTime: '12:00',
          endDate: '2026-10-03',
          endTime: '16:00',
          location: 'PetSmart - Pasadena',
        },
        {
          id: 'evt-pasadena-sun-2',
          title: 'PetSmart Adoption',
          type: 'adoption-event',
          startDate: '2026-10-04',
          startTime: '12:00',
          endDate: '2026-10-04',
          endTime: '16:00',
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

    // Exactly 2 tabs for today: Pasadena and Upland (both Sunday).
    // Next Saturday (Oct 3) and Next Sunday (Oct 4) are NOT shown on Sunday!
    expect(formattedUpcomingEvents.value).toHaveLength(2)
    expect(formattedUpcomingEvents.value.map((e) => e.locationName)).toEqual([
      'PetSmart - Pasadena',
      'PetSmart - Upland',
    ])
    expect(formattedUpcomingEvents.value[0].recurrenceText).toBe('Sunday (12 PM – 4 PM)')
    expect(formattedUpcomingEvents.value[0].dates).toContain('Sun, Sep 27')
    expect(formattedUpcomingEvents.value[0].dates).not.toContain('Oct 4')
  })

  it('on Monday, rolls over to display the coming weekend events', async () => {
    // Fake time: Monday Sep 28, 2026 at 09:00:00 AM
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-28T09:00:00'))

    const mockApiResponse = {
      data: [
        {
          id: 'evt-pasadena-sun-past',
          title: 'PetSmart Adoption',
          type: 'adoption-event',
          startDate: '2026-09-27',
          startTime: '12:00',
          endDate: '2026-09-27',
          endTime: '16:00',
          location: 'PetSmart - Pasadena',
        },
        {
          id: 'evt-pasadena-sat-next',
          title: 'PetSmart Adoption',
          type: 'adoption-event',
          startDate: '2026-10-03',
          startTime: '12:00',
          endDate: '2026-10-03',
          endTime: '16:00',
          location: 'PetSmart - Pasadena',
        },
        {
          id: 'evt-pasadena-sun-next',
          title: 'PetSmart Adoption',
          type: 'adoption-event',
          startDate: '2026-10-04',
          startTime: '12:00',
          endDate: '2026-10-04',
          endTime: '16:00',
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

    // On Monday, the weekend of Oct 3 & Oct 4 is shown, and past Sep 27 is excluded
    expect(formattedUpcomingEvents.value).toHaveLength(1)
    expect(formattedUpcomingEvents.value[0].locationName).toBe('PetSmart - Pasadena')
    expect(formattedUpcomingEvents.value[0].dates).toContain('Sat, Oct 3 & Sun, Oct 4')
    expect(formattedUpcomingEvents.value[0].recurrenceText).toBe('Sat & Sun (12 PM – 4 PM)')
  })
})
