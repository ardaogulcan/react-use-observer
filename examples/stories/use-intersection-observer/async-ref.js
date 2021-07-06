import React, { useEffect, useState } from 'react'
import { storiesOf } from '@storybook/react'

import { useIntersectionObserver } from 'react-use-observer'

const IntersectionObserverAsyncRefStory = () => {
  const [visible, setVisible] = useState(false)
  const [ref, intersectionObserverEntry] = useIntersectionObserver({
    root: null,
    rootMargin: '0px',
    threshold: Array(1 / 0.01)
      .fill(0.01)
      .map((current, index) => current * index),
  })

  const ratio = Math.floor(intersectionObserverEntry.intersectionRatio * 100)

  useEffect(() => {
    // mimic async nature of data loading
    setTimeout(() => {
      setVisible(true)
    }, 1000)
  }, [])

  return (
    <div
      style={{
        height: 1500,
      }}
    >
      <p>Scroll Me</p>
      {visible && (
        <div
          ref={ref}
          style={{
            position: 'relative',
            backgroundColor: '#f5f5f5',
            height: 250,
            width: 250,
          }}
        >
          <div>{`${ratio}%`}</div>
          <span>
            {intersectionObserverEntry instanceof IntersectionObserverEntry
              ? 'has an observer entry'
              : 'does nott have an observer entry'}
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
          >
            {`${ratio}%`}
          </span>
        </div>
      )}
    </div>
  )
}

storiesOf('useIntersectionObserver', module).add('async-ref', () => (
  <IntersectionObserverAsyncRefStory />
))
