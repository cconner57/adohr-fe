export interface IHouseholdMember {
  age: string
  gender: 'Male' | 'Female'
  count: number
}

export interface ISurrenderFormState {
  fax_number?: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  whenToSurrenderAnimal: string
  animalName: string
  animalSex: string
  animalAge: string
  animalOwnershipDuration: string
  animalLocationFound: string
  animalWhySurrendered: string
  householdMembers: IHouseholdMember[]
  otherPetsInHousehold: string
  animalsBehaviorTowardsKnownPeople: string
  animalsBehaviorTowardsStrangers: string
  animalsBehaviorTowardsKnownAnimals: string
  commentsOnBehavior: string
  animalsReactionToNewPeople: string
  animalHouseTrained: string
  animalSpendMajorityOfTime: string
  animalLeftAloneDuration: string
  animalWhenLeftAlone: string
  animalLeftAloneBehaviors: string
  animalHowItPlays: string
  animalToysItLikes: string
  animalGamesItLikes: string
  animalScaredOfAnything: string
  animalScaredOfAnythingExplanation: string
  animalBadHabits: string
  animalAllowedOnFurniture: string
  animalSleepAtNight: string
  animalBehaviorFoodOthers: string
  animalBehaviorToysOthers: string
  animalProblemsRidingInCar: string
  animalProblemsRidingInCarExplanation: string
  animalEscapedBefore: string
  animalEscapedBeforeExplanation: string
  animalEverAttackedPeople: string
  animalEverAttackedPeopleExplanation: string
  animalEverAttackedOtherCats: string
  animalEverAttackedOtherCatsExplanation: string
  animalEverAttackedOtherDogs: string
  animalEverAttackedOtherDogsExplanation: string
  animalVeterinarianList: string
  animalVeterinarianYearlyVisits: string
  animalSpayedNeutered: string
  animalVaccinationHistory: string
  animalVaccinationsCurrent: string
  animalTestedHeartworm: string
  animalTestedHeartwormExplanation: string
  animalHeartwormPrevention: string
  animalHeartwormPreventionExplanation: string
  animalMicrochipped: string
  animalMicrochippedExplanation: string
  animalVetOrGroomerBehavior: string
  animalVetMuzzled: string
  animalPastOrPresentHealthProblems: string
  animalPastOrPresentHealthProblemsExplanation: string
  animalCurrentMedications: string
  animalCurrentMedicationsExplanation: string
  animalTypeOfFood: string
  animalEatingFrequency: string
  animalAmountOfFood: string
  animalFoodTreats: string
  animalFoodTreatsExplanation: string
  additionalInformation: string
  fullBodyPhotoOfAnimal: string | File | (string | File)[] | null
  closeUpPhotoOfAnimalFace: string | File | (string | File)[] | null
  copiesOfRecords: string | File | (string | File)[] | null
}

export type SurrenderFormState = ISurrenderFormState

