import React, { Fragment } from 'react'
import { storiesOf } from '@storybook/react'

import { useIntersectionObserver } from 'react-use-observer'

const Box = React.forwardRef(({ ratio, children, ...props }, ref) => (
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
    {...props}
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

const dummyArray = new Array(5).fill('')

const DynamicRefIntersectionObserverStory = () => {
  const [firstRef, firstEntry] = useIntersectionObserver({
    threshold: [0.5],
  })

  const ratio = Math.floor((firstEntry ? firstEntry.intersectionRatio : 1) * 100)

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
        {dummyArray.map((_, index) => (
          <Box
            key={`key${index}`}
            ref={index === 0 ? firstRef : undefined}
            ratio={index === 0 ? ratio : 100}
          />
        ))}
      </div>
    </Fragment>
  )
}

storiesOf('useIntersectionObserver', module).add('Dynamic Ref', () => (
  <DynamicRefIntersectionObserverStory />
))
