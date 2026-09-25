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
        rootMargin: '0px 0px -20px 0px',
      },
    )
    observers.set(key, obs)
  }
  return obs
}

export function useScrollReveal(className = 'reveal', threshold = 0.05) {
  const vScrollReveal = {
    mounted: (el: HTMLElement) => {
      el.classList.add(className)
      const observer = getObserver(className, threshold)
      if (!observer) {
        el.classList.add('active')
        return
      }

      if (typeof window !== 'undefined' && typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect()
          // If already in viewport on mount (e.g. Hero section), activate smoothly on initial render
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('active')
          } else {
            observer.observe(el)
          }
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
