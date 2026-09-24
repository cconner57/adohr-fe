export interface ICurrentPet {
  name: string
  speciesBreedSize: string
  age: string
  source: string
  spayedNeutered: string
  likesDogs: string
}
export type CurrentPet = ICurrentPet

export interface IPastPet {
  name: string
  speciesBreedSize: string
  age: string
  source: string
  spayedNeutered: string
  passedAwayReason: string
}
export type PastPet = IPastPet

export interface IAdoptFormState {
  fax_number: string | null
  secondPetId: string | null
  generalPetName: string | null
  firstName: string | null
  lastName: string | null
  age: number | null
  spouseFirstName: string | null
  spouseLastName: string | null
  roommatesNames: string[]
  childrenNamesAges: { name: string; age: string }[]
  currentPets: CurrentPet[]
  currentlyHavePets: string | null

  pastPets: PastPet[]
  ownPetsBefore: string | null
  email: string | null
  address: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  zip: string | null
  phoneNumber: string | null
  cellPhoneNumber: string | null
  adultMembersAgreed: string | null
  homeType: string | null
  homeOwnership: string | null
  landlordName: string | null
  landlordPhoneNumber: string | null
  allowPets: string | null
  breedRestrictionsWeightLimit: string | null
  monthlyFee: string | null
  allergies: string | null
  primaryOwner: boolean | null
  yearsAtAddress: string | null
  previousAddress: string | null
  expectToMove: string | null
  travelPlan: string | null
  catAccess: string[]
  catIndoorOutdoor: string | null
  catPreferenceBreed: string | null
  catPreferencePhysical: string | null
  catPreferencePersonality: string | null
  catPreferenceNotWant: string | null
  whyInterested: string | null
  adoptionReason: string | null
  ownCatBefore: string | null
  ownKittenBefore: string | null
  alreadyHaveVeterinarian: string | null
  catAllowedHomeArea: string | null
  catHomeAloneHours: string | null
  catDisciplineType: string | null
  catEscapeSteps: string | null

  bredAnimalDescription: string | null

  ownedDeclawedOrDebarked: string | null
  movedWithPet: string | null
  ownedSpecialNeedsPet: string | null
  mobilityDevice: string | null
  surrenderConditions: string[]
  surrenderPlan: string | null

  foodTypeBrand: string | null
  affordVetCare: string | null
  affordEmergencyCost: string | null

  agreementSignature1: string | null

  agreementSignature2: string | null
  agreementSignature3: string | null
  signatureData: string | null

  // Dog-specific fields
  dogWhySelected: string | null
  dogHeardAbout: string[]
  dogFencedBackyard: string | null
  dogHasPool: string | null
  dogPoolFence: string | null
  dogHouseholdDescription: string[]
  dogKeptLocation: string[]
  dogSleepingLocation: string[]
  dogAloneLocation: string[]
  dogExercisePotty: string | null
  dogCareResponsible: string | null
  dogAnnualExpense: string | null
  dogTravelArrangements: string | null
  dogWillingToPottyTrain: string | null
  dogTrainingExperience: string[]
  dogWillingTrainingClass: string | null
  dogConfinementTypes: string[]
  dogBondingTime: string | null
  dogDeniedOwnership: string | null
}
export type FormState = IAdoptFormState
