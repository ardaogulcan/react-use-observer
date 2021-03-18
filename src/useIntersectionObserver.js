import { useEffect } from 'react'
import window from 'global/window'

import useObserver from './useObserver'

export default function useIntersectionObserver(observerOptions) {
  useEffect(() => {
    const isIntersectionObserverAvailable = 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window

    if (!isIntersectionObserverAvailable) {
      throw new Error(
        'IntersectionObserver is not available in this environment please consider using polyfill https://github.com/w3c/IntersectionObserver',
      )
    }
  }, [])

  return useObserver(window.IntersectionObserver, { observerOptions })
}
