import { addTabs, removeTabById } from './redux/actions'

import AudioContextManager from './Managers/AudioContextManager'
import CONSTANTS from './constants/CONSTANTS'
import Meyda from 'meyda'
import eventManager from './Managers/EventManager'
import store from './redux/store'
import { wrapStore } from 'webext-redux'

const audioContextManager = new AudioContextManager()
let analyzer

const getAllTabs = () => {
  chrome.tabs.query({}, (tabs) => {
    store.dispatch(addTabs(tabs))
  })
}

const attachListeners = () => {
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

  eventManager.on(
    CONSTANTS.EVENTS.START_COLLECTING_DATA,
    async ({ selectedTabId, selectedClass, sampleLength }) => {
      try {
        const stream = await audioContextManager.getAudioStream(selectedTabId, sampleLength)
        const audioElement = new Audio()
        audioElement.srcObject = stream
        const AudioContext = window.AudioContext || window.webkitAudioContext
        const currAudioContext = new AudioContext()
        const source = currAudioContext.createMediaStreamSource(stream)
        analyzer = Meyda.createMeydaAnalyzer({
          audioContext: currAudioContext,
          source: source,
          bufferSize: 512,
          featureExtractors: ['rms'],
          callback: (features) => {
            console.log(features)
          }
        })
        analyzer.start()
        console.log('Start collecting data...')
      } catch (err) {
        console.error('Error starting data collection:', err.message)
      }
    }
  )

  eventManager.on(CONSTANTS.EVENTS.STOP_COLLECTING_DATA, () => {
    audioContextManager.stopStream()
    if (analyzer) {
      analyzer.stop()
    }
    console.log('Stopped collecting data')
  })
}

const init = () => {
  wrapStore(store)
  console.log('Store created and wrapped with webext-redux')
  getAllTabs()
  attachListeners()
}

const main = () => {
  console.log('Running background.js')
  init()
}

main()
