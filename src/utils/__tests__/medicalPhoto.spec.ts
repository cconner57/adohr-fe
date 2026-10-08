import { describe, expect, it } from 'vitest'

import { resolvePetPhotoCandidates } from '@/utils/medicalParser'

describe('resolvePetPhotoCandidates', () => {
  const r2Base = 'https://pub-768b3a497dc648f2895152092bf57934.r2.dev'

  it('returns empty array when portalData is null or empty', () => {
    expect(resolvePetPhotoCandidates(null)).toEqual([])
    expect(resolvePetPhotoCandidates({})).toEqual([])
  })

  it('normalizes relative pet photo keys by stripping pets/ prefix and prepending public R2 URL', () => {
    const data = {
      photoUrl: 'pets/marshal-id/photos/marshal_large.jpg',
    }
    const candidates = resolvePetPhotoCandidates(data, r2Base)
    expect(candidates).toContain(`${r2Base}/marshal-id/photos/marshal_large.jpg`)
    expect(candidates).toContain(`${r2Base}/pets/marshal-id/photos/marshal_large.jpg`)
  })

  it('maps api.adoption-os.com photo URLs to public R2 storage', () => {
    const data = {
      photoUrl: 'https://api.adoption-os.com/pets/marshal-id/photos/marshal_large.jpg',
    }
    const candidates = resolvePetPhotoCandidates(data, r2Base)
    expect(candidates[0]).toBe(`${r2Base}/marshal-id/photos/marshal_large.jpg`)
    expect(candidates).toContain(`${r2Base}/pets/marshal-id/photos/marshal_large.jpg`)
    expect(candidates).toContain('https://api.adoption-os.com/pets/marshal-id/photos/marshal_large.jpg')
  })

  it('normalizes .r2.dev/pets/ URLs by stripping pets/ prefix', () => {
    const data = {
      photoUrl: `${r2Base}/pets/marshal-id/photos/marshal_large.jpg`,
    }
    const candidates = resolvePetPhotoCandidates(data, r2Base)
    expect(candidates).toContain(`${r2Base}/marshal-id/photos/marshal_large.jpg`)
  })

  it('extracts primary and array photos from data.photos', () => {
    const data = {
      photos: [
        { url: 'pets/marshal-id/photos/marshal_1.jpg', isPrimary: true },
        { url: 'pets/marshal-id/photos/marshal_2.jpg', isPrimary: false },
      ],
    }
    const candidates = resolvePetPhotoCandidates(data, r2Base)
    expect(candidates).toContain(`${r2Base}/marshal-id/photos/marshal_1.jpg`)
    expect(candidates).toContain(`${r2Base}/marshal-id/photos/marshal_2.jpg`)
  })

  it('falls back to family photo if no pet photo exists', () => {
    const data = {
      adoption: {
        familyPhotoUrl: 'https://api.adoption-os.com/pets/marshal/adoption/family.jpg',
      },
    }
    const candidates = resolvePetPhotoCandidates(data, r2Base)
    expect(candidates).toContain(`${r2Base}/marshal/adoption/family.jpg`)
  })
})
