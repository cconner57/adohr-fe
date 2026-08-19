export interface IHappyTail {
  id: string
  petName: string
  species: 'cat' | 'dog'
  adoptersName: string
  adoptedDate: string
  photoUrl: string
  testimonial: string
  beforePhotoUrl?: string
}
