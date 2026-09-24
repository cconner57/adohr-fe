const observers = new Map<string, IntersectionObserver>()

function getObserver(className: string, threshold: number): IntersectionObserver | null {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null
  }
  const key = `${className}-${threshold}`
  let obs = observers.get(key)
  if (!obs) {
    obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            obs?.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      },
    )
    observers.set(key, obs)
  }
  return obs
}

export function useScrollReveal(className = 'reveal', threshold = 0.1) {
  const vScrollReveal = {
    mounted: (el: HTMLElement) => {
      el.classList.add(className)
      const observer = getObserver(className, threshold)
      if (!observer) return
      // Delay observe to next frame so View Transitions API completes first
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
          observer.observe(el)
        })
      } else {
        observer.observe(el)
      }
    },
    unmounted: (el: HTMLElement) => {
      const observer = getObserver(className, threshold)
      observer?.unobserve(el)
    },
  }

  return {
    vScrollReveal,
  }
}
