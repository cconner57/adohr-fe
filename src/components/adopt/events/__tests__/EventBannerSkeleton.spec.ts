import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import EventBannerSkeleton from '../EventBannerSkeleton.vue'

describe('EventBannerSkeleton.vue', () => {
  it('renders default light variant with correct accessibility attributes', () => {
    const wrapper = mount(EventBannerSkeleton)

    expect(wrapper.find('.event-banner-skeleton').exists()).toBe(true)
    expect(wrapper.classes()).toContain('variant-light')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading upcoming adoption events...')
    expect(wrapper.find('.skeleton-location-selector').exists()).toBe(true)
    expect(wrapper.find('.skeleton-title').exists()).toBe(true)
    expect(wrapper.find('.skeleton-subtitle').exists()).toBe(true)
    expect(wrapper.find('.skeleton-address').exists()).toBe(true)
    expect(wrapper.find('.skeleton-actions').exists()).toBe(true)
  })

  it('renders dark variant when colorScheme="dark"', () => {
    const wrapper = mount(EventBannerSkeleton, {
      props: {
        colorScheme: 'dark',
      },
    })

    expect(wrapper.classes()).toContain('variant-dark')
    expect(wrapper.classes()).not.toContain('variant-light')
  })

  it('hides action buttons when showActions=false', () => {
    const wrapper = mount(EventBannerSkeleton, {
      props: {
        showActions: false,
      },
    })

    expect(wrapper.find('.skeleton-actions').exists()).toBe(false)
  })
})
