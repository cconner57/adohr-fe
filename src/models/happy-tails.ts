export interface IHappyTail {
  id: string | number
  petName: string
  species: 'cat' | 'dog' | string
  adoptersName: string
  adoptedDate: string
  photoUrl: string
  testimonial: string
  beforePhotoUrl?: string
}
