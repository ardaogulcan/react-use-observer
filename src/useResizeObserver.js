import window from 'global/window'

import useObserver from './useObserver'

export default function useResizeObserver() {
  return useObserver(window.ResizeObserver)
}
