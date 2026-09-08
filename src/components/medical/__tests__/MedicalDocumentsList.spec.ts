import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { IMedicalDocument } from '@/models/common'

import MedicalDocumentsList from '../MedicalDocumentsList.vue'

describe('MedicalDocumentsList.vue', () => {
  const mockDocuments: IMedicalDocument[] = [
    {
      id: 'doc-1',
      title: 'Luna Rabies Certificate',
      category: 'vaccination',
      fileName: 'luna_rabies.pdf',
      fileUrl: '#',
      fileSizeBytes: 245000,
      uploadedAt: '2025-01-15T10:00:00Z',
      veterinarian: 'Dr. Jenkins',
      notes: '1-Year Rabies Vaccine',
    },
    {
      id: 'doc-2',
      title: 'Luna Spay Certificate',
      category: 'spay_neuter',
      fileName: 'luna_spay.pdf',
      fileUrl: '#',
      fileSizeBytes: 312000,
      uploadedAt: '2025-01-10T10:00:00Z',
    },
  ]

  it('renders document cards with title, category, and download buttons', () => {
    const wrapper = mount(MedicalDocumentsList, {
      props: {
        documents: mockDocuments,
        petName: 'Luna',
      },
    })

    expect(wrapper.text()).toContain('Official Medical Documents & PDFs')
    expect(wrapper.text()).toContain('Luna Rabies Certificate')
    expect(wrapper.text()).toContain('Luna Spay Certificate')
    expect(wrapper.text()).toContain('2 Documents')

    const downloadButtons = wrapper.findAllComponents({ name: 'Button' })
    expect(downloadButtons).toHaveLength(2)
  })

  it('renders empty state when no documents are provided', () => {
    const wrapper = mount(MedicalDocumentsList, {
      props: {
        documents: [],
        petName: 'Luna',
      },
    })

    expect(wrapper.text()).toContain('No Attached PDF Records Yet')
  })
})
