import type {
  ILitter,
  IPet,
  TAgeGroup,
  TCoatLength,
  TEnergyLevel,
  TSize,
  TSpecies,
  TTemperament,
} from '@/models/common'

export type TPetBreed = string

/**
 * Ensures photo arrays always contain { id, isPrimary, url } objects.
 */
export function normalizePetPhotos(
  rawPhotos: unknown,
  fallbackUrls?: Array<string | undefined | null>,
): Array<{ id: string; isPrimary: boolean; url: string }> {
  const result: Array<{ id: string; isPrimary: boolean; url: string }> = []

  if (Array.isArray(rawPhotos)) {
    rawPhotos.forEach((item, index) => {
      if (typeof item === 'string' && item.trim()) {
        result.push({
          id: String(index),
          isPrimary: index === 0,
          url: item.trim(),
        })
      } else if (item && typeof item === 'object') {
        const p = item as { id?: string; url?: string; photoUrl?: string; uri?: string; isPrimary?: boolean; primary?: boolean }
        const url = (p.url || p.photoUrl || p.uri || '').trim()
        if (url) {
          result.push({
            id: p.id || String(index),
            isPrimary: Boolean(p.isPrimary ?? p.primary ?? index === 0),
            url,
          })
        }
      }
    })
  }

  // If no photos found in photos array, check fallback single photo fields
  if (result.length === 0 && fallbackUrls) {
    for (const rawUrl of fallbackUrls) {
      if (typeof rawUrl === 'string' && rawUrl.trim()) {
        result.push({
          id: 'primary',
          isPrimary: true,
          url: rawUrl.trim(),
        })
        break
      }
    }
  }

  // Ensure at least one photo is marked as primary if any exist
  if (result.length > 0 && !result.some((p) => p.isPrimary)) {
    result[0].isPrimary = true
  }

  return result
}

/**
 * Normalizes a raw pet object from the API into a complete, safe IPet instance.
 */
export function normalizePet(raw: Record<string, unknown>): IPet {
  const rawId = (raw.id || raw._id || raw.petId || raw.uuid || '') as string
  const id = String(rawId).trim()
  const slug = (raw.slug || raw.petSlug || id) as string
  const name = (raw.name || raw.petName || 'Unnamed Pet') as string

  // Species normalization
  const rawSpecies = String(raw.species || 'cat').toLowerCase()
  const species: TSpecies = rawSpecies.includes('dog') ? 'dog' : 'cat'

  // Sex normalization
  const rawSex = String(raw.sex || raw.gender || 'unknown').toLowerCase()
  let sex: 'male' | 'female' | 'unknown' = 'unknown'
  if (rawSex.startsWith('f')) {
    sex = 'female'
  } else if (rawSex.startsWith('m')) {
    sex = 'male'
  }

  // Physical sub-object or flat fallbacks
  const phys = (raw.physical || {}) as Record<string, unknown>
  const breed = (phys.breed || raw.breed || raw.primaryBreed || raw.primary_breed || 'Mix') as TPetBreed
  const rawAge = String(phys.ageGroup || raw.ageGroup || raw.age_group || raw.age || 'young').toLowerCase()
  const ageGroup = rawAge as TAgeGroup
  const rawSize = String(phys.size || raw.size || 'medium').toLowerCase()
  const size = rawSize as TSize
  const coatLength = (phys.coatLength || raw.coatLength || raw.coat_length || null) as TCoatLength | null
  const color = (phys.color || raw.color || null) as string | null
  const dateOfBirth = (phys.dateOfBirth || raw.dateOfBirth || raw.dob || raw.birthDate || null) as string | null
  const currentWeight = (phys.currentWeight ?? raw.weight ?? raw.current_weight ?? null) as number | null

  // Behavior sub-object or flat fallbacks
  const beh = (raw.behavior || {}) as Record<string, unknown>
  const isGoodWithKids = (beh.isGoodWithKids ?? raw.isGoodWithKids ?? raw.goodWithKids ?? raw.good_with_kids ?? null) as boolean | null
  const isGoodWithDogs = (beh.isGoodWithDogs ?? raw.isGoodWithDogs ?? raw.goodWithDogs ?? raw.good_with_dogs ?? null) as boolean | null
  const isGoodWithCats = (beh.isGoodWithCats ?? raw.isGoodWithCats ?? raw.goodWithCats ?? raw.good_with_cats ?? null) as boolean | null
  const isHouseTrained = (beh.isHouseTrained ?? raw.isHouseTrained ?? raw.houseTrained ?? null) as boolean | null
  
  // Medical sub-object or flat fallbacks
  const med = (raw.medical || {}) as Record<string, unknown>
  let rawMedSpecialNeeds: string[] = []
  if (Array.isArray(med.specialNeeds)) {
    rawMedSpecialNeeds = med.specialNeeds.filter(
      (s): s is string => typeof s === 'string' && s.trim().length > 0,
    )
  } else if (typeof med.specialNeeds === 'string' && med.specialNeeds.trim().length > 0) {
    rawMedSpecialNeeds = [med.specialNeeds.trim()]
  }

  const specialNeeds = (
    (rawMedSpecialNeeds.length > 0 ? rawMedSpecialNeeds.join(', ') : null) ||
    beh.specialNeeds ||
    raw.specialNeeds ||
    raw.special_needs ||
    null
  ) as string | null

  const personalityTags = (beh.personalityTags || raw.personalityTags || raw.temperament || []) as TTemperament[]
  const energyLevel = (beh.energyLevel || raw.energyLevel || null) as TEnergyLevel | null

  // Bonded pair logic
  const rawBonded = (beh.bonded || raw.bonded || {}) as Record<string, unknown>
  const isBonded = Boolean(rawBonded.isBonded ?? raw.isBonded)
  const bondedWith = (rawBonded.bondedWith || raw.bondedWith || []) as string[]
  const bondedObj = isBonded ? { isBonded: true, bondedWith } : null

  // Status & Details
  const det = (raw.details || {}) as Record<string, unknown>
  const status = (det.status || raw.status || 'available') as string

  // Descriptions
  const desc = (raw.descriptions || {}) as Record<string, unknown>
  const funDesc = (desc.fun || raw.funDescription || raw.description || raw.notes || raw.story || '') as string
  const specialNeedsDesc = (desc.specialNeeds || raw.specialNeedsDescription || specialNeeds || null) as string | null

  // Photos
  const photos = normalizePetPhotos(raw.photos, [
    raw.photoUrl as string,
    raw.primaryPhoto as string,
    raw.photo as string,
    raw.imageUrl as string,
  ])

  // Litter
  const litter = (raw.litter || null) as ILitter | null

  // Sponsored
  const rawSponsored = (raw.sponsored || {}) as Record<string, unknown>
  const isSponsored = Boolean(rawSponsored.isSponsored ?? raw.isSponsored ?? false)

  const normalized = {
    ...raw,
    id,
    slug: String(slug).trim(),
    name: String(name).trim(),
    species,
    sex,
    createdAt: (raw.createdAt || raw.created_at || new Date().toISOString()) as string,
    updatedAt: (raw.updatedAt || raw.updated_at || new Date().toISOString()) as string,
    litter,
    litterName: (raw.litterName || litter?.groupName || null) as string | null,
    isAttendingWeekend: Boolean(raw.isAttendingWeekend ?? raw.attendingWeekend ?? raw.attending_weekend ?? false),
    photos,
    physical: {
      ...phys,
      breed,
      ageGroup,
      size,
      coatLength,
      color,
      dateOfBirth,
      currentWeight,
    },
    behavior: {
      ...beh,
      bonded: bondedObj,
      energyLevel,
      healthSummary: (beh.healthSummary || raw.healthSummary || null) as string | null,
      isGoodWithCats,
      isGoodWithDogs,
      isGoodWithKids,
      isHouseTrained,
      mustGoWithAnotherCat: (beh.mustGoWithAnotherCat ?? raw.mustGoWithAnotherCat ?? null) as boolean | null,
      mustGoWithAnotherDog: (beh.mustGoWithAnotherDog ?? raw.mustGoWithAnotherDog ?? null) as boolean | null,
      personalityTags,
      prefersToBeAlone: (beh.prefersToBeAlone ?? raw.prefersToBeAlone ?? null) as boolean | null,
      specialNeeds,
    },
    details: {
      ...det,
      status,
      intakeDate: (det.intakeDate || raw.intakeDate || null) as string | null,
      adoptionFee: (det.adoptionFee ?? raw.adoptionFee ?? null) as number | null,
      location: (det.location || raw.location || null) as string | null,
      fosterId: (det.fosterId || raw.fosterId || null) as string | null,
    },
    descriptions: {
      ...desc,
      fun: funDesc,
      specialNeeds: specialNeedsDesc,
    },
    sponsored: {
      isSponsored,
    },
    medical: {
      ...med,
      specialNeeds: rawMedSpecialNeeds,
      felvPositive: Boolean(med.felvPositive ?? raw.felvPositive ?? false),
      fivPositive: Boolean(med.fivPositive ?? raw.fivPositive ?? false),
      healthConcerns: (Array.isArray(med.healthConcerns) ? med.healthConcerns : []) as IPet['medical']['healthConcerns'],
      currentMedications: (Array.isArray(med.currentMedications) ? med.currentMedications : []) as string[],
      intakeCondition: (med.intakeCondition || raw.intakeCondition || null) as string | null,
      spayedOrNeutered: Boolean(med.spayedOrNeutered ?? raw.spayedOrNeutered ?? false),
      vaccinationsUpToDate: Boolean(med.vaccinationsUpToDate ?? raw.vaccinationsUpToDate ?? false),
      microchip: {
        microchipped: Boolean(
          (med.microchip as Record<string, unknown>)?.microchipped ??
            (raw.microchip as Record<string, unknown>)?.microchipped ??
            false,
        ),
        microchipID: (
          (med.microchip as Record<string, unknown>)?.microchipID ||
          (raw.microchip as Record<string, unknown>)?.microchipID ||
          null
        ) as string | null,
        microchipCompany: (
          (med.microchip as Record<string, unknown>)?.microchipCompany ||
          (raw.microchip as Record<string, unknown>)?.microchipCompany ||
          null
        ) as string | null,
      },
      surgeries: (med.surgeries || raw.surgeries || []) as IPet['medical']['surgeries'],
      vaccinations: (med.vaccinations || raw.vaccinations || {}) as IPet['medical']['vaccinations'],
    },
  }

  return normalized as unknown as IPet
}

/**
 * Extracts and normalizes pet arrays from all known API response formats.
 */
export function extractPetsFromApiResponse(json: unknown): IPet[] {
  if (!json || typeof json !== 'object') return []

  const asRecord = json as Record<string, unknown>
  let rawList: unknown[] = []

  if (Array.isArray(json)) {
    rawList = json
  } else if (Array.isArray(asRecord.pets)) {
    rawList = asRecord.pets
  } else if (Array.isArray(asRecord.data)) {
    rawList = asRecord.data
  } else if (asRecord.data && typeof asRecord.data === 'object') {
    const sub = asRecord.data as Record<string, unknown>
    if (Array.isArray(sub.pets)) {
      rawList = sub.pets
    } else if (Array.isArray(sub.data)) {
      rawList = sub.data
    } else if (Array.isArray(sub.items)) {
      rawList = sub.items
    } else if (Array.isArray(sub.results)) {
      rawList = sub.results
    } else if (Array.isArray(sub.records)) {
      rawList = sub.records
    } else if (Array.isArray(sub.list)) {
      rawList = sub.list
    }
  } else if (Array.isArray(asRecord.items)) {
    rawList = asRecord.items
  } else if (Array.isArray(asRecord.results)) {
    rawList = asRecord.results
  } else if (Array.isArray(asRecord.records)) {
    rawList = asRecord.records
  } else if (Array.isArray(asRecord.list)) {
    rawList = asRecord.list
  } else {
    // Dynamic scan: Find first property holding an array of pet-like objects
    for (const val of Object.values(asRecord)) {
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0] !== null) {
        const sample = val[0] as Record<string, unknown>
        if ('name' in sample || 'species' in sample || 'id' in sample || 'petId' in sample || 'breed' in sample) {
          rawList = val
          break
        }
      }
    }
  }

  // Handle single pet response
  if (rawList.length === 0 && ('id' in asRecord || 'petId' in asRecord || 'slug' in asRecord) && 'name' in asRecord) {
    rawList = [asRecord]
  }

  return rawList
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => normalizePet(item))
}

/**
 * Extracts unified special needs information from a pet's medical, behavior, and description records.
 */
export function getPetSpecialNeeds(pet?: IPet | null): {
  isSpecialNeeds: boolean
  specialNeedsText: string
  specialNeedsList: string[]
} {
  if (!pet) {
    return { isSpecialNeeds: false, specialNeedsText: '', specialNeedsList: [] }
  }

  const items: string[] = []

  // 1. Medical special needs (e.g. ['blind (both eyes)'])
  if (Array.isArray(pet.medical?.specialNeeds)) {
    items.push(...pet.medical.specialNeeds.filter((s): s is string => Boolean(s && s.trim())))
  } else if (typeof pet.medical?.specialNeeds === 'string' && pet.medical.specialNeeds.trim()) {
    items.push(pet.medical.specialNeeds.trim())
  }

  // 2. Behavior special needs
  if (pet.behavior?.specialNeeds?.trim()) {
    items.push(pet.behavior.specialNeeds.trim())
  }

  // 3. Descriptions special needs
  if (pet.descriptions?.specialNeeds?.trim()) {
    items.push(pet.descriptions.specialNeeds.trim())
  }

  // 4. Medical viral positives
  if (pet.medical?.fivPositive) {
    items.push('FIV Positive')
  }
  if (pet.medical?.felvPositive) {
    items.push('FeLV Positive')
  }

  // 5. Medical health concerns
  if (Array.isArray(pet.medical?.healthConcerns)) {
    pet.medical.healthConcerns.forEach((concern) => {
      const label = typeof concern === 'string' ? concern : String(concern || '')
      if (label && label.trim()) items.push(label.trim())
    })
  }

  // Deduplicate case-insensitively
  const uniqueItems: string[] = []
  const seen = new Set<string>()

  for (const item of items) {
    const key = item.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      const formatted = item.charAt(0).toUpperCase() + item.slice(1)
      uniqueItems.push(formatted)
    }
  }

  return {
    isSpecialNeeds: uniqueItems.length > 0,
    specialNeedsText: uniqueItems.join(', '),
    specialNeedsList: uniqueItems,
  }
}
