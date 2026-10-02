import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useSurrenderStore } from '../surrender'

describe('useSurrenderStore - animalSpecies sync', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes animalSpecies as empty string', () => {
    const store = useSurrenderStore()
    expect(store.formState.animalSpecies).toBe('')
    expect(store.selectedAnimal).toBeNull()
  })

  it('syncs formState.animalSpecies when selectedAnimal changes', () => {
    const store = useSurrenderStore()

    store.selectedAnimal = 'dog'
    expect(store.formState.animalSpecies).toBe('dog')

    store.selectedAnimal = 'cat'
    expect(store.formState.animalSpecies).toBe('cat')
  })

  it('clears animalSpecies on resetForm', () => {
    const store = useSurrenderStore()
    store.selectedAnimal = 'dog'
    expect(store.formState.animalSpecies).toBe('dog')

    store.resetForm()
    expect(store.selectedAnimal).toBeNull()
    expect(store.formState.animalSpecies).toBe('')
  })
})
