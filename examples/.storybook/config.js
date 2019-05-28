import React from 'react'
import { configure, addDecorator, addParameters } from '@storybook/react'
import { themes } from '@storybook/theming'

addParameters({
  options: {
    panelPosition: 'right',
  },
})

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
