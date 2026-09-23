import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useHappyTailsStore } from '@/stores/happyTails'

import SuccessStories from '../SuccessStories.vue'

describe('SuccessStories.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('does not render when there are no stories in store', () => {
    const store = useHappyTailsStore()
    store.items = []

    const wrapper = mount(SuccessStories, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.find('.success-stories').exists()).toBe(false)
  })

  it('renders story cards when stories exist in store', () => {
    const store = useHappyTailsStore()
    store.items = [
      {
        id: '1',
        petName: 'Bella',
        species: 'dog',
        adopterName: 'The Johnson Family',
        adoptersName: 'The Johnson Family',
        testimonial: 'Bella brought so much warmth to our home!',
        photoUrl: 'https://example.com/bella.jpg',
        adoptedDate: '2026-01-10',
      },
      {
        id: '2',
        petName: 'Milo',
        species: 'cat',
        adopterName: 'Sam K.',
        adoptersName: 'Sam K.',
        testimonial: 'Milo is the sweetest cat ever.',
        photoUrl: 'https://example.com/milo.jpg',
        adoptedDate: '2026-02-15',
      },
    ]

    const wrapper = mount(SuccessStories, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.find('.success-stories').exists()).toBe(true)
    const cards = wrapper.findAll('.story-card')
    expect(cards).toHaveLength(2)
    expect(wrapper.text()).toContain('Bella')
    expect(wrapper.text()).toContain('The Johnson Family')
    expect(wrapper.text()).toContain('Milo')
    expect(wrapper.text()).toContain('Sam K.')
  })
})
