import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Transparency from '../Transparency.vue'

const mockTransparencyData = {
  orgName: 'A Dream of Home Rescue',
  orgSlug: 'adohr',
  ein: '42-3096944',
  logoUrl: 'https://example.com/logo.png',
  year: 2025,
  totalSaved: 480,
  adoptedThisYear: 142,
  currentlyAvailable: 18,
  avgLengthOfStay: 14.5,
  saveRate: 98.2,
  liveReleaseRate: 98.2,
  maddiesFundSaveRate: 99.1,
  volunteerHoursThisYear: 1250.5,
  speciesBreakdown: [
    { species: 'Cat', count: 420 },
    { species: 'Dog', count: 60 },
  ],
  monthlyAdoptions: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 10 },
  ],
  sacMatrix: {
    orgId: 'adohr',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    canine: {
      beginningCount: { adult: 2, juvenile: 1, total: 3 },
      intakes: {
        stray: { adult: 5, juvenile: 0, total: 5 },
        relinquishedByOwner: { adult: 3, juvenile: 0, total: 3 },
        ownerIntendedEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        transferredIn: { adult: 2, juvenile: 0, total: 2 },
        otherLiveIntake: { adult: 0, juvenile: 0, total: 0 },
        total: { adult: 10, juvenile: 0, total: 10 },
      },
      outcomes: {
        adoption: { adult: 8, juvenile: 0, total: 8 },
        returnedToOwner: { adult: 1, juvenile: 0, total: 1 },
        transferredOut: { adult: 1, juvenile: 0, total: 1 },
        returnedToField: { adult: 0, juvenile: 0, total: 0 },
        otherLiveOutcome: { adult: 0, juvenile: 0, total: 0 },
        totalLiveOutcomes: { adult: 10, juvenile: 0, total: 10 },
        diedInCare: { adult: 0, juvenile: 0, total: 0 },
        shelterEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        ownerIntendedEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        otherOutcomes: { adult: 0, juvenile: 0, total: 0 },
        totalOtherOutcomes: { adult: 0, juvenile: 0, total: 0 },
        totalAllOutcomes: { adult: 10, juvenile: 0, total: 10 },
      },
      endingCount: { adult: 2, juvenile: 1, total: 3 },
      liveReleaseRate: 100,
      saveRate: 100,
    },
    feline: {
      beginningCount: { adult: 5, juvenile: 5, total: 10 },
      intakes: {
        stray: { adult: 20, juvenile: 60, total: 80 },
        relinquishedByOwner: { adult: 10, juvenile: 20, total: 30 },
        ownerIntendedEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        transferredIn: { adult: 10, juvenile: 10, total: 20 },
        otherLiveIntake: { adult: 0, juvenile: 0, total: 0 },
        total: { adult: 40, juvenile: 90, total: 130 },
      },
      outcomes: {
        adoption: { adult: 35, juvenile: 85, total: 120 },
        returnedToOwner: { adult: 2, juvenile: 0, total: 2 },
        transferredOut: { adult: 3, juvenile: 5, total: 8 },
        returnedToField: { adult: 0, juvenile: 0, total: 0 },
        otherLiveOutcome: { adult: 0, juvenile: 0, total: 0 },
        totalLiveOutcomes: { adult: 40, juvenile: 90, total: 130 },
        diedInCare: { adult: 0, juvenile: 1, total: 1 },
        shelterEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        ownerIntendedEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        otherOutcomes: { adult: 0, juvenile: 0, total: 0 },
        totalOtherOutcomes: { adult: 0, juvenile: 1, total: 1 },
        totalAllOutcomes: { adult: 40, juvenile: 91, total: 131 },
      },
      endingCount: { adult: 5, juvenile: 4, total: 9 },
      liveReleaseRate: 99.2,
      saveRate: 100,
    },
    other: {
      beginningCount: { adult: 0, juvenile: 0, total: 0 },
      intakes: {
        stray: { adult: 0, juvenile: 0, total: 0 },
        relinquishedByOwner: { adult: 0, juvenile: 0, total: 0 },
        ownerIntendedEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        transferredIn: { adult: 0, juvenile: 0, total: 0 },
        otherLiveIntake: { adult: 0, juvenile: 0, total: 0 },
        total: { adult: 0, juvenile: 0, total: 0 },
      },
      outcomes: {
        adoption: { adult: 0, juvenile: 0, total: 0 },
        returnedToOwner: { adult: 0, juvenile: 0, total: 0 },
        transferredOut: { adult: 0, juvenile: 0, total: 0 },
        returnedToField: { adult: 0, juvenile: 0, total: 0 },
        otherLiveOutcome: { adult: 0, juvenile: 0, total: 0 },
        totalLiveOutcomes: { adult: 0, juvenile: 0, total: 0 },
        diedInCare: { adult: 0, juvenile: 0, total: 0 },
        shelterEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        ownerIntendedEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        otherOutcomes: { adult: 0, juvenile: 0, total: 0 },
        totalOtherOutcomes: { adult: 0, juvenile: 0, total: 0 },
        totalAllOutcomes: { adult: 0, juvenile: 0, total: 0 },
      },
      endingCount: { adult: 0, juvenile: 0, total: 0 },
      liveReleaseRate: 0,
      saveRate: 0,
    },
    total: {
      beginningCount: { adult: 7, juvenile: 6, total: 13 },
      intakes: {
        stray: { adult: 25, juvenile: 60, total: 85 },
        relinquishedByOwner: { adult: 13, juvenile: 20, total: 33 },
        ownerIntendedEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        transferredIn: { adult: 12, juvenile: 10, total: 22 },
        otherLiveIntake: { adult: 0, juvenile: 0, total: 0 },
        total: { adult: 50, juvenile: 90, total: 140 },
      },
      outcomes: {
        adoption: { adult: 43, juvenile: 85, total: 128 },
        returnedToOwner: { adult: 3, juvenile: 0, total: 3 },
        transferredOut: { adult: 4, juvenile: 5, total: 9 },
        returnedToField: { adult: 0, juvenile: 0, total: 0 },
        otherLiveOutcome: { adult: 0, juvenile: 0, total: 0 },
        totalLiveOutcomes: { adult: 50, juvenile: 90, total: 140 },
        diedInCare: { adult: 0, juvenile: 1, total: 1 },
        shelterEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        ownerIntendedEuthanasia: { adult: 0, juvenile: 0, total: 0 },
        otherOutcomes: { adult: 0, juvenile: 0, total: 0 },
        totalOtherOutcomes: { adult: 0, juvenile: 1, total: 1 },
        totalAllOutcomes: { adult: 50, juvenile: 91, total: 141 },
      },
      endingCount: { adult: 7, juvenile: 5, total: 12 },
      liveReleaseRate: 99.3,
      saveRate: 100,
    },
    generatedAt: '2025-12-31T23:59:59Z',
  },
  methodology: {
    asilomarFormula: 'Live Outcomes / (Total Outcomes - Owner Intended Euthanasia) * 100',
    maddiesFundFormula: '(Total Live Intakes - Shelter Euthanasia) / Total Live Intakes * 100',
    sacFormula: 'Shelter Animals Count (SAC) Standard Live Release Rate: Live Outcomes / Total Live Intakes * 100',
    compliance: "Certified public shelter statistics conforming to Maddie's Fund Transparency guidelines and Shelter Animals Count (SAC) Core Data Matrix standards.",
  },
}

describe('Transparency.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTransparencyData),
    }))
  })

  it('renders hero title and subtitle', async () => {
    const wrapper = mount(Transparency, {
      global: {
        stubs: {
          Footer: true,
          Spinner: true,
        },
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Shelter Transparency & Annual Report')
    expect(wrapper.text()).toContain("Maddie's Fund")
    expect(wrapper.text()).toContain('Shelter Animals Count (SAC)')
  })

  it('renders KPI values for Live Release Rate and Save Rate', async () => {
    const wrapper = mount(Transparency, {
      global: {
        stubs: {
          Footer: true,
          Spinner: true,
        },
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('98.2%')
    expect(wrapper.text()).toContain('99.1%')
    expect(wrapper.text()).toContain('No-Kill Standard')
    expect(wrapper.text()).toContain('480')
    expect(wrapper.text()).toContain('142')
  })

  it('renders Maddie\'s Fund and Asilomar Accords methodology disclosure', async () => {
    const wrapper = mount(Transparency, {
      global: {
        stubs: {
          Footer: true,
          Spinner: true,
        },
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain("Methodology & Maddie's Fund Compliance")
    expect(wrapper.text()).toContain('Live Outcomes / (Total Outcomes - Owner Intended Euthanasia) * 100')
    expect(wrapper.text()).toContain('(Total Live Intakes - Shelter Euthanasia) / Total Live Intakes * 100')
  })

  it('renders Shelter Animals Count matrix table', async () => {
    const wrapper = mount(Transparency, {
      global: {
        stubs: {
          Footer: true,
          Spinner: true,
        },
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('A. Beginning Animal Census')
    expect(wrapper.text()).toContain('B. Live Intakes & Admissions')
    expect(wrapper.text()).toContain('C. Live Outcomes')
    expect(wrapper.text()).toContain('D. Other Outcomes & Euthanasia')
    expect(wrapper.text()).toContain('Ending Animal Census')
    expect(wrapper.text()).toContain('42-3096944')
  })
})
