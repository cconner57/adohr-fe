import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resetAdoptionEventsState } from '@/composables/useAdoptionEvents'

import EventBanner from '../EventBanner.vue'
import EventPrepDrawer from '../EventPrepDrawer.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const mockLiveEvent = {
  events: [
    {
      id: 'evt-1',
      title: 'PetSmart Pasadena Adoption Event',
      type: 'adoption-event',
      startDate: '2026-09-05',
      startTime: '12:00',
      endTime: '16:00',
      location: 'PetSmart Pasadena',
      address: '3347 E Foothill Blvd, Pasadena',
      attendingPetIds: ['pet-1'],
    },
  ],
}

describe('EventBanner.vue', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    resetAdoptionEventsState()
  })

  it('does not render when no upcoming events exist', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ events: [] }),
    } as Response)

    const wrapper = mount(EventBanner)
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(wrapper.find('.event-banner').exists()).toBe(false)
  })

  it('renders live event information when events are returned from API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockLiveEvent,
    } as Response)

    const wrapper = mount(EventBanner, {
      props: {
        showFilterButton: true,
        isFilterActive: false,
      },
    })
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(wrapper.find('.petsmart-banner').exists()).toBe(true)
    expect(wrapper.text()).toContain('PetSmart Pasadena')
    expect(wrapper.text()).toContain('Sep 5')
  })

  it('emits toggle-filter when the filter button is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockLiveEvent,
    } as Response)

    const wrapper = mount(EventBanner, {
      props: {
        showFilterButton: true,
        isFilterActive: false,
      },
    })
    await new Promise((resolve) => setTimeout(resolve, 30))
    const filterBtn = wrapper.find('.filter-toggle-btn')
    expect(filterBtn.exists()).toBe(true)
    expect(filterBtn.text()).toContain('Pets Attending Event')
    await filterBtn.trigger('click')

    expect(wrapper.emitted('toggle-filter')).toBeTruthy()
  })

  it('opens prep modal when What to Bring is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockLiveEvent,
    } as Response)

    const wrapper = mount(EventBanner, {
      props: {
        showFilterButton: false,
      },
    })
    await new Promise((resolve) => setTimeout(resolve, 30))

    const buttons = wrapper.findAllComponents({ name: 'Button' })
    const prepBtn = buttons.find((b) => b.props('title') === 'What to Bring')
    expect(prepBtn).toBeTruthy()
    await prepBtn!.trigger('click')

    expect(wrapper.findComponent(EventPrepDrawer).props('isOpen')).toBe(true)
  })

  it('hides both action buttons when showFilterButton and showWhatToBringButton are false', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockLiveEvent,
    } as Response)

    const wrapper = mount(EventBanner, {
      props: {
        showFilterButton: false,
        showWhatToBringButton: false,
      },
    })
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(wrapper.find('.banner-actions').exists()).toBe(false)
    expect(wrapper.find('.filter-toggle-btn').exists()).toBe(false)
  })

  it('applies variant-dark class when variant is dark or colorScheme is forest/dark', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockLiveEvent,
    } as Response)

    const wrapper = mount(EventBanner, {
      props: {
        colorScheme: 'forest',
      },
    })
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(wrapper.find('.petsmart-banner').classes()).toContain('variant-dark')
  })

  it('renders location tabs when multiple adoption events are available', async () => {
    const mockMultiApiResponse = {
      events: [
        {
          id: 'evt-1',
          title: 'PetSmart Pasadena Adoption Event',
          type: 'adoption-event',
          startDate: '2026-09-05',
          startTime: '12:00',
          location: 'PetSmart Pasadena',
          address: '3347 E Foothill Blvd, Pasadena',
        },
        {
          id: 'evt-2',
          title: 'Petco Burbank Adoption Fair',
          type: 'adoption-event',
          startDate: '2026-09-05',
          startTime: '11:00',
          location: 'Petco Burbank',
          address: '3525 W Victory Blvd, Burbank',
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMultiApiResponse,
    } as Response)

    const wrapper = mount(EventBanner)
    await new Promise((resolve) => setTimeout(resolve, 50))

    const tabs = wrapper.findAll('.location-tab-btn')
    expect(tabs.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.text()).toContain('PetSmart Pasadena')
    expect(wrapper.text()).toContain('Petco Burbank')
  })

  it('hides Pets Attending Event button when active event has no attending pets', async () => {
    const eventWithoutPets = {
      events: [
        {
          id: 'evt-empty',
          title: 'PetSmart Upland Adoption Event',
          type: 'adoption-event',
          startDate: '2026-09-06',
          startTime: '12:00',
          endTime: '16:00',
          location: 'PetSmart Upland',
          address: 'Upland, CA',
          attendingPetIds: [],
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => eventWithoutPets,
    } as Response)

    const wrapper = mount(EventBanner, {
      props: {
        showFilterButton: true,
      },
    })
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(wrapper.find('.filter-toggle-btn').exists()).toBe(false)
  })

  it('respects hasAttendingPets boolean prop if provided explicitly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockLiveEvent,
    } as Response)

    const wrapper = mount(EventBanner, {
      props: {
        showFilterButton: true,
        hasAttendingPets: false,
      },
    })
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(wrapper.find('.filter-toggle-btn').exists()).toBe(false)
  })
})
