import { addTabs, removeTabById } from './redux/actions'

import AudioContextManager from './managers/AudioContextManager'
import { CONSTANTS } from './constants/constants'
import { DataManager } from './managers/DataManager'
import eventManager from './managers/EventManager'
import { store } from './redux/store'
import { wrapStore } from 'webext-redux'

const audioContextManager = new AudioContextManager({ store })
const dataManager = new DataManager({ store })

const getAllTabsInfo = () => {
  chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
    console.log('query tabs', tabs)
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

  chrome.tabs.onRemoved.addListener((id: number) => {
    store.dispatch(removeTabById(id))
  })
}

const attachCrossLayerListeners = () => {
  eventManager.on(CONSTANTS.EVENTS.START_PREDICTING, async ({ selectedTabId }) => {
    try {
      // const stream = await audioContextManager.getAudioStream(selectedTabId?.workout)
      // dataManager.startExtraction(stream)
    } catch (err) {
      console.error('Error starting data collection:', err)
    }
  })

  eventManager.on(CONSTANTS.EVENTS.STOP_PREDICTING, () => {
    audioContextManager.stopStream()
  })
}

const main = async () => {
  console.log('Running background.js')
  wrapStore(store)
  getAllTabsInfo()
  attachTabListeners()
  attachCrossLayerListeners()
  console.log('done set up')
  // await dataManager.start()
}

main()
