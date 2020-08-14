import { addLog, addTabs, removeTabById } from './redux/actions'

// import AudioContextManager from './Managers/AudioContextManager'
import CONSTANTS from './constants/CONSTANTS'
// import DataManager from './Managers/DataManager'
import eventManager from './Managers/EventManager'
import store from './redux/store'
import { wrapStore } from 'webext-redux'

// const audioContextManager = new AudioContextManager({ store })
// const dataManager = new DataManager({ store })

const getAllTabsInfo = () => {
  chrome.tabs.query({}, (tabs) => {
    store.dispatch(addTabs(tabs))
  })
}

const attachTabListeners = () => {
  chrome.tabs.onCreated.addListener((tab) => {
    store.dispatch(addTabs([tab]))
  })

  chrome.tabs.onUpdated.addListener((id) => {
    chrome.tabs.get(id, (tab) => {
      store.dispatch(addTabs([tab]))
    })
  })

  chrome.tabs.onRemoved.addListener((id) => {
    store.dispatch(removeTabById(id))
  })
}

const attachCrossLayerListeners = () => {
  eventManager.on(CONSTANTS.EVENTS.START_PREDICTING, (payload) => {
    console.log(payload)
  })

  eventManager.on(CONSTANTS.EVENTS.STOP_PREDICTING, () => {
    console.log('stop predicting')
  })
}

const main = () => {
  console.log('Running background.js')
  wrapStore(store)
  getAllTabsInfo()
  attachTabListeners()
  attachCrossLayerListeners()
}

main()
