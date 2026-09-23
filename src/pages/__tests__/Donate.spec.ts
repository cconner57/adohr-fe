import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import Donate from '../Donate.vue'

describe('Donate.vue', () => {
  beforeAll(() => {
    class MockIntersectionObserver {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  it('renders the donate page and includes the site Footer', () => {
    const wrapper = mount(Donate, {
      global: {
        directives: {
          'scroll-reveal': {},
        },
        stubs: {
          RouterLink: true,
          Footer: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Help a rescue find a')
    expect(wrapper.findComponent({ name: 'Footer' }).exists()).toBe(true)
  })
})
