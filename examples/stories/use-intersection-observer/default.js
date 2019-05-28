import React from 'react'
import { storiesOf } from '@storybook/react'

import { useIntersectionObserver } from 'react-use-observer'

const IntersectionObserverStory = () => {
  const [ref, intersectionObserverEntry] = useIntersectionObserver({
    root: null,
    rootMargin: '0px',
    threshold: Array(1 / 0.01).fill(0.01).map((current, index) => current * index),
  })

  const ratio = Math.floor(intersectionObserverEntry.intersectionRatio * 100)

  return (
    <div
      style={{
        height: 1500,
      }}
    >
      <p>Scroll Me</p>
      <div
        ref={ref}
        style={{
          position: 'relative',
          backgroundColor: '#f5f5f5',
          height: 250,
          width: 250,
        }}
      >
        <span>{`${ratio}%`}</span>
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
    </div>
  )
}

storiesOf('useIntersectionObserver', module)
  .add('default', () => <IntersectionObserverStory />)
