import type { FormState } from '../../models/adopt-form'

const normalizeTypedName = (value: string | null) => {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
}

export function getAdoptionValidationErrors(
  step: number,
  formState: FormState,
  species = 'cat',
  isGeneral = false,
): string[] {
  const errors: string[] = []

  if (isGeneral) {
    if (species === 'cat' && step === -1) {
      if (!formState.generalPetName || !formState.generalPetName.trim()) {
        errors.push('Interested Pet Name')
      }
    } else if (species === 'dog' && step === 0) {
      if (!formState.generalPetName || !formState.generalPetName.trim()) {
        errors.push('Interested Pet Name')
      }
    }
  }

  if (step === 0) {
    if (!formState.firstName) errors.push('First Name')
    if (!formState.lastName) errors.push('Last Name')
    if (!formState.age) errors.push('Age')
    if (!formState.email) errors.push('Email')
    if (!formState.address) errors.push('Address')
    if (!formState.city) errors.push('City')
    if (!formState.state) errors.push('State')
    if (!formState.zip) errors.push('Zip Code')
    if (!formState.phoneNumber) errors.push('Phone Number')
    if (!formState.adultMembersAgreed) errors.push('Household Agreement')
  }

  if (step === 1) {
    if (!formState.homeType) errors.push('Home Type')
    if (!formState.homeOwnership) errors.push('Own or Rent')

    // Fields required for everyone
    if (!formState.allergies) errors.push('Allergies')
    if (!formState.primaryOwner) errors.push('Primary Owner')
    if (!formState.yearsAtAddress) errors.push('Years at Address')
    if (!formState.previousAddress) errors.push('Previous Address')
    if (!formState.expectToMove) errors.push('Expect to Move')
    if (!formState.travelPlan) errors.push('Travel Plan')
    if (formState.catAccess.length === 0) errors.push('Cat Access')
    if (!formState.catIndoorOutdoor) errors.push('Indoor/Outdoor')

    // Additional fields for Renters/Leasers
    if (formState.homeOwnership === 'Rent' || formState.homeOwnership === 'Lease') {
      if (!formState.landlordName) errors.push('Landlord Name')
      if (!formState.landlordPhoneNumber) errors.push('Landlord Phone')
      if (!formState.allowPets) errors.push('Pets Allowed')
      if (!formState.monthlyFee) errors.push('Pet Deposit/Fee')
      if (!formState.breedRestrictionsWeightLimit) errors.push('Breed Restrictions')
    }
  }

  if (step === 2) {
    if (!formState.catPreferenceBreed) errors.push('Preferred Breed')
    if (!formState.catPreferencePhysical) errors.push('Physical Preferences')
    if (!formState.catPreferencePersonality) errors.push('Personality Preferences')
    if (!formState.catPreferenceNotWant) errors.push('Traits Not Wanted')
    if (!formState.whyInterested) errors.push('Why Interested')
    if (!formState.adoptionReason) errors.push('Adoption Reason')
    if (!formState.ownCatBefore) errors.push('Owned Cat Before')
    if (!formState.ownKittenBefore) errors.push('Owned Kitten Before')
    if (!formState.alreadyHaveVeterinarian) errors.push('Veterinarian')
    if (!formState.catAllowedHomeArea) errors.push('Allowed Areas')
    if (!formState.catHomeAloneHours) errors.push('Home Alone Hours')
    if (!formState.catDisciplineType) errors.push('Discipline Type')
    if (!formState.catEscapeSteps) errors.push('Escape Plan')
  }

  if (step === 3) {
    if (!formState.currentlyHavePets) errors.push('Do you have pets?')
    if (formState.currentlyHavePets === 'Yes') {
      formState.currentPets.forEach((pet, index) => {
        if (!pet.name) errors.push(`Pet ${index + 1} Name`)
        if (!pet.speciesBreedSize) errors.push(`Pet ${index + 1} Breed/Size`)
        if (!pet.age) errors.push(`Pet ${index + 1} Age`)
        if (!pet.likesDogs) errors.push(`Pet ${index + 1} Likes Dogs`)
        if (!pet.source) errors.push(`Pet ${index + 1} Source`)
        if (!pet.spayedNeutered) errors.push(`Pet ${index + 1} Spayed/Neutered`)
      })
    }
  }

  if (step === 4) {
    if (!formState.ownPetsBefore) errors.push('Have you owned pets?')
    if (formState.ownPetsBefore === 'Yes') {
      formState.pastPets.forEach((pet, index) => {
        if (!pet.name) errors.push(`Past Pet ${index + 1} Name`)
        if (!pet.speciesBreedSize) errors.push(`Past Pet ${index + 1} Breed/Size`)
        if (!pet.age) errors.push(`Past Pet ${index + 1} Age`)
        if (!pet.source) errors.push(`Past Pet ${index + 1} Source`)
        if (!pet.spayedNeutered) errors.push(`Past Pet ${index + 1} Spayed/Neutered`)
        if (!pet.passedAwayReason) errors.push(`Past Pet ${index + 1} Outcome`)
      })
    }
  }

  if (step === 5) {
    if (!formState.bredAnimalDescription) errors.push('Bred Animals')
    if (!formState.ownedDeclawedOrDebarked) errors.push('Declawed/Debarked')
    if (!formState.movedWithPet) errors.push('Moved with Pet')
    if (!formState.ownedSpecialNeedsPet) errors.push('Special Needs Pet')
    if (!formState.mobilityDevice) errors.push('Mobility Device')
    if (!formState.foodTypeBrand) errors.push('Food Type')
    if (formState.surrenderConditions.length === 0) errors.push('Surrender Conditions')
    if (!formState.surrenderPlan) errors.push('Surrender Plan')
    if (!formState.affordVetCare) errors.push('Vet Care')
    if (!formState.affordEmergencyCost) errors.push('Emergency Cost')

    if (species === 'dog') {
      if (!formState.dogWhySelected) errors.push('Why Selected')
      if (formState.dogHeardAbout.length === 0) errors.push('Where Heard About')
      if (!formState.dogFencedBackyard) errors.push('Fenced Backyard')
      if (!formState.dogHasPool) errors.push('Has Pool')
      if (formState.dogHasPool === 'Yes' && !formState.dogPoolFence) errors.push('Pool Fence')
      if (formState.dogHouseholdDescription.length === 0) errors.push('Household Description')
      if (formState.dogKeptLocation.length === 0) errors.push('Dog Kept Location')
      if (formState.dogSleepingLocation.length === 0) errors.push('Sleeping Location')
      if (formState.dogAloneLocation.length === 0) errors.push('Alone Location')
      if (!formState.dogExercisePotty) errors.push('Exercise & Potty Breaks')
      if (!formState.dogCareResponsible) errors.push('Care Responsible Person')
      if (!formState.dogAnnualExpense) errors.push('Annual Expense')
      if (!formState.dogTravelArrangements) errors.push('Travel Arrangements')
      if (!formState.dogWillingToPottyTrain) errors.push('Willing to Potty Train')
      if (formState.dogTrainingExperience.length === 0) errors.push('Training Experience')
      if (!formState.dogWillingTrainingClass) errors.push('Willing to Take Training Class')
      if (formState.dogConfinementTypes.length === 0) errors.push('Confinement Types')
      if (!formState.dogBondingTime) errors.push('Bonding Time')
      if (!formState.dogDeniedOwnership) errors.push('Denied Pet Ownership')
    }
  }

  if (step === 6) {
    if (!formState.agreementSignature1) errors.push('Commitment Signature')
    if (!formState.agreementSignature2) errors.push('Homecheck Consent')

    const agreementSignature1 = normalizeTypedName(formState.agreementSignature1)
    const agreementSignature2 = normalizeTypedName(formState.agreementSignature2)
    if (agreementSignature1 && agreementSignature2 && agreementSignature1 !== agreementSignature2) {
      errors.push('Typed names must match')
    }

    if (!formState.signatureData) errors.push('Final Signature')
  }

  return errors
}
