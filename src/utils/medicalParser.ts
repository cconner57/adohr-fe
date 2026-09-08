import type {
  IPetMedicalPortalData,
  IVaccineSeries,
} from '@/models/common'
import { formatDate } from '@/utils/date'
import { buildDiagnosticTests, type IDiagnosticTestResult } from '@/utils/medicalDiagnostics'
import {
  buildDietInfo,
  buildMedicationsList,
  buildPhysicalTraitCapsules,
  buildProceduresList,
  type IDietGuidelines,
  type IProcedureItem,
} from '@/utils/medicalDiet'

export type { IDiagnosticTestResult, IDietGuidelines, IProcedureItem }
export {
  buildDiagnosticTests,
  buildDietInfo,
  buildMedicationsList,
  buildPhysicalTraitCapsules,
  buildProceduresList,
}

export interface IParsedVaccineRecord {
  name: string
  administered?: string | null
  expires?: string | null
  veterinarian?: string | null
  status?: string | null
}

export interface ITimelineEvent {
  type: 'intake' | 'surgery' | 'microchip' | 'vaccine' | 'diagnostic'
  title: string
  date: string
  note: string
  status: 'completed' | 'current'
}

export interface IIdentificationInfo {
  isChipped: boolean
  microchipId: string
  microchipBrand?: string | null
  secondaryMicrochipId?: string | null
  secondaryMicrochipBrand?: string | null
  rabiesTagNumber?: string | null
  licenseTagNumber?: string | null
}

export const getFieldIgnoreCase = (obj: unknown, ...keys: string[]): unknown => {
  if (!obj || typeof obj !== 'object') return undefined
  const rec = obj as Record<string, unknown>
  const targets = keys.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, ''))
  for (const [k, v] of Object.entries(rec)) {
    const normK = k.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (targets.includes(normK) && v !== undefined && v !== null && v !== '') {
      return v
    }
  }
  return undefined
}

export const extractDateValue = (raw: unknown): string | null => {
  if (!raw) return null
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed || trimmed === '-' || trimmed === 'null' || trimmed.toLowerCase() === 'not provided') {
      return null
    }
    return trimmed
  }
  if (typeof raw === 'number' && !Number.isNaN(raw) && raw > 0) {
    const ms = raw < 1e11 ? raw * 1000 : raw
    const d = new Date(ms)
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString().slice(0, 10)
  }
  if (typeof raw === 'object') {
    const inner = getFieldIgnoreCase(
      raw,
      'date', 'dateAdministered', 'administeredDate', 'value', 'val', 'timestamp', 'formatted',
    )
    if (inner && inner !== raw) return extractDateValue(inner)
  }
  return null
}

export const formatMicrochipId = (raw?: string | number | null): string => {
  if (!raw) return ''
  const str = String(raw).trim()
  if (!str) return ''
  const digitsOnly = str.replace(/\s+/g, '')
  if (/^\d+$/.test(digitsOnly)) {
    return digitsOnly.replace(/(\d{3})(?=\d)/g, '$1 ')
  }
  return str
}

export const toDateLabel = (value?: unknown): string => {
  const extracted = extractDateValue(value)
  if (!extracted) return 'Not provided'
  const formatted = formatDate(extracted)
  return formatted === '-' ? extracted : formatted
}

export const parseVaccineRecord = (
  name: string,
  record?: unknown,
): IParsedVaccineRecord | null => {
  if (!record) return null
  if (typeof record === 'string' || typeof record === 'number' || record instanceof Date) {
    const d = extractDateValue(record)
    return d ? { name, administered: toDateLabel(d) } : null
  }
  if (typeof record === 'object' && record !== null) {
    const rec = record as Record<string, unknown>
    const adminRaw = getFieldIgnoreCase(
      rec,
      'dateAdministered', 'date_administered', 'administeredDate', 'administered_date',
      'adminDate', 'admin_date', 'date', 'dateGiven', 'date_given', 'givenDate',
      'given_date', 'administered', 'administeredAt', 'vaccinationDate', 'value',
    )

    const expRaw = getFieldIgnoreCase(
      rec,
      'expiresAt', 'expires_at', 'expirationDate', 'expiration_date', 'expiration',
      'expires', 'expDate', 'exp_date', 'exp', 'dueDate', 'due_date', 'nextDueDate',
      'next_due_date', 'nextDoseReminder', 'validUntil', 'valid_until',
    )

    const vet = getFieldIgnoreCase(
      rec,
      'veterinarian', 'vet', 'clinic', 'provider', 'doctor', 'administeredBy', 'administeringVeterinarian',
    )
    const status = getFieldIgnoreCase(rec, 'status', 'notes', 'note', 'comment', 'description')

    const adminDate = extractDateValue(adminRaw)
    const expDate = extractDateValue(expRaw)

    if (!adminDate && !expDate && !vet && !status) return null

    let administeredLabel = 'Not provided'
    if (adminDate) {
      administeredLabel = toDateLabel(adminDate)
    } else if (expDate) {
      administeredLabel = 'Administered'
    }

    return {
      name,
      administered: administeredLabel,
      expires: expDate ? toDateLabel(expDate) : null,
      veterinarian: typeof vet === 'string' && vet.trim() ? vet.trim() : null,
      status: typeof status === 'string' && status.trim() ? status.trim() : null,
    }
  }
  return null
}

export const expandSeriesObjects = (
  label: string,
  series?: IVaccineSeries,
): IParsedVaccineRecord[] => {
  if (!series) return []
  const rows: IParsedVaccineRecord[] = []
  const round1 = parseVaccineRecord(`${label} Round 1`, series.round1)
  const round2 = parseVaccineRecord(`${label} Round 2`, series.round2)
  const round3 = parseVaccineRecord(`${label} Round 3`, series.round3)

  if (round1) rows.push(round1)
  if (round2) rows.push(round2)
  if (round3) rows.push(round3)

  if (rows.length === 0 && series.isComplete) {
    rows.push({ name: label, status: 'Series marked complete' })
  }
  return rows
}

export const buildVaccineRecords = (
  portalData: IPetMedicalPortalData | null,
): IParsedVaccineRecord[] => {
  if (!portalData) return []
  const lines: IParsedVaccineRecord[] = []
  const seenNames = new Set<string>()

  const addRecord = (rec: IParsedVaccineRecord | null) => {
    if (!rec) return
    const key = rec.name.toLowerCase().trim()
    if (seenNames.has(key)) return
    seenNames.add(key)
    lines.push(rec)
  }

  const med = (portalData.medical || {}) as Record<string, unknown>
  const dataRoot = portalData as unknown as Record<string, unknown>

  // 1. Process array sources
  const arraySources = [
    med.vaccinations, med.vaccines, med.immunizations, med.preventatives,
    med.records, dataRoot.vaccinations, dataRoot.vaccines, dataRoot.medicalRecords,
  ]

  arraySources.forEach((src) => {
    if (Array.isArray(src)) {
      src.forEach((item, idx) => {
        if (!item) return
        if (typeof item === 'string') {
          addRecord(parseVaccineRecord(`Vaccine #${idx + 1}`, item))
        } else if (typeof item === 'object') {
          const vName =
            (getFieldIgnoreCase(item, 'name', 'vaccine', 'vaccineName', 'type', 'title', 'label') as string) ||
            `Vaccine #${idx + 1}`
          addRecord(parseVaccineRecord(vName, item))
        }
      })
    }
  })

  // 2. Standard recognized vaccines across object sources
  const mapSources: Array<Record<string, unknown>> = [
    typeof med.vaccinations === 'object' && !Array.isArray(med.vaccinations)
      ? (med.vaccinations as Record<string, unknown>)
      : null,
    typeof med.vaccines === 'object' && !Array.isArray(med.vaccines)
      ? (med.vaccines as Record<string, unknown>)
      : null,
    med,
    dataRoot,
  ].filter(Boolean) as Array<Record<string, unknown>>

  const standardKeys = [
    { match: ['rabies', 'rabiesvaccine', 'rabiesdate', 'rabies_vaccine'], label: 'Rabies' },
    { match: ['bordetella', 'bordetellavaccine', 'kennelcough', 'bordetella_vaccine'], label: 'Bordetella' },
    { match: ['fvrcp', 'felinedistemper', 'distempercat', 'feline_distemper'], label: 'FVRCP', isSeries: true },
    { match: ['dhpp', 'caninedistemper', 'distemperdog', 'da2pp', 'canine_distemper'], label: 'Canine Distemper', isSeries: true },
    { match: ['felv', 'felineleukemia', 'feline_leukemia'], label: 'Feline Leukemia', isSeries: true },
    { match: ['leptospira', 'lepto'], label: 'Leptospira', isSeries: true },
  ]

  for (const src of mapSources) {
    for (const item of standardKeys) {
      if (seenNames.has(item.label.toLowerCase())) continue
      const val = getFieldIgnoreCase(src, ...item.match)
      if (!val) continue

      if (
        item.isSeries &&
        typeof val === 'object' &&
        ('round1' in (val as object) || 'isComplete' in (val as object))
      ) {
        expandSeriesObjects(item.label, val as IVaccineSeries).forEach((r) => addRecord(r))
      } else {
        addRecord(parseVaccineRecord(item.label, val))
      }
    }

    if (src === med.vaccinations || src === med.vaccines) {
      for (const [key, val] of Object.entries(src)) {
        if (!val) continue
        const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
        const isStandard = standardKeys.some((s) => s.match.includes(normKey))
        if (isStandard || normKey === 'other' || normKey === 'documents') continue

        const cleanTitle = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase())

        if (
          typeof val === 'object' &&
          ('round1' in (val as object) || 'isComplete' in (val as object))
        ) {
          expandSeriesObjects(cleanTitle, val as IVaccineSeries).forEach((r) => addRecord(r))
        } else {
          addRecord(parseVaccineRecord(cleanTitle, val))
        }
      }
    }
  }

  // 3. Process other array
  mapSources.forEach((src) => {
    const other = getFieldIgnoreCase(src, 'other', 'customVaccines', 'additionalVaccines')
    if (Array.isArray(other)) {
      other.forEach((item, idx) => {
        const name =
          (getFieldIgnoreCase(item, 'name', 'title', 'vaccine') as string) ||
          `Vaccine #${idx + 1}`
        addRecord(parseVaccineRecord(name, item))
      })
    }
  })

  // 4. Fallback: Rabies certificate document
  if (!seenNames.has('rabies') && Array.isArray(portalData.medical?.documents)) {
    const rabiesDoc = portalData.medical.documents.find((d) =>
      d.title?.toLowerCase().includes('rabies') || d.fileName?.toLowerCase().includes('rabies'),
    )
    if (rabiesDoc && rabiesDoc.uploadedAt) {
      addRecord({
        name: 'Rabies',
        administered: toDateLabel(rabiesDoc.uploadedAt),
        veterinarian: rabiesDoc.veterinarian || null,
        status: rabiesDoc.notes || 'Verified by attached certificate',
      })
    }
  }

  return lines
}

export const isFemale = (sex?: string | null): boolean => {
  if (!sex || typeof sex !== 'string') return false
  const s = sex.trim().toLowerCase()
  return s === 'female' || s === 'f'
}

export const isMale = (sex?: string | null): boolean => {
  if (!sex || typeof sex !== 'string') return false
  const s = sex.trim().toLowerCase()
  return s === 'male' || s === 'm'
}

export const getSpayNeuterLabels = (
  sex?: string | null,
  isCompleted = false,
): {
  sectionTitle: string
  surgeryTitle: string
  statusPill: string
  timelineNote: string
} => {
  if (isFemale(sex)) {
    return {
      sectionTitle: 'Spay Status',
      surgeryTitle: 'Spay Surgery',
      statusPill: isCompleted ? '✓ Spayed' : 'Pending Spay',
      timelineNote: 'Spay sterilization procedure completed with full post-op recovery.',
    }
  }
  if (isMale(sex)) {
    return {
      sectionTitle: 'Neuter Status',
      surgeryTitle: 'Neuter Surgery',
      statusPill: isCompleted ? '✓ Neutered' : 'Pending Neuter',
      timelineNote: 'Neuter sterilization procedure completed with full post-op recovery.',
    }
  }
  return {
    sectionTitle: 'Spay / Neuter Status',
    surgeryTitle: 'Spay / Neuter Surgery',
    statusPill: isCompleted ? '✓ Spayed/Neutered' : 'Pending Sterilization',
    timelineNote: 'Sterilization procedure completed with full post-op recovery.',
  }
}

export const getSpayNeuterInfo = (
  portalData: IPetMedicalPortalData | null,
): { isSpayedNeutered: boolean; spayNeuterDate: string | null } => {
  if (!portalData) return { isSpayedNeutered: false, spayNeuterDate: null }
  const med = (portalData.medical || {}) as Record<string, unknown>
  const raw = getFieldIgnoreCase(
    med,
    'spayedOrNeuteredDate', 'spayed_or_neutered_date', 'spayNeuterDate',
    'spay_neuter_date', 'dateSpayedNeutered', 'date_spayed_neutered', 'spayDate',
  )

  const spayNeuterDate = extractDateValue(raw)
  const isSpayedNeutered = Boolean(
    getFieldIgnoreCase(med, 'spayedOrNeutered', 'spayed_or_neutered', 'isSpayed', 'isNeutered') ||
    spayNeuterDate,
  )

  return { isSpayedNeutered, spayNeuterDate }
}

export const buildIdentificationInfo = (
  portalData: IPetMedicalPortalData | null,
): IIdentificationInfo => {
  if (!portalData) {
    return { isChipped: false, microchipId: '', microchipBrand: null, rabiesTagNumber: null, licenseTagNumber: null }
  }
  const med = (portalData.medical || {}) as Record<string, unknown>
  const chipObj = (med.microchip || {}) as Record<string, unknown>
  const chipIdRaw = getFieldIgnoreCase(
    chipObj, 'microchipID', 'microchipId', 'microchip_id', 'id',
  ) ?? getFieldIgnoreCase(med, 'microchipID', 'microchipId', 'microchip_id')

  const isChipped = Boolean(
    getFieldIgnoreCase(chipObj, 'microchipped', 'isMicrochipped') ??
    getFieldIgnoreCase(med, 'microchipped', 'isMicrochipped') ??
    chipIdRaw,
  )

  const chipStr = formatMicrochipId(chipIdRaw as string | number)
  const company = (getFieldIgnoreCase(chipObj, 'microchipCompany', 'company', 'brand') ??
    getFieldIgnoreCase(med, 'microchipCompany', 'microchipBrand', 'company', 'brand')) as string | null

  const secChipRaw = getFieldIgnoreCase(
    chipObj, 'secondaryMicrochipID', 'secondaryMicrochipId', 'secondary_microchip_id',
  )
  const secCompany = getFieldIgnoreCase(
    chipObj, 'secondaryMicrochipCompany', 'secondary_microchip_company',
  ) as string | null

  const rabiesTag = getFieldIgnoreCase(med, 'rabiesTagNumber', 'rabiesTag', 'rabies_tag_number', 'rabies_tag') as string | null
  const licenseTag = getFieldIgnoreCase(med, 'licenseTagNumber', 'licenseTag', 'license_tag_number', 'license_tag') as string | null

  return {
    isChipped,
    microchipId: chipStr,
    microchipBrand: typeof company === 'string' && company.trim() ? company.trim() : null,
    secondaryMicrochipId: secChipRaw ? formatMicrochipId(secChipRaw as string | number) : null,
    secondaryMicrochipBrand: typeof secCompany === 'string' && secCompany.trim() ? secCompany.trim() : null,
    rabiesTagNumber: typeof rabiesTag === 'string' && rabiesTag.trim() ? rabiesTag.trim() : null,
    licenseTagNumber: typeof licenseTag === 'string' && licenseTag.trim() ? licenseTag.trim() : null,
  }
}

export const buildCareTimeline = (
  portalData: IPetMedicalPortalData | null,
  vaccines: IParsedVaccineRecord[],
): ITimelineEvent[] => {
  if (!portalData) return []
  const events: ITimelineEvent[] = []
  const { isSpayedNeutered, spayNeuterDate } = getSpayNeuterInfo(portalData)
  const labels = getSpayNeuterLabels(portalData.sex, isSpayedNeutered)

  // 1. Spay / Neuter Surgery
  if (isSpayedNeutered) {
    events.push({
      type: 'surgery',
      title: labels.surgeryTitle,
      date: spayNeuterDate ? toDateLabel(spayNeuterDate) : 'Completed',
      note: labels.timelineNote,
      status: 'completed',
    })
  }

  // 2. Microchip
  const ident = buildIdentificationInfo(portalData)
  if (ident.isChipped) {
    events.push({
      type: 'microchip',
      title: 'Microchip Implantation & Registration',
      date: 'Active',
      note: ident.microchipId
        ? `Microchip #${ident.microchipId} registered with ${ident.microchipBrand || 'national registry'}.`
        : 'Microchip implanted and registered.',
      status: 'completed',
    })
  }

  // 3. Additional Surgeries / Procedures
  const procedures = buildProceduresList(portalData)
  procedures.forEach((p) => {
    events.push({
      type: 'surgery',
      title: p.name,
      date: p.date ? toDateLabel(p.date) : 'Completed',
      note: p.notes || (p.veterinarian ? `Performed by ${p.veterinarian}` : 'Clinical procedure recorded.'),
      status: 'completed',
    })
  })

  // 4. Diagnostic tests
  const diagnostics = buildDiagnosticTests(portalData)
  diagnostics.forEach((d) => {
    events.push({
      type: 'diagnostic',
      title: d.name,
      date: d.date || 'Completed',
      note: `Result: ${d.result}`,
      status: 'completed',
    })
  })

  // 5. Vaccines
  vaccines.forEach((v) => {
    events.push({
      type: 'vaccine',
      title: `Vaccination: ${v.name}`,
      date: v.administered && v.administered !== 'Not provided' ? v.administered : 'Administered',
      note: v.expires ? `Expires: ${v.expires}` : 'Up to date',
      status: 'completed',
    })
  })

  return events
}
