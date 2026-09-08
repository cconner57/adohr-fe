import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useFavorites } from '../useFavorites'

describe('useFavorites.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const { clearFavorites } = useFavorites()
    clearFavorites()
  })

  it('starts with 0 favorites', () => {
    const { favoriteCount, isFavorite } = useFavorites()
    expect(favoriteCount.value).toBe(0)
    expect(isFavorite('pet-123')).toBe(false)
  })

  it('toggles a pet as favorite and updates count', () => {
    const { toggleFavorite, isFavorite, favoriteCount } = useFavorites()
    const added = toggleFavorite('pet-123', 'Bella')
    expect(added).toBe(true)
    expect(isFavorite('pet-123')).toBe(true)
    expect(favoriteCount.value).toBe(1)

    // Toggling again removes it
    const removed = toggleFavorite('pet-123', 'Bella')
    expect(removed).toBe(false)
    expect(isFavorite('pet-123')).toBe(false)
    expect(favoriteCount.value).toBe(0)
  })

  it('is case-insensitive for IDs', () => {
    const { toggleFavorite, isFavorite } = useFavorites()
    toggleFavorite('PET-ABC')
    expect(isFavorite('pet-abc')).toBe(true)
    expect(isFavorite('PET-ABC')).toBe(true)
  })
})
