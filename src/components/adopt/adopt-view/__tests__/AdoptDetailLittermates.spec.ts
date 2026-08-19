import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { IPet } from '@/models/common'

import AdoptDetailLittermates from '../AdoptDetailLittermates.vue'

describe('AdoptDetailLittermates.vue', () => {
  it('renders siblings correctly when pet.litter.siblings is provided', () => {
    const petWithLitter: IPet = {
      id: '5aba24642f76c4ff1747ff33a053bf84',
      name: 'Mocha',
      species: 'dog',
      sex: 'male',
      litter: {
        groupName: 'Bloom Babies',
        siblings: [
          {
            id: 'e3414e93da08b691f8bf80f216cc8d70',
            name: 'Teddy',
            photo: 'https://images.example.com/teddy.jpg',
            species: 'dog',
            sex: 'male',
            age: 'baby',
            dob: '2026-06-01',
            status: 'available',
            isMom: false,
            isDad: false,
          },
        ],
      },
    } as IPet

    const wrapper = mount(AdoptDetailLittermates, {
      props: {
        pet: petWithLitter,
      },
      global: {
        stubs: {
          PetItem: {
            props: ['id', 'name', 'photo', 'capsules', 'status'],
            template: `
              <div class="stub-pet-item">
                <span class="pet-name">{{ name }}</span>
                <span class="pet-capsules">{{ capsules?.join(', ') }}</span>
              </div>
            `,
          },
        },
      },
    })

    expect(wrapper.find('.adopt-detail__littermates').exists()).toBe(true)
    expect(wrapper.text()).toContain("Meet Mocha's Littermates")
    expect(wrapper.text()).toContain('Bloom Babies ·')
    expect(wrapper.text()).toContain('Teddy')
  })

  it('renders fallback littermates when pet.litter is absent but littermates prop is provided', () => {
    const pet: IPet = {
      id: 'pet-1',
      name: 'Bella',
      species: 'cat',
      sex: 'female',
      litterName: 'Spring Kittens',
    } as IPet

    const littermates: IPet[] = [
      {
        id: 'pet-2',
        name: 'Milo',
        species: 'cat',
        sex: 'male',
        details: { status: 'available' },
      } as IPet,
    ]

    const wrapper = mount(AdoptDetailLittermates, {
      props: {
        pet,
        littermates,
      },
      global: {
        stubs: {
          PetItem: {
            props: ['name'],
            template: '<div class="stub-pet-item">{{ name }}</div>',
          },
        },
      },
    })

    expect(wrapper.find('.adopt-detail__littermates').exists()).toBe(true)
    expect(wrapper.text()).toContain("Meet Bella's Littermates")
    expect(wrapper.text()).toContain('Milo')
  })

  it('does not render when there are no siblings or littermates', () => {
    const pet: IPet = {
      id: 'pet-1',
      name: 'Bella',
      species: 'cat',
      sex: 'female',
    } as IPet

    const wrapper = mount(AdoptDetailLittermates, {
      props: {
        pet,
      },
    })

    expect(wrapper.find('.adopt-detail__littermates').exists()).toBe(false)
  })
})
