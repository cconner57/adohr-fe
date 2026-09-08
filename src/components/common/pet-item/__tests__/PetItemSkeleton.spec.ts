import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PetItemSkeleton from '../PetItemSkeleton.vue'

describe('PetItemSkeleton.vue', () => {
  it('renders skeleton card matching pet card elements', () => {
    const wrapper = mount(PetItemSkeleton)

    expect(wrapper.find('.pet-skeleton').exists()).toBe(true)
    expect(wrapper.find('.skeleton-img').exists()).toBe(true)
    expect(wrapper.find('.skeleton-fav').exists()).toBe(true)
    expect(wrapper.find('.skeleton-info').exists()).toBe(true)
    expect(wrapper.find('.skeleton-title').exists()).toBe(true)
    expect(wrapper.find('.skeleton-capsules').exists()).toBe(true)
    expect(wrapper.find('.skeleton-btn').exists()).toBe(true)
  })

  it('has aria-hidden true for accessibility', () => {
    const wrapper = mount(PetItemSkeleton)
    expect(wrapper.find('.pet-skeleton').attributes('aria-hidden')).toBe('true')
  })
})
