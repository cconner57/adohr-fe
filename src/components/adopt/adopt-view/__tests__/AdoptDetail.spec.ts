import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import type { IPet } from '@/models/common'

import AdoptDetail from '../AdoptDetail.vue'

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

vi.mock('@/composables/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: vi.fn().mockReturnValue(false),
    toggleFavorite: vi.fn(),
  }),
}))

const createPet = (overrides: Partial<IPet['profileSettings']> = {}): IPet => ({
  id: 'snowball-id',
  slug: 'snowball-fa1f8',
  name: 'Snowball',
  species: 'cat',
  sex: 'female',
  createdAt: '2026-11-25T16:45:13Z',
  updatedAt: '2026-11-27T16:44:37Z',
  physical: {
    ageGroup: 'baby',
    breed: 'Domestic Shorthair',
    coatLength: 'short',
    color: 'Tan',
    size: 'medium',
  },
  behavior: {
    energyLevel: null,
    personalityTags: [],
    bonded: null,
    isGoodWithCats: null,
    isGoodWithDogs: null,
    isGoodWithKids: null,
    isGoodWithOtherAnimals: null,
    isHouseTrained: null,
    prefersToBeAlone: null,
  },
  medical: {
    specialNeeds: [],
    felvPositive: false,
    fivPositive: false,
    healthConcerns: [],
    currentMedications: [],
    spayedOrNeutered: false,
    vaccinationsUpToDate: false,
    microchip: { microchipped: false },
    surgeries: [],
    vaccinations: {},
  },
  descriptions: {
    primary: 'Sweet kitten',
    fun: 'Sweet kitten',
  },
  details: {
    status: 'available',
  },
  adoption: {},
  foster: {},
  returned: {
    isReturned: false,
    history: [],
  },
  sponsored: {
    isSponsored: false,
  },
  photos: [{ isPrimary: true, uploadedAt: '2026-11-25T16:45:13Z', url: 'snowball.jpg' }],
  profileSettings: {
    isSpotlightFeatured: false,
    showAdditionalInformation: false,
    showMedicalHistory: false,
    allowAdoptionInquiries: true,
    allowRequestInfo: true,
    allowShare: true,
    allowScheduleMeet: true,
    ...overrides,
  },
})

const mountAdoptDetail = (pet: IPet) =>
  mount(AdoptDetail, {
    props: { pet },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: {
        AdoptDetailInfo: true,
        AdoptDetailAbout: true,
        AdoptDetailLittermates: true,
        AdoptDrawer: { props: ['isDrawerOpen'], template: '<div data-test="adopt-drawer" :data-open="isDrawerOpen" />' },
        RequestInfoDrawer: {
          props: ['isDrawerOpen'],
          template: '<div data-test="request-info-drawer" :data-open="isDrawerOpen" />',
        },
        PreQualDrawer: { props: ['isOpen'], template: '<div data-test="prequal-drawer" :data-open="isOpen" />' },
        PetPhotoBadges: true,
        ImagePlaceholder: true,
      },
    },
  })

describe('AdoptDetail.vue visitor profile actions', () => {
  it('disables Start Adoption when profileSettings.allowAdoptionInquiries is false', async () => {
    const wrapper = mountAdoptDetail(
      createPet({
        allowAdoptionInquiries: false,
        allowRequestInfo: true,
        allowShare: true,
      }),
    )

    const startBtn = wrapper.findAll('button').find((b) => b.text() === 'Start Adoption')
    const infoBtn = wrapper.findAll('button').find((b) => b.text() === 'Request Information')
    const shareBtn = wrapper.findAll('button').find((b) => b.text() === 'Share')

    expect(startBtn?.attributes('disabled')).toBeDefined()
    expect(infoBtn?.attributes('disabled')).toBeUndefined()
    expect(shareBtn?.attributes('disabled')).toBeUndefined()

    await startBtn?.trigger('click')
    expect(wrapper.find('[data-test="prequal-drawer"]').attributes('data-open')).toBe('false')

    await infoBtn?.trigger('click')
    expect(wrapper.find('[data-test="request-info-drawer"]').attributes('data-open')).toBe('true')
  })

  it('disables Request Information and Share when allowRequestInfo and allowShare are false', async () => {
    const writeText = vi.fn()
    Object.assign(navigator, { clipboard: { writeText }, share: undefined })

    const wrapper = mountAdoptDetail(
      createPet({
        allowAdoptionInquiries: true,
        allowRequestInfo: false,
        allowShare: false,
      }),
    )

    const startBtn = wrapper.findAll('button').find((b) => b.text() === 'Start Adoption')
    const infoBtn = wrapper.findAll('button').find((b) => b.text() === 'Request Information')
    const shareBtn = wrapper.findAll('button').find((b) => b.text() === 'Share')

    expect(startBtn?.attributes('disabled')).toBeUndefined()
    expect(infoBtn?.attributes('disabled')).toBeDefined()
    expect(shareBtn?.attributes('disabled')).toBeDefined()

    await infoBtn?.trigger('click')
    expect(wrapper.find('[data-test="request-info-drawer"]').attributes('data-open')).toBe('false')

    await shareBtn?.trigger('click')
    expect(writeText).not.toHaveBeenCalled()
  })
})
