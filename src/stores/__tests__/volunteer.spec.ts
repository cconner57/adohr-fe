import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useVolunteerStore } from '../volunteer'

describe('useVolunteerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads public volunteer locations with Any Location option and excludes Unknown on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          locations: [
            { id: 'loc-1', name: 'Main Shelter', shortName: 'Main' },
            { id: 'loc-2', name: 'PetSmart - Upland', shortName: 'Upland' },
          ],
        }),
      }),
    )

    const store = useVolunteerStore()
    await store.fetchPublicLocations()

    expect(store.isLoadingLocations).toBe(false)
    expect(store.locationsLoadFailed).toBe(false)
    expect(store.apiError).toBeNull()
    expect(store.locationOptions).toEqual([
      { value: 'any', label: 'Any Location' },
      { value: 'loc-1', label: 'Main Shelter' },
      { value: 'loc-2', label: 'PetSmart - Upland' },
    ])
    expect(store.locationOptions.some((o) => o.value === 'unknown')).toBe(false)

    store.setPreferredLocation('loc-2')
    expect(store.formState.preferredLocationId).toBe('loc-2')
    expect(store.formState.preferredLocationName).toBe('PetSmart - Upland')

    store.setPreferredLocation('any')
    expect(store.formState.preferredLocationId).toBe('any')
    expect(store.formState.preferredLocationName).toBe('Any Location')
  })

  it('silently sets Unknown and disables overrides when public locations API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    const store = useVolunteerStore()
    await store.fetchPublicLocations()

    expect(store.isLoadingLocations).toBe(false)
    expect(store.locationsLoadFailed).toBe(true)
    expect(store.apiError).toBeNull()
    expect(store.locationOptions).toEqual([{ value: 'unknown', label: 'Unknown' }])
    expect(store.formState.preferredLocationId).toBe('unknown')
    expect(store.formState.preferredLocationName).toBe('Unknown')

    store.setPreferredLocation('loc-1')
    expect(store.formState.preferredLocationId).toBe('unknown')
  })

  it('requires preferredLocationId in validationErrors', () => {
    const store = useVolunteerStore()
    expect(store.validationErrors).toContain('Preferred Location')

    store.formState.preferredLocationId = 'any'
    expect(store.validationErrors).not.toContain('Preferred Location')
  })
})
