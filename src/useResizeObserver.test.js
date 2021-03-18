import { renderHook } from 'react-hooks-testing-library'
import window from 'global/window'

import useResizeObserver from './useResizeObserver'
import useObserver from './useObserver'

jest.mock('global/window', () => ({
  ResizeObserver: () => 'ResizeObserver',
}))

jest.mock('./useObserver')

it('should call useObserver with ResizeObserver with no options', () => {
  renderHook(() => useResizeObserver())

  expect(useObserver).toBeCalledWith(window.ResizeObserver)
})
