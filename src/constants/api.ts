export const normalizeApiBaseUrl = (value: string | undefined) => {
  return (
    value
      ?.trim()
      .replace(/\/+$/, '')
      .replace(/\.(?=\/?$)/, '') || ''
  )
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)

export const API_ENDPOINTS = {
  VOLUNTEER_APPLICATION: `${API_BASE_URL}/applications/volunteer`,
  FOSTER_APPLICATION: `${API_BASE_URL}/applications/foster`,
  ADOPTION_APPLICATION: `${API_BASE_URL}/applications/adoption`,
  ADOPTED_PETS_COUNT: `${API_BASE_URL}/pets/adopted-count`,
  PET_SPOTLIGHT: `${API_BASE_URL}/pets/spotlight`,
  SURRENDER_APPLICATION: `${API_BASE_URL}/applications/surrender`,
  PET_INQUIRY: `${API_BASE_URL}/applications/inquiry`,
  METRICS: `${API_BASE_URL}/metrics`,
  PETS: `${API_BASE_URL}/pets`,
  PETS_LIST: `${API_BASE_URL}/pets`,
  PET_DETAILS: (idOrSlug: string) => `${API_BASE_URL}/v1/pets/${idOrSlug}`,
  PET_PHOTOS: (id: string) => `${API_BASE_URL}/pets/${id}/photos`,
  NEWS_PUBLIC: `${API_BASE_URL}/public/news`,
  MARKETING_CAMPAIGNS: `${API_BASE_URL}/v1/marketing/campaigns`, // Using v1
  APPLICATIONS: `${API_BASE_URL}/v1/applications`,
  VOLUNTEERS: `${API_BASE_URL}/v1/volunteers`,
  SHIFTS: `${API_BASE_URL}/v1/shifts`,
  SHIFTS_META_ROLES: `${API_BASE_URL}/v1/shifts/meta/roles`,

  // Public Calendar & Events (Read-Only)
  EVENTS_PUBLIC: `${API_BASE_URL}/v1/events/public`,
  EVENTS_UPCOMING: `${API_BASE_URL}/v1/events/upcoming`,

  // Auth & Users
  VALIDATE_INVITE: (token: string) => `${API_BASE_URL}/validate-invite/${token}`,
  REGISTER: `${API_BASE_URL}/register`,
  USERS_ME: `${API_BASE_URL}/users/me`,
  LOGIN: `${API_BASE_URL}/login`,
  LOGOUT: `${API_BASE_URL}/users/logout`,
  USERS: `${API_BASE_URL}/users`,

  // Notifications
  NOTIFICATIONS_PUBLIC_KEY: `${API_BASE_URL}/v1/notifications/public-key`,
  NOTIFICATIONS_SUBSCRIBE: `${API_BASE_URL}/v1/notifications/subscribe`,
  NOTIFICATIONS_TEST: `${API_BASE_URL}/v1/notifications/test`,
}
