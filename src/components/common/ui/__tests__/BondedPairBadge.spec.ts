import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BondedPairBadge from '../BondedPairBadge.vue'

describe('BondedPairBadge.vue', () => {
  it('renders generic bonded pair text when no partner name is provided', () => {
    const wrapper = mount(BondedPairBadge)
    expect(wrapper.text()).toContain('Bonded Pair')
  })

  it('renders partner name when provided', () => {
    const wrapper = mount(BondedPairBadge, {
      props: {
        bondedWithNames: ['Mocha', 'Chai'],
        size: 'md',
      },
    })
    expect(wrapper.text()).toContain('Bonded Pair with Mocha & Chai')
    expect(wrapper.classes()).toContain('bonded-badge--md')
  })
})
