import type { ISurrenderFormState } from '../../models/surrender-form'

interface SurrenderValidationContext {
  step: number
  selectedAnimal: 'dog' | 'cat' | null
  formState: ISurrenderFormState
}

function getStep0Errors(selectedAnimal: 'dog' | 'cat' | null): string[] {
  if (!selectedAnimal) return ['Animal Type (Dog or Cat)']
  return []
}

function getStep1Errors(formState: ISurrenderFormState): string[] {
  const errors: string[] = []

  if (!formState.firstName?.trim()) errors.push('First Name')
  if (!formState.lastName?.trim()) errors.push('Last Name')
  if (!formState.phoneNumber?.trim() || formState.phoneNumber.length < 10) errors.push('Phone Number')
  if (!formState.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim()))
    errors.push('Valid Email')
  if (!formState.streetAddress?.trim()) errors.push('Street Address')
  if (!formState.city?.trim()) errors.push('City')
  if (!formState.state?.trim()) errors.push('State')
  if (!formState.zipCode?.trim() || formState.zipCode.length < 5) errors.push('Valid Zip Code')
  if (!formState.whenToSurrenderAnimal?.trim()) errors.push('When do you need to surrender your animal')
  if (!formState.animalName?.trim()) errors.push("Animal's Name")
  if (!formState.animalAge?.trim()) errors.push('Age')
  if (!formState.animalSex?.trim()) errors.push('Sex')
  if (!formState.animalOwnershipDuration?.trim()) errors.push('How long have you had your animal?')
  if (!formState.animalLocationFound?.trim()) errors.push('Where did you get your animal?')
  if (!formState.animalWhySurrendered?.trim()) errors.push('Why are you surrendering your animal?')
  if (!formState.otherPetsInHousehold?.trim()) errors.push('Other pets in household')

  let hasAgeError = false
  let hasQtyError = false
  formState.householdMembers.forEach((member) => {
    if (!member.age) hasAgeError = true
    if (!member.count || member.count < 1) hasQtyError = true
  })
  if (hasAgeError) errors.push('Household - Age')
  if (hasQtyError) errors.push('Household - Quantity')

  return errors
}

function getStep2Errors(formState: ISurrenderFormState): string[] {
  const errors: string[] = []

  if (!formState.animalsReactionToNewPeople?.trim()) errors.push('Reaction to unfamiliar people')
  if (!formState.animalHouseTrained?.trim()) errors.push('Housetrained status')
  if (!formState.animalSpendMajorityOfTime?.trim()) errors.push('Majority of time location')
  if (!formState.animalLeftAloneDuration?.trim()) errors.push('Hours left alone without human')
  if (!formState.animalWhenLeftAlone?.trim()) errors.push('Confinement when left alone')
  if (!formState.animalLeftAloneBehaviors?.trim()) errors.push('Behaviors when left alone')
  if (!formState.animalHowItPlays?.trim()) errors.push('Play behavior')
  if (!formState.animalToysItLikes?.trim()) errors.push('Favorite toys')
  if (!formState.animalGamesItLikes?.trim()) errors.push('Favorite games')
  if (!formState.animalSleepAtNight?.trim()) errors.push('Sleeping location overnight')
  if (!formState.animalProblemsRidingInCar?.trim()) errors.push('Riding in cars status')

  if (
    formState.animalScaredOfAnything === 'Yes' &&
    !formState.animalScaredOfAnythingExplanation?.trim()
  ) {
    errors.push('Fear explanation')
  }
  if (
    formState.animalProblemsRidingInCar === 'Yes' &&
    !formState.animalProblemsRidingInCarExplanation?.trim()
  ) {
    errors.push('Car ride problems explanation')
  }
  if (
    formState.animalEscapedBefore === 'Yes' &&
    !formState.animalEscapedBeforeExplanation?.trim()
  ) {
    errors.push('Escape history explanation')
  }

  return errors
}

function getStep3Errors(formState: ISurrenderFormState): string[] {
  const errors: string[] = []

  if (
    formState.animalEverAttackedPeople === 'Yes' &&
    !formState.animalEverAttackedPeopleExplanation?.trim()
  ) {
    errors.push('Person attack explanation')
  }
  if (
    formState.animalEverAttackedOtherCats === 'Yes' &&
    !formState.animalEverAttackedOtherCatsExplanation?.trim()
  ) {
    errors.push('Animal attack explanation')
  }

  return errors
}

function getStep4Errors(
  formState: ISurrenderFormState,
  selectedAnimal: 'dog' | 'cat' | null,
): string[] {
  if (selectedAnimal !== 'cat') return []
  const errors: string[] = []

  if (
    formState.animalMicrochipped === 'Yes' &&
    !formState.animalMicrochippedExplanation?.trim()
  ) {
    errors.push('Microchip details')
  }
  if (
    formState.animalPastOrPresentHealthProblems === 'Yes' &&
    !formState.animalPastOrPresentHealthProblemsExplanation?.trim()
  ) {
    errors.push('Health problems explanation')
  }
  if (
    formState.animalCurrentMedications === 'Yes' &&
    !formState.animalCurrentMedicationsExplanation?.trim()
  ) {
    errors.push('Medication details')
  }

  return errors
}

function getStep5Errors(formState: ISurrenderFormState): string[] {
  const errors: string[] = []

  if (!formState.animalTypeOfFood?.trim()) errors.push('Type of food')
  if (!formState.animalEatingFrequency?.trim()) errors.push('Feeding frequency')
  if (!formState.animalAmountOfFood?.trim()) errors.push('Amount of food per feeding')
  if (
    formState.animalFoodTreats === 'Yes' &&
    !formState.animalFoodTreatsExplanation?.trim()
  ) {
    errors.push('Treat details')
  }

  return errors
}

function getStep6Errors(formState: ISurrenderFormState): string[] {
  const errors: string[] = []

  if (!formState.fullBodyPhotoOfAnimal) {
    errors.push('Full body photo of pet')
  }

  return errors
}

export function getSurrenderValidationErrors(context: SurrenderValidationContext): string[] {
  if (context.step === 0) return getStep0Errors(context.selectedAnimal)
  if (context.step === 1) return getStep1Errors(context.formState)
  if (context.step === 2) return getStep2Errors(context.formState)
  if (context.step === 3) return getStep3Errors(context.formState)
  if (context.step === 4) return getStep4Errors(context.formState, context.selectedAnimal)
  if (context.step === 5) return getStep5Errors(context.formState)
  if (context.step === 6) return getStep6Errors(context.formState)
  return []
}
