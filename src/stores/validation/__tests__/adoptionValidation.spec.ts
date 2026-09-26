import { describe, expect, it } from 'vitest'

import type { FormState } from '../../../models/adopt-form'
import { getAdoptionValidationErrors } from '../adoptionValidation'

const createMockFormState = (overrides: Partial<FormState> = {}): FormState => ({
  fax_number: '',
  secondPetId: null,
  generalPetName: '',
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  spouseFirstName: null,
  spouseLastName: null,
  roommatesNames: [''],
  childrenNamesAges: [{ name: '', age: '' }],
  currentPets: [],
  currentlyHavePets: 'No',
  pastPets: [],
  ownPetsBefore: 'No',
  email: 'john@example.com',
  address: '123 Main St',
  addressLine2: null,
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  phoneNumber: '555-555-5555',
  cellPhoneNumber: null,
  adultMembersAgreed: 'Yes',
  homeType: 'House',
  homeOwnership: 'Own',
  landlordName: null,
  landlordPhoneNumber: null,
  allowPets: null,
  breedRestrictionsWeightLimit: null,
  monthlyFee: null,
  allergies: null,
  primaryOwner: null,
  yearsAtAddress: null,
  previousAddress: null,
  expectToMove: null,
  travelPlan: null,
  catAccess: [],
  catIndoorOutdoor: null,
  catPreferenceBreed: null,
  catPreferencePhysical: null,
  catPreferencePersonality: null,
  catPreferenceNotWant: null,
  whyInterested: null,
  adoptionReason: null,
  ownCatBefore: null,
  ownKittenBefore: null,
  alreadyHaveVeterinarian: null,
  catAllowedHomeArea: null,
  catHomeAloneHours: null,
  catDisciplineType: null,
  catEscapeSteps: null,
  bredAnimalDescription: null,
  ownedDeclawedOrDebarked: null,
  movedWithPet: null,
  ownedSpecialNeedsPet: null,
  mobilityDevice: null,
  surrenderConditions: [],
  surrenderPlan: null,
  foodTypeBrand: null,
  affordVetCare: null,
  affordEmergencyCost: null,
  agreementSignature1: null,
  agreementSignature2: null,
  agreementSignature3: null,
  signatureData: null,
  dogWhySelected: null,
  dogHeardAbout: [],
  dogFencedBackyard: null,
  dogHasPool: null,
  dogPoolFence: null,
  dogHouseholdDescription: [],
  dogKeptLocation: [],
  dogSleepingLocation: [],
  dogAloneLocation: [],
  dogExercisePotty: null,
  dogCareResponsible: null,
  dogAnnualExpense: null,
  dogTravelArrangements: null,
  dogWillingToPottyTrain: null,
  dogTrainingExperience: [],
  dogWillingTrainingClass: null,
  dogConfinementTypes: [],
  dogBondingTime: null,
  dogDeniedOwnership: null,
  ...overrides,
})

describe('getAdoptionValidationErrors', () => {
  it('should return no general pet name validation errors if isGeneral is false', () => {
    const formState = createMockFormState({ generalPetName: '' })
    const errors = getAdoptionValidationErrors(-1, formState, 'cat', false)
    expect(errors).not.toContain('Interested Pet Name')
  })

  it('should return validation error for cat general flow when generalPetName is empty at step -1', () => {
    const formState = createMockFormState({ generalPetName: '' })
    const errors = getAdoptionValidationErrors(-1, formState, 'cat', true)
    expect(errors).toContain('Interested Pet Name')
  })

  it('should not return validation error for cat general flow when generalPetName is set at step -1', () => {
    const formState = createMockFormState({ generalPetName: 'Luna' })
    const errors = getAdoptionValidationErrors(-1, formState, 'cat', true)
    expect(errors).not.toContain('Interested Pet Name')
  })

  it('should return validation error for dog general flow when generalPetName is empty at step 0', () => {
    const formState = createMockFormState({ generalPetName: '' })
    const errors = getAdoptionValidationErrors(0, formState, 'dog', true)
    expect(errors).toContain('Interested Pet Name')
  })

  it('should not return validation error for dog general flow when generalPetName is set at step 0', () => {
    const formState = createMockFormState({ generalPetName: 'Buddy' })
    const errors = getAdoptionValidationErrors(0, formState, 'dog', true)
    expect(errors).not.toContain('Interested Pet Name')
  })

  describe('Step 3: Current Pets validation', () => {
    it('requires currentlyHavePets to be answered', () => {
      const formState = createMockFormState({ currentlyHavePets: null })
      const errors = getAdoptionValidationErrors(3, formState, 'dog')
      expect(errors).toContain('Do you have pets?')
    })

    it('passes when currentlyHavePets is No', () => {
      const formState = createMockFormState({ currentlyHavePets: 'No', currentPets: [] })
      const errors = getAdoptionValidationErrors(3, formState, 'dog')
      expect(errors).toHaveLength(0)
    })

    it('requires pet fields when currentlyHavePets is Yes', () => {
      const formState = createMockFormState({
        currentlyHavePets: 'Yes',
        currentPets: [
          {
            name: '',
            speciesBreedSize: '',
            age: '',
            likesDogs: '',
            source: '',
            spayedNeutered: '',
          },
        ],
      })
      const errors = getAdoptionValidationErrors(3, formState, 'dog')
      expect(errors).toContain('Pet 1 Name')
      expect(errors).toContain('Pet 1 Breed/Size')
      expect(errors).toContain('Pet 1 Age')
      expect(errors).toContain('Pet 1 Likes Dogs')
      expect(errors).toContain('Pet 1 Source')
      expect(errors).toContain('Pet 1 Spayed/Neutered')
    })
  })

  describe('Step 4: Past Pets validation', () => {
    it('requires ownPetsBefore to be answered', () => {
      const formState = createMockFormState({ ownPetsBefore: null })
      const errors = getAdoptionValidationErrors(4, formState, 'dog')
      expect(errors).toContain('Have you owned pets?')
    })

    it('passes when ownPetsBefore is No', () => {
      const formState = createMockFormState({ ownPetsBefore: 'No', pastPets: [] })
      const errors = getAdoptionValidationErrors(4, formState, 'dog')
      expect(errors).toHaveLength(0)
    })

    it('requires past pet fields when ownPetsBefore is Yes', () => {
      const formState = createMockFormState({
        ownPetsBefore: 'Yes',
        pastPets: [
          {
            name: '',
            speciesBreedSize: '',
            age: '',
            source: '',
            spayedNeutered: '',
            passedAwayReason: '',
          },
        ],
      })
      const errors = getAdoptionValidationErrors(4, formState, 'dog')
      expect(errors).toContain('Past Pet 1 Name')
      expect(errors).toContain('Past Pet 1 Breed/Size')
      expect(errors).toContain('Past Pet 1 Age')
      expect(errors).toContain('Past Pet 1 Source')
      expect(errors).toContain('Past Pet 1 Spayed/Neutered')
      expect(errors).toContain('Past Pet 1 Outcome')
    })
  })

  describe('Step 5: Other validation', () => {
    it('requires dog-specific fields when species is dog', () => {
      const formState = createMockFormState({
        bredAnimalDescription: 'No',
        ownedDeclawedOrDebarked: 'No',
        movedWithPet: 'No',
        ownedSpecialNeedsPet: 'No',
        mobilityDevice: 'No',
        foodTypeBrand: 'Kibble',
        surrenderConditions: ['None of the above'],
        surrenderPlan: 'Keep pet',
        affordVetCare: 'Yes',
        affordEmergencyCost: 'Yes',
      })
      const errors = getAdoptionValidationErrors(5, formState, 'dog')
      expect(errors).toContain('Why Selected')
      expect(errors).toContain('Where Heard About')
      expect(errors).toContain('Fenced Backyard')
      expect(errors).toContain('Has Pool')
      expect(errors).toContain('Household Description')
    })
  })

  describe('Step 6: Summary validation', () => {
    it('validates matching typed names and signature', () => {
      const formState = createMockFormState({
        agreementSignature1: 'John Doe',
        agreementSignature2: 'Jane Doe',
        signatureData: null,
      })
      const errors = getAdoptionValidationErrors(6, formState, 'dog')
      expect(errors).toContain('Typed names must match')
      expect(errors).toContain('Final Signature')
    })
  })
})
