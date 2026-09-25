import { useMediaQuery } from './useMediaQuery'

export const useIsMobile = () => {
  return useMediaQuery('(max-width: 640px)')
}

export const useIsTablet = () => {
  return useMediaQuery('(max-width: 768px)')
}

export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 769px)')
}
