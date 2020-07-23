import '../style/popup.css'

import CONSTANTS from './constants/CONSTANTS'
import Dashboard from './components/Dashboard'
import { Provider } from 'react-redux'
import React from 'react'
import { Store } from 'webext-redux'
import { render } from 'react-dom'

const store = new Store()
const port = chrome.runtime.connect({ name: CONSTANTS.PORTS.CROSS_LAYER })

store.ready().then(() => {
  render(
    <Provider store={store}>
      <Dashboard port={port} />
    </Provider>,
    document.getElementById('popup')
  )
})
