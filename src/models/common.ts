import type { TPetBreed } from '../constants/breeds.ts'

export type TSpecies = 'cat' | 'dog'
export type TSex = 'male' | 'female'
export type TSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'
export type TAgeGroup = 'baby' | 'young' | 'adult' | 'senior'
export type TEnergyLevel = 'low' | 'medium' | 'high'
export type TCoatLength = 'short' | 'medium' | 'long' | 'wire' | 'hairless'
export type TEnvironment = 'outdoor' | 'indoor' | 'indoor/outdoor'

export type TEatingStatus = 'normal' | 'low' | 'none' | 'excessive' | 'assisted-feeding'
export type TDrinkingStatus = 'normal' | 'low' | 'none' | 'dehydrated'
export type TActivityLog = 'normal' | 'calm' | 'lethargic' | 'energetic' | 'hyperactive'
export type THealthLogUrination = 'normal' | 'none' | 'blood' | 'straining'
export type THealthLogDefecation = 'normal' | 'diarrhea' | 'none' | 'constipated'

export type TPetStatus =
  | 'adopted'
  | 'adoption-pending'
  | 'archived'
  | 'available'
  | 'foster'
  | 'hold'
  | 'intake'

export type TTemperament =
  | 'affectionate'
  | 'anxious'
  | 'bossy'
  | 'curious'
  | 'hunter'
  | 'independent'
  | 'laid-back'
  | 'playful'
  | 'shy'
  | 'vocal'

export type TMedicalConcern =
  | 'allergies - flea'
  | 'allergies - food'
  | 'allergies - skin'
  | 'anemia'
  | 'asthma'
  | 'bladder infection'
  | 'cancer'
  | 'cystitis'
  | 'dental problems'
  | 'diabetes'
  | 'ear infections'
  | 'feline immunodeficiency (fiv)'
  | 'feline infectious peritonitis (fip)'
  | 'feline leukemia virus (felv)'
  | 'gastrointestinal issues'
  | 'heartworm disease'
  | 'hyperthyroidism'
  | 'kidney disease'
  | 'obesity'
  | 'upper respiratory infections'

export interface ISibling {
  id: string
  name: string
  photo?: string | null
  species: TSpecies | string
  sex: TSex | 'unknown' | string
  age?: TAgeGroup | string | null
  dob?: string | null
  status?: string | null
  isMom?: boolean | null
  isDad?: boolean | null
}

export interface ILitter {
  groupName?: string | null
  siblings?: ISibling[] | null
}

export interface IPet {
  id: string
  slug?: string

  createdAt: string
  updatedAt: string

  name: string
  species: TSpecies
  sex: TSex | 'unknown'
  litter?: ILitter | null
  litterName?: string | null
  isAttendingWeekend?: boolean | null

  physical: {
    ageGroup: TAgeGroup | null
    breed: TPetBreed | 'Unknown' | 'unknown' | 'Mix' | 'mix' | null
    coatLength: TCoatLength | null
    color: string | null
    dateOfBirth?: string | null

    size: TSize | null
    currentWeight?: number | null
  }

  behavior: {
    bonded?: {
      bondedWith?: string[] | null
      isBonded?: boolean | null
    } | null
    energyLevel: TEnergyLevel | null
    healthSummary?: string | null
    isGoodWithCats: boolean | null
    isGoodWithDogs: boolean | null
    isGoodWithKids: boolean | null
    isHouseTrained: boolean | null
    mustGoWithAnotherCat?: boolean | null
    mustGoWithAnotherDog?: boolean | null
    personalityTags: TTemperament[] | null
    prefersToBeAlone: boolean | null
    specialNeeds?: string | null
  }

  medical: {
    currentMedications?: string[] | null
    felvPositive?: boolean | null
    fivPositive?: boolean | null
    healthConcerns?: TMedicalConcern[] | string[] | null
    intakeCondition?: string | null
    microchip: {
      microchipCompany?: string | null
      microchipID?: string | null
      microchipped: boolean | null
    }
    spayedOrNeutered: boolean | null
    spayedOrNeuteredDate?: string | null
    specialNeeds?: string[] | string | null
    surgeries: IMedicalProcedure[]
    vaccinations: {
      bordetella?: IVaccineRecord
      canineDistemper?: IVaccineSeries
      felineDistemper?: IVaccineSeries
      felineLeukemia?: IVaccineSeries
      leptospira?: IVaccineSeries
      other?: IVaccineRecord[]
      rabies?: IVaccineRecord
    }
    vaccinationsUpToDate: boolean | null
    documents?: IPetMedicalDocument[] | null
  }

  descriptions: {
    additionalInformation?: string[] | null
    behavioral?: string | null
    fun?: string | null
    origin?: string | null
    primary: string | null
    specialNeeds?: string | null
    spotlight?: string | null
  }

  details: {
    environmentType?: TEnvironment | null
    intakeDate?: string | null
    preferredPetLitterType?: string | null
    shelterLocation?: string | null
    status: TPetStatus
  }

  adoption: {
    adoptedBy?: string | null
    date?: string | null
    newAdoptedName?: string | null
    photo?: IPhoto | null
    fee?: number | null
    surveyCompleted?: boolean | null
    adopterContactInfo?: IContactInfo
  }

  foster: {
    endDate?: string | null
    parentName?: string | null
    parentPhoto?: IPhoto | null
    startDate?: string | null
    fosterContactInfo?: IContactInfo
  }

  returned: {
    isReturned: boolean
    history: { date: string; reason: string }[]
  }

  sponsored: {
    amount?: number | null
    date?: string | null
    isSponsored: boolean
    sponsoredBy?: string | null
  }

  photos: IPhoto[]

  profileSettings: {
    isSpotlightFeatured: boolean
    showAdditionalInformation: boolean
    showMedicalHistory: boolean
  }
}

export type MedicalDocumentCategory =
  | 'vaccination'
  | 'spay_neuter'
  | 'intake_exam'
  | 'lab_results'
  | 'general'

export interface IMedicalDocument {
  id: string
  title: string
  category: MedicalDocumentCategory
  fileName: string
  fileUrl: string
  fileSizeBytes: number
  uploadedAt: string
  veterinarian?: string
  notes?: string
}

export type IPetMedicalDocument = IMedicalDocument

export interface IVerifyMedicalPayload {
  petName: string
  adopterLastName: string
  email: string
  phoneNumber: string
  adoptionMonth: string // e.g. "05" or "5"
  adoptionYear: string // e.g. "2025"
}

export type IMedicalVerificationForm = IVerifyMedicalPayload

export interface IVerifyMedicalResponse {
  success: boolean
  petSlug: string
  verifiedToken: string
}

export interface IPetPhysicalData {
  primaryBreed?: string | null
  secondaryBreed?: string | null
  breed?: string | null
  color?: string | null
  pattern?: string | null
  coatLength?: string | null
  distinguishingMarks?: string | null
  dateOfBirth?: string | null
  ageGroup?: string | null
  size?: string | null
  weight?: number | string | null
  weightUnit?: string | null
  bodyConditionScore?: string | null
}

export interface IPetDietData {
  primaryFoodType?: string | null
  foodBrand?: string | null
  foodFormula?: string | null
  portionSize?: string | null
  feedingFrequency?: string | null
  isPrescriptionDiet?: boolean | null
  prescriptionDietNotes?: string | null
  foodAllergies?: string | string[] | null
  feedingNotes?: string | null
}

export interface IPetDiseaseTestingData {
  fivResult?: string | boolean | null
  fivTestDate?: string | null
  felvResult?: string | boolean | null
  felvTestDate?: string | null
  heartwormResult?: string | boolean | null
  heartwormTestDate?: string | null
  fecalTestResult?: string | null
  fecalTestDate?: string | null
}

export interface IMedicalProcedureRecord {
  id?: string
  name: string
  date?: string | null
  veterinarian?: string | null
  clinic?: string | null
  notes?: string | null
  cost?: string | number | null
}

export interface IPetMedicalPortalData {
  petId: string
  name: string
  slug: string
  status: 'adopted' | 'foster' | string
  species: string
  sex?: string | null
  dob?: string | null
  dateOfBirth?: string | null
  photoUrl: string
  physical?: IPetPhysicalData | null
  nutrition?: IPetDietData | null
  diet?: IPetDietData | null
  feeding?: IPetDietData | null
  documents?: IMedicalDocument[] | null
  medical: {
    intakeCondition?: string | null
    spayedOrNeutered: boolean | null
    spayedOrNeuteredDate: string | null
    vaccinationsUpToDate?: boolean | null
    microchip: {
      microchipped?: boolean | null
      microchipCompany?: string | null
      microchipID?: string | null
      secondaryMicrochipCompany?: string | null
      secondaryMicrochipID?: string | null
    }
    rabiesTagNumber?: string | null
    licenseTagNumber?: string | null
    diseaseTesting?: IPetDiseaseTestingData | null
    testing?: IPetDiseaseTestingData | null
    vaccinations: Record<string, unknown>
    surgeries?: IMedicalProcedureRecord[] | null
    procedures?: IMedicalProcedureRecord[] | null
    healthSummary?: string | null
    healthConcerns?: string | string[] | null
    currentMedications?: string | string[] | null
    documents: IMedicalDocument[]
  }
}

export interface IVaccineRecord {
  dateAdministered: string
  expiresAt?: string
  name?: string
  veterinarian?: string
}

export interface IVaccineSeries {
  isComplete: boolean
  round1?: IVaccineRecord
  round2?: IVaccineRecord
  round3?: IVaccineRecord
}

export interface IMedicalProcedure {
  date: string
  id: string
  name: string
  notes?: string
}

export interface IPhoto {
  isPrimary: boolean
  isSpotlight?: boolean
  thumbnailUrl?: string
  uploadedAt: string
  url: string
}

export interface IHealthLogEntry {
  id: string
  petId: string
  date: string
  weight?: number | null
  temperature?: number | null
  eating: TEatingStatus | null
  drinking: TDrinkingStatus | null
  activity: TActivityLog | null
  urination: THealthLogUrination | null
  defecation: THealthLogDefecation | null
  notes?: string
  recordedBy?: string
}

export interface IContactInfo {
  name?: string | null
  email?: string | null
  phone?: string | null
}
