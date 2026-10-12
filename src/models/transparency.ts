export interface ISACCohort {
  adult: number
  juvenile: number
  total: number
}

export interface ISACIntakeBreakdown {
  stray: ISACCohort
  relinquishedByOwner: ISACCohort
  ownerIntendedEuthanasia: ISACCohort
  transferredIn: ISACCohort
  otherLiveIntake: ISACCohort
  total: ISACCohort
}

export interface ISACOutcomeBreakdown {
  adoption: ISACCohort
  returnedToOwner: ISACCohort
  transferredOut: ISACCohort
  returnedToField: ISACCohort
  otherLiveOutcome: ISACCohort
  totalLiveOutcomes: ISACCohort
  diedInCare: ISACCohort
  lostInCare?: ISACCohort
  ownerIntendedEuthanasia: ISACCohort
  shelterEuthanasia: ISACCohort
  totalOtherOutcomes: ISACCohort
  totalAllOutcomes: ISACCohort
}

export interface ISACSpeciesMatrix {
  beginningCount: ISACCohort
  intakes: ISACIntakeBreakdown
  outcomes: ISACOutcomeBreakdown
  endingCount: ISACCohort
  liveReleaseRate: number
  saveRate: number
}

export interface ISACReport {
  orgId: string
  startDate: string
  endDate: string
  canine: ISACSpeciesMatrix
  feline: ISACSpeciesMatrix
  other: ISACSpeciesMatrix
  total: ISACSpeciesMatrix
  generatedAt: string
}

export interface ITransparencyMethodology {
  asilomarFormula: string
  maddiesFundFormula: string
  sacFormula: string
  compliance: string
}

export interface ISpeciesCount {
  species: string
  count: number
}

export interface IMonthlyAdoption {
  month: string
  count: number
}

export interface ITransparencyStats {
  orgName: string
  orgSlug?: string
  ein?: string
  logoUrl: string
  year: number
  totalSaved: number
  adoptedThisYear: number
  currentlyAvailable: number
  avgLengthOfStay: number
  saveRate: number
  liveReleaseRate?: number
  maddiesFundSaveRate?: number
  volunteerHoursThisYear: number
  speciesBreakdown: ISpeciesCount[]
  monthlyAdoptions: IMonthlyAdoption[]
  sacMatrix?: ISACReport
  methodology?: ITransparencyMethodology
}
