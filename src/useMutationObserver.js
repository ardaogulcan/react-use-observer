import window from 'global/window'
import useObserver from './useObserver'

export default function useMutationObserver(subscribeOptions) {
  return useObserver(window.MutationObserver, { subscribeOptions })
}
