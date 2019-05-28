export default function createObserverPublisher(Observer, options) {
  if (!Observer) {
    return {
      observer: {},
      subscribe: () => undefined,
      unsubscribe: () => undefined,
    }
  }

  const subscribers = new WeakMap()
  const observer = new Observer((entries) => {
    if (!Array.isArray(entries) || !entries.length) {
      return
    }

    entries.forEach((entry) => {
      const { callback } = subscribers.get(entry.target) || {}
      if (!callback) {
        return
      }

      callback(entry)
    })
  }, options)

  const unsubscribe = (element) => {
    if (!subscribers.get(element)) {
      return
    }

    subscribers.delete(element)

    if (!observer.unobserve) {
      observer.disconnect()
      return
    }

    observer.unobserve(element)
  }

  const subscribe = (target, callback) => {
    const element = target.element || target
    const targetOptions = target.options

    const subscriber = subscribers.get(element)
    if (subscriber) {
      if (targetOptions === subscriber.options) {
        return
      }
      unsubscribe(element)
    }

    subscribers.set(element, {
      callback,
      options: targetOptions,
    })

    observer.observe(element, targetOptions)
  }

  return {
    observer,
    subscribe,
    unsubscribe,
  }
}
