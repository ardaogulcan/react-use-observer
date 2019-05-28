import React, { Fragment, useState } from 'react'
import { storiesOf } from '@storybook/react'

import { useObserver } from 'react-use-observer'

const getRandomColor = () => `#${(0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)}`

const getMutationText = ({
  type,
  attributeName,
  addedNodes,
  removedNodes,
}) => {
  switch (type) {
    case 'childList':
      return `${addedNodes.length > 0 ? 'Added' : 'Removed'} ${addedNodes.length || removedNodes.length} node(s)`
    case 'attributes':
      return `${attributeName} attribute has modified`
    default:
      return type ? `Mutation type: ${type}` : 'Waiting for mutation'
  }
}

const UseObserverStory = () => {
  const [elements, setElements] = useState([])
  const [background, setBackground] = useState('#f5f5f5')

  const [resizeRef, resizeObserverEntry] = useObserver(ResizeObserver)
  const [mutationRef, mutationObserverEntry] = useObserver(MutationObserver, {
    subscribeOptions: {
      attributes: true,
      childList: true,
      subtree: true,
    },
  })
  const [intersectionRef, intersectionObserverEntry] = useObserver(IntersectionObserver, {
    observerOptions: {
      root: null,
      rootMargin: '0px',
      threshold: Array(1 / 0.01).fill(0.01).map((current, index) => current * index),
    },
  })

  const ratio = Math.floor(intersectionObserverEntry.intersectionRatio * 100)

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
    <Fragment>
      <h1>ResizeObserver</h1>
      <div
        ref={resizeRef}
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
      <h1>MutationObserver</h1>
      <div>
        <p>
          <button type="button" onClick={() => setElements([...elements, 'element'])}>
            Add Element
          </button>
          <button type="button" onClick={() => elements.length > 0 && setElements(elements.slice(0, elements.length - 1))}>
            Remove Element
          </button>
          <button type="button" onClick={() => setBackground(getRandomColor())}>Change Background</button>
        </p>
        <div
          ref={mutationRef}
          style={{
            background,
            padding: 10,
          }}
        >
          { !elements.length && <p>Start adding elements or change background</p> }
          { elements.map((element, index) => <p key={`element${index}`}>element #{index}</p>) }
        </div>
        <h2>Last Mutation</h2>
        <p>{getMutationText(mutationObserverEntry)}</p>
        <h1>IntersectionObserver</h1>
        <div
          style={{
            height: 1500,
          }}
        >
          <p>Scroll Me</p>
          <div
            ref={intersectionRef}
            style={{
              position: 'relative',
              backgroundColor: '#f5f5f5',
              height: 250,
              width: 250,
            }}
          >
            <span>{ratio}%</span>
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
            >
              {ratio}%
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

storiesOf('useObserver', module)
  .add('default', () => <UseObserverStory />)
