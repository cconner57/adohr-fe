export interface IPublicVolunteerLocation {
  id: string
  name: string
  shortName?: string
  locationType?: string
  address?: string
  isDefault?: boolean
}

export interface IVolunteerFormState {
  fax_number?: string
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  zip: string
  phoneNumber: string
  birthday: string
  age: number | null
  allergies: boolean | null
  allergiesDetails?: string
  emergencyContactName: string
  emergencyContactPhone: string
  volunteerExperience: string
  interestReason: string
  preferredLocationId: string
  preferredLocationName: string
  positionPreferences: string[]
  availability: string[]
  nameFull: string
  signatureData: string | null
  signatureDate: string
  parentName: string
  parentSignatureData: string | null
  parentSignatureDate: string
}
