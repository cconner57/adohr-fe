import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import { MOCK_HAPPY_TAILS } from '@/constants/mockHappyTails'
import type { IHappyTail } from '@/models/happy-tails'
import { PUBLIC_ORG_ID, withPublicOrgId } from '@/utils/api'

interface IRawHappyTail {
  id: string | number
  petName: string
  species?: string
  adopterName?: string
  adoptersName?: string
  story?: string
  testimonial?: string
  photoUrl?: string
  beforePhotoUrl?: string
  adoptionDate?: string
  adoptedDate?: string
}

interface IHappyTailPayload {
  data?: {
    happyTails?: IRawHappyTail[]
    stories?: IRawHappyTail[]
  }
  happyTails?: IRawHappyTail[]
  stories?: IRawHappyTail[]
}

export const useHappyTailsStore = defineStore('happyTails', () => {
  const items = ref<IHappyTail[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sortedItems = computed(() => {
    return [...items.value].sort((a, b) => {
      return new Date(b.adoptedDate).getTime() - new Date(a.adoptedDate).getTime()
    })
  })

  const fetchHappyTails = async () => {
    isLoading.value = true
    error.value = null

    try {
      const url = withPublicOrgId(API_ENDPOINTS.HAPPY_TAILS_PUBLIC, PUBLIC_ORG_ID)
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'X-Org-Id': PUBLIC_ORG_ID,
        },
      })

      if (response.ok) {
        const payload: IHappyTailPayload = await response.json()
        const rawTails =
          payload.data?.happyTails ||
          payload.data?.stories ||
          payload.happyTails ||
          payload.stories ||
          []

        if (rawTails.length > 0) {
          items.value = rawTails.map((t) => ({
            id: String(t.id),
            petName: t.petName,
            species: t.species === 'cat' ? 'cat' : 'dog',
            adoptersName: t.adoptersName || t.adopterName || 'Loving Family',
            adoptedDate: t.adoptedDate || t.adoptionDate || new Date().toISOString().slice(0, 10),
            photoUrl: t.photoUrl || '',
            testimonial: t.testimonial || t.story || '',
            beforePhotoUrl: t.beforePhotoUrl || undefined,
          }))
          return
        }
      }

      // Fallback to mock data if API returned empty list or error
      items.value = MOCK_HAPPY_TAILS
    } catch {
      // Fallback gracefully to mock data for resilience
      items.value = MOCK_HAPPY_TAILS
    } finally {
      isLoading.value = false
    }
  }

  const submitHappyTail = async (submission: {
    petName: string
    species: 'cat' | 'dog'
    adopterName: string
    adopterEmail?: string
    story: string
    photoUrl?: string
    adoptionYear?: string
  }) => {
    const response = await fetch(API_ENDPOINTS.HAPPY_TAILS_SUBMIT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Org-Id': PUBLIC_ORG_ID,
      },
      body: JSON.stringify({
        orgId: PUBLIC_ORG_ID,
        petName: submission.petName,
        species: submission.species,
        adopterName: submission.adopterName,
        adopterEmail: submission.adopterEmail,
        story: submission.story,
        photoUrl: submission.photoUrl,
        adoptionYear: submission.adoptionYear,
      }),
    })

    if (!response.ok) {
      const errPayload = (await response.json().catch(() => null)) as {
        userMessage?: string
        error?: { message?: string }
      } | null
      throw new Error(
        errPayload?.userMessage || errPayload?.error?.message || 'Failed to submit happy tail',
      )
    }

    return true
  }

  return {
    items,
    isLoading,
    error,
    sortedItems,
    fetchHappyTails,
    submitHappyTail,
  }
})
