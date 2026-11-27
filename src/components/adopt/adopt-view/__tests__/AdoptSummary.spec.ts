import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { normalizePet } from '@/utils/petNormalizer'

import AdoptSummary from '../AdoptSummary.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('@/composables/useAdoptionEvents', () => ({
  useAdoptionEvents: () => ({
    getPetAttendanceSchedule: vi.fn().mockReturnValue(null),
  }),
}))

describe('AdoptSummary.vue', () => {
  it('renders dashed placeholder capsules on cards when showDetailCapsules is false', () => {
    const visiblePet = normalizePet({
      id: 'pet-visible',
      name: 'Milo',
      species: 'cat',
      sex: 'male',
      physical: { dateOfBirth: '2026-06-01' },
    })

    const hiddenPet = normalizePet({
      id: 'pet-hidden',
      name: 'Snowball',
      species: 'cat',
      sex: 'female',
      physical: { dateOfBirth: '2026-07-15' },
      profileSettings: { showDetailCapsules: false },
    })

    const wrapper = mount(AdoptSummary, {
      props: { pets: [visiblePet, hiddenPet] },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    const cards = wrapper.findAll('.pet-item')
    expect(cards).toHaveLength(2)

    const hiddenCapsules = cards[1].findAll('.capsules .capsule')
    expect(hiddenCapsules).toHaveLength(3)
    expect(hiddenCapsules.map((c) => c.text())).toEqual(['—', '—', '—'])
  })
})
