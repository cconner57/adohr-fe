const configuredPublicOrgId = import.meta.env.VITE_PUBLIC_ORG_ID?.trim() ?? ''

export const PUBLIC_ORG_ID = configuredPublicOrgId || 'adohr'

const INTERNAL_URL_BASE = 'https://adohr.local'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isAbsoluteUrl = (value: string) => {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)
}

const DEFAULT_RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])

interface IFetchRetryContext {
  response?: Response
  error?: unknown
  attempt: number
}

interface IFetchRetryOptions {
  retries?: number
  retryDelayMs?: number
  // eslint-disable-next-line no-unused-vars
  shouldRetry?: (context: IFetchRetryContext) => boolean
}

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const isRetryableFetchError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false
  }

  if (error.name === 'TimeoutError') {
    return true
  }

  // Browsers throw TypeError for network failures in fetch.
  return error instanceof TypeError
}

const defaultShouldRetry = (context: IFetchRetryContext) => {
  if (context.error) {
    return isRetryableFetchError(context.error)
  }

  if (!context.response) {
    return false
  }

  return DEFAULT_RETRYABLE_STATUS_CODES.has(context.response.status)
}

export const withPublicOrgId = (endpoint: string, orgId = PUBLIC_ORG_ID) => {
  const url = new URL(endpoint, INTERNAL_URL_BASE)

  if (!url.searchParams.get('orgId')) {
    url.searchParams.set('orgId', orgId)
  }

  if (isAbsoluteUrl(endpoint)) {
    return url.toString()
  }

  return `${url.pathname}${url.search}${url.hash}`
}

export const fetchWithRetry = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  options: IFetchRetryOptions = {},
) => {
  const { retries = 0, retryDelayMs = 500, shouldRetry = defaultShouldRetry } = options

  let lastError: unknown = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(input, init)

      if (!shouldRetry({ response, attempt }) || attempt === retries) {
        return response
      }
    } catch (error: unknown) {
      lastError = error

      if (!shouldRetry({ error, attempt }) || attempt === retries) {
        throw error
      }
    }

    await sleep(retryDelayMs)
  }

  throw lastError
}

export const parseApiErrorMessage = (payload: unknown, fallback: string) => {
  if (!isRecord(payload)) {
    return fallback
  }

  if (typeof payload.userMessage === 'string' && payload.userMessage.trim()) {
    return payload.userMessage
  }

  if (isRecord(payload.error)) {
    const nestedMessage = payload.error.message

    if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
      return nestedMessage
    }
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error
  }

  return fallback
}

export const getApiErrorMessage = async (response: Response, fallback: string) => {
  const payload = await response.json().catch(() => null)

  return parseApiErrorMessage(payload, fallback)
}
