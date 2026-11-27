import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { normalizePet } from '@/utils/petNormalizer'

import AdoptDetailInfo from '../AdoptDetailInfo.vue'

describe('AdoptDetailInfo.vue', () => {
  it('hides good-with badges when API behavior fields are unknown', () => {
    const pet = normalizePet({
      id: 'cookie-1c87f',
      name: 'Cookie',
      species: 'cat',
      sex: 'female',
      physical: {
        breed: 'Domestic Long Hair',
        color: 'Black',
        secondaryColor: 'White',
        size: 'medium',
      },
      behavior: {
        isGoodWithKids: 'unknown',
        isGoodWithDogs: 'unknown',
        isGoodWithCats: 'unknown',
        isHouseTrained: 'unknown',
      },
    })

    const wrapper = mount(AdoptDetailInfo, {
      props: { pet },
    })

    expect(wrapper.findAll('.behavior-tag')).toHaveLength(0)
    expect(wrapper.find('.behavior-tags').exists()).toBe(false)
    expect(wrapper.find('.adopt-detail__traits').classes()).not.toContain(
      'adopt-detail__traits--bordered',
    )
    expect(wrapper.text()).not.toContain('Good with kids')
    expect(wrapper.text()).not.toContain('Good with dogs')
    expect(wrapper.text()).not.toContain('Good with cats')
  })

  it('shows positive and negative good-with badges and hides unknown traits', () => {
    const pet = normalizePet({
      id: 'pet-true',
      name: 'Clover',
      species: 'cat',
      behavior: {
        isGoodWithKids: true,
        isGoodWithDogs: false,
        isGoodWithCats: 'unknown',
      },
    })

    const wrapper = mount(AdoptDetailInfo, {
      props: { pet },
    })

    const tags = wrapper.findAll('.behavior-tag')
    expect(tags.map((tag) => tag.text())).toEqual(['Good with kids', 'Not good with dogs'])
    expect(tags[0].classes()).not.toContain('behavior-tag--negative')
    expect(tags[1].classes()).toContain('behavior-tag--negative')
    expect(wrapper.text()).not.toContain('cats')
    expect(wrapper.find('.adopt-detail__traits').classes()).toContain(
      'adopt-detail__traits--bordered',
    )
  })

  it('hides species, sex, and age capsules when showDetailCapsules is false', () => {
    const pet = normalizePet({
      id: 'snowball-hidden-capsules',
      name: 'Snowball',
      species: 'cat',
      sex: 'female',
      physical: {
        dateOfBirth: '2026-07-15',
      },
      profileSettings: {
        showDetailCapsules: false,
      },
    })

    const wrapper = mount(AdoptDetailInfo, {
      props: { pet },
    })

    expect(wrapper.find('.adopt-detail__traits').exists()).toBe(false)
    expect(wrapper.text()).toContain('Snowball')
  })

  it('shows species, sex, and age capsules when showDetailCapsules is omitted or true', () => {
    const pet = normalizePet({
      id: 'snowball-visible-capsules',
      name: 'Snowball',
      species: 'cat',
      sex: 'female',
      physical: {
        dateOfBirth: '2026-07-15',
      },
    })

    const wrapper = mount(AdoptDetailInfo, {
      props: { pet },
    })

    expect(wrapper.find('.adopt-detail__traits').exists()).toBe(true)
    expect(wrapper.text().toLowerCase()).toContain('cat')
    expect(wrapper.text().toLowerCase()).toContain('female')
  })
})
