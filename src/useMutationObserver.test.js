import useMutationObserver from './useMutationObserver'

import useObserver from './useObserver'

jest.mock('./useObserver')

jest.mock('global/window', () => ({
  MutationObserver: 'MutationObserver',
}))


it('should call useObserver with MutationObserver and subscibeOptions', () => {
  useMutationObserver({ test: 'test' })

  expect(useObserver).toBeCalledWith('MutationObserver', {
    subscribeOptions: {
      test: 'test',
    },
  })
})
