import { mount } from '@vue/test-utils'
import { beforeEach,describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import type { IPet } from '@/models/common'

import AdoptionSpotlight from '../AdoptionSpotlight.vue'

const isMobileMock = ref(false)

vi.mock('@/utils/useIsMobile', () => ({
  useIsMobile: () => isMobileMock,
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const mockPets: IPet[] = [
  {
    id: '1',
    slug: 'bella',
    name: 'Bella',
    species: 'Dog',
    sex: 'Female',
    photos: [{ isPrimary: true, url: 'pets/bella.jpg' }],
    physical: { dateOfBirth: '2022-01-01' },
    sponsored: { isSponsored: false },
    details: { status: 'available' },
  } as unknown as IPet,
  {
    id: '2',
    slug: 'luna',
    name: 'Luna',
    species: 'Cat',
    sex: 'Female',
    photos: [{ isPrimary: true, url: 'pets/luna.jpg' }],
    physical: { dateOfBirth: '2023-01-01' },
    sponsored: { isSponsored: false },
    details: { status: 'available' },
  } as unknown as IPet,
  {
    id: '3',
    slug: 'max',
    name: 'Max',
    species: 'Dog',
    sex: 'Male',
    photos: [{ isPrimary: true, url: 'pets/max.jpg' }],
    physical: { dateOfBirth: '2021-05-01' },
    sponsored: { isSponsored: false },
    details: { status: 'available' },
  } as unknown as IPet,
  {
    id: '4',
    slug: 'charlie',
    name: 'Charlie',
    species: 'Cat',
    sex: 'Male',
    photos: [{ isPrimary: true, url: 'pets/charlie.jpg' }],
    physical: { dateOfBirth: '2020-03-01' },
    sponsored: { isSponsored: false },
    details: { status: 'available' },
  } as unknown as IPet,
]

describe('AdoptionSpotlight.vue', () => {
  beforeEach(() => {
    isMobileMock.value = false
  })

  it('renders 4 spotlight pets on desktop view', () => {
    isMobileMock.value = false
    const wrapper = mount(AdoptionSpotlight, {
      props: {
        pets: mockPets,
        loading: false,
        error: null,
      },
      global: {
        stubs: {
          PetItem: {
            props: ['name', 'id'],
            template: '<div class="pet-item">{{ name }}</div>',
          },
          PetItemSkeleton: true,
          Button: true,
        },
      },
    })

    const items = wrapper.findAll('.pet-item')
    expect(items).toHaveLength(4)
    expect(items.map((i) => i.text())).toEqual(['Bella', 'Luna', 'Max', 'Charlie'])
  })

  it('renders only 1 random spotlight pet on mobile view', () => {
    isMobileMock.value = true
    const wrapper = mount(AdoptionSpotlight, {
      props: {
        pets: mockPets,
        loading: false,
        error: null,
      },
      global: {
        stubs: {
          PetItem: {
            props: ['name', 'id'],
            template: '<div class="pet-item">{{ name }}</div>',
          },
          PetItemSkeleton: true,
          Button: true,
        },
      },
    })

    const items = wrapper.findAll('.pet-item')
    expect(items).toHaveLength(1)
    const petNames = mockPets.map((p) => p.name)
    expect(petNames).toContain(items[0].text())
  })

  it('renders 1 loading skeleton on mobile and 4 on desktop', async () => {
    isMobileMock.value = true
    const mobileWrapper = mount(AdoptionSpotlight, {
      props: {
        pets: [],
        loading: true,
        error: null,
      },
      global: {
        stubs: {
          PetItem: true,
          PetItemSkeleton: {
            template: '<div class="pet-skeleton"></div>',
          },
          Button: true,
        },
      },
    })

    expect(mobileWrapper.findAll('.pet-skeleton')).toHaveLength(1)

    isMobileMock.value = false
    const desktopWrapper = mount(AdoptionSpotlight, {
      props: {
        pets: [],
        loading: true,
        error: null,
      },
      global: {
        stubs: {
          PetItem: true,
          PetItemSkeleton: {
            template: '<div class="pet-skeleton"></div>',
          },
          Button: true,
        },
      },
    })

    expect(desktopWrapper.findAll('.pet-skeleton')).toHaveLength(4)
  })

  it('renders error container when error is present', () => {
    const wrapper = mount(AdoptionSpotlight, {
      props: {
        pets: [],
        loading: false,
        error: 'Network error',
      },
      global: {
        stubs: {
          PetItem: true,
          PetItemSkeleton: true,
          Button: true,
        },
      },
    })

    expect(wrapper.find('.error-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('Spotlight unavailable')
  })

  it('renders empty state when no pets are available', () => {
    const wrapper = mount(AdoptionSpotlight, {
      props: {
        pets: [],
        loading: false,
        error: null,
      },
      global: {
        stubs: {
          PetItem: true,
          PetItemSkeleton: true,
          Button: true,
        },
      },
    })

    expect(wrapper.find('.empty-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('No spotlight pets available right now')
  })
})
