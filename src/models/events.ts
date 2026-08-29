export type AdoptionEventType =
  | 'Adoption Event'
  | 'adoption-event'
  | 'adoption_event'
  | 'Adoption'
  | string

export interface IEventRepeatRule {
  type?: 'weekly' | 'biweekly' | 'monthly' | string
  every?: number
  period?: string
  endType?: 'never' | 'date' | 'count' | string
  endDate?: string
  endAfter?: number
}

export interface IAttendingPetSummary {
  id: string
  name: string
  species?: string
  sex?: string
  breed?: string
  status?: string
  primaryPhoto?: string
  photos?: string[]
  [key: string]: unknown
}

export interface IVetPetSummary {
  id: string
  name: string
}

export interface IPublicAdoptionEvent {
  id: string
  orgId?: string
  title: string
  type?: string // e.g. "adoption-event"
  eventType?: AdoptionEventType
  startDate: string // ISO 8601 string or Date string (e.g. "2026-08-08")
  startTime?: string // e.g. "12:00"
  endDate?: string // ISO 8601 string or Date string (e.g. "2026-08-08")
  endTime?: string // e.g. "16:00"
  allDay?: boolean
  location?: string // e.g. "PetSmart Pasadena, 3347 E Foothill Blvd"
  locationName?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  googleMapsUrl?: string
  description?: string
  repeat?: IEventRepeatRule
  repeats?: string
  recurrenceText?: string
  visibility?: string
  status?: 'scheduled' | 'cancelled' | 'in-progress' | 'completed' | string

  // Attending pets
  attendingPetIds?: string[]
  attendingPets?: IAttendingPetSummary[]
  vetPets?: IVetPetSummary[]
}

export interface IPublicEventsApiResponse {
  events: IPublicAdoptionEvent[]
}
