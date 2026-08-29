import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import {
  calculateFallbackWeekendDates,
  formatEventDates,
  formatTime12h,
  isAdoptionEventType,
  useAdoptionEvents,
} from '../useAdoptionEvents'

describe('useAdoptionEvents', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
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

  it('gracefully handles API failure by providing fallback data without throwing', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { displayTitle, displayAddress, displayDates, fetchUpcomingEvents, error } =
      useAdoptionEvents()

    await fetchUpcomingEvents(true)
    await nextTick()

    expect(error.value).toBe('Could not load live calendar events')
    expect(displayTitle.value).toContain('Meet Our Adoptable Pets')
    expect(displayAddress.value).toContain('3347 E Foothill Blvd')
    expect(displayDates.value).toBeTruthy()
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
    expect(displayAddress.value).toContain('PetSmart Pasadena, 3347 E Foothill Blvd')
    expect(recurrenceText.value).toBe('Every Sat & Sun (12 PM – 4 PM)')
    expect(attendingPetIds.value).toEqual(['pet-uuid-1', 'pet-uuid-2'])
    expect(attendingPets.value).toHaveLength(2)
    expect(attendingPets.value[0].name).toBe('Luna')
    expect(attendingPets.value[1].name).toBe('Oliver')
  })
})
