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
    expect(dockBadges[0].classes()).toContain('is-standalone')
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

    // Sponsored badge moves to bottom dock as standalone full-text pill
    const dockBadges = wrapper.findAll('.bottom-badge-dock .dock-badge')
    expect(dockBadges.length).toBe(1)
    expect(dockBadges[0].classes()).toContain('is-standalone')
    expect(dockBadges[0].text()).toContain('Sponsored')
  })

  it('renders single special needs badge as standalone full text pill', () => {
    const wrapper = mount(PetPhotoBadges, {
      props: {
        isAttendingWeekend: true,
        attendingDaysText: 'Sat & Sun',
        isSpecialNeeds: true,
      },
    })

    const dockBadges = wrapper.findAll('.bottom-badge-dock .dock-badge')
    expect(dockBadges.length).toBe(1)
    expect(dockBadges[0].classes()).toContain('is-standalone')
    expect(dockBadges[0].classes()).not.toContain('is-expanded')
    expect(dockBadges[0].text()).toContain('Special Needs')
  })

  it('renders circular icons and toggles expansion state when multiple dock badges exist', async () => {
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

    // Initial state: not standalone, not expanded
    expect(dockBadges[0].classes()).not.toContain('is-standalone')
    expect(dockBadges[1].classes()).not.toContain('is-standalone')
    expect(dockBadges[0].classes()).not.toContain('is-expanded')

    // Click to expand
    await dockBadges[0].trigger('click')
    expect(dockBadges[0].classes()).toContain('is-expanded')

    // Click again to collapse
    await dockBadges[0].trigger('click')
    expect(dockBadges[0].classes()).not.toContain('is-expanded')
  })

  it('does not toggle expansion on click when dock badge is single standalone', async () => {
    const wrapper = mount(PetPhotoBadges, {
      props: {
        isAttendingWeekend: true,
        attendingDaysText: 'Sat & Sun',
        isSponsored: true,
      },
    })

    const dockBadges = wrapper.findAll('.bottom-badge-dock .dock-badge')
    expect(dockBadges.length).toBe(1)
    expect(dockBadges[0].classes()).toContain('is-standalone')

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
    const dockBadges = wrapper.findAll('.bottom-badge-dock .dock-badge')
    expect(dockBadges.length).toBe(1)
    expect(dockBadges[0].classes()).toContain('is-standalone')
  })
})
