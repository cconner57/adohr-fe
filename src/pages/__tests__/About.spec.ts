import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import About from '../About.vue'

describe('About.vue', () => {
  beforeAll(() => {
    class MockIntersectionObserver {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  it('renders the about page and includes the site Footer', () => {
    const wrapper = mount(About, {
      global: {
        directives: {
          'scroll-reveal': {},
        },
        stubs: {
          RouterLink: true,
          AboutHero: true,
          AboutStory: true,
          AboutMission: true,
          AboutTransparency: true,
          AboutLocations: true,
          AboutFAQ: true,
          SupportOurMission: true,
          SurrenderCat: true,
          Footer: true,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'Footer' }).exists()).toBe(true)
  })
})
