import IntersectionObserver from 'intersection-observer-polyfill'

import useObserver from './useObserver'

export default function useIntersectionObserver(observerOptions) {
  return useObserver(IntersectionObserver, { observerOptions })
}
