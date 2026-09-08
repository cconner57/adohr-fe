import { describe, expect, it } from 'vitest'

import { extractPetsFromApiResponse, getPetSpecialNeeds, normalizePet, normalizePetPhotos } from '../petNormalizer'

describe('petNormalizer', () => {
  it('normalizes flat photo string arrays and fallback single photo fields', () => {
    const photos1 = normalizePetPhotos(['https://r2.dev/pet1.jpg', 'https://r2.dev/pet2.jpg'])
    expect(photos1).toHaveLength(2)
    expect(photos1[0].isPrimary).toBe(true)
    expect(photos1[0].url).toBe('https://r2.dev/pet1.jpg')
    expect(photos1[1].isPrimary).toBe(false)

    const photos2 = normalizePetPhotos([], ['https://r2.dev/fallback.jpg'])
    expect(photos2).toHaveLength(1)
    expect(photos2[0].isPrimary).toBe(true)
    expect(photos2[0].url).toBe('https://r2.dev/fallback.jpg')
  })

  it('normalizes a flat API pet into a structured IPet model', () => {
    const raw = {
      id: 'pet-123',
      name: 'Luna',
      species: 'Cat',
      sex: 'Female',
      status: 'available',
      primaryBreed: 'Domestic Short Hair',
      ageGroup: 'Baby',
      size: 'Medium',
      weight: 2.4,
      photoUrl: 'https://r2.dev/luna.jpg',
      isGoodWithKids: true,
      isGoodWithDogs: false,
      isGoodWithCats: true,
      specialNeeds: null,
      funDescription: 'Very friendly and cuddly kitten',
    }

    const pet = normalizePet(raw)
    expect(pet.id).toBe('pet-123')
    expect(pet.name).toBe('Luna')
    expect(pet.species).toBe('cat')
    expect(pet.sex).toBe('female')
    expect(pet.details?.status).toBe('available')
    expect(pet.physical?.breed).toBe('Domestic Short Hair')
    expect(pet.physical?.ageGroup).toBe('baby')
    expect(pet.physical?.size).toBe('medium')
    expect(pet.physical?.currentWeight).toBe(2.4)
    expect(pet.behavior?.isGoodWithKids).toBe(true)
    expect(pet.behavior?.isGoodWithDogs).toBe(false)
    expect(pet.behavior?.isGoodWithCats).toBe(true)
    expect(pet.descriptions?.fun).toBe('Very friendly and cuddly kitten')
    expect(pet.photos).toHaveLength(1)
    expect(pet.photos[0].url).toBe('https://r2.dev/luna.jpg')
  })

  it('extracts pets from { pets: [...] } response shape', () => {
    const json = {
      success: true,
      pets: [
        { id: '1', name: 'Milo', species: 'dog' },
        { id: '2', name: 'Otis', species: 'cat' },
      ],
    }

    const list = extractPetsFromApiResponse(json)
    expect(list).toHaveLength(2)
    expect(list[0].name).toBe('Milo')
    expect(list[1].name).toBe('Otis')
  })

  it('extracts pets from { data: { pets: [...] } } response shape', () => {
    const json = {
      success: true,
      data: {
        pets: [
          { id: '3', name: 'Bella', species: 'cat' },
        ],
      },
    }

    const list = extractPetsFromApiResponse(json)
    expect(list).toHaveLength(1)
    expect(list[0].name).toBe('Bella')
  })

  it('extracts pets from { data: [...] } and bare array response shapes', () => {
    const json = {
      data: [
        { id: '4', name: 'Simba', species: 'cat' },
      ],
    }

    const list1 = extractPetsFromApiResponse(json)
    expect(list1).toHaveLength(1)
    expect(list1[0].name).toBe('Simba')

    const list2 = extractPetsFromApiResponse([{ id: '5', name: 'Nala', species: 'cat' }])
    expect(list2).toHaveLength(1)
    expect(list2[0].name).toBe('Nala')
  })

  it('normalizes medical information including specialNeeds array, viral status, and medications', () => {
    const raw = {
      id: 'pet-med-1',
      name: 'Chester',
      species: 'cat',
      medical: {
        currentMedications: ['Eye drops daily'],
        felvPositive: false,
        fivPositive: true,
        healthConcerns: ['Dental disease'],
        intakeCondition: 'good',
        microchip: { microchipped: true },
        spayedOrNeutered: true,
        specialNeeds: ['blind (both eyes)'],
        vaccinationsUpToDate: true,
      },
    }

    const pet = normalizePet(raw)
    expect(pet.medical.specialNeeds).toEqual(['blind (both eyes)'])
    expect(pet.medical.fivPositive).toBe(true)
    expect(pet.medical.felvPositive).toBe(false)
    expect(pet.medical.healthConcerns).toEqual(['Dental disease'])
    expect(pet.medical.currentMedications).toEqual(['Eye drops daily'])
    expect(pet.medical.intakeCondition).toBe('good')
    expect(pet.medical.spayedOrNeutered).toBe(true)
    expect(pet.medical.vaccinationsUpToDate).toBe(true)
    expect(pet.medical.microchip.microchipped).toBe(true)

    const specialInfo = getPetSpecialNeeds(pet)
    expect(specialInfo.isSpecialNeeds).toBe(true)
    expect(specialInfo.specialNeedsList).toContain('Blind (both eyes)')
    expect(specialInfo.specialNeedsList).toContain('FIV Positive')
    expect(specialInfo.specialNeedsList).toContain('Dental disease')
    expect(specialInfo.specialNeedsText).toContain('Blind (both eyes)')
  })
})
