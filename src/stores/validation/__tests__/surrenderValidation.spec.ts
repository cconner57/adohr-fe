import { describe, expect, it } from 'vitest'

import type { ISurrenderFormState } from '../../../models/surrender-form'
import { getSurrenderValidationErrors } from '../surrenderValidation'

const createMockSurrenderFormState = (
  overrides: Partial<ISurrenderFormState> = {},
): ISurrenderFormState => ({
  fax_number: '',
  firstName: 'Jane',
  lastName: 'Doe',
  phoneNumber: '555-234-5678',
  email: 'jane@example.com',
  streetAddress: '123 Main St',
  city: 'Austin',
  state: 'TX',
  zipCode: '78701',
  whenToSurrenderAnimal: 'Immediately',
  animalName: 'Barnaby',
  animalSpecies: 'cat',
  animalBreed: 'Domestic Shorthair',
  animalSex: 'Male',
  animalAge: '3 years',
  animalOwnershipDuration: '2 years',
  animalLocationFound: 'Shelter',
  animalWhySurrendered: 'Moving',
  householdMembers: [{ age: '30', gender: 'Female', count: 1 }],
  otherPetsInHousehold: 'None',
  animalsBehaviorTowardsKnownPeople: '',
  animalsBehaviorTowardsStrangers: '',
  animalsBehaviorTowardsKnownAnimals: '',
  commentsOnBehavior: '',
  animalsReactionToNewPeople: 'Friendly',
  animalHouseTrained: 'Yes',
  animalSpendMajorityOfTime: 'Inside',
  animalLeftAloneDuration: '1-3 hours',
  animalWhenLeftAlone: 'Free roam',
  animalLeftAloneBehaviors: 'None',
  animalHowItPlays: 'Gentle',
  animalToysItLikes: 'Balls',
  animalGamesItLikes: 'Chase',
  animalScaredOfAnything: 'No',
  animalScaredOfAnythingExplanation: '',
  animalBadHabits: '',
  animalAllowedOnFurniture: 'No',
  animalSleepAtNight: 'Floor',
  animalBehaviorFoodOthers: '',
  animalBehaviorToysOthers: '',
  animalProblemsRidingInCar: 'No',
  animalProblemsRidingInCarExplanation: '',
  animalEscapedBefore: 'No',
  animalEscapedBeforeExplanation: '',
  animalEverAttackedPeople: 'No',
  animalEverAttackedPeopleExplanation: '',
  animalEverAttackedOtherCats: 'No',
  animalEverAttackedOtherCatsExplanation: '',
  animalEverAttackedOtherDogs: 'No',
  animalEverAttackedOtherDogsExplanation: '',
  animalVeterinarianList: '',
  animalVeterinarianYearlyVisits: 'No',
  animalSpayedNeutered: 'Yes',
  animalVaccinationHistory: '',
  animalVaccinationsCurrent: 'Yes',
  animalTestedHeartworm: 'No',
  animalTestedHeartwormExplanation: '',
  animalHeartwormPrevention: 'No',
  animalHeartwormPreventionExplanation: '',
  animalMicrochipped: 'No',
  animalMicrochippedExplanation: '',
  animalVetOrGroomerBehavior: '',
  animalVetMuzzled: 'No',
  animalPastOrPresentHealthProblems: 'No',
  animalPastOrPresentHealthProblemsExplanation: '',
  animalCurrentMedications: 'No',
  animalCurrentMedicationsExplanation: '',
  animalTypeOfFood: 'Dry',
  animalEatingFrequency: '2 times',
  animalAmountOfFood: '1 cup',
  animalFoodTreats: 'No',
  animalFoodTreatsExplanation: '',
  additionalInformation: '',
  fullBodyPhotoOfAnimal: 'photo.jpg',
  closeUpPhotoOfAnimalFace: '',
  copiesOfRecords: '',
  ...overrides,
})

describe('surrenderValidation', () => {
  it('safely handles array values without throwing TypeError', () => {
    const formState = createMockSurrenderFormState({
      // Pass arrays to fields where multi-select might emit arrays
      otherPetsInHousehold: ['Dogs', 'Cats'] as unknown as string,
      animalsReactionToNewPeople: ['Friendly', 'Afraid'] as unknown as string,
      animalLeftAloneBehaviors: ['None'] as unknown as string,
      animalHowItPlays: ['Jumps'] as unknown as string,
      animalToysItLikes: ['Balls'] as unknown as string,
      animalGamesItLikes: ['Chase'] as unknown as string,
      animalSleepAtNight: ['Floor', 'Couch'] as unknown as string,
      animalTypeOfFood: ['Dry', 'Canned'] as unknown as string,
    })

    // Step 1
    const step1Errors = getSurrenderValidationErrors({
      step: 1,
      selectedAnimal: 'cat',
      formState,
    })
    expect(step1Errors).toHaveLength(0)

    // Step 2
    const step2Errors = getSurrenderValidationErrors({
      step: 2,
      selectedAnimal: 'cat',
      formState,
    })
    expect(step2Errors).toHaveLength(0)

    // Step 5
    const step5Errors = getSurrenderValidationErrors({
      step: 5,
      selectedAnimal: 'cat',
      formState,
    })
    expect(step5Errors).toHaveLength(0)
  })

  it('reports missing required fields on step 1', () => {
    const formState = createMockSurrenderFormState({
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      phoneNumber: '123',
    })

    const errors = getSurrenderValidationErrors({
      step: 1,
      selectedAnimal: 'cat',
      formState,
    })

    expect(errors).toContain('First Name')
    expect(errors).toContain('Last Name')
    expect(errors).toContain('Valid Email')
    expect(errors).toContain('Phone Number')
  })

  it('reports explanation errors when toggles are set to Yes without explanations', () => {
    const formState = createMockSurrenderFormState({
      animalScaredOfAnything: 'Yes',
      animalScaredOfAnythingExplanation: '',
      animalProblemsRidingInCar: 'Yes',
      animalProblemsRidingInCarExplanation: '',
      animalEscapedBefore: 'Yes',
      animalEscapedBeforeExplanation: '',
    })

    const errors = getSurrenderValidationErrors({
      step: 2,
      selectedAnimal: 'cat',
      formState,
    })

    expect(errors).toContain('Fear explanation')
    expect(errors).toContain('Car ride problems explanation')
    expect(errors).toContain('Escape history explanation')
  })
})
