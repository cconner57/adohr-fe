import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import type { IHappyTail, IHappyTailSubmission } from '@/models/happy-tails'
import { PUBLIC_ORG_ID } from '@/utils/api'

interface IRawHappyTail {
  id: string | number
  orgId?: string
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
  adoptionYear?: string
  status?: 'pending' | 'published' | 'approved' | 'rejected'
  isFeatured?: boolean
  publishedAt?: string
}

interface IHappyTailPayload {
  data?: {
    happyTails?: IRawHappyTail[]
    stories?: IRawHappyTail[]
  }
  happyTails?: IRawHappyTail[]
  stories?: IRawHappyTail[]
}

interface ISubmitResponse {
  status?: string
  message?: string
  happyTail?: IRawHappyTail
  error?: {
    code?: string
    message?: string
    field?: string
  } | string
  userMessage?: string
}

const DEFAULT_R2_PUBLIC_URL = 'https://pub-768b3a497dc648f2895152092bf57934.r2.dev'

export const normalizeHappyTailPhotoUrl = (
  u?: string | null,
  baseUrl: string = (import.meta.env.VITE_R2_PUBLIC_URL as string) || DEFAULT_R2_PUBLIC_URL,
): string => {
  if (!u) return ''
  const trimmed = u.trim()
  if (!trimmed) return ''

  const cleanBase = baseUrl.replace(/\/+$/, '')

  // If already pointing to the configured public R2 storage URL
  if (cleanBase && trimmed.startsWith(cleanBase)) {
    return trimmed
  }

  // If the path contains /happy-tails/ (e.g. from https://api.adoption-os.com/happy-tails/1790139065-photo.jpeg)
  if (trimmed.includes('/happy-tails/')) {
    const idx = trimmed.indexOf('/happy-tails/')
    const relativePath = trimmed.substring(idx + 1)
    return `${cleanBase}/${relativePath}`
  }

  // If relative path starting with happy-tails/
  if (trimmed.startsWith('happy-tails/')) {
    return `${cleanBase}/${trimmed}`
  }

  return trimmed
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

  const totalStories = computed(() => items.value.length)

  const fetchHappyTails = async () => {
    isLoading.value = true
    error.value = null

    try {
      const url = new URL(API_ENDPOINTS.HAPPY_TAILS_PUBLIC)
      url.searchParams.set('org_id', PUBLIC_ORG_ID)
      url.searchParams.set('orgId', PUBLIC_ORG_ID)

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          'X-Org-Id': PUBLIC_ORG_ID,
        },
      })

      if (response.ok) {
        const payload: IHappyTailPayload = await response.json()
        const rawTails =
          payload.happyTails ||
          payload.stories ||
          payload.data?.happyTails ||
          payload.data?.stories ||
          []

        if (rawTails.length > 0) {
          items.value = rawTails.map((t) => {
            const adopter = t.adopterName || t.adoptersName || 'Loving Family'
            const storyText = t.story || t.testimonial || ''
            const dateStr =
              t.adoptionDate || t.adoptedDate || t.adoptionYear || new Date().toISOString().slice(0, 10)

            let speciesNormalized: 'cat' | 'dog' | 'other' = 'cat'
            if (t.species === 'dog') {
              speciesNormalized = 'dog'
            } else if (t.species === 'other') {
              speciesNormalized = 'other'
            }

            return {
              id: String(t.id),
              orgId: t.orgId,
              petName: t.petName,
              species: speciesNormalized,
              adopterName: adopter,
              adoptersName: adopter,
              story: storyText,
              testimonial: storyText,
              photoUrl: normalizeHappyTailPhotoUrl(t.photoUrl),
              beforePhotoUrl: normalizeHappyTailPhotoUrl(t.beforePhotoUrl) || undefined,
              adoptionDate: dateStr,
              adoptedDate: dateStr,
              status: t.status,
              isFeatured: t.isFeatured,
              publishedAt: t.publishedAt,
            }
          })
          return
        }
      }

      // Empty list from API or no published stories yet
      items.value = []
    } catch (err) {
      items.value = []
      error.value = err instanceof Error ? err.message : 'Failed to load happy tails'
    } finally {
      isLoading.value = false
    }
  }

  const submitHappyTail = async (submission: IHappyTailSubmission) => {
    const url = new URL(API_ENDPOINTS.HAPPY_TAILS_SUBMIT)
    url.searchParams.set('org_id', PUBLIC_ORG_ID)

    let response: Response

    if (submission.photoFile) {
      // Option A: multipart/form-data for file uploads
      const formData = new FormData()
      formData.append('petName', submission.petName.trim())
      formData.append('species', submission.species.trim())
      formData.append('adopterName', submission.adopterName.trim())
      if (submission.adopterEmail?.trim()) {
        formData.append('adopterEmail', submission.adopterEmail.trim())
      }
      if (submission.adoptionYear?.trim()) {
        formData.append('adoptionYear', submission.adoptionYear.trim())
      }
      formData.append('story', submission.story.trim())
      formData.append('photo', submission.photoFile)

      response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'X-Org-Id': PUBLIC_ORG_ID,
          Accept: 'application/json',
        },
        body: formData,
      })
    } else {
      // Option B: application/json when no local file is attached
      const bodyPayload: Record<string, unknown> = {
        petName: submission.petName.trim(),
        species: submission.species.trim(),
        adopterName: submission.adopterName.trim(),
        story: submission.story.trim(),
      }
      if (submission.adopterEmail?.trim()) {
        bodyPayload.adopterEmail = submission.adopterEmail.trim()
      }
      if (submission.adoptionYear?.trim()) {
        bodyPayload.adoptionYear = submission.adoptionYear.trim()
      }
      if (submission.photoUrl?.trim()) {
        bodyPayload.photoUrl = submission.photoUrl.trim()
      }

      response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': PUBLIC_ORG_ID,
          Accept: 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      })
    }

    if (!response.ok) {
      const errPayload = (await response.json().catch(() => null)) as ISubmitResponse | null
      let errMsg = 'Failed to submit happy tail'
      if (errPayload) {
        if (typeof errPayload.error === 'string') {
          errMsg = errPayload.error
        } else if (errPayload.error?.message) {
          errMsg = errPayload.error.message
        } else if (errPayload.message) {
          errMsg = errPayload.message
        } else if (errPayload.userMessage) {
          errMsg = errPayload.userMessage
        }
      }
      throw new Error(errMsg)
    }

    const result = (await response.json().catch(() => null)) as ISubmitResponse | null
    return result || { status: 'success' }
  }

  return {
    items,
    isLoading,
    error,
    sortedItems,
    totalStories,
    fetchHappyTails,
    submitHappyTail,
  }
})
