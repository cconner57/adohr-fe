import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import HeroSection from '../HeroSection.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('HeroSection.vue', () => {
  it('renders hero title and lede text', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Connecting rescued pets')
    expect(wrapper.text()).toContain('forever')
  })

  it('renders overlapping duo cards with rescued dog and cat photos', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    expect(wrapper.find('.hero-duo-cards').exists()).toBe(true)

    const dogImg = wrapper.find('.card-dog img')
    expect(dogImg.exists()).toBe(true)
    expect(dogImg.attributes('src')).toBe('/images/hero-dog.jpg')
    expect(dogImg.attributes('alt')).toContain('Rescued puppy')

    const catImg = wrapper.find('.card-cat img')
    expect(catImg.exists()).toBe(true)
    expect(catImg.attributes('src')).toBe('/images/hero-cat.jpg')
    expect(catImg.attributes('alt')).toContain('Rescued tuxedo cat')

    expect(wrapper.find('.sticker').exists()).toBe(false)
  })
})
