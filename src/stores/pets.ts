import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

import { API_ENDPOINTS } from '../constants/api'
import type { IPet } from '../models/common'

export const usePetStore = defineStore('pets', () => {
  const currentPets = ref<IPet[]>([])
  const adminPets = ref<IPet[]>([])
  const lastFetched = ref<number>(0)
  const lastAdminFetched = ref<number>(0)
  const lastAdminParams = ref<string>('')
  const isFetching = ref(false)

  const selectedPet = ref<{
    id?: string
    name?: string
    petName?: string
    species: 'cat' | 'dog'
  } | null>(null)

  const STORAGE_KEY = 'adoption_pet'
  const CACHE_DURATION = 5 * 60 * 1000

  const adoptedPets = ref<IPet[]>([])

  const adoptedCounts = ref<Record<number, number>>({})
  const countsLoaded = ref(false)

  const error = ref<string | null>(null)

  const parsePetPayload = (json: unknown): IPet[] => {
    if (!json || typeof json !== 'object') return []

    const payload = (json as { data?: unknown }).data ?? json
    if (Array.isArray(payload)) return payload as IPet[]

    if (
      payload &&
      typeof payload === 'object' &&
      Array.isArray((payload as { data?: unknown }).data)
    ) {
      return (payload as { data: IPet[] }).data
    }

    return []
  }

  const fetchListByStatus = async (status: string) => {
    const params = new URLSearchParams({
      status,
      sort: 'age',
      limit: '10000',
      orgId: 'idohr',
    })

    const response = await fetch(`${API_ENDPOINTS.PETS_LIST}?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch pets with status: ${status}`)
    }

    const json = await response.json()
    const firstPagePets = parsePetPayload(json)

    const pageSize = 25
    if (firstPagePets.length < pageSize) {
      return firstPagePets
    }

    const allPets = [...firstPagePets]
    let page = 2

    while (page <= 200) {
      const pageParams = new URLSearchParams({
        status,
        sort: 'age',
        page: String(page),
        page_size: String(pageSize),
        orgId: 'idohr',
      })

      const pageResponse = await fetch(`${API_ENDPOINTS.PETS_LIST}?${pageParams.toString()}`)
      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch pets with status: ${status} (page ${page})`)
      }

      const pageJson = await pageResponse.json()
      const pagePets = parsePetPayload(pageJson)

      if (pagePets.length === 0) {
        break
      }

      allPets.push(...pagePets)

      if (pagePets.length < pageSize) {
        break
      }

      page += 1
    }

    return allPets
  }

  const mergeIntoCurrentPets = (pets: IPet[]) => {
    const dedupedPets = new Map<string, IPet>()
    const allPets = [...currentPets.value, ...pets]
    allPets.forEach((pet: IPet) => {
      dedupedPets.set(pet.id, pet)
    })
    currentPets.value = Array.from(dedupedPets.values())
  }

  const fetchPetsList = async (forceRefresh = false) => {
    const isFresh = Date.now() - lastFetched.value < CACHE_DURATION
    if (currentPets.value.length > 0 && isFresh && !forceRefresh) {
      return
    }

    isFetching.value = true
    error.value = null
    try {
      const [availablePets, intakePets] = await Promise.all([
        fetchListByStatus('available'),
        fetchListByStatus('intake'),
      ])

      mergeIntoCurrentPets([...availablePets, ...intakePets])
      lastFetched.value = Date.now()
    } catch (err: unknown) {
      console.error('Error fetching pets:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch pets'
    } finally {
      isFetching.value = false
    }
  }

  const fetchPetDetail = async (idOrSlug: string) => {
    const normalizedParam = idOrSlug.trim().toLowerCase()
    const cachedPet = currentPets.value.find((p: IPet) => {
      const id = p.id.trim().toLowerCase()
      const slug = p.slug?.trim().toLowerCase() ?? ''
      return id === normalizedParam || slug === normalizedParam
    })

    if (cachedPet) return cachedPet

    await fetchPetsList(true)
    const refreshedPet = currentPets.value.find((p: IPet) => {
      const id = p.id.trim().toLowerCase()
      const slug = p.slug?.trim().toLowerCase() ?? ''
      return id === normalizedParam || slug === normalizedParam
    })

    if (refreshedPet) return refreshedPet

    try {
      const response = await fetch(`${API_ENDPOINTS.PET_DETAILS(idOrSlug)}?orgId=idohr`)
      if (!response.ok) return null

      const json = await response.json()
      const payload = (json as { data?: unknown }).data ?? json
      if (!payload || typeof payload !== 'object') return null

      const fetchedPet = payload as IPet
      mergeIntoCurrentPets([fetchedPet])
      return fetchedPet
    } catch (err) {
      console.warn('Pet detail endpoint unavailable, using cached list fallback', err)
      return null
    }
  }

  const fetchPets = async (forceRefresh = false) => {
    await fetchPetsList(forceRefresh)
  }

  const fetchAdminPets = async (params: URLSearchParams, forceRefresh = false) => {
    const paramsString = params.toString()
    const isFresh = Date.now() - lastAdminFetched.value < CACHE_DURATION
    const isSameParams = lastAdminParams.value === paramsString

    if (adminPets.value.length > 0 && isFresh && isSameParams && !forceRefresh) {
      console.log('Using cached admin pets')
      return
    }

    isFetching.value = true
    try {
      const queryString = paramsString ? `${paramsString}&orgId=idohr` : 'orgId=idohr'
      const response = await fetch(`${API_ENDPOINTS.PETS}?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch admin pets')
      const json = await response.json()
      const payload = json.data ?? json
      adminPets.value = Array.isArray(payload) ? payload : payload.data || []
      lastAdminFetched.value = Date.now()
      lastAdminParams.value = paramsString
    } catch (err) {
      console.error('Error fetching admin pets:', err)
      throw err
    } finally {
      isFetching.value = false
    }
  }

  const fetchAdoptedPets = async () => {
    isFetching.value = true
    try {
      // Fetch specifically adopted pets, reasonable limit (e.g. 1000 to cover full year)
      const response = await fetch(`${API_ENDPOINTS.PETS}?status=adopted&limit=1000&orgId=idohr`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch adopted pets')
      const json = await response.json()
      const payload = json.data ?? json
      adoptedPets.value = Array.isArray(payload) ? payload : payload.data || []
    } catch (err) {
      console.error('Error fetching adopted pets:', err)
      throw err
    } finally {
      isFetching.value = false
    }
  }

  const fetchAdoptedCounts = async () => {
    if (countsLoaded.value) return

    const currentYear = new Date().getFullYear()
    const previousYear = currentYear - 1

    const fetchCount = async (year: number): Promise<number> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.ADOPTED_PETS_COUNT}?year=${year}&orgId=idohr`)
        const json = await response.json()

        if (json.data && typeof json.data.count === 'number') {
          return json.data.count as number
        }

        return (json.count as number) || 0
      } catch (err) {
        console.error(`Error fetching count for ${year}:`, err)
        return 0
      }
    }

    const [current, previous] = await Promise.all([
      fetchCount(currentYear),
      fetchCount(previousYear),
    ])

    adoptedCounts.value = { [currentYear]: current, [previousYear]: previous }
    countsLoaded.value = true
  }

  const updatePet = async (pet: IPet) => {
    // Optimistic update
    const updateInList = (list: Ref<IPet[]>) => {
      const idx = list.value.findIndex((p: IPet) => p.id === pet.id)
      if (idx !== -1) {
        list.value[idx] = { ...pet }
      }
    }

    updateInList(currentPets)
    updateInList(adminPets)
    updateInList(adoptedPets)

    // Sanitize payload: Remove read-only fields that the backend does not expect
    // Note: structuredClone fails with Vue proxy objects, so we use JSON.parse/stringify
    const payload: Partial<IPet> = JSON.parse(JSON.stringify(pet))
    delete payload.id
    delete payload.createdAt
    delete payload.updatedAt

    try {
      const response = await fetch(`${API_ENDPOINTS.PETS}/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to update pet')

      // Update successful, maybe fetch fresh data or just leave optimistic?
      // Leaving optimistic is fine.
    } catch (err) {
      console.error('Error updating pet:', err)
      // Revert or fetch?
      await fetchPets(true) // Revert by fetching fresh
      throw err
    }
  }

  const initFromSession = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        selectedPet.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse selected pet from session storage', e)
        sessionStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  const selectPet = (pet: {
    id?: string
    name?: string
    petName?: string
    species: 'cat' | 'dog'
  }) => {
    selectedPet.value = pet
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPet.value))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPet.value))
  }

  const clearSelectedPet = () => {
    selectedPet.value = null
    sessionStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY)
  }

  initFromSession()

  return {
    currentPets,
    adminPets,
    adoptedPets,
    adoptedCounts,
    countsLoaded,
    selectedPet,
    isFetching,

    fetchPets,
    fetchPetsList,
    fetchPetDetail,
    fetchAdminPets,
    fetchAdoptedPets,
    fetchAdoptedCounts,
    updatePet,
    selectPet,
    clearSelectedPet,
    initFromSession,
    error,
  }
})
