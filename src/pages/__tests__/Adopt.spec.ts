import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { usePetStore } from '@/stores/pets'
import { normalizePet } from '@/utils/petNormalizer'

import Adopt from '../Adopt.vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
  }),
}))

vi.mock('@/composables/useAdoptionEvents', () => ({
  useAdoptionEvents: () => ({
    attendingPetIds: { value: [] },
    fetchUpcomingEvents: vi.fn(),
  }),
}))

describe('Adopt.vue', () => {
  it('renders adoptable pets directory with list skeleton when loading and pet cards when loaded', () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const store = usePetStore(pinia)
    store.isFetching = true

    const wrapper = mount(Adopt, {
      global: {
        plugins: [pinia],
        stubs: {
          AdoptPageHeader: { template: '<div data-test="adopt-header" />' },
          FilterPanel: true,
          EventBanner: true,
          PetMatcherDrawer: true,
          AdoptSummary: { props: ['pets'], template: '<div data-test="adopt-summary">{{ pets.length }}</div>' },
          PetItemSkeleton: { template: '<div class="pet-item-skeleton" />' },
        },
      },
    })

    expect(wrapper.find('.skeleton-grid').exists()).toBe(true)
    expect(wrapper.find('[data-test="adopt-summary"]').exists()).toBe(false)

    store.isFetching = false
    store.currentPets = [
      normalizePet({ id: '1', name: 'Achilles', species: 'cat' }),
      normalizePet({ id: '2', name: 'Angel', species: 'cat' }),
    ]

    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.find('.skeleton-grid').exists()).toBe(false)
      expect(wrapper.find('[data-test="adopt-summary"]').text()).toBe('2')
    })
  })
})
