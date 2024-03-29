import { useState, useCallback } from 'react'
import useDeepCompareEffect from './helpers/useDeepCompareEffect'

import createObserverPublisher from './helpers/createObserverPublisher'

let publishers

export default function useObserver(Observer, { observerOptions, subscribeOptions } = {}) {
  const [entry, setEntry] = useState({})
  const [element, setElement] = useState()

  const ref = useCallback((node) => {
    if (node !== null) {
      setElement(node)
    }
  }, [])

  useDeepCompareEffect(() => {
    if (!element || !Observer) {
      return undefined;
    }

    if (!publishers) {
      publishers = new Map()
    }

    let options = publishers.get(Observer)
    if (!options) {
      options = new Map()
      publishers.set(Observer, options)
    }

    const optionId = observerOptions ? JSON.stringify(observerOptions) : 'default'
    let publisher = options.get(optionId)

    if (!publisher) {
      publisher = createObserverPublisher(Observer, observerOptions)
      options.set(optionId, publisher)
    }

    const { subscribe, unsubscribe } = publisher
    subscribe({ element, options: subscribeOptions }, newEntry => setEntry(newEntry))

    return () => unsubscribe(element)
  }, [element, Observer, observerOptions, subscribeOptions])

  return [ref, entry]
}
