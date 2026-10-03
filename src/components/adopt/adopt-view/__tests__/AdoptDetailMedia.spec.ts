import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import AdoptDetailMedia from '../AdoptDetailMedia.vue'

vi.mock('@/composables/useAdoptionEvents', () => ({
  useAdoptionEvents: () => ({
    getPetAttendanceSchedule: vi.fn().mockReturnValue(null),
  }),
}))

vi.mock('@/composables/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: vi.fn().mockReturnValue(false),
    toggleFavorite: vi.fn(),
  }),
}))

describe('AdoptDetailMedia.vue', () => {
  const defaultProps = {
    petPhotoUrl: 'https://images.example.com/carlo.jpg',
    petName: 'Carlo',
    petId: 'pet-123',
    photos: [
      { url: 'https://images.example.com/carlo.jpg', isPrimary: true },
      { url: 'https://images.example.com/carlo-2.jpg' },
    ],
  }

  it('renders thumbnail strip inside .adopt-detail__media on the bottom left when multiple photos exist', () => {
    const wrapper = mount(AdoptDetailMedia, {
      props: defaultProps,
      global: {
        stubs: {
          PetPhotoBadges: true,
          Button: true,
          ImagePlaceholder: true,
        },
      },
    })

    const mediaContainer = wrapper.find('.adopt-detail__media')
    expect(mediaContainer.exists()).toBe(true)

    // Verify thumbnail strip is a child of .adopt-detail__media
    const thumbStrip = mediaContainer.find('.thumbnail-strip')
    expect(thumbStrip.exists()).toBe(true)

    // Verify it contains the 2 thumbnail buttons
    const thumbButtons = thumbStrip.findAll('.thumb-btn')
    expect(thumbButtons.length).toBe(2)
    expect(thumbButtons[0].classes()).toContain('active')
    expect(thumbButtons[1].classes()).not.toContain('active')
  })

  it('switches active photo when a thumbnail is clicked', async () => {
    const wrapper = mount(AdoptDetailMedia, {
      props: defaultProps,
      global: {
        stubs: {
          PetPhotoBadges: true,
          Button: true,
          ImagePlaceholder: true,
        },
      },
    })

    const mediaContainer = wrapper.find('.adopt-detail__media')
    const thumbButtons = mediaContainer.findAll('.thumb-btn')

    // Click second thumbnail
    await thumbButtons[1].trigger('click')

    expect(thumbButtons[1].classes()).toContain('active')
    expect(thumbButtons[0].classes()).not.toContain('active')

    const mainImg = wrapper.find('.adopt-detail__main-img')
    expect(mainImg.attributes('src')).toContain('carlo-2.jpg')
  })

  it('does not render thumbnail strip when only one photo exists', () => {
    const wrapper = mount(AdoptDetailMedia, {
      props: {
        petPhotoUrl: 'https://images.example.com/carlo.jpg',
        petName: 'Carlo',
        petId: 'pet-123',
        photos: [{ url: 'https://images.example.com/carlo.jpg' }],
      },
      global: {
        stubs: {
          PetPhotoBadges: true,
          Button: true,
          ImagePlaceholder: true,
        },
      },
    })

    expect(wrapper.find('.thumbnail-strip').exists()).toBe(false)
  })

  it('emits action events when buttons in action card are clicked', async () => {
    const wrapper = mount(AdoptDetailMedia, {
      props: defaultProps,
      global: {
        stubs: {
          PetPhotoBadges: true,
          ImagePlaceholder: true,
        },
      },
    })

    const buttons = wrapper.findAllComponents({ name: 'Button' })
    expect(buttons.length).toBe(4)

    // Start Adoption
    await buttons[0].trigger('click')
    expect(wrapper.emitted('start-adoption')).toBeTruthy()

    // Schedule a Meet
    await buttons[1].trigger('click')
    expect(wrapper.emitted('schedule-meet')).toBeTruthy()

    // Request Information
    await buttons[2].trigger('click')
    expect(wrapper.emitted('request-info')).toBeTruthy()

    // Share
    await buttons[3].trigger('click')
    expect(wrapper.emitted('share')).toBeTruthy()
  })
})
