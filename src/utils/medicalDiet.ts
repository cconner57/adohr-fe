import type { IPetMedicalPortalData } from '@/models/common'
import { extractDateValue, getFieldIgnoreCase, toDateLabel } from '@/utils/medicalParser'

export interface IDietGuidelines {
  hasInfo: boolean
  primaryFoodType?: string | null
  foodBrand?: string | null
  foodFormula?: string | null
  portionSize?: string | null
  feedingFrequency?: string | null
  isPrescriptionDiet: boolean
  prescriptionNotes?: string | null
  allergies?: string | null
  feedingNotes?: string | null
}

export interface IProcedureItem {
  name: string
  date?: string | null
  veterinarian?: string | null
  notes?: string | null
}

export const buildDietInfo = (
  portalData: IPetMedicalPortalData | null,
): IDietGuidelines => {
  if (!portalData) {
    return { hasInfo: false, isPrescriptionDiet: false }
  }
  const dietObj = (
    portalData.nutrition ??
    portalData.diet ??
    portalData.feeding ??
    portalData.medical ??
    {}
  ) as Record<string, unknown>

  const foodType = getFieldIgnoreCase(dietObj, 'primaryFoodType', 'foodType', 'food_type', 'type') as string | null
  const brand = getFieldIgnoreCase(dietObj, 'foodBrand', 'brand', 'food_brand') as string | null
  const formula = getFieldIgnoreCase(dietObj, 'foodFormula', 'formula', 'food_formula') as string | null
  const portion = getFieldIgnoreCase(dietObj, 'portionSize', 'portion', 'portion_size', 'amount') as string | null
  const freq = getFieldIgnoreCase(dietObj, 'feedingFrequency', 'frequency', 'feeding_frequency', 'schedule') as string | null
  const isPrescription = Boolean(getFieldIgnoreCase(dietObj, 'isPrescriptionDiet', 'prescriptionDiet', 'prescription_diet', 'isPrescription'))
  const prescNotes = getFieldIgnoreCase(dietObj, 'prescriptionDietNotes', 'prescriptionNotes') as string | null
  const rawAllergies = getFieldIgnoreCase(dietObj, 'foodAllergies', 'allergies', 'food_allergies', 'sensitivities')
  
  let allergies: string | null = null
  if (Array.isArray(rawAllergies)) {
    allergies = rawAllergies.join(', ')
  } else if (typeof rawAllergies === 'string') {
    allergies = rawAllergies
  }

  const notes = getFieldIgnoreCase(dietObj, 'feedingNotes', 'dietNotes', 'feeding_notes', 'instructions') as string | null
  const brandFormula = [brand, formula].filter(Boolean).join(' - ')
  const hasInfo = Boolean(
    foodType || brandFormula || portion || freq || isPrescription || allergies || notes,
  )

  return {
    hasInfo,
    primaryFoodType: foodType && foodType !== '-' ? foodType : null,
    foodBrand: brand && brand !== '-' ? brand : null,
    foodFormula: formula && formula !== '-' ? formula : null,
    portionSize: portion && portion !== '-' ? portion : null,
    feedingFrequency: freq && freq !== '-' ? freq : null,
    isPrescriptionDiet: isPrescription,
    prescriptionNotes: prescNotes && prescNotes !== '-' ? prescNotes : null,
    allergies: allergies && allergies !== '-' ? allergies : null,
    feedingNotes: notes && notes !== '-' ? notes : null,
  }
}

export const buildMedicationsList = (
  portalData: IPetMedicalPortalData | null,
): string[] => {
  if (!portalData) return []
  const med = (portalData.medical || {}) as Record<string, unknown>
  const raw = getFieldIgnoreCase(med, 'currentMedications', 'medications', 'current_medications', 'treatments') ??
    getFieldIgnoreCase(portalData as unknown as Record<string, unknown>, 'currentMedications', 'medications')

  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === 'string') return item.trim()
        if (item && typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
          return item.name.trim()
        }
        return ''
      })
      .filter((item) => Boolean(item) && item !== '-')
  }
  if (typeof raw === 'string' && raw.trim() && raw.trim() !== '-') {
    return [raw.trim()]
  }
  return []
}

export const buildProceduresList = (
  portalData: IPetMedicalPortalData | null,
): IProcedureItem[] => {
  if (!portalData) return []
  const med = (portalData.medical || {}) as Record<string, unknown>
  const raw = getFieldIgnoreCase(med, 'procedures', 'surgeries', 'procedureRecords', 'surgicalHistory') ??
    getFieldIgnoreCase(portalData as unknown as Record<string, unknown>, 'procedures', 'surgeries')

  if (!Array.isArray(raw)) return []

  const list: IProcedureItem[] = []
  raw.forEach((item) => {
    if (typeof item === 'string' && item.trim()) {
      const trimmed = item.trim()
      if (trimmed.toLowerCase() !== 'spay' && trimmed.toLowerCase() !== 'neuter') {
        list.push({ name: trimmed, date: null, veterinarian: null, notes: null })
      }
    } else if (typeof item === 'object' && item !== null) {
      const rec = item as Record<string, unknown>
      const pName = (getFieldIgnoreCase(rec, 'name', 'title', 'procedure', 'surgery') as string) || 'Veterinary Procedure'
      if (pName.toLowerCase() !== 'spay' && pName.toLowerCase() !== 'neuter') {
        const pDate = extractDateValue(getFieldIgnoreCase(rec, 'date', 'procedureDate', 'surgeryDate'))
        const pVet = getFieldIgnoreCase(rec, 'veterinarian', 'vet', 'clinic') as string | null
        const pNotes = getFieldIgnoreCase(rec, 'notes', 'note', 'description') as string | null
        list.push({
          name: pName,
          date: pDate ? toDateLabel(pDate) : null,
          veterinarian: typeof pVet === 'string' && pVet.trim() ? pVet.trim() : null,
          notes: typeof pNotes === 'string' && pNotes.trim() ? pNotes.trim() : null,
        })
      }
    }
  })

  return list
}

export const buildPhysicalTraitCapsules = (
  portalData: IPetMedicalPortalData | null,
): string[] => {
  if (!portalData) return []
  const capsules: string[] = []
  const phys = (portalData.physical || {}) as Record<string, unknown>
  const dataRoot = portalData as unknown as Record<string, unknown>


  // 1. Weight
  const weight = getFieldIgnoreCase(phys, 'weight') ?? getFieldIgnoreCase(dataRoot, 'weight')
  const weightUnit = (getFieldIgnoreCase(phys, 'weightUnit', 'weight_unit') ??
    getFieldIgnoreCase(dataRoot, 'weightUnit', 'weight_unit') ??
    'lbs') as string
  if (weight && weight !== '-') {
    capsules.push(`${weight} ${weightUnit}`.toUpperCase())
  }

  // 2. Distinguishing Marks
  const marks = getFieldIgnoreCase(phys, 'distinguishingMarks', 'distinguishing_marks', 'marks') ??
    getFieldIgnoreCase(dataRoot, 'distinguishingMarks', 'distinguishing_marks')
  if (typeof marks === 'string' && marks.trim() && marks.trim() !== '-') {
    capsules.push(marks.trim().toUpperCase())
  }

  return capsules
}
