import useResizeObserver from './useResizeObserver'

import useObserver from './useObserver'

jest.mock('resize-observer-polyfill', () => 'ResizeObserver')

jest.mock('./useObserver')

it('should call useObserver with ResizeObserver with no options', () => {
  useResizeObserver()

  expect(useObserver).toBeCalledWith('ResizeObserver')
})
