import React, { Fragment } from 'react'
import { storiesOf } from '@storybook/react'

import { useIntersectionObserver } from 'react-use-observer'

const Box = React.forwardRef(({ ratio, children }, ref) => (
  <div
    ref={ref}
    style={{
      position: 'relative',
      backgroundColor: '#f5f5f5',
      height: 250,
      width: 250,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {`${ratio}%`}
    </span>
    {children}
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
))

const MultipleIntersectionObserverStory = () => {
  const commonOptions = {
    root: null,
    rootMargin: '0px',
    threshold: Array(1 / 0.01).fill(0.01).map((current, index) => current * index),
  }
  const [box1Ref, box1Entry] = useIntersectionObserver(commonOptions)
  const [box2Ref, box2Entry] = useIntersectionObserver(commonOptions)
  const [box3Ref, box3Entry] = useIntersectionObserver({
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  })

  const box1Ratio = Math.floor(box1Entry.intersectionRatio * 100)
  const box2Ratio = Math.floor(box2Entry.intersectionRatio * 100)
  const box3Ratio = Math.floor(box3Entry.intersectionRatio * 100)

  return (
    <Fragment>
      <p>Scroll Me</p>
      <div
        style={{
          height: 1500,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box ref={box1Ref} ratio={box1Ratio}>Using same observer for common options</Box>
        <Box ref={box2Ref} ratio={box2Ratio}>Using same observer for common options</Box>
        <Box ref={box3Ref} ratio={box3Ratio}>Using new observer for different options</Box>
      </div>
    </Fragment>
  )
}

storiesOf('useIntersectionObserver', module)
  .add('Multiple Observers', () => <MultipleIntersectionObserverStory />)
