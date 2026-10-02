import type { ISurrenderFormState } from '../../models/surrender-form'

interface SurrenderValidationContext {
  step: number
  selectedAnimal: 'dog' | 'cat' | null
  formState: ISurrenderFormState
}

function hasValue(val: unknown): boolean {
  if (val === null || val === undefined) return false
  if (typeof val === 'string') return val.trim().length > 0
  if (Array.isArray(val)) return val.length > 0
  return Boolean(val)
}

function getStep0Errors(selectedAnimal: 'dog' | 'cat' | null): string[] {
  if (!selectedAnimal) return ['Animal Type (Dog or Cat)']
  return []
}

function getStep1Errors(formState: ISurrenderFormState): string[] {
  const errors: string[] = []

  if (!hasValue(formState.firstName)) errors.push('First Name')
  if (!hasValue(formState.lastName)) errors.push('Last Name')
  if (!formState.phoneNumber || String(formState.phoneNumber).trim().length < 10)
    errors.push('Phone Number')
  if (
    !formState.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formState.email).trim())
  )
    errors.push('Valid Email')
  if (!hasValue(formState.streetAddress)) errors.push('Street Address')
  if (!hasValue(formState.city)) errors.push('City')
  if (!hasValue(formState.state)) errors.push('State')
  if (!formState.zipCode || String(formState.zipCode).trim().length < 5)
    errors.push('Valid Zip Code')
  if (!hasValue(formState.whenToSurrenderAnimal))
    errors.push('When do you need to surrender your animal')
  if (!hasValue(formState.animalName)) errors.push("Animal's Name")
  if (!hasValue(formState.animalAge)) errors.push('Age')
  if (!hasValue(formState.animalSex)) errors.push('Sex')
  if (!hasValue(formState.animalOwnershipDuration))
    errors.push('How long have you had your animal?')
  if (!hasValue(formState.animalLocationFound))
    errors.push('Where did you get your animal?')
  if (!hasValue(formState.animalWhySurrendered))
    errors.push('Why are you surrendering your animal?')
  if (!hasValue(formState.otherPetsInHousehold))
    errors.push('Other pets in household')

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

  if (!hasValue(formState.animalsReactionToNewPeople))
    errors.push('Reaction to unfamiliar people')
  if (!hasValue(formState.animalHouseTrained)) errors.push('Housetrained status')
  if (!hasValue(formState.animalSpendMajorityOfTime))
    errors.push('Majority of time location')
  if (!hasValue(formState.animalLeftAloneDuration))
    errors.push('Hours left alone without human')
  if (!hasValue(formState.animalWhenLeftAlone))
    errors.push('Confinement when left alone')
  if (!hasValue(formState.animalLeftAloneBehaviors))
    errors.push('Behaviors when left alone')
  if (!hasValue(formState.animalHowItPlays)) errors.push('Play behavior')
  if (!hasValue(formState.animalToysItLikes)) errors.push('Favorite toys')
  if (!hasValue(formState.animalGamesItLikes)) errors.push('Favorite games')
  if (!hasValue(formState.animalSleepAtNight))
    errors.push('Sleeping location overnight')
  if (!hasValue(formState.animalProblemsRidingInCar))
    errors.push('Riding in cars status')

  if (
    formState.animalScaredOfAnything === 'Yes' &&
    !hasValue(formState.animalScaredOfAnythingExplanation)
  ) {
    errors.push('Fear explanation')
  }
  if (
    formState.animalProblemsRidingInCar === 'Yes' &&
    !hasValue(formState.animalProblemsRidingInCarExplanation)
  ) {
    errors.push('Car ride problems explanation')
  }
  if (
    formState.animalEscapedBefore === 'Yes' &&
    !hasValue(formState.animalEscapedBeforeExplanation)
  ) {
    errors.push('Escape history explanation')
  }

  return errors
}

function getStep3Errors(formState: ISurrenderFormState): string[] {
  const errors: string[] = []

  if (
    formState.animalEverAttackedPeople === 'Yes' &&
    !hasValue(formState.animalEverAttackedPeopleExplanation)
  ) {
    errors.push('Person attack explanation')
  }
  if (
    formState.animalEverAttackedOtherCats === 'Yes' &&
    !hasValue(formState.animalEverAttackedOtherCatsExplanation)
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
    !hasValue(formState.animalMicrochippedExplanation)
  ) {
    errors.push('Microchip details')
  }
  if (
    formState.animalPastOrPresentHealthProblems === 'Yes' &&
    !hasValue(formState.animalPastOrPresentHealthProblemsExplanation)
  ) {
    errors.push('Health problems explanation')
  }
  if (
    formState.animalCurrentMedications === 'Yes' &&
    !hasValue(formState.animalCurrentMedicationsExplanation)
  ) {
    errors.push('Medication details')
  }

  return errors
}

function getStep5Errors(formState: ISurrenderFormState): string[] {
  const errors: string[] = []

  if (!hasValue(formState.animalTypeOfFood)) errors.push('Type of food')
  if (!hasValue(formState.animalEatingFrequency)) errors.push('Feeding frequency')
  if (!hasValue(formState.animalAmountOfFood))
    errors.push('Amount of food per feeding')
  if (
    formState.animalFoodTreats === 'Yes' &&
    !hasValue(formState.animalFoodTreatsExplanation)
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
