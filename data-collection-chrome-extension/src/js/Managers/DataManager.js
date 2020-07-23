import { setActiveSignal, updateCount } from '../redux/actions'

import CONSTANTS from '../constants/CONSTANTS'
import Meyda from 'meyda'
import { addLog } from '../redux/actions'
import eventManager from './EventManager'
import isNumber from '../Utils/isNumber'
import { mean } from 'lodash'

const AudioContext = window.AudioContext || window.webkitAudioContext

class DataManager {
  constructor(options) {
    this.analyzer = null
    this.running = false
    this.store = options.store
    this.eventManager = eventManager
    this.selectedClass = null
    this.sampleLength = CONSTANTS.DEFAULT_SAMPLE_LENGTH
    this.count = {
      chloe: 0,
      music: 0
    }
    this.currentAudioContext = null
    this.nFFTCount = 0
    this.targetNFFT = null
    this.dataset = []
    this.dataHolder = {
      rms: [],
      powerSpectrum: [],
      mfcc: [],
      spectralCentroid: [],
      spectralFlux: []
    }
    this.init()
  }

  init() {
    eventManager.on(CONSTANTS.EVENTS.SELECTED_CLASS_CHANGE, () => {})
  }

  // --------------------------------------------------------------------------
  // Public Functions
  // --------------------------------------------------------------------------

  startCollectingData(stream) {
    // A hack to start playing audio stream without connecting to speaker is to create HTML Audio element
    // and connect the stream to the element srcObject
    this.audioElement = new Audio()
    this.audioElement.srcObject = stream
    this.currentAudioContext = new AudioContext()
    this.calculateDataNeededPerSampleLength()
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
    this.activeSignal = false
    this.nFFTCount = 0
    this.targetNFFT = null
    this.store.dispatch(setActiveSignal(false))
    this.store.dispatch(addLog('Stop collecting data'))
  }

  selectedClassChange(selectedClass) {
    this.selectedClass = selectedClass
    if (this.running && selectedClass !== null) {
    }
  }

  sampleLengthChange(sampleLength) {
    this.sampleLength = sampleLength
  }

  // --------------------------------------------------------------------------
  // Private Functions
  // --------------------------------------------------------------------------

  createAnalyzer(source) {
    return Meyda.createMeydaAnalyzer({
      audioContext: this.currentAudioContext,
      source: source,
      bufferSize: CONSTANTS.BUFFER_SIZE,
      featureExtractors: ['rms', 'spectralFlatness'],
      callback: (features) => {
        this.extractFeatures(features)
      }
    })
  }

  extractFeatures(features) {
    const { rms, spectralFlatness } = features
    if (this.nFFTCount < this.targetNFFT) {
      this.nFFTCount += 1
      if (isNumber(spectralFlatness)) {
        this.dataHolder.rms.push(spectralFlatness)
      }
      // console.log(perceptualSpread)
    } else {
      this.nFFTCount = 0
      console.log(mean(this.dataHolder.rms))
      this.dataHolder.rms = []
      this.incrementDatasetCount()
      this.checkActiveSignal(rms)
    }
  }

  calculateDataNeededPerSampleLength() {
    // sampleRate = sampling rate of WebAPI audio (usually 48000)
    // BUFFER_SIZE = number of samples in each FFT calculation
    // frameDuration = number of milliseconds of sample per each FFT calculation
    // targetNFFT = number of FFT calculation needed to reach duration of sampleLength
    // sampleLength = number of milliseconds of sample per each dataset (to be used in ML training)

    const sampleRate = this.currentAudioContext.sampleRate
    const frameDuration = (CONSTANTS.BUFFER_SIZE / sampleRate) * 1000.0
    this.targetNFFT = this.sampleLength / frameDuration
    console.log(`Sampling rate: ${sampleRate} Hz`)
    console.log(`Frame duration: ${frameDuration} ms`)
    console.log(`Number of FFT per dataset: ${this.targetNFFT}`)
  }

  checkActiveSignal(rms) {
    if (rms > 0 && !this.activeSignal) {
      this.activeSignal = true
      this.store.dispatch(setActiveSignal(true))
    } else if (rms <= 0 && this.activeSignal) {
      this.activeSignal = false
      this.store.dispatch(setActiveSignal(false))
    }
  }

  incrementDatasetCount() {
    switch (this.selectedClass) {
      case CONSTANTS.CHLOE:
        this.count.chloe += 1
        this.store.dispatch(updateCount(CONSTANTS.CHLOE, this.count.chloe))
        break
      case CONSTANTS.MUSIC:
        this.count.music += 1
        this.store.dispatch(updateCount(CONSTANTS.MUSIC, this.count.music))
        break
      default:
        break
    }
  }

  clearDatasetCount() {
    this.count = {
      chloe: 0,
      music: 0
    }
    this.store.dispatch(updateCount(CONSTANTS.CHLOE, this.count.chloe))
    this.store.dispatch(updateCount(CONSTANTS.MUSIC, this.count.music))
  }
}

export default DataManager
