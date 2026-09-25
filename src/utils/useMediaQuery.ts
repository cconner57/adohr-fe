import { onMounted, onUnmounted, ref } from 'vue'

export function useMediaQuery(query: string) {
  const matches = ref(
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false,
  )
  let mediaQuery: MediaQueryList | undefined

  const updateMatch = (mediaQueryEvent: MediaQueryListEvent | MediaQueryList) => {
    matches.value = mediaQueryEvent.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    mediaQuery = window.matchMedia(query)
    matches.value = mediaQuery.matches

    mediaQuery.addEventListener('change', updateMatch)
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', updateMatch)
    }
  })

  return matches
}
