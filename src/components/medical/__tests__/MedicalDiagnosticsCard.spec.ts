import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { IDiagnosticTestResult } from '@/utils/medicalParser'

import MedicalDiagnosticsCard from '../MedicalDiagnosticsCard.vue'

describe('MedicalDiagnosticsCard.vue', () => {
  const mockDiagnostics: IDiagnosticTestResult[] = [
    {
      name: 'FIV Test (Feline Immunodeficiency Virus)',
      result: 'Negative',
      date: 'Sep 13, 2026',
      isPositive: false,
      isNegative: true,
    },
    {
      name: 'FeLV Test (Feline Leukemia Virus)',
      result: 'Negative',
      date: 'Sep 13, 2026',
      isPositive: false,
      isNegative: true,
    },
  ]

  it('renders diagnostic tests with dates and results', () => {
    const wrapper = mount(MedicalDiagnosticsCard, {
      props: {
        diagnostics: mockDiagnostics,
        petName: 'Marshal',
      },
    })

    expect(wrapper.text()).toContain('Diagnostic Lab & Disease Screening')
    expect(wrapper.text()).toContain('Marshal')
    expect(wrapper.text()).toContain('FIV Test (Feline Immunodeficiency Virus)')
    expect(wrapper.text()).toContain('FeLV Test (Feline Leukemia Virus)')
    expect(wrapper.text()).toContain('Tested: Sep 13, 2026')
    expect(wrapper.text()).toContain('Negative')
  })

  it('renders nothing when diagnostics list is empty', () => {
    const wrapper = mount(MedicalDiagnosticsCard, {
      props: {
        diagnostics: [],
        petName: 'Marshal',
      },
    })

    expect(wrapper.find('.diagnostics-card').exists()).toBe(false)
  })

  it('applies positive classes when a test is positive', () => {
    const positiveDiag: IDiagnosticTestResult[] = [
      {
        name: 'Heartworm Screening Test',
        result: 'Positive',
        date: 'Aug 10, 2026',
        isPositive: true,
        isNegative: false,
      },
    ]

    const wrapper = mount(MedicalDiagnosticsCard, {
      props: {
        diagnostics: positiveDiag,
        petName: 'Rex',
      },
    })

    expect(wrapper.find('.test-item.positive').exists()).toBe(true)
    expect(wrapper.find('.result-badge.pos').exists()).toBe(true)
  })
})
