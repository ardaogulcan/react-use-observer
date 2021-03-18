import { renderHook } from 'react-hooks-testing-library'
import window from 'global/window'

import useIntersectionObserver from './useIntersectionObserver'
import useObserver from './useObserver'

jest.mock('global/window', () => ({
  IntersectionObserver: () => 'IntersectionObserver',
  IntersectionObserverEntry: () => 'IntersectionObserverEntry',
}))

jest.mock('./useObserver')

it('should call useObserver with IntersectionObserver and observerOptions', () => {
  renderHook(() => useIntersectionObserver({ test: 'test' }));

  expect(useObserver).toBeCalledWith(window.IntersectionObserver, {
    observerOptions: {
      test: 'test',
    },
  })
})
