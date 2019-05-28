import React, { useState, Fragment } from 'react'
import { storiesOf } from '@storybook/react'

import { useMutationObserver } from 'react-use-observer'

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

const MutationObserverStory = () => {
  const [elements, setElements] = useState([])
  const [background, setBackground] = useState('#f5f5f5')
  const [ref, mutationObserverEntry] = useMutationObserver({
    attributes: true,
    childList: true,
    subtree: true,
  })

  return (
    <Fragment>
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
        ref={ref}
        style={{
          background,
          padding: 10,
        }}
      >
        {!elements.length && <p>Start adding elements or change background</p>}
        { elements.map((element, index) => <p key={`element${index}`}>{`element #${index}`}</p>)}
      </div>
      <h2>Last Mutation</h2>
      <p>{getMutationText(mutationObserverEntry)}</p>
    </Fragment>
  )
}

storiesOf('useMutationObserver', module)
  .add('default', () => <MutationObserverStory />)
