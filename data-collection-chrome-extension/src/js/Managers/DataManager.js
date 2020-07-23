import CONSTANTS from '../constants/CONSTANTS'
import Meyda from 'meyda'
import { addLog } from '../redux/actions'
import eventManager from './EventManager'

const AudioContext = window.AudioContext || window.webkitAudioContext

class DataManager {
  constructor(options) {
    this.analyzer = null
    this.running = false
    this.store = options.store
    this.eventManager = eventManager
    this.selectedClass = null
    this.currentAudioContext = null
    this.init()
  }

  init() {
    eventManager.on(CONSTANTS.EVENTS.SELECTED_CLASS_CHANGE, () => {})
  }

  createAnalyzer(source) {
    return Meyda.createMeydaAnalyzer({
      audioContext: this.currentAudioContext,
      source: source,
      bufferSize: 512,
      featureExtractors: ['rms'],
      callback: (features) => {
        console.log(features)
      }
    })
  }

  startCollectingData(stream) {
    // A hack to start playing audio stream without connecting to speaker is to create HTML Audio element
    // and connect the stream to the element srcObject
    this.audioElement = new Audio()
    this.audioElement.srcObject = stream
    this.currentAudioContext = new AudioContext()
    const source = this.currentAudioContext.createMediaStreamSource(stream)
    this.analyzer = this.createAnalyzer(source)
    this.analyzer.start()
    this.store.dispatch(addLog(`Start collecting data`))
    console.log('Start collecting data...')
  }

  async stopCollectingData() {
    if (this.analyzer) {
      this.analyzer.stop()
      this.analyzer = null
    }
    this.audioElement = null
    this.currentAudioContext = null
    this.store.dispatch(addLog('Stop collecting data'))
  }

  selectedClassChange(selectedClass) {
    this.selectedClass = selectedClass
    if (this.running && selectedClass !== null) {
    }
  }
}

export default DataManager
