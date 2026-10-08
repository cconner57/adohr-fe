import type { IPetMedicalPortalData } from '@/models/common'
import { buildDiagnosticTests } from '@/utils/medicalDiagnostics'
import { buildProceduresList } from '@/utils/medicalDiet'
import {
  buildIdentificationInfo,
  extractDateValue,
  getFieldIgnoreCase,
  type IParsedVaccineRecord,
  toDateLabel,
} from '@/utils/medicalParser'

export interface ITimelineEvent {
  type: 'intake' | 'surgery' | 'microchip' | 'vaccine' | 'diagnostic'
  title: string
  date: string
  note: string
  status: 'completed' | 'current'
  rawDate?: string | null
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

export const parseTimelineTimestamp = (dateStr?: string | null): number | null => {
  if (!dateStr || typeof dateStr !== 'string') return null
  const trimmed = dateStr.trim()
  if (!trimmed) return null

  const nonDateWords = new Set([
    'active',
    'completed',
    'administered',
    'not provided',
    'pending',
    'current',
    'unknown',
    'n/a',
    '-',
  ])
  if (nonDateWords.has(trimmed.toLowerCase())) return null

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const [y, m, d] = trimmed.slice(0, 10).split('-').map(Number)
    const localDate = new Date(y, m - 1, d)
    if (!isNaN(localDate.getTime())) return localDate.getTime()
  }

  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) {
    const [m, d, y] = trimmed.split('/').map(Number)
    const localDate = new Date(y, m - 1, d)
    if (!isNaN(localDate.getTime())) return localDate.getTime()
  }

  const d = new Date(trimmed)
  const time = d.getTime()
  if (!isNaN(time)) return time

  const extracted = extractDateValue(trimmed)
  if (extracted && extracted !== trimmed) {
    return parseTimelineTimestamp(extracted)
  }

  return null
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
      rawDate: spayNeuterDate || null,
    })
  }

  // 2. Microchip
  const ident = buildIdentificationInfo(portalData)
  if (ident.isChipped) {
    const med = (portalData.medical || {}) as Record<string, unknown>
    const chipObj = (med.microchip || {}) as Record<string, unknown>
    const chipDateRaw = getFieldIgnoreCase(
      chipObj, 'implantDate', 'implantedDate', 'date', 'implantedAt', 'implanted',
    )
    const chipDate = extractDateValue(chipDateRaw)

    events.push({
      type: 'microchip',
      title: 'Microchip Implantation & Registration',
      date: chipDate ? toDateLabel(chipDate) : 'Active',
      note: ident.microchipId
        ? `Microchip #${ident.microchipId} registered with ${ident.microchipBrand || 'national registry'}.`
        : 'Microchip implanted and registered.',
      status: 'completed',
      rawDate: chipDate || null,
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
      rawDate: p.date || null,
    })
  })

  // 4. Diagnostic tests
  const diagnostics = buildDiagnosticTests(portalData)
  diagnostics.forEach((d) => {
    events.push({
      type: 'diagnostic',
      title: d.name,
      date: d.date,
      note: `Result: ${d.result}`,
      status: 'completed',
      rawDate: d.rawDate || d.date,
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
      rawDate: v.administered && v.administered !== 'Not provided' ? v.administered : null,
    })
  })

  // 6. Rescue Intake & Admission (if recorded in portal data)
  const med = (portalData.medical || {}) as Record<string, unknown>
  const rawIntake =
    getFieldIgnoreCase(portalData, 'intakeDate', 'intake_date') ??
    getFieldIgnoreCase((portalData as unknown as Record<string, unknown>).details, 'intakeDate', 'intake_date') ??
    getFieldIgnoreCase(med, 'intakeDate', 'intake_date')
  const intakeDate = extractDateValue(rawIntake)
  if (intakeDate) {
    events.push({
      type: 'intake',
      title: 'Rescue Intake & Admission',
      date: toDateLabel(intakeDate),
      note: typeof med.intakeCondition === 'string' && med.intakeCondition.trim()
        ? `Intake condition: ${med.intakeCondition}. Admitted into ADOHR care.`
        : 'Official admission into ADOHR rescue care program.',
      status: 'completed',
      rawDate: intakeDate,
    })
  }

  const getUndatedPriority = (ev: ITimelineEvent): number => {
    switch (ev.type) {
      case 'microchip':
        return 1
      case 'diagnostic':
        return 2
      case 'surgery':
        return 3
      case 'vaccine':
        return 4
      case 'intake':
        return 5
      default:
        return 6
    }
  }

  // Sort events chronologically:
  // Undated items (microchip, diagnostic tests without dates) move to the top as most recent/active.
  // Dated items are sorted descending (most recent date first).
  events.sort((a, b) => {
    const timeA = parseTimelineTimestamp(a.rawDate) ?? parseTimelineTimestamp(a.date)
    const timeB = parseTimelineTimestamp(b.rawDate) ?? parseTimelineTimestamp(b.date)

    if (timeA === null && timeB === null) {
      return getUndatedPriority(a) - getUndatedPriority(b)
    }
    if (timeA === null) return -1
    if (timeB === null) return 1

    if (timeB !== timeA) return timeB - timeA

    return 0
  })

  return events
}
