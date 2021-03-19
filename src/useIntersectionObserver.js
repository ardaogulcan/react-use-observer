import window from 'global/window'

import useObserver from './useObserver'

export default function useIntersectionObserver(observerOptions) {
  return useObserver(window.IntersectionObserver, { observerOptions })
}
