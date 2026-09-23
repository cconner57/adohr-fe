/**
 * Route prefetching utility to eliminate chunk download latency on navigation.
 */

const prefetchedRoutes = new Set<string>()

export const routeLoaders: Record<string, () => Promise<unknown>> = {
  '/about': () => import('../pages/About.vue'),
  '/adopt': () => import('../pages/Adopt.vue'),
  '/donate': () => import('../pages/Donate.vue'),
  '/foster': () => import('../pages/Foster.vue'),
  '/volunteer': () => import('../pages/Volunteer.vue'),
  '/happy-tails': () => import('../pages/HappyTails.vue'),
  '/wishlist': () => import('../pages/Wishlist.vue'),
  '/news': () => import('../pages/News.vue'),
  '/medical-records': () => import('../pages/MedicalRecordsLookup.vue'),
  '/surrender': () => import('../pages/SurrenderPet.vue'),
}

/**
 * Prefetches the component chunk for a given route path if not already loaded.
 */
export function prefetchRoute(rawPath: string): void {
  const cleanPath = rawPath.split('?')[0].split('#')[0]
  if (prefetchedRoutes.has(cleanPath)) return

  const loader = routeLoaders[cleanPath]
  if (loader) {
    prefetchedRoutes.add(cleanPath)
    loader().catch((err) => {
      // Remove from cache so retry is possible
      prefetchedRoutes.delete(cleanPath)
      console.debug(`Prefetch failed for ${cleanPath}:`, err)
    })
  }
}

/**
 * Progressively prefetches top-level routes in the background during idle browser frames.
 */
export function scheduleIdlePrefetch(
  routes: string[] = ['/about', '/adopt', '/foster', '/volunteer', '/donate'],
): void {
  if (typeof window === 'undefined') return

  const queue = [...routes]

  const prefetchNext = () => {
    if (queue.length === 0) return
    const path = queue.shift()
    if (path) {
      prefetchRoute(path)
    }
    if (queue.length > 0) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(prefetchNext, { timeout: 2000 })
      } else {
        setTimeout(prefetchNext, 300)
      }
    }
  }

  // Initial delay to avoid competing with critical first-render resources
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetchNext, { timeout: 3000 })
  } else {
    setTimeout(prefetchNext, 1200)
  }
}
