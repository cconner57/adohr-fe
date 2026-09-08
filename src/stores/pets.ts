import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

import { API_ENDPOINTS } from '../constants/api'
import type { IPet } from '../models/common'
import { PUBLIC_ORG_ID } from '../utils/api'
import { extractPetsFromApiResponse } from '../utils/petNormalizer'

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

  const fetchListByStatus = async (status: string) => {
    const params = new URLSearchParams({
      status,
      sort: 'name',
      limit: '10000',
      orgId: PUBLIC_ORG_ID,
    })

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Org-Id': PUBLIC_ORG_ID,
    }

    let response = await fetch(`${API_ENDPOINTS.PETS_LIST}?${params.toString()}`, { headers })
    // Only check /pets/available alias for 'available' status
    if (!response.ok && status === 'available') {
      const altUrl = `${API_ENDPOINTS.PETS_LIST}/available?orgId=${PUBLIC_ORG_ID}`
      const altResp = await fetch(altUrl, { headers }).catch(() => null)
      if (altResp && altResp.ok) {
        response = altResp
      }
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch pets with status: ${status}`)
    }

    const json = await response.json()
    let firstPagePets = extractPetsFromApiResponse(json)

    if (firstPagePets.length === 0 && status === 'available') {
      const altUrl = `${API_ENDPOINTS.PETS_LIST}/available?orgId=${PUBLIC_ORG_ID}`
      try {
        const altResp = await fetch(altUrl, { headers })
        if (altResp.ok) {
          const altJson = await altResp.json()
          const altPets = extractPetsFromApiResponse(altJson)
          if (altPets.length > 0) {
            firstPagePets = altPets
          }
        }
      } catch {
        // Fallback silently
      }
    }

    const pageSize = 25
    if (firstPagePets.length < pageSize) {
      return firstPagePets
    }

    const allPets = [...firstPagePets]
    let page = 2

    while (page <= 200) {
      const pageParams = new URLSearchParams({
        status,
        sort: 'name',
        page: String(page),
        page_size: String(pageSize),
        orgId: PUBLIC_ORG_ID,
      })

      const pageResponse = await fetch(`${API_ENDPOINTS.PETS_LIST}?${pageParams.toString()}`, { headers })
      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch pets with status: ${status} (page ${page})`)
      }

      const pageJson = await pageResponse.json()
      const pagePets = extractPetsFromApiResponse(pageJson)

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
      if (pet.id) {
        dedupedPets.set(pet.id, pet)
      }
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
      const availablePets = await fetchListByStatus('available').catch((err) => {
        console.warn('Could not fetch available pets:', err)
        return []
      })

      mergeIntoCurrentPets(availablePets)
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
      const headers = { Accept: 'application/json', 'X-Org-Id': PUBLIC_ORG_ID }
      let response = await fetch(`${API_ENDPOINTS.PET_DETAILS(idOrSlug)}?orgId=${PUBLIC_ORG_ID}`, { headers })
      if (!response.ok) {
        response = await fetch(`${API_ENDPOINTS.PETS}/${idOrSlug}?orgId=${PUBLIC_ORG_ID}`, { headers })
      }
      if (!response.ok) return null

      const json = await response.json()
      const pets = extractPetsFromApiResponse(json)
      if (pets.length > 0) {
        mergeIntoCurrentPets([pets[0]])
        return pets[0]
      }
      return null
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
      const queryString = paramsString
        ? `${paramsString}&orgId=${PUBLIC_ORG_ID}`
        : `orgId=${PUBLIC_ORG_ID}`
      const response = await fetch(`${API_ENDPOINTS.PETS}?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch admin pets')
      const json = await response.json()
      adminPets.value = extractPetsFromApiResponse(json)
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
      const response = await fetch(
        `${API_ENDPOINTS.PETS}?status=adopted&limit=1000&orgId=${PUBLIC_ORG_ID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      if (!response.ok) throw new Error('Failed to fetch adopted pets')
      const json = await response.json()
      adoptedPets.value = extractPetsFromApiResponse(json)
    } catch (err) {
      console.error('Error fetching adopted pets:', err)
      throw err
    } finally {
      isFetching.value = false
    }
  }

  const fetchMedicalLookupPets = async () => {
    isFetching.value = true
    try {
      const [adoptedList, fosterList] = await Promise.all([
        fetchListByStatus('adopted').catch(() => []),
        fetchListByStatus('foster').catch(() => []),
      ])
      mergeIntoCurrentPets([...adoptedList, ...fosterList])
    } catch (err) {
      console.warn('Could not fetch adopted/foster list for medical lookup', err)
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
        const response = await fetch(
          `${API_ENDPOINTS.ADOPTED_PETS_COUNT}?year=${year}&orgId=${PUBLIC_ORG_ID}`,
        )
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
    const updateInList = (list: Ref<IPet[]>) => {
      const idx = list.value.findIndex((p: IPet) => p.id === pet.id)
      if (idx !== -1) {
        list.value[idx] = { ...pet }
      }
    }

    updateInList(currentPets)
    updateInList(adminPets)
    updateInList(adoptedPets)

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
    } catch (err) {
      console.error('Error updating pet:', err)
      await fetchPets(true)
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
    fetchMedicalLookupPets,
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
