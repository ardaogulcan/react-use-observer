import React from 'react'
import { renderHook } from 'react-hooks-testing-library'
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

it('should throw an error if no Observer given', () => {
  jest.spyOn(console, 'error').mockImplementation(() => { })

  const { result } = renderHook(() => useObserver())

  expect(result.error.message)
    .toBe('useObserver requires a valid WebAPI Observer as a first parameter')

  // eslint-disable-next-line no-console
  expect(console.error)
    .toHaveBeenCalledTimes(1)

  // eslint-disable-next-line no-console
  console.error.mockRestore()
})

it('should not throw an error on production mode', () => {
  const env = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'

  const { result } = renderHook(() => useObserver())
  expect(result.error).toBeUndefined()

  process.env.NODE_ENV = env
})

it('should create only one observer instance for same Observer and Options for all uses and rerenders', () => {
  const loopArr = [...Array(10)]

  loopArr.forEach(() => {
    renderHook(() => useObserver(MockObserver))
    renderHook(() => useObserver(MockObserver, { observerOptions: { test: 'test' } }))
    renderHook(() => useObserver(MockObserver, { observerOptions: { test: 'test2' } }))
    renderHook(() => useObserver(MockObserver, { observerOptions: { test: 'test' }, subscribeOptions: { test: 'test' } }))
  })

  const { rerender } = renderHook(() => useObserver(MockObserver))
  const { rerender: rerender2 } = renderHook(() => useObserver(MockObserver, { observerOptions: { test: 'test' } }))
  const { rerender: rerender3 } = renderHook(() => useObserver(MockObserver, { observerOptions: { test: 'test2' } }))

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
