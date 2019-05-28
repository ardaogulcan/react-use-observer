import ResizeObserver from 'resize-observer-polyfill'

import useObserver from './useObserver'

export default function useResizeObserver() {
  return useObserver(ResizeObserver)
}

// export default function useResizeObserverPlain() {
//   const ref = useRef(null)
//   const [entry, setEntry] = useState({})

//   useEffect(() => {
//     if (!publisher) {
//       publisher = createObserverPublisher(ResizeObserver)
//     }

//     const element = ref.current
//     if (!element) {
//       return undefined
//     }

//     const { subscribe, unsubscribe } = publisher
//     subscribe(element, newEntry => setEntry(newEntry))

//     return () => unsubscribe(element)
//   }, [])

//   return [ref, entry]
// }
