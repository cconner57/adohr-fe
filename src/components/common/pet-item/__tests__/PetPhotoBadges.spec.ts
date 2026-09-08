import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PetPhotoBadges from '../PetPhotoBadges.vue'

describe('PetPhotoBadges.vue', () => {
  it('renders event attendance as the single top badge when attending weekend', () => {
    const wrapper = mount(PetPhotoBadges, {
      props: {
        isAttendingWeekend: true,
        attendingDaysText: 'Sat & Sun',
        attendingLocationText: 'PetSmart - Pasadena',
        isSponsored: true,
      },
    })

    const topBadge = wrapper.find('.badge-stack .weekend-badge')
    expect(topBadge.exists()).toBe(true)
    expect(topBadge.text()).toContain('Sat & Sun')
    expect(topBadge.text()).toContain('PetSmart - Pasadena')

    // Sponsored badge should go to bottom dock since weekend attendance is top
    const dockBadges = wrapper.findAll('.bottom-badge-dock .dock-badge')
    expect(dockBadges.length).toBe(1)
    expect(dockBadges[0].text()).toContain('Sponsored')
  })

  it('renders status badge as the single top badge when not attending weekend', () => {
    const wrapper = mount(PetPhotoBadges, {
      props: {
        isAttendingWeekend: false,
        status: 'intake',
        isSponsored: true,
      },
    })

    const topChip = wrapper.find('.badge-stack .top-chip-badge')
    expect(topChip.exists()).toBe(true)
    expect(topChip.text()).toContain('Coming Soon')

    // Sponsored badge moves to bottom dock
    const dockBadges = wrapper.findAll('.bottom-badge-dock .dock-badge')
    expect(dockBadges.length).toBe(1)
    expect(dockBadges[0].text()).toContain('Sponsored')
  })

  it('toggles expansion state when a dock badge is clicked', async () => {
    const wrapper = mount(PetPhotoBadges, {
      props: {
        isAttendingWeekend: true,
        attendingDaysText: 'Sunday Only',
        isSponsored: true,
        isSpecialNeeds: true,
      },
    })

    const dockBadges = wrapper.findAll('.bottom-badge-dock .dock-badge')
    expect(dockBadges.length).toBe(2)

    // Initial state: not expanded
    expect(dockBadges[0].classes()).not.toContain('is-expanded')

    // Click to expand
    await dockBadges[0].trigger('click')
    expect(dockBadges[0].classes()).toContain('is-expanded')

    // Click again to collapse
    await dockBadges[0].trigger('click')
    expect(dockBadges[0].classes()).not.toContain('is-expanded')
  })

  it('renders bonded pair badge in bottom dock when isBonded is true', () => {
    const wrapper = mount(PetPhotoBadges, {
      props: {
        isAttendingWeekend: true,
        attendingDaysText: 'Sat & Sun',
        isBonded: true,
        bondedWithNames: ['Carlo', 'Milo'],
      },
    })

    const dock = wrapper.find('.bottom-badge-dock')
    expect(dock.exists()).toBe(true)
    expect(dock.text()).toContain('Bonded with Carlo & Milo')
  })
})
