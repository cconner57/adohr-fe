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
    healthConcerns?: TMedicalConcern[] | null
    microchip: {
      microchipCompany?: string | null
      microchipID?: string | null
      microchipped: boolean | null
    }
    spayedOrNeutered: boolean | null
    spayedOrNeuteredDate?: string | null
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
