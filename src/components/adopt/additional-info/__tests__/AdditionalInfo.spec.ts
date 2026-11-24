import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { normalizePet } from '@/utils/petNormalizer'

import AdditionalInfo from '../AdditionalInfo.vue'

describe('AdditionalInfo.vue', () => {
  it('displays combined primary & secondary colors and renders N/A for unknown house-trained', () => {
    const pet = normalizePet({
      id: 'cookie-1c87f',
      name: 'Cookie',
      species: 'cat',
      physical: {
        breed: 'Domestic Long Hair',
        color: 'Black',
        secondaryColor: 'White',
        size: 'medium',
      },
      behavior: {
        isHouseTrained: 'unknown',
      },
    })

    const wrapper = mount(AdditionalInfo, {
      props: { pet },
    })

    expect(wrapper.text()).toContain('Black & White')
    expect(wrapper.text()).not.toContain('Yes')
    expect(wrapper.text()).toContain('N/A')
  })

  it('displays single color cleanly when secondaryColor is missing or matches primary color', () => {
    const singleColorPet = normalizePet({
      id: 'pet-single',
      name: 'Shadow',
      species: 'cat',
      physical: {
        color: 'Black',
        secondaryColor: 'Black',
      },
      behavior: {
        isHouseTrained: false,
      },
    })

    const wrapper = mount(AdditionalInfo, {
      props: { pet: singleColorPet },
    })

    expect(wrapper.text()).toContain('Black')
    expect(wrapper.text()).not.toContain('Black & Black')
    expect(wrapper.text()).toContain('No')
  })
})
