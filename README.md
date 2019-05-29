# react-use-observer

[![Build Status](https://travis-ci.org/ardaogulcan/react-use-observer.svg?branch=master)](https://travis-ci.org/ardaogulcan/react-use-observer) [![coverage](https://codecov.io/gh/ardaogulcan/react-use-observer/branch/master/graph/badge.svg)](https://codecov.io/gh/ardaogulcan/react-use-observer) [![NPM](https://img.shields.io/npm/v/react-use-observer.svg)](https://www.npmjs.com/package/react-use-observer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Performant react hooks for WebApi Observers

## Features

- Hooks for
  - [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) - useResizeObserver
  - [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) - useMutationObserver
  - [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) - useIntersectionObserver
  - useObserver hook for additional WebApi Observers
- Optimizes performance by re-using same Observers for same settings through the app
- Supports three shaking
- Includes pollyfills for
  - [ResizeObserver](https://github.com/que-etc/resize-observer-polyfill)
  - [IntersectionObserver](https://github.com/que-etc/intersection-observer-polyfill)

## Install

```bash
yarn add react-use-observer
```

or

```bash
npm install --save react-use-observer
```

## Usage

### useResizeObserver: [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

#### Returns
[ref: [React Ref](https://reactjs.org/docs/refs-and-the-dom.html), entry: [ResizeObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry)]

#### Example

```js
import { useResizeObserver } from 'react-use-observer'

const App = () => {
  const [ref, resizeObserverEntry] = useResizeObserver()
  const { width = 0 } = resizeObserverEntry.contentRect || {}
  return (
    <div ref={ref}>
      width: {width}
    </div>
  )
}
```

### useIntersectionObserver: [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)

#### Parameters

- options: Object - `Initialization` options for  `IntersectionObserver`

    - **root:**
    An Element object which is an ancestor of the intended target, whose bounding rectangle will be considered the viewport. Any part of the target not visible in the visible area of the root is not considered visible.

    - **rootMargin:**
    A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections, effectively shrinking or growing the root for calculation purposes. The syntax is approximately the same as that for the CSS margin property; see The root element and root margin in Intersection Observer API for more information on how the margin works and the syntax. The default is "0px 0px 0px 0px".

    - **threshold:**
    Either a single number or an array of numbers between 0.0 and 1.0, specifying a ratio of intersection area to total bounding box area for the observed target. A value of 0.0 means that even a single visible pixel counts as the target being visible. 1.0 means that the entire target element is visible. See Thresholds in Intersection Observer API for a more in-depth description of how thresholds are used. The default is a threshold of 0.0.

#### Returns
[ref: [React Ref](https://reactjs.org/docs/refs-and-the-dom.html), entry: [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)]

#### Example

```js
import { useIntersectionObserver } from 'react-use-observer'

const MyComp = () => {
  const [ref, intersectionObserverEntry] = useIntersectionObserver({
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  })

  return (
    <div ref={ref}>
      {intersectionObserverEntry.intersectionRatio}
    </div>
  )
}
```

### useMutationObserver: [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

#### Parameters

- options: [MutationObserverInit](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) - Options to pass `observe` method of `MutationObserver`

    - **attributeFilter:**
    An array of specific attribute names to be monitored. If this property isn't included, changes to all attributes cause mutation notifications. No default value.

    - **attributeOldValue:**
    Set to true to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes; see Monitoring attribute values in MutationObserver for details on watching for attribute changes and value recording. No default value.

    - **attributes:**
    Set to true to watch for changes to the value of attributes on the node or nodes being monitored. The default value is false.

    - **characterData:**
    Set to true to monitor the specified target node or subtree for changes to the character data contained within the node or nodes. No default value.

    - **characterDataOldValue:**
    Set to true to record the previous value of a node's text whenever the text changes on nodes being monitored. For details and an example, see Monitoring text content changes in MutationObserver. No default value.

    - **childList:**
    Set to true to monitor the target node (and, if subtree is true, its descendants) for the addition of new child nodes or removal of existing child nodes. The default is false.

    - **subtree:**
    Set to true to extend monitoring to the entire subtree of nodes rooted at target. All of the other MutationObserverInit properties are then extended to all of the nodes in the subtree instead of applying solely to the target node. The default value is false.

#### Returns

[ref: [React Ref](https://reactjs.org/docs/refs-and-the-dom.html), entry: [MutationRecord](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord)]

#### Example

```js
import { useMutationObserver } from 'react-use-observer'

const MyComp = () => {
  const [ref, mutationRecord] = useMutationObserver({
    attributes: true,
    childList: true,
    subtree: true,
  })

  return (
    <div>
      Mutation Type { mutationRecord.type }
    </div>
  )
}
```

### useObserver

#### Parameters

- Observer: (Any WebApi Observer)

- options: Object
  - **observerOptions:**
  `Initialization` options for given `Observer`
  - **subscribeOptions:**
  Options to pass `observe` method of `Observer`

#### Returns

[ref: [React Ref](https://reactjs.org/docs/refs-and-the-dom.html), entry: ObserverEntry]

#### Example

```js
import { useObserver } from 'react-use-observer'

const MyComp = () => {
  const [ref, entry] = useObserver(Performance​Observer, {
    subscribeOptions: {
      entryTypes: ['frame'],
    },
  })

  return (
    <div>
      Entry Type { entry.entryType }
    </div>
  )
}
```

## All WebApi Observers

- [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
- [ReportingObserver](https://developer.mozilla.org/en-US/docs/Web/API/ReportingObserver)

## License

MIT © [ardaogulcan](https://github.com/ardaogulcan)
