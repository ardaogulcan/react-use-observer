import React, { useEffect, useState } from 'react'
import { render, act } from 'react-testing-library'

const mockObserve = jest.fn()
const mockUnobserve = jest.fn()

const MockObserver = jest.fn(callback => ({
  observe: mockObserve.mockImplementation((element) => {
    // eslint-disable-next-line no-param-reassign
    element.triggerChange = entry => callback([{ target: element, ...entry }])
  }),
  unobserve: mockUnobserve,
}))

let useObserver

beforeEach(() => {
  jest.clearAllMocks()
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    useObserver = require('./useObserver').default
  })
})

it('should not initialize observer if element ref is not provided', () => {
  // eslint-disable-next-line react/prop-types
  const ObservedComponent = ({ observer, options }) => {
    useObserver(observer, options);

    return <div />
  };

  render(<ObservedComponent observer={MockObserver} />);

  expect(MockObserver).not.toBeCalled();
});

it('should create only one observer instance for same Observer and Options for all uses and rerenders', () => {
  const loopArr = [...Array(10)]

  // eslint-disable-next-line react/prop-types
  const ObservedComponent = ({ observer, options }) => {
    const [ref] = useObserver(observer, options);

    return <div ref={ref} />
  };

  loopArr.forEach(() => {
    render(<ObservedComponent observer={MockObserver} />)
    render(<ObservedComponent observer={MockObserver} options={{ observerOptions: { test: 'test' } }} />)
    render(<ObservedComponent observer={MockObserver} options={{ observerOptions: { test: 'test2' } }} />)
    render(<ObservedComponent observer={MockObserver} options={{ observerOptions: { test: 'test' }, subscribeOptions: { test: 'test' } }} />)
  })

  const { rerender } = render(<ObservedComponent observer={MockObserver} />);
  const { rerender: rerender2 } = render(<ObservedComponent observer={MockObserver} options={{ observerOptions: { test: 'test' } }} />)
  const { rerender: rerender3 } = render(<ObservedComponent observer={MockObserver} options={{ observerOptions: { test: 'test2' } }} />)

  loopArr.forEach(() => {
    rerender()
    rerender2()
    rerender3()
  })

  expect(MockObserver).toHaveBeenCalledTimes(3)
})

it('should observe and unobserve element', () => {
  const TestComp = () => {
    const [ref] = useObserver(MockObserver)
    return <div ref={ref} />
  }

  const { unmount, container } = render(<TestComp />)
  const element = container.firstChild

  expect(mockObserve).toBeCalledWith(element, undefined)
  unmount()
  expect(mockUnobserve).toBeCalledWith(element)
})

it('should reobserve on options change', () => {
  // eslint-disable-next-line react/prop-types
  const TestComp = ({ options }) => {
    const [ref] = useObserver(MockObserver, options)
    return <div ref={ref} />
  }

  const { rerender, container } = render((
    <TestComp
      options={{
        subscribeOptions: { test: 'options' },
      }}
    />
  ))

  const element = container.firstChild

  expect(mockObserve).toBeCalledWith(element, { test: 'options' })

  rerender((
    <TestComp
      options={{
        subscribeOptions: { test: 'options 2' },
      }}
    />
  ))

  expect(mockUnobserve).toBeCalledWith(element)
  expect(mockObserve).toBeCalledWith(element, { test: 'options 2' })

  rerender((
    <TestComp
      options={{
        observerOptions: { test: 'observer' },
      }}
    />
  ))

  expect(mockUnobserve).toBeCalledWith(element)
  expect(mockObserve).toBeCalledWith(element, undefined)
  expect(MockObserver.mock.calls[MockObserver.mock.calls.length - 1][1])
    .toEqual({ test: 'observer' })
})

it('should update entry for element on change', () => {
  const TestComp = () => {
    const [ref, entry] = useObserver(MockObserver)
    const [ref2, entry2] = useObserver(MockObserver)
    return (
      <div>
        <div ref={ref} data-testid="element1">
          {entry.text}
        </div>
        <div ref={ref2} data-testid="element2">
          {entry2.text}
        </div>
      </div>
    )
  }

  const { getByTestId } = render(<TestComp />)
  const element1 = getByTestId('element1')
  const element2 = getByTestId('element2')

  act(() => {
    element1.triggerChange({ text: 'test1' })
    element2.triggerChange({ text: 'test2' })
  })

  expect(element1.textContent).toBe('test1')
  expect(element2.textContent).toBe('test2')
})

it('should work with async elements', () => {
  jest.useFakeTimers()
  const TestComp = () => {
    const [ref] = useObserver(MockObserver)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
      // mimic async nature of data loading
      setTimeout(() => {
        setVisible(true)
      }, 1000)
    }, [])

    return (
      <div>
        {visible && <div ref={ref} />}
      </div>
    )
  }

  const { unmount, container } = render(<TestComp />)

  act(() => {
    jest.runAllTimers()
  })

  const element = container.firstChild.firstChild

  expect(mockObserve).toBeCalledWith(element, undefined)
  unmount()
  expect(mockUnobserve).toBeCalledWith(element)
  jest.useRealTimers()
})
