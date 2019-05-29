import createObserverPublisher, { emptyPublisher } from './createObserverPublisher'

// No arrow function because we need constructor
export const MockObserver = jest.fn(callback => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  // Trigger for testing internals of publisher
  triggerChangesFor: (elements, entry) => callback(elements.map(element => ({
    target: element,
    ...entry,
  }))),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Call underlying observers correctly', () => {
  it('should observe subscribed element', () => {
    const { subscribe, observer } = createObserverPublisher(MockObserver)
    const target = { div: 'div' }

    subscribe(target)
    expect(observer.observe).toBeCalledWith(target, undefined)
  })

  it('should observe subscribed element with options ', () => {
    const { subscribe, observer } = createObserverPublisher(MockObserver)
    const element = { div: 'div' }

    subscribe({
      element,
      options: {
        test: 'test',
      },
    })

    expect(observer.observe).toBeCalledWith(element, { test: 'test' })
  })

  it('should unobserve unsubscribed element', () => {
    const { subscribe, unsubscribe, observer } = createObserverPublisher(MockObserver)
    const target = { div: 'div' }

    unsubscribe(target)
    expect(observer.unobserve).not.toBeCalledWith(target)

    subscribe(target)
    unsubscribe(target)
    expect(observer.unobserve).toBeCalledWith(target)
  })

  /*
    Some Observers have dedicated unobserve() while others only have disconnect()
    https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
    https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
    https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
    https://developer.mozilla.org/en-US/docs/Web/API/ReportingObserver
  */
  it('should disconnect if unobserve is not available for observer', () => {
    function MockDisc() {
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      }
    }

    const { subscribe, unsubscribe, observer } = createObserverPublisher(MockDisc)
    const target = { div: 'div' }

    unsubscribe(target)
    expect(observer.disconnect).not.toBeCalled()

    subscribe(target)
    unsubscribe(target)
    expect(observer.disconnect).toBeCalled()
  })
})

describe('Publish changes to the subscribers', () => {
  it('should return empty publisher if Observer is not given', () => {
    const publisher = createObserverPublisher()
    expect(publisher).toEqual(emptyPublisher)
  })

  it('should publish changes to subscribers', () => {
    const { subscribe, observer } = createObserverPublisher(MockObserver)

    // Create random number of subscribers
    const subscriberCount = Math.ceil(Math.random() * 10)
    const subscribers = Array(subscriberCount)
      .fill(jest.fn())
      .map((callback, index) => ({
        element: { div: `div${index}` },
        callback,
      }))

    subscribers.forEach(({ element, callback }) => {
      subscribe(element, callback)
    })

    // Trigger changes for random number of elements
    const triggeredSubs = subscribers
      .slice(0, Math.floor(Math.random() * subscriberCount))

    const triggerRecord = {
      test: 'test',
    }

    observer.triggerChangesFor(
      triggeredSubs.map(({ element }) => element),
      triggerRecord,
    )

    triggeredSubs.forEach(({ element: target, callback }) => {
      expect(callback).toBeCalledWith({
        target,
        ...triggerRecord,
      })
    })
  })

  it('should not publish to subscriber if not subscribed', () => {
    const { observer } = createObserverPublisher(MockObserver)

    const element = { div: 'div' }

    observer.triggerChangesFor([element])
  })

  it('should not subscribe same element twice', () => {
    const { subscribe, observer } = createObserverPublisher(MockObserver)

    const element = { div: 'div' }

    subscribe(element)
    expect(observer.observe).toBeCalledWith(element, undefined)

    observer.observe.mockClear()

    subscribe(element)
    expect(observer.observe).not.toBeCalledWith(element, undefined)
  })

  it('should not subscribe same element twice with same subscribe options', () => {
    const { subscribe, observer } = createObserverPublisher(MockObserver)

    const element = { div: 'div' }
    const options = { test: 'test' }

    subscribe({ element, options })
    expect(observer.observe).toBeCalledWith(element, options)

    observer.observe.mockClear()

    subscribe({ element, options })
    expect(observer.observe).not.toBeCalledWith(element, undefined)
  })

  it('should resubscribe if subscribe options change', () => {
    const { subscribe, observer } = createObserverPublisher(MockObserver)

    const element = { div: 'div' }
    const options = { test: 'test' }

    subscribe({ element, options })
    expect(observer.observe).toBeCalledWith(element, options)

    observer.observe.mockClear()

    subscribe({ element, options: { test: 'new' } })
    expect(observer.unobserve).toBeCalledWith(element)
    expect(observer.observe).toBeCalledWith(element, { test: 'new' })
  })

  it('should not unsubscribe already unsubscribed subscribers', () => {
    const { subscribe, unsubscribe, observer } = createObserverPublisher(MockObserver)

    const element = { div: 'div' }

    subscribe(element)
    unsubscribe(element)
    expect(observer.unobserve).toBeCalledWith(element)

    observer.unobserve.mockClear()

    unsubscribe(element)
    expect(observer.unobserve).not.toBeCalledWith(element)
  })
})
