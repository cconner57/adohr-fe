import type { IPetMedicalPortalData } from '@/models/common'
import { extractDateValue, getFieldIgnoreCase, toDateLabel } from '@/utils/medicalParser'

export interface IDiagnosticTestResult {
  name: string
  result: string
  date?: string | null
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
    dataRoot.diseaseTesting ??
    med
  ) as Record<string, unknown>

  if (!diagContainer || typeof diagContainer !== 'object') return []

  const results: IDiagnosticTestResult[] = []

  // 1. FIV
  const fivVal = getFieldIgnoreCase(diagContainer, 'fivResult', 'fiv_result', 'fivPositive', 'fiv_positive', 'fiv')
  const fivDate = extractDateValue(getFieldIgnoreCase(diagContainer, 'fivTestDate', 'fiv_test_date', 'fivDate'))
  if (fivVal !== undefined && fivVal !== null && fivVal !== '' && fivVal !== '-') {
    const parsed = normalizeResultText(fivVal)
    results.push({
      name: 'FIV Test (Feline Immunodeficiency Virus)',
      result: parsed.result,
      date: fivDate ? toDateLabel(fivDate) : null,
      isPositive: parsed.isPositive,
      isNegative: parsed.isNegative,
    })
  }

  // 2. FeLV
  const felvVal = getFieldIgnoreCase(diagContainer, 'felvResult', 'felv_result', 'felvPositive', 'felv_positive', 'felv')
  const felvDate = extractDateValue(getFieldIgnoreCase(diagContainer, 'felvTestDate', 'felv_test_date', 'felvDate'))
  if (felvVal !== undefined && felvVal !== null && felvVal !== '' && felvVal !== '-') {
    const parsed = normalizeResultText(felvVal)
    results.push({
      name: 'FeLV Test (Feline Leukemia Virus)',
      result: parsed.result,
      date: felvDate ? toDateLabel(felvDate) : null,
      isPositive: parsed.isPositive,
      isNegative: parsed.isNegative,
    })
  }

  // 3. Heartworm
  const hwVal = getFieldIgnoreCase(diagContainer, 'heartwormResult', 'heartworm_result', 'heartwormTestResult', 'heartworm')
  const hwDate = extractDateValue(getFieldIgnoreCase(diagContainer, 'heartwormTestDate', 'heartworm_test_date', 'heartwormDate'))
  if (hwVal !== undefined && hwVal !== null && hwVal !== '' && hwVal !== '-') {
    const parsed = normalizeResultText(hwVal)
    results.push({
      name: 'Heartworm Screening Test',
      result: parsed.result,
      date: hwDate ? toDateLabel(hwDate) : null,
      isPositive: parsed.isPositive,
      isNegative: parsed.isNegative,
    })
  }

  // 4. Fecal / Parasite
  const fecalVal = getFieldIgnoreCase(diagContainer, 'fecalTestResult', 'fecal_result', 'fecal')
  const fecalDate = extractDateValue(getFieldIgnoreCase(diagContainer, 'fecalTestDate', 'fecal_test_date'))
  if (fecalVal !== undefined && fecalVal !== null && fecalVal !== '' && fecalVal !== '-') {
    const parsed = normalizeResultText(fecalVal)
    results.push({
      name: 'Fecal Parasite & Giardia Screen',
      result: parsed.result,
      date: fecalDate ? toDateLabel(fecalDate) : null,
      isPositive: parsed.isPositive,
      isNegative: parsed.isNegative,
    })
  }

  return results
}
