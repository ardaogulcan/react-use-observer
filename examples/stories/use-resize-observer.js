import React from 'react'
import { storiesOf } from '@storybook/react'

import { useResizeObserver } from 'react-use-observer'

const ResizeObserverStory = () => {
  const [ref, resizeObserverEntry] = useResizeObserver()
  const {
    x = 0,
    y = 0,
    top = 0,
    left = 0,
    width = 0,
    height = 0,
    right = 0,
    bottom = 0,
  } = resizeObserverEntry.contentRect || {}

  return (
    <div
      ref={ref}
      style={{
        background: '#F5f5f5',
        padding: 10,
        minWidth: 400,
      }}
    >
      <p>x: {x}</p>
      <p>y: {y}</p>
      <p>top: {top}</p>
      <p>left: {left}</p>
      <p>width: {width}</p>
      <p>height: {height}</p>
      <p>right: {right}</p>
      <p>bottom: {bottom}</p>
    </div>
  )
}

storiesOf('useResizeObserver', module)
  .add('default', () => <ResizeObserverStory />)
