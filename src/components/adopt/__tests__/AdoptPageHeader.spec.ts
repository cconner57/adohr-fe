import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AdoptPageHeader from '../AdoptPageHeader.vue'

describe('AdoptPageHeader.vue', () => {
  const defaultProps = {
    pet: false,
    activeFilter: 'All',
    isFilterPanelOpen: false,
    filterCount: 0,
    searchQuery: '',
    isFavoritesOnly: false,
    favoriteCount: 3,
  }

  it('renders Favorites button with favorite count badge', () => {
    const wrapper = mount(AdoptPageHeader, {
      props: defaultProps,
    })

    const favBtn = wrapper.find('.fav-filter-btn')
    expect(favBtn.exists()).toBe(true)
    expect(favBtn.text()).toContain('Favorites')
    expect(favBtn.text()).toContain('3')
  })

  it('emits toggle-favorites when clicked', async () => {
    const wrapper = mount(AdoptPageHeader, {
      props: defaultProps,
    })

    const favBtn = wrapper.find('.fav-filter-btn')
    await favBtn.trigger('click')

    expect(wrapper.emitted('toggle-favorites')).toHaveLength(1)
  })

  it('shows active favorites chip when isFavoritesOnly is true', () => {
    const wrapper = mount(AdoptPageHeader, {
      props: {
        ...defaultProps,
        isFavoritesOnly: true,
      },
    })

    const favBtn = wrapper.find('.fav-filter-btn')
    expect(favBtn.classes()).toContain('active')

    const activeChip = wrapper.find('.chip-fav')
    expect(activeChip.exists()).toBe(true)
    expect(activeChip.text()).toContain('Favorites')
  })
})
