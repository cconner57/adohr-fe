export interface IHappyTail {
  id: string | number
  orgId?: string
  petName: string
  species: 'cat' | 'dog' | 'other' | string
  adopterName?: string
  adoptersName: string
  story?: string
  testimonial: string
  photoUrl: string
  beforePhotoUrl?: string
  adoptionDate?: string
  adoptedDate: string
  status?: 'pending' | 'published' | 'approved' | 'rejected'
  isFeatured?: boolean
  publishedAt?: string
  submittedAt?: string
}

export interface IHappyTailSubmission {
  petName: string
  species: 'cat' | 'dog' | 'other' | string
  adopterName: string
  adopterEmail?: string
  story: string
  photoFile?: File | null
  photoUrl?: string
  adoptionYear?: string
}
