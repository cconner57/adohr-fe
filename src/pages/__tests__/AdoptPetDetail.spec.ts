import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { usePetStore } from '@/stores/pets'
import { normalizePet } from '@/utils/petNormalizer'

import AdoptPetDetail from '../AdoptPetDetail.vue'

const pushMock = vi.fn()
const mockRouteParams: { id?: string } = { id: 'angel-bab98' }

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}))

const createSamplePet = () =>
  normalizePet({
    id: 'angel-id',
    slug: 'angel-bab98',
    name: 'Angel',
    species: 'cat',
    sex: 'female',
    details: { status: 'available' },
  })

describe('AdoptPetDetail.vue', () => {
  it('shows dedicated pet profile skeleton (not list skeleton grid) while loading on refresh', async () => {
    let releaseFetch: (() => void) | undefined
    const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: false })
    const store = usePetStore(pinia)
    vi.spyOn(store, 'fetchPetDetail').mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseFetch = () => resolve(createSamplePet())
        }),
    )

    const wrapper = mount(AdoptPetDetail, {
      props: { id: 'angel-bab98' },
      global: {
        plugins: [pinia],
        stubs: { AdoptDetail: { props: ['pet'], template: '<div class="pet-detail">{{ pet.name }}</div>' } },
      },
    })

    expect(wrapper.find('.detail-skeleton').exists()).toBe(true)
    expect(wrapper.find('.skeleton-grid').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Find your new best friend')

    releaseFetch?.()
    await flushPromises()

    expect(wrapper.find('.detail-skeleton').exists()).toBe(false)
    expect(wrapper.find('.pet-detail').text()).toBe('Angel')
  })

  it('shows friendly not-found state with navigation back to /adopt when pet is missing', async () => {
    pushMock.mockReset()
    const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: false })
    const store = usePetStore(pinia)
    vi.spyOn(store, 'fetchPetDetail').mockResolvedValue(null)

    const wrapper = mount(AdoptPetDetail, {
      props: { id: 'missing-pet' },
      global: {
        plugins: [pinia],
        stubs: { AdoptDetail: true },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Pet not found')
    const browseBtn = wrapper.findAll('button').find((b) => b.text() === 'Browse Adoptable Pets')
    expect(browseBtn).toBeDefined()
    await browseBtn?.trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/adopt')
  })

  it('shows error state and retries loading pet profile cleanly', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: false })
    const store = usePetStore(pinia)
    const fetchSpy = vi
      .spyOn(store, 'fetchPetDetail')
      .mockRejectedValueOnce(new Error('Network offline'))
      .mockResolvedValueOnce(createSamplePet())

    const wrapper = mount(AdoptPetDetail, {
      props: { id: 'angel-bab98' },
      global: {
        plugins: [pinia],
        stubs: { AdoptDetail: { props: ['pet'], template: '<div class="pet-detail">{{ pet.name }}</div>' } },
      },
    })

    await flushPromises()
    expect(wrapper.text()).toContain('Unable to load pet profile')
    expect(wrapper.text()).toContain('Network offline')

    await wrapper.find('.retry-btn').trigger('click')
    await flushPromises()

    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.pet-detail').text()).toBe('Angel')
  })

  it('loads pet profile on cold refresh when public API wraps pet in { data: pet }', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          id: '49b8bb1faf3c39f51e0f90b6c69ae44c',
          slug: 'sylvester-49b8b',
          name: 'Sylvester',
          species: 'cat',
          sex: 'male',
          details: { status: 'available' },
        },
      }),
    } as Response)

    try {
      const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: false })
      const wrapper = mount(AdoptPetDetail, {
        props: { id: 'sylvester-49b8b' },
        global: {
          plugins: [pinia],
          stubs: {
            AdoptDetail: { props: ['pet'], template: '<div class="pet-detail">{{ pet.name }}</div>' },
          },
        },
      })

      await flushPromises()

      expect(wrapper.text()).not.toContain('Pet not found')
      expect(wrapper.find('.pet-detail').text()).toBe('Sylvester')
    } finally {
      fetchMock.mockRestore()
    }
  })
})
