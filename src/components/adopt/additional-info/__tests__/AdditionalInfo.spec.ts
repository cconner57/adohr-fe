import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { normalizePet } from '@/utils/petNormalizer'

import AdditionalInfo from '../AdditionalInfo.vue'

describe('AdditionalInfo.vue', () => {
  it('displays Litter Box Trained for cats and N/A for unknown', () => {
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
        isHouseTrained: true,
        isLitterBoxTrained: 'unknown',
      },
    })

    const wrapper = mount(AdditionalInfo, {
      props: { pet },
    })

    expect(wrapper.text()).toContain('Black & White')
    expect(wrapper.text()).toContain('Litter Box Trained')
    expect(wrapper.text()).not.toContain('House-trained')
    expect(wrapper.text()).not.toContain('Yes')
    expect(wrapper.text()).toContain('N/A')
  })

  it('displays single color cleanly and uses isLitterBoxTrained for cats', () => {
    const singleColorPet = normalizePet({
      id: 'pet-single',
      name: 'Shadow',
      species: 'cat',
      physical: {
        color: 'Black',
        secondaryColor: 'Black',
      },
      behavior: {
        isHouseTrained: true,
        isLitterBoxTrained: false,
      },
    })

    const wrapper = mount(AdditionalInfo, {
      props: { pet: singleColorPet },
    })

    expect(wrapper.text()).toContain('Black')
    expect(wrapper.text()).not.toContain('Black & Black')
    expect(wrapper.text()).toContain('Litter Box Trained')
    expect(wrapper.text()).toContain('No')
  })

  it('displays House-trained using isHouseTrained for dogs', () => {
    const dog = normalizePet({
      id: 'pet-dog',
      name: 'Buddy',
      species: 'dog',
      behavior: {
        isHouseTrained: true,
        isLitterBoxTrained: false,
      },
    })

    const wrapper = mount(AdditionalInfo, {
      props: { pet: dog },
    })

    expect(wrapper.text()).toContain('House-trained')
    expect(wrapper.text()).not.toContain('Litter Box Trained')
    expect(wrapper.text()).toContain('Yes')
  })
})
