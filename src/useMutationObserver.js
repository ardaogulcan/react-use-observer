import useObserver from './useObserver'

const { MutationObserver } = (window || {})

export default function useMutationObserver(subscribeOptions) {
  return useObserver(MutationObserver, { subscribeOptions })
}
