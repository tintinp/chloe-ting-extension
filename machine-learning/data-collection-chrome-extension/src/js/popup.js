import '../style/popup.css'

import Dashboard from './components/Dashboard'
import { Provider } from 'react-redux'
import React from 'react'
import { Store } from 'webext-redux'
import { render } from 'react-dom'

const store = new Store()

store.ready().then(() => {
  render(
    <Provider store={store}>
      <Dashboard />
    </Provider>,
    document.getElementById('popup')
  )
})
