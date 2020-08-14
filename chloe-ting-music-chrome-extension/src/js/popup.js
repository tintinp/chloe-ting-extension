import '../style/popup.css'

import App from './components/App'
import CONSTANTS from './constants/CONSTANTS'
import { Provider } from 'react-redux'
import React from 'react'
import { Store } from 'webext-redux'
import { render } from 'react-dom'

const store = new Store()
const port = chrome.runtime.connect({ name: CONSTANTS.PORTS.CROSS_LAYER })

console.log('popup')
store.ready().then(() => {
  console.log('store ready')
  render(
    <Provider store={store}>
      <App port={port} />
    </Provider>,
    document.getElementById('popup')
  )
})
