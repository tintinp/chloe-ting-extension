import { addTabs } from './redux/actions'
import store from './redux/store'
import { wrapStore } from 'webext-redux'

const getAllTabs = () => {
  chrome.tabs.query({}, (tabs) => {
    store.dispatch(addTabs(tabs))
  })
}

const init = () => {
  wrapStore(store)
  console.log('Store created and wrapped with webext-redux')
  getAllTabs()
  console.log('Got all open tabs')
}

const main = () => {
  console.log('Running background.js')
  init()
}

main()
