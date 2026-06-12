import { describe, expect, it } from 'vitest'

import { parseApiErrorMessage, withPublicOrgId } from './api'

describe('parseApiErrorMessage', () => {
  it('prefers userMessage when present', () => {
    expect(
      parseApiErrorMessage(
        {
          userMessage: 'Friendly message',
          error: { message: 'Nested message' },
        },
        'Fallback message',
      ),
    ).toBe('Friendly message')
  })

  it('falls back to nested error.message when userMessage is missing', () => {
    expect(
      parseApiErrorMessage(
        {
          error: { message: 'Nested message' },
        },
        'Fallback message',
      ),
    ).toBe('Nested message')
  })

  it('returns the fallback when the payload does not contain a message', () => {
    expect(parseApiErrorMessage({ error: { code: 'VALIDATION_ERROR' } }, 'Fallback message')).toBe(
      'Fallback message',
    )
  })
})

describe('withPublicOrgId', () => {
  it('appends the default orgId when missing', () => {
    expect(withPublicOrgId('/applications/inquiry')).toBe('/applications/inquiry?orgId=idohr')
  })

  it('preserves an existing orgId query parameter', () => {
    expect(withPublicOrgId('/applications/inquiry?orgId=custom-org')).toBe(
      '/applications/inquiry?orgId=custom-org',
    )
  })

  it('preserves absolute urls while appending orgId', () => {
    expect(withPublicOrgId('https://api.example.com/applications/inquiry?source=request')).toBe(
      'https://api.example.com/applications/inquiry?source=request&orgId=idohr',
    )
  })
})
