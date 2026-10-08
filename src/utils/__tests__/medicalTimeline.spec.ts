import { describe, expect, it } from 'vitest'

import type { IPetMedicalPortalData } from '@/models/common'
import {
  buildCareTimeline,
  getSpayNeuterInfo,
  getSpayNeuterLabels,
  isFemale,
  isMale,
  parseTimelineTimestamp,
} from '@/utils/medicalTimeline'

describe('medicalTimeline utility', () => {
  it('correctly determines sex using isFemale and isMale', () => {
    expect(isFemale('female')).toBe(true)
    expect(isFemale('Female')).toBe(true)
    expect(isFemale('F')).toBe(true)
    expect(isFemale('male')).toBe(false)
    expect(isFemale(null)).toBe(false)

    expect(isMale('male')).toBe(true)
    expect(isMale('Male')).toBe(true)
    expect(isMale('M')).toBe(true)
    expect(isMale('female')).toBe(false)
    expect(isMale(null)).toBe(false)
  })

  it('generates sex-appropriate spay/neuter labels', () => {
    const female = getSpayNeuterLabels('female', true)
    expect(female.sectionTitle).toBe('Spay Status')
    expect(female.surgeryTitle).toBe('Spay Surgery')
    expect(female.statusPill).toBe('✓ Spayed')

    const male = getSpayNeuterLabels('male', false)
    expect(male.sectionTitle).toBe('Neuter Status')
    expect(male.surgeryTitle).toBe('Neuter Surgery')
    expect(male.statusPill).toBe('Pending Neuter')
  })

  it('extracts spay/neuter info correctly', () => {
    expect(getSpayNeuterInfo(null)).toEqual({ isSpayedNeutered: false, spayNeuterDate: null })

    const data = {
      medical: {
        spayedOrNeutered: true,
        spayedOrNeuteredDate: '2026-10-06',
      },
    } as unknown as IPetMedicalPortalData
    expect(getSpayNeuterInfo(data)).toEqual({ isSpayedNeutered: true, spayNeuterDate: '2026-10-06' })
  })

  it('parses timestamps or returns null for non-date strings', () => {
    expect(parseTimelineTimestamp('2026-10-06')).toBeTypeOf('number')
    expect(parseTimelineTimestamp('10/06/2026')).toBeTypeOf('number')
    expect(parseTimelineTimestamp('Oct 6, 2026')).toBeTypeOf('number')
    expect(parseTimelineTimestamp('Active')).toBeNull()
    expect(parseTimelineTimestamp('Completed')).toBeNull()
    expect(parseTimelineTimestamp(null)).toBeNull()
  })

  it('builds care timeline with undated events at the top and dated events in reverse chronological order', () => {
    const data = {
      name: 'Jaylene',
      sex: 'female',
      medical: {
        spayedOrNeutered: true,
        spayedOrNeuteredDate: '2026-10-06',
        microchip: {
          microchipped: true,
          microchipID: '985113014797341',
          microchipCompany: 'HomeAgain',
        },
        diseaseTesting: {
          fivResult: 'Negative',
          felvResult: 'Negative',
        },
      },
    } as unknown as IPetMedicalPortalData

    const mockVaccines = [
      { name: 'Rabies', administered: 'Oct 6, 2026' },
      { name: 'FVRCP Round 1', administered: 'May 23, 2026' },
      { name: 'FVRCP Round 3', administered: 'Sep 6, 2026' },
    ]

    const timeline = buildCareTimeline(data, mockVaccines)

    expect(timeline[0].title).toBe('Microchip Implantation & Registration')
    expect(timeline[0].date).toBe('Active')

    expect(timeline[1].title).toContain('FIV Test')
    expect(timeline[1].date).toBe('Completed')

    expect(timeline[2].title).toContain('FeLV Test')
    expect(timeline[2].date).toBe('Completed')

    expect(timeline[3].title).toBe('Spay Surgery')
    expect(timeline[3].date).toBe('Oct 6, 2026')

    expect(timeline[4].title).toBe('Vaccination: Rabies')
    expect(timeline[4].date).toBe('Oct 6, 2026')

    expect(timeline[5].title).toBe('Vaccination: FVRCP Round 3')
    expect(timeline[5].date).toBe('Sep 6, 2026')

    expect(timeline[6].title).toBe('Vaccination: FVRCP Round 1')
    expect(timeline[6].date).toBe('May 23, 2026')
  })

  it('includes rescue intake event when intakeDate is recorded', () => {
    const data = {
      name: 'Jaylene',
      sex: 'female',
      intakeDate: '2026-05-01',
      medical: {
        intakeCondition: 'Healthy kitten',
        spayedOrNeutered: false,
      },
    } as unknown as IPetMedicalPortalData

    const timeline = buildCareTimeline(data, [])
    expect(timeline).toHaveLength(1)
    expect(timeline[0].type).toBe('intake')
    expect(timeline[0].title).toBe('Rescue Intake & Admission')
    expect(timeline[0].date).toBe('May 1, 2026')
    expect(timeline[0].note).toContain('Healthy kitten')
  })
})
