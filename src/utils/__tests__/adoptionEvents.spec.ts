import { describe, expect, it } from 'vitest'

import type { IPublicAdoptionEvent } from '@/models/events'

import {
  calculateFallbackWeekendDates,
  combineConsecutiveEvents,
  computePetAttendanceMap,
  formatEventDates,
  formatTime12h,
  getTargetWeekendEnd,
  getWeekendCycleKey,
  isAdoptionEventType,
} from '../adoptionEvents'

describe('adoptionEvents utils', () => {
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

  it('combines consecutive Saturday and Sunday events when titles match exactly', () => {
    const events: IPublicAdoptionEvent[] = [
      {
        id: 'evt-pasadena-sat',
        title: 'PetSmart - Pasadena',
        type: 'adoption-event',
        startDate: '2026-09-05',
        startTime: '12:00',
        endTime: '16:00',
        location: 'PetSmart - Pasadena',
        attendingPetIds: ['pet-1'],
      },
      {
        id: 'evt-pasadena-sun',
        title: 'PetSmart - Pasadena',
        type: 'adoption-event',
        startDate: '2026-09-06',
        startTime: '12:00',
        endTime: '16:00',
        location: 'PetSmart - Pasadena',
        attendingPetIds: ['pet-2'],
      },
      {
        id: 'evt-upland-sun',
        title: 'PetSmart - Upland',
        type: 'adoption-event',
        startDate: '2026-09-06',
        startTime: '12:00',
        endTime: '16:00',
        location: 'PetSmart - Upland',
        attendingPetIds: ['pet-3'],
      },
    ]

    const result = combineConsecutiveEvents(events)
    expect(result).toHaveLength(2)
    expect(result[0].locationName).toBe('PetSmart - Pasadena')
    expect(result[0].dates).toContain('Sat, Sep 5 & Sun, Sep 6')
    expect(result[0].recurrenceText).toBe('Sat & Sun (12 PM – 4 PM)')
    expect(result[0].attendingPetIds).toEqual(['pet-1', 'pet-2'])
  })

  it('dynamically groups events in any city such as Monrovia and Arcadia without hardcoded lists', () => {
    const events: IPublicAdoptionEvent[] = [
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
    ]

    const result = combineConsecutiveEvents(events)
    expect(result).toHaveLength(2)
    expect(result[0].locationName).toBe('PetSmart - Monrovia')
    expect(result[0].dates).toContain('Sat, Sep 5 & Sun, Sep 6')
    expect(result[1].locationName).toBe('Petco - Arcadia')
  })

  it('does not combine events if they have different start or end times', () => {
    const events: IPublicAdoptionEvent[] = [
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
    ]

    const result = combineConsecutiveEvents(events)
    expect(result).toHaveLength(2)
    expect(result[0].recurrenceText).toBe('Saturday (12 PM – 4 PM)')
    expect(result[1].recurrenceText).toBe('Sunday (11 AM – 6 PM)')
  })

  it('combines events when location wording is permuted (e.g. PetSmart - Pasadena vs Pasadena PetSmart)', () => {
    const events: IPublicAdoptionEvent[] = [
      {
        id: 'evt-1',
        title: 'Adoption Fair',
        type: 'adoption-event',
        startDate: '2026-09-05',
        startTime: '12:00',
        endTime: '16:00',
        location: 'PetSmart - Pasadena',
      },
      {
        id: 'evt-2',
        title: 'Adoption Fair',
        type: 'adoption-event',
        startDate: '2026-09-06',
        startTime: '12:00',
        endTime: '16:00',
        location: 'Pasadena PetSmart',
      },
    ]

    const result = combineConsecutiveEvents(events)
    expect(result).toHaveLength(1)
    expect(result[0].dates).toContain('Sat, Sep 5 & Sun, Sep 6')
  })

  it('keeps events separate when titles do not match exactly, combining only identical titles', () => {
    const events: IPublicAdoptionEvent[] = [
      {
        id: 'evt-1',
        title: 'PetSmart Adoptions',
        type: 'adoption-event',
        startDate: '2026-09-05',
        startTime: '12:00',
        endTime: '16:00',
        location: 'PetSmart - Pasadena',
      },
      {
        id: 'evt-2',
        title: 'PetSmart Adoption Pasadena',
        type: 'adoption-event',
        startDate: '2026-09-05',
        startTime: '12:00',
        endTime: '16:00',
        location: 'PetSmart - Pasadena',
      },
      {
        id: 'evt-3',
        title: 'PetSmart Adoption Pasadena',
        type: 'adoption-event',
        startDate: '2026-09-06',
        startTime: '12:00',
        endTime: '16:00',
        location: 'PetSmart - Pasadena',
      },
      {
        id: 'evt-4',
        title: 'PetSmart Adoption Upland',
        type: 'adoption-event',
        startDate: '2026-09-06',
        startTime: '12:00',
        endTime: '16:00',
        location: 'PetSmart - Upland',
      },
    ]

    const result = combineConsecutiveEvents(events)
    expect(result).toHaveLength(3)
  })

  it('correctly calculates individual pet attendance schedule for single day vs both days', () => {
    const events: IPublicAdoptionEvent[] = [
      {
        id: 'evt-1',
        title: 'PetSmart Adoption Fair',
        type: 'adoption-event',
        startDate: '2026-09-05',
        location: 'PetSmart',
        attendingPetIds: ['pet-sat-only', 'pet-both-days'],
      },
      {
        id: 'evt-2',
        title: 'PetSmart Adoption Fair',
        type: 'adoption-event',
        startDate: '2026-09-06',
        location: 'PetSmart',
        attendingPetIds: ['pet-sun-only', 'pet-both-days'],
      },
    ]

    const map = computePetAttendanceMap(events)

    const satPet = map.get('pet-sat-only')
    expect(satPet?.isAttendingSat).toBe(true)
    expect(satPet?.isAttendingSun).toBe(false)
    expect(satPet?.shortDayText).toBe('Saturday Only')

    const sunPet = map.get('pet-sun-only')
    expect(sunPet?.isAttendingSat).toBe(false)
    expect(sunPet?.isAttendingSun).toBe(true)
    expect(sunPet?.shortDayText).toBe('Sunday Only')

    const bothPet = map.get('pet-both-days')
    expect(bothPet?.isAttendingBoth).toBe(true)
    expect(bothPet?.shortDayText).toBe('Sat & Sun')
  })

  it('specifies location on pet cards when multiple events have different locations', () => {
    const multiLocationEvents: IPublicAdoptionEvent[] = [
      {
        id: '1',
        title: 'Adoption Fair',
        location: 'PetSmart - Pasadena',
        type: 'adoption-event',
        startDate: '2026-09-05',
        attendingPetIds: ['pet-pasadena'],
      },
      {
        id: '2',
        title: 'Adoption Fair',
        location: 'PetSmart - Upland',
        type: 'adoption-event',
        startDate: '2026-09-06',
        attendingPetIds: ['pet-upland'],
      },
    ]
    const map = computePetAttendanceMap(multiLocationEvents)
    expect(map.get('pet-pasadena')?.scheduleText).toBe('At PetSmart - Pasadena · Saturday Only')
    expect(map.get('pet-upland')?.scheduleText).toBe('At PetSmart - Upland · Sunday Only')
  })

  describe('Weekend Cycle Calculations', () => {
    it('calculates the target weekend ending Sunday correctly for any day of the week', () => {
      // Sunday Sep 27 -> ends Sunday Sep 27 23:59:59.999
      const sunDate = new Date('2026-09-27T10:00:00')
      const sunEnd = getTargetWeekendEnd(sunDate)
      expect(sunEnd.getFullYear()).toBe(2026)
      expect(sunEnd.getMonth()).toBe(8)
      expect(sunEnd.getDate()).toBe(27)
      expect(sunEnd.getHours()).toBe(23)
      expect(sunEnd.getMinutes()).toBe(59)

      // Monday Sep 28 -> ends Sunday Oct 4 23:59:59.999
      const monDate = new Date('2026-09-28T09:00:00')
      const monEnd = getTargetWeekendEnd(monDate)
      expect(monEnd.getDate()).toBe(4)
      expect(monEnd.getMonth()).toBe(9)

      // Saturday Oct 3 -> ends Sunday Oct 4 23:59:59.999
      const satDate = new Date('2026-10-03T14:00:00')
      const satEnd = getTargetWeekendEnd(satDate)
      expect(satEnd.getDate()).toBe(4)
      expect(satEnd.getMonth()).toBe(9)
    })

    it('groups dates within the same weekend cycle to the same cycle key', () => {
      expect(getWeekendCycleKey('2026-09-25')).toBe('2026-09-27')
      expect(getWeekendCycleKey('2026-09-26')).toBe('2026-09-27')
      expect(getWeekendCycleKey('2026-09-27')).toBe('2026-09-27')

      expect(getWeekendCycleKey('2026-10-03')).toBe('2026-10-04')
      expect(getWeekendCycleKey('2026-10-04')).toBe('2026-10-04')
    })
  })
})
