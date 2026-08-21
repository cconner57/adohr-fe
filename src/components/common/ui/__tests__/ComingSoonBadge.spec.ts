import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ComingSoonBadge from '../ComingSoonBadge.vue'

describe('ComingSoonBadge.vue', () => {
  it('renders coming soon text with correct class', () => {
    const wrapper = mount(ComingSoonBadge, {
      props: { size: 'sm' },
    })
    expect(wrapper.text()).toContain('Coming Soon')
    expect(wrapper.classes()).toContain('coming-soon-badge--sm')
  })
})
