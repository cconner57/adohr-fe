import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PUBLIC_ORG_ID } from '@/utils/api'

import { normalizeHappyTailPhotoUrl, useHappyTailsStore } from '../happyTails'

describe('useHappyTailsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes with empty items and non-loading state', () => {
    const store = useHappyTailsStore()
    expect(store.items).toEqual([])
    expect(store.totalStories).toBe(0)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetches happy tails and populates items with normalized fields', async () => {
    const mockTails = [
      {
        id: 14,
        orgId: PUBLIC_ORG_ID,
        petName: 'Adrian',
        species: 'cat',
        adopterName: 'Chris C.',
        story: 'Adrian has been the best addition to our home...',
        photoUrl: 'https://pub-r2.adoption-os.com/happy-tails/adrian.jpg',
        adoptionDate: '2025',
        isFeatured: true,
        publishedAt: '2026-09-15T12:00:00Z',
      },
    ]

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ happyTails: mockTails }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const store = useHappyTailsStore()
    await store.fetchHappyTails()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [calledUrl, calledInit] = fetchMock.mock.calls[0]
    expect(calledUrl).toContain(`org_id=${  PUBLIC_ORG_ID}`)
    expect(calledInit.headers['X-Org-Id']).toBe(PUBLIC_ORG_ID)

    expect(store.items).toHaveLength(1)
    expect(store.totalStories).toBe(1)
    expect(store.items[0].petName).toBe('Adrian')
    expect(store.items[0].adopterName).toBe('Chris C.')
    expect(store.items[0].adoptersName).toBe('Chris C.')
    expect(store.items[0].story).toContain('best addition')
    expect(store.items[0].testimonial).toContain('best addition')
    expect(store.items[0].adoptedDate).toBe('2025')
  })

  it('handles fetch failure gracefully and keeps items empty', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', fetchMock)

    const store = useHappyTailsStore()
    await store.fetchHappyTails()

    expect(store.items).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe('Network error')
  })

  it('keeps items empty when API returns empty list', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ happyTails: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const store = useHappyTailsStore()
    await store.fetchHappyTails()

    expect(store.items).toEqual([])
    expect(store.isLoading).toBe(false)
  })

  it('submits happy tail with JSON when no photoFile is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'success',
        message: 'Happy Tail submitted for review',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const store = useHappyTailsStore()
    const result = await store.submitHappyTail({
      petName: 'Luna',
      species: 'cat',
      adopterName: 'Sarah Jenkins',
      adopterEmail: 'sarah@example.com',
      adoptionYear: '2025',
      story: 'Luna settled in immediately and loves playing with catnip mice.',
    })

    expect(result.status).toBe('success')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [calledUrl, calledInit] = fetchMock.mock.calls[0]
    expect(calledUrl).toContain(`org_id=${  PUBLIC_ORG_ID}`)
    expect(calledInit.method).toBe('POST')
    expect(calledInit.headers['Content-Type']).toBe('application/json')
    expect(calledInit.headers['X-Org-Id']).toBe(PUBLIC_ORG_ID)

    const parsedBody = JSON.parse(calledInit.body)
    expect(parsedBody.petName).toBe('Luna')
    expect(parsedBody.species).toBe('cat')
    expect(parsedBody.adopterName).toBe('Sarah Jenkins')
    expect(parsedBody.adopterEmail).toBe('sarah@example.com')
  })

  it('submits happy tail with FormData when photoFile is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'success',
        message: 'Happy Tail submitted for review',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const fakeFile = new File(['dummy content'], 'luna.jpg', { type: 'image/jpeg' })

    const store = useHappyTailsStore()
    const result = await store.submitHappyTail({
      petName: 'Luna',
      species: 'cat',
      adopterName: 'Sarah Jenkins',
      story: 'Luna settled in immediately!',
      photoFile: fakeFile,
    })

    expect(result.status).toBe('success')
    const [, calledInit] = fetchMock.mock.calls[0]
    expect(calledInit.method).toBe('POST')
    expect(calledInit.headers['X-Org-Id']).toBe(PUBLIC_ORG_ID)
    // In browser fetch, Content-Type should NOT be set manually for FormData
    expect(calledInit.headers['Content-Type']).toBeUndefined()
    expect(calledInit.body instanceof FormData).toBe(true)

    const formData = calledInit.body as FormData
    expect(formData.get('petName')).toBe('Luna')
    expect(formData.get('species')).toBe('cat')
    expect(formData.get('adopterName')).toBe('Sarah Jenkins')
    expect(formData.get('story')).toBe('Luna settled in immediately!')
    expect(formData.get('photo')).toBe(fakeFile)
  })

  it('throws descriptive error on validation failure from API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: {
          code: 'BAD_REQUEST',
          message: 'pet name is required',
          field: 'petName',
        },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const store = useHappyTailsStore()
    await expect(
      store.submitHappyTail({
        petName: '',
        species: 'cat',
        adopterName: 'Sarah',
        story: 'A wonderful story about our rescue pet.',
      }),
    ).rejects.toThrow('pet name is required')
  })

  describe('normalizeHappyTailPhotoUrl', () => {
    const testR2 = 'https://pub-768b3a497dc648f2895152092bf57934.r2.dev'

    it('returns empty string for null, undefined, or empty values', () => {
      expect(normalizeHappyTailPhotoUrl(null)).toBe('')
      expect(normalizeHappyTailPhotoUrl(undefined)).toBe('')
      expect(normalizeHappyTailPhotoUrl('')).toBe('')
      expect(normalizeHappyTailPhotoUrl('   ')).toBe('')
    })

    it('maps api.adoption-os.com photo URLs to public R2 bucket', () => {
      const apiPhoto = 'https://api.adoption-os.com/happy-tails/1790139065-photo.jpeg'
      expect(normalizeHappyTailPhotoUrl(apiPhoto, testR2)).toBe(
        'https://pub-768b3a497dc648f2895152092bf57934.r2.dev/happy-tails/1790139065-photo.jpeg',
      )
    })

    it('preserves already normalized public R2 URLs', () => {
      const r2Photo = 'https://pub-768b3a497dc648f2895152092bf57934.r2.dev/happy-tails/1790139065-photo.jpeg'
      expect(normalizeHappyTailPhotoUrl(r2Photo, testR2)).toBe(r2Photo)
    })

    it('maps relative happy-tails paths to public R2 bucket', () => {
      expect(normalizeHappyTailPhotoUrl('happy-tails/123-photo.jpg', testR2)).toBe(
        'https://pub-768b3a497dc648f2895152092bf57934.r2.dev/happy-tails/123-photo.jpg',
      )
      expect(normalizeHappyTailPhotoUrl('/happy-tails/123-photo.jpg', testR2)).toBe(
        'https://pub-768b3a497dc648f2895152092bf57934.r2.dev/happy-tails/123-photo.jpg',
      )
    })

    it('leaves standard external image URLs unchanged', () => {
      const externalUrl = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'
      expect(normalizeHappyTailPhotoUrl(externalUrl, testR2)).toBe(externalUrl)
    })
  })
})
