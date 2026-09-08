export function formatDigitDate(dateString?: string | null) {
  if (!dateString || dateString.trim() === '' || dateString === '-' || dateString === 'null') return '-'

  const trimmed = dateString.trim()
  let date: Date

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const [y, m, d] = trimmed.slice(0, 10).split('-').map(Number)
    date = new Date(y, m - 1, d)
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) {
    const [m, d, y] = trimmed.split('/').map(Number)
    date = new Date(y, m - 1, d)
  } else {
    date = new Date(trimmed)
  }

  if (Number.isNaN(date.getTime())) return trimmed

  // Format as MM/DD/YYYY
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const yyyy = date.getFullYear()

  return `${mm}/${dd}/${yyyy}`
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr || dateStr.trim() === '' || dateStr === '-' || dateStr === 'null') return '-'

  const trimmed = dateStr.trim()
  let date: Date

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const [y, m, d] = trimmed.slice(0, 10).split('-').map(Number)
    date = new Date(y, m - 1, d)
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) {
    const [m, d, y] = trimmed.split('/').map(Number)
    date = new Date(y, m - 1, d)
  } else {
    date = new Date(trimmed)
  }

  if (Number.isNaN(date.getTime())) return trimmed

  return date.toLocaleDateString('en-US', {
    weekday: undefined,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function calculateAge(dateOfBirth?: string | null): string {
  if (!dateOfBirth) return '-'

  const birthDate = new Date(dateOfBirth)
  const today = new Date()

  if (Number.isNaN(birthDate.getTime())) return '-'

  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()
  let days = today.getDate() - birthDate.getDate()

  if (days < 0) {
    months--

    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
    days += prevMonthLastDay
  }

  if (months < 0) {
    years--
    months += 12
  }

  if (years < 0) return '0 days'

  if (years >= 1) {
    if (months === 0) return `${years} yr`
    return `${years} yr ${months} mo`
  }

  // < 1 year
  if (months > 0) {
    return `${months} mo`
  }

  // < 1 month
  return `${days} day${days === 1 ? '' : 's'}`
}

export function formatIntakeDate(dateStr?: string | null): string {
  if (!dateStr) return '-'

  // If it already matches YY-MMDD (e.g. 25-1124), return it
  if (/^\d{2}-\d{4}$/.test(dateStr)) return dateStr

  let date: Date

  if (dateStr.length === 10 && dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-').map(Number)
    date = new Date(y, m - 1, d)
  } else {
    date = new Date(dateStr)
  }

  if (Number.isNaN(date.getTime())) return dateStr

  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  return `${yy}-${mm}${dd}`
}
