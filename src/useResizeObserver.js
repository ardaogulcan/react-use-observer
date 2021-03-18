import { useEffect } from 'react'
import window from 'global/window'

import useObserver from './useObserver'

export default function useResizeObserver() {
  useEffect(() => {
    const isResizeObserverAvailable = 'ResizeObserver' in window

    if (!isResizeObserverAvailable) {
      throw new Error(
        'ResizeObserver is not available in this environment please consider using polyfill https://github.com/que-etc/resize-observer-polyfill',
      )
    }
  }, [])

  return useObserver(window.ResizeObserver)
}
