import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SpecialNeedsBadge from '../SpecialNeedsBadge.vue'

describe('SpecialNeedsBadge.vue', () => {
  it('renders generic special needs text when no custom text is provided', () => {
    const wrapper = mount(SpecialNeedsBadge)
    expect(wrapper.text()).toContain('Special Needs')
  })

  it('renders custom text when provided', () => {
    const wrapper = mount(SpecialNeedsBadge, {
      props: {
        text: 'Daily Eye Drops',
        size: 'md',
      },
    })
    expect(wrapper.text()).toContain('Special Needs: Daily Eye Drops')
    expect(wrapper.classes()).toContain('special-needs-badge--md')
  })
})
