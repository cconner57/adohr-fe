import type { IVolunteerFormState } from '../../models/volunteer-form'

function calculateAge(birthday: string): number | null {
  let birthDate: Date
  if (birthday.includes('-')) {
    birthDate = new Date(`${birthday}T00:00:00`)
  } else {
    birthDate = new Date(birthday)
  }

  if (Number.isNaN(birthDate.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function getVolunteerValidationErrors(formState: IVolunteerFormState): string[] {
  const errors: string[] = []

  if (!formState.firstName) errors.push('First Name')
  if (!formState.lastName) errors.push('Last Name')
  if (!formState.email) errors.push('Email')
  if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email))
    errors.push('Valid Email')
  if (!formState.address) errors.push('Address')
  if (!formState.city) errors.push('City')
  if (!formState.zip) errors.push('Zip Code')
  if (!formState.phoneNumber) errors.push('Phone Number')
  if (!formState.birthday) errors.push('Birthday')

  let derivedAge: number | null = null
  if (formState.birthday) {
    derivedAge = calculateAge(formState.birthday)
  }

  if (!formState.emergencyContactName) errors.push('Emergency Contact Name')
  if (!formState.emergencyContactPhone) errors.push('Emergency Contact Phone')
  if (!formState.interestReason) errors.push('Interest Reason')
  if (!formState.preferredLocationId?.trim()) errors.push('Preferred Location')
  if (formState.positionPreferences.length === 0) errors.push('Position Preferences')
  if (formState.availability.length === 0) errors.push('Availability')
  if (!formState.nameFull) errors.push('Agreement Name')
  if (!formState.signatureDate) errors.push('Agreement Date')
  if (!formState.signatureData) errors.push('Signature')

  if (derivedAge !== null && derivedAge < 21) {
    if (!formState.parentName) errors.push('Parent Name')
    if (!formState.parentSignatureDate) errors.push('Parent Date')
    if (!formState.parentSignatureData) errors.push('Parent Signature')
  }

  return errors
}
