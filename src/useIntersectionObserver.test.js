import useIntersectionObserver from './useIntersectionObserver'

import useObserver from './useObserver'

jest.mock('intersection-observer-polyfill', () => 'IntersectionObserver')

jest.mock('./useObserver')

it('should call useObserver with IntersectionObserver and observerOptions', () => {
  useIntersectionObserver({ test: 'test' })

  expect(useObserver).toBeCalledWith('IntersectionObserver', {
    observerOptions: {
      test: 'test',
    },
  })
})
