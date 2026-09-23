import { beforeEach, describe, expect, it, vi } from 'vitest'

import { prefetchRoute, routeLoaders, scheduleIdlePrefetch } from '../prefetch'

describe('prefetch utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('contains loaders for all primary routes', () => {
    expect(routeLoaders['/about']).toBeDefined()
    expect(routeLoaders['/adopt']).toBeDefined()
    expect(routeLoaders['/donate']).toBeDefined()
    expect(routeLoaders['/foster']).toBeDefined()
    expect(routeLoaders['/volunteer']).toBeDefined()
    expect(routeLoaders['/happy-tails']).toBeDefined()
    expect(routeLoaders['/wishlist']).toBeDefined()
    expect(routeLoaders['/news']).toBeDefined()
    expect(routeLoaders['/medical-records']).toBeDefined()
  })

  it('calls loader for known route and strips query/hash', () => {
    const mockLoader = vi.fn().mockResolvedValue({})
    routeLoaders['/custom-test-route'] = mockLoader

    prefetchRoute('/custom-test-route?param=1#section')
    expect(mockLoader).toHaveBeenCalledTimes(1)

    // Second call should be deduplicated
    prefetchRoute('/custom-test-route')
    expect(mockLoader).toHaveBeenCalledTimes(1)

    delete routeLoaders['/custom-test-route']
  })

  it('safely handles unknown routes without errors', () => {
    expect(() => prefetchRoute('/unknown-route-123')).not.toThrow()
  })

  it('scheduleIdlePrefetch calls idle callback or setTimeout fallback', () => {
    const originalRequestIdleCallback = window.requestIdleCallback
    const idleSpy = vi.fn((cb: IdleRequestCallback) => {
      cb({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline)
      return 1
    })

    window.requestIdleCallback = idleSpy as unknown as typeof window.requestIdleCallback

    scheduleIdlePrefetch(['/about'])
    expect(idleSpy).toHaveBeenCalled()

    window.requestIdleCallback = originalRequestIdleCallback
  })
})
