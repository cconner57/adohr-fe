import { describe, expect, it } from 'vitest'

import type { IPetMedicalPortalData } from '@/models/common'

import {
  buildCareTimeline,
  buildDiagnosticTests,
  buildDietInfo,
  buildIdentificationInfo,
  buildMedicationsList,
  buildPhysicalTraitCapsules,
  buildProceduresList,
  buildVaccineRecords,
  formatMicrochipId,
  getSpayNeuterInfo,
  getSpayNeuterLabels,
  parseTimelineTimestamp,
  parseVaccineRecord,
  toDateLabel,
} from './medicalParser'

describe('formatMicrochipId', () => {
  it('formats continuous 15-digit microchip numbers with spaces in groups of 3', () => {
    expect(formatMicrochipId('985113013923290')).toBe('985 113 013 923 290')
  })

  it('normalizes already spaced microchips', () => {
    expect(formatMicrochipId('985 113 013 923 290')).toBe('985 113 013 923 290')
  })

  it('handles empty or null values gracefully', () => {
    expect(formatMicrochipId(null)).toBe('')
    expect(formatMicrochipId('')).toBe('')
  })
})

describe('toDateLabel', () => {
  it('formats YYYY-MM-DD dates without timezone shifting', () => {
    expect(toDateLabel('2026-08-25')).toBe('Aug 25, 2026')
  })

  it('formats MM/DD/YYYY dates', () => {
    expect(toDateLabel('08/25/2026')).toBe('Aug 25, 2026')
  })

  it('returns Not provided for null, empty or hyphen values', () => {
    expect(toDateLabel(null)).toBe('Not provided')
    expect(toDateLabel('')).toBe('Not provided')
    expect(toDateLabel('-')).toBe('Not provided')
  })
})

describe('parseVaccineRecord', () => {
  it('parses string dates directly', () => {
    const res = parseVaccineRecord('Rabies', '2026-08-25')
    expect(res).toEqual({
      name: 'Rabies',
      administered: 'Aug 25, 2026',
    })
  })

  it('parses objects with dateAdministered', () => {
    const res = parseVaccineRecord('Rabies', {
      dateAdministered: '2026-08-25',
      expiresAt: '2027-08-24',
    })
    expect(res).toEqual({
      name: 'Rabies',
      administered: 'Aug 25, 2026',
      expires: 'Aug 24, 2027',
      veterinarian: null,
      status: null,
    })
  })

  it('parses objects with alternative keys like date and exp', () => {
    const res = parseVaccineRecord('Rabies', {
      date: '08/25/2026',
      exp: '08/24/2027',
      clinic: 'Pasadena Vet',
    })
    expect(res).toEqual({
      name: 'Rabies',
      administered: 'Aug 25, 2026',
      expires: 'Aug 24, 2027',
      veterinarian: 'Pasadena Vet',
      status: null,
    })
  })
})

describe('buildVaccineRecords', () => {
  it('handles rabies at medical root or vaccinations root', () => {
    const data = {
      name: 'Petal',
      medical: {
        vaccinations: {
          rabies: {
            date: '08/25/2026',
            expires: '08/24/2027',
          },
        },
      },
    } as unknown as IPetMedicalPortalData

    const records = buildVaccineRecords(data)
    expect(records).toHaveLength(1)
    expect(records[0].name).toBe('Rabies')
    expect(records[0].administered).toBe('Aug 25, 2026')
    expect(records[0].expires).toBe('Aug 24, 2027')
  })

  it('handles PascalCase keys and dynamic object keys', () => {
    const data = {
      name: 'Petal',
      medical: {
        vaccinations: {
          'Rabies Vaccine': {
            DateAdministered: '2026-08-25',
            ExpiresAt: '2027-08-24',
          },
        },
      },
    } as unknown as IPetMedicalPortalData

    const records = buildVaccineRecords(data)
    expect(records).toHaveLength(1)
    expect(records[0].name).toBe('Rabies')
    expect(records[0].administered).toBe('Aug 25, 2026')
  })

  it('handles array format in medical.vaccines or medical.vaccinations', () => {
    const data = {
      name: 'Petal',
      medical: {
        vaccinations: [
          {
            name: 'Rabies',
            dateAdministered: '2026-08-25',
            expiresAt: '2027-08-24',
          },
        ],
      },
    } as unknown as IPetMedicalPortalData

    const records = buildVaccineRecords(data)
    expect(records).toHaveLength(1)
    expect(records[0].name).toBe('Rabies')
  })

  it('falls back to Rabies certificate document if no explicit vaccine record exists', () => {
    const data = {
      name: 'Petal',
      medical: {
        vaccinations: {},
        documents: [
          {
            id: 'doc-1',
            title: 'Petal - SpayRabies Certificate',
            category: 'vaccination',
            uploadedAt: '2026-08-26',
          },
        ],
      },
    } as unknown as IPetMedicalPortalData

    const records = buildVaccineRecords(data)
    expect(records).toHaveLength(1)
    expect(records[0].name).toBe('Rabies')
    expect(records[0].administered).toBe('Aug 26, 2026')
  })
})

describe('buildIdentificationInfo', () => {
  it('extracts microchip ID, brand, and tag numbers', () => {
    const data = {
      medical: {
        microchip: {
          microchipped: true,
          microchipID: '985113013923290',
          microchipCompany: 'HomeAgain',
        },
        rabiesTagNumber: 'LA-2026-8941',
        licenseTagNumber: 'CITY-40192',
      },
    } as unknown as IPetMedicalPortalData

    const ident = buildIdentificationInfo(data)
    expect(ident.isChipped).toBe(true)
    expect(ident.microchipId).toBe('985 113 013 923 290')
    expect(ident.microchipBrand).toBe('HomeAgain')
    expect(ident.rabiesTagNumber).toBe('LA-2026-8941')
    expect(ident.licenseTagNumber).toBe('CITY-40192')
  })

  it('extracts secondary microchip if present', () => {
    const data = {
      medical: {
        microchip: {
          microchipped: true,
          microchipID: '985113013923290',
          microchipCompany: 'HomeAgain',
          secondaryMicrochipID: '985113013923291',
          secondaryMicrochipCompany: 'AKC Reunite',
        },
      },
    } as unknown as IPetMedicalPortalData

    const ident = buildIdentificationInfo(data)
    expect(ident.secondaryMicrochipId).toBe('985 113 013 923 291')
    expect(ident.secondaryMicrochipBrand).toBe('AKC Reunite')
  })
})

describe('buildDiagnosticTests', () => {
  it('parses FIV, FeLV, and Heartworm test results with dates', () => {
    const data = {
      medical: {
        diseaseTesting: {
          fivResult: 'Negative',
          fivTestDate: '2026-08-20',
          felvResult: 'Negative',
          felvTestDate: '2026-08-20',
          heartwormResult: 'Negative',
          heartwormTestDate: '2026-08-20',
        },
      },
    } as unknown as IPetMedicalPortalData

    const tests = buildDiagnosticTests(data)
    expect(tests).toHaveLength(3)
    expect(tests[0].name).toContain('FIV')
    expect(tests[0].result).toBe('Negative')
    expect(tests[0].date).toBe('Aug 20, 2026')
  })
})

describe('buildDietInfo', () => {
  it('parses feeding schedule, brand, formula, and prescription flags', () => {
    const data = {
      nutrition: {
        primaryFoodType: 'Dry Kibble & Wet',
        foodBrand: 'Purina Pro Plan',
        foodFormula: 'Kitten Chicken & Rice',
        portionSize: '1/2 cup',
        feedingFrequency: 'Twice daily',
        isPrescriptionDiet: false,
        foodAllergies: 'None',
        feedingNotes: 'Add warm water',
      },
    } as unknown as IPetMedicalPortalData

    const diet = buildDietInfo(data)
    expect(diet.hasInfo).toBe(true)
    expect(diet.primaryFoodType).toBe('Dry Kibble & Wet')
    expect(diet.foodBrand).toBe('Purina Pro Plan')
    expect(diet.foodFormula).toBe('Kitten Chicken & Rice')
    expect(diet.portionSize).toBe('1/2 cup')
  })
})

describe('buildPhysicalTraitCapsules', () => {
  it('extracts weight and distinguishing marks, omitting breed, color/pattern, and coat length', () => {
    const data = {
      physical: {
        primaryBreed: 'DSH',
        color: 'Grey',
        pattern: 'Tabby',
        coatLength: 'Short',
        distinguishingMarks: 'White spot on chest',
        weight: 2.4,
        weightUnit: 'lbs',
      },
    } as unknown as IPetMedicalPortalData

    const capsules = buildPhysicalTraitCapsules(data)
    expect(capsules).not.toContain('DSH')
    expect(capsules).not.toContain('GREY TABBY')
    expect(capsules).not.toContain('SHORT COAT')
    expect(capsules).toContain('WHITE SPOT ON CHEST')
    expect(capsules).toContain('2.4 LBS')
  })
})

describe('buildMedicationsList', () => {
  it('extracts medication array strings and objects', () => {
    const data = {
      medical: {
        currentMedications: ['Revolution Plus (Monthly)', 'Dewormer (Pyrantel)'],
      },
    } as unknown as IPetMedicalPortalData

    const meds = buildMedicationsList(data)
    expect(meds).toHaveLength(2)
    expect(meds[0]).toBe('Revolution Plus (Monthly)')
  })
})

describe('buildProceduresList', () => {
  it('extracts non-spay/neuter clinical procedures', () => {
    const data = {
      medical: {
        procedures: [
          {
            name: 'Dental Prophylaxis',
            date: '2026-08-20',
            veterinarian: 'Dr. Jenkins',
            notes: 'Grade 1 tartar cleaned.',
          },
        ],
      },
    } as unknown as IPetMedicalPortalData

    const procs = buildProceduresList(data)
    expect(procs).toHaveLength(1)
    expect(procs[0].name).toBe('Dental Prophylaxis')
    expect(procs[0].date).toBe('Aug 20, 2026')
    expect(procs[0].veterinarian).toBe('Dr. Jenkins')
  })
})

describe('getSpayNeuterInfo and buildCareTimeline', () => {
  it('extracts spay date and creates gender-specific Spay Surgery event for female', () => {
    const data = {
      name: 'Petal',
      sex: 'female',
      medical: {
        spayedOrNeutered: true,
        spayedOrNeuteredDate: '2026-08-25',
      },
    } as unknown as IPetMedicalPortalData

    const info = getSpayNeuterInfo(data)
    expect(info.isSpayedNeutered).toBe(true)
    expect(info.spayNeuterDate).toBe('2026-08-25')

    const timeline = buildCareTimeline(data, [])
    expect(timeline).toHaveLength(1)
    expect(timeline[0].title).toBe('Spay Surgery')
    expect(timeline[0].date).toBe('Aug 25, 2026')
  })

  it('creates Neuter Surgery event for male', () => {
    const data = {
      name: 'Onyx',
      sex: 'male',
      medical: {
        spayedOrNeutered: true,
        spayedOrNeuteredDate: '2025-08-14',
      },
    } as unknown as IPetMedicalPortalData

    const timeline = buildCareTimeline(data, [])
    expect(timeline).toHaveLength(1)
    expect(timeline[0].title).toBe('Neuter Surgery')
    expect(timeline[0].date).toBe('Aug 14, 2025')
  })

  it('returns gender-specific labels from getSpayNeuterLabels', () => {
    const femaleLabels = getSpayNeuterLabels('female', true)
    expect(femaleLabels.sectionTitle).toBe('Spay Status')
    expect(femaleLabels.statusPill).toBe('✓ Spayed')

    const maleLabels = getSpayNeuterLabels('male', false)
    expect(maleLabels.sectionTitle).toBe('Neuter Status')
    expect(maleLabels.statusPill).toBe('Pending Neuter')
  })

  it('sorts undated items (microchip, FIV/FeLV tests) to top and orders dated items in reverse chronological order', () => {
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
      { name: 'Rabies', administered: 'Oct 6, 2026', expires: 'Oct 6, 2027' },
      { name: 'FVRCP Round 1', administered: 'May 23, 2026' },
      { name: 'FVRCP Round 2', administered: 'Jun 13, 2026' },
      { name: 'FVRCP Round 3', administered: 'Sep 6, 2026' },
    ]

    const timeline = buildCareTimeline(data, mockVaccines)

    // Expected order:
    // 1. Microchip (Active - undated at top)
    // 2. FIV Test (Completed - undated at top)
    // 3. FeLV Test (Completed - undated at top)
    // 4. Spay Surgery (Oct 6, 2026)
    // 5. Vaccination: Rabies (Oct 6, 2026)
    // 6. Vaccination: FVRCP Round 3 (Sep 6, 2026)
    // 7. Vaccination: FVRCP Round 2 (Jun 13, 2026)
    // 8. Vaccination: FVRCP Round 1 (May 23, 2026)
    expect(timeline).toHaveLength(8)
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

    expect(timeline[6].title).toBe('Vaccination: FVRCP Round 2')
    expect(timeline[6].date).toBe('Jun 13, 2026')

    expect(timeline[7].title).toBe('Vaccination: FVRCP Round 1')
    expect(timeline[7].date).toBe('May 23, 2026')
  })
})

describe('parseTimelineTimestamp', () => {
  it('parses valid date strings into numeric timestamps', () => {
    expect(parseTimelineTimestamp('Oct 6, 2026')).toBeTypeOf('number')
    expect(parseTimelineTimestamp('2026-05-23')).toBeTypeOf('number')
    expect(parseTimelineTimestamp('10/06/2026')).toBeTypeOf('number')
  })

  it('returns null for undated status indicators or invalid values', () => {
    expect(parseTimelineTimestamp('Active')).toBeNull()
    expect(parseTimelineTimestamp('Completed')).toBeNull()
    expect(parseTimelineTimestamp('Administered')).toBeNull()
    expect(parseTimelineTimestamp('Not provided')).toBeNull()
    expect(parseTimelineTimestamp('Pending')).toBeNull()
    expect(parseTimelineTimestamp('')).toBeNull()
    expect(parseTimelineTimestamp(null)).toBeNull()
    expect(parseTimelineTimestamp(undefined)).toBeNull()
  })
})
