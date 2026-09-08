import { computed, ref } from 'vue'

import { useUIStore } from '../stores/ui'
import { vibrate } from '../utils/haptics'

const STORAGE_KEY = 'adohr_saved_pets'

function loadSavedPets(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map((id) => String(id).toLowerCase()) : []
  } catch (e) {
    console.error('Failed to load saved pets from localStorage', e)
    return []
  }
}

// Module-level reactive singleton
const savedPetIds = ref<string[]>(loadSavedPets())

function persistSavedPets(ids: string[]) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch (e) {
    console.error('Failed to persist saved pets to localStorage', e)
  }
}

export function useFavorites() {
  const isFavorite = (id: string | null | undefined): boolean => {
    if (!id) return false
    return savedPetIds.value.includes(id.toLowerCase())
  }

  const toggleFavorite = (id: string | null | undefined, petName?: string): boolean => {
    if (!id) return false
    const normalizedId = id.toLowerCase()
    const index = savedPetIds.value.indexOf(normalizedId)
    const uiStore = useUIStore()

    vibrate(25)

    if (index > -1) {
      savedPetIds.value = savedPetIds.value.filter((item) => item !== normalizedId)
      persistSavedPets(savedPetIds.value)
      uiStore.showToast(petName ? `Removed ${petName} from saved pets.` : 'Removed from saved pets.', 'info')
      return false
    } else {
      savedPetIds.value = [...savedPetIds.value, normalizedId]
      persistSavedPets(savedPetIds.value)
      uiStore.showToast(petName ? `Saved ${petName} to your favorites! ❤️` : 'Saved to favorites! ❤️', 'success')
      return true
    }
  }

  const clearFavorites = () => {
    savedPetIds.value = []
    persistSavedPets([])
  }

  const favoriteCount = computed(() => savedPetIds.value.length)

  return {
    savedPetIds: computed(() => savedPetIds.value),
    favoriteCount,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  }
}
