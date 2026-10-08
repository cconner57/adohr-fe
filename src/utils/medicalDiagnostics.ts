import type { IPetMedicalPortalData } from '@/models/common'
import { extractDateValue, getFieldIgnoreCase, toDateLabel } from '@/utils/medicalParser'

export interface IDiagnosticTestResult {
  name: string
  result: string
  date: string
  rawDate?: string | null
  isPositive: boolean
  isNegative: boolean
}

function normalizeResultText(val: unknown): { result: string; isPositive: boolean; isNegative: boolean } {
  const str = String(val).trim()
  const lower = str.toLowerCase()
  if (val === true || lower === 'positive' || lower === 'yes') {
    return { result: 'Positive', isPositive: true, isNegative: false }
  }
  if (val === false || lower === 'negative' || lower === 'no' || lower === 'clear') {
    return { result: 'Negative', isPositive: false, isNegative: true }
  }
  const isPos = lower.includes('positive') || lower.includes('abnormal')
  return { result: str, isPositive: isPos, isNegative: !isPos }
}

export const buildDiagnosticTests = (
  portalData: IPetMedicalPortalData | null,
): IDiagnosticTestResult[] => {
  if (!portalData) return []
  const med = (portalData.medical || {}) as Record<string, unknown>
  const dataRoot = portalData as unknown as Record<string, unknown>
  const diagContainer = (
    med.diseaseTesting ??
    med.testing ??
    med.diagnostics ??
    med.labResults ??
    dataRoot.diseaseTesting ??
    dataRoot.testing ??
    dataRoot.diagnostics ??
    med
  ) as Record<string, unknown> | undefined

  if (!diagContainer || typeof diagContainer !== 'object') return []

  const results: IDiagnosticTestResult[] = []

  const getDiagField = (...keys: string[]): unknown => {
    return (
      (diagContainer ? getFieldIgnoreCase(diagContainer, ...keys) : undefined) ??
      getFieldIgnoreCase(med, ...keys) ??
      getFieldIgnoreCase(dataRoot, ...keys)
    )
  }

  // 1. FIV - require both test result and valid date
  const fivVal = getDiagField('fivResult', 'fiv_result', 'fivTestResult', 'fiv')
  const fivDate = extractDateValue(getDiagField('fivTestDate', 'fiv_test_date', 'fivDate', 'fiv_date'))
  if (fivVal !== undefined && fivVal !== null && fivVal !== '' && fivVal !== '-' && fivDate) {
    const parsed = normalizeResultText(fivVal)
    results.push({
      name: 'FIV Test (Feline Immunodeficiency Virus)',
      result: parsed.result,
      date: toDateLabel(fivDate),
      rawDate: fivDate,
      isPositive: parsed.isPositive,
      isNegative: parsed.isNegative,
    })
  }

  // 2. FeLV - require both test result and valid date
  const felvVal = getDiagField('felvResult', 'felv_result', 'felvTestResult', 'felv')
  const felvDate = extractDateValue(getDiagField('felvTestDate', 'felv_test_date', 'felvDate', 'felv_date'))
  if (felvVal !== undefined && felvVal !== null && felvVal !== '' && felvVal !== '-' && felvDate) {
    const parsed = normalizeResultText(felvVal)
    results.push({
      name: 'FeLV Test (Feline Leukemia Virus)',
      result: parsed.result,
      date: toDateLabel(felvDate),
      rawDate: felvDate,
      isPositive: parsed.isPositive,
      isNegative: parsed.isNegative,
    })
  }

  // 3. Heartworm - require both test result and valid date
  const hwVal = getDiagField('heartwormResult', 'heartworm_result', 'heartwormTestResult', 'heartworm')
  const hwDate = extractDateValue(getDiagField('heartwormTestDate', 'heartworm_test_date', 'heartwormDate', 'heartworm_date'))
  if (hwVal !== undefined && hwVal !== null && hwVal !== '' && hwVal !== '-' && hwDate) {
    const parsed = normalizeResultText(hwVal)
    results.push({
      name: 'Heartworm Screening Test',
      result: parsed.result,
      date: toDateLabel(hwDate),
      rawDate: hwDate,
      isPositive: parsed.isPositive,
      isNegative: parsed.isNegative,
    })
  }

  // 4. Fecal / Parasite - require both test result and valid date
  const fecalVal = getDiagField('fecalTestResult', 'fecal_result', 'fecal')
  const fecalDate = extractDateValue(getDiagField('fecalTestDate', 'fecal_test_date', 'fecalDate', 'fecal_date'))
  if (fecalVal !== undefined && fecalVal !== null && fecalVal !== '' && fecalVal !== '-' && fecalDate) {
    const parsed = normalizeResultText(fecalVal)
    results.push({
      name: 'Fecal Parasite & Giardia Screen',
      result: parsed.result,
      date: toDateLabel(fecalDate),
      rawDate: fecalDate,
      isPositive: parsed.isPositive,
      isNegative: parsed.isNegative,
    })
  }

  return results
}
