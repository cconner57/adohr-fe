import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { IPet } from '@/models/common'
import { usePetStore } from '@/stores/pets'

import { usePets } from '../usePets'

const makePet = (id: string, spotlight: boolean): IPet =>
  ({
    id,
    slug: id,
    name: `Pet ${id}`,
    species: 'Cat',
    sex: 'Female',
    photos: [{ url: 'pets/cat.jpg', isPrimary: true }],
    physical: {},
    sponsored: { isSponsored: false },
    details: { status: 'available' },
    profileSettings: { isSpotlightFeatured: spotlight },
  }) as unknown as IPet

describe('usePets composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
  })

  it('returns empty array and clears cached spotlight pets when zero pets are featured after fetch', () => {
    sessionStorage.setItem('adohr_spotlight_pets', JSON.stringify([makePet('cached-1', true)]))
    const store = usePetStore()
    store.currentPets = [makePet('avail-1', false), makePet('avail-2', false)]
    store.lastFetched = Date.now()

    const { spotlightPets } = usePets()

    expect(spotlightPets.value).toEqual([])
    expect(sessionStorage.getItem('adohr_spotlight_pets')).toBeNull()
  })

  it('preserves all featured spotlight pets beyond 4 for random desktop sampling', () => {
    const store = usePetStore()
    store.currentPets = [
      makePet('s1', true),
      makePet('s2', true),
      makePet('s3', true),
      makePet('s4', true),
      makePet('s5', true),
      makePet('s6', true),
      makePet('other', false),
    ]
    store.lastFetched = Date.now()

    const { spotlightPets } = usePets()

    expect(spotlightPets.value).toHaveLength(6)
    expect(spotlightPets.value.map((p) => p.id)).toEqual(['s1', 's2', 's3', 's4', 's5', 's6'])
  })
})
