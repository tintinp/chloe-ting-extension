import { abs, floor, log, mean, pow, round } from 'mathjs'
import { addLog, setActiveSignal, updateCount } from '../redux/actions'

import CONSTANTS from '../constants/CONSTANTS'
import Meyda from 'meyda'
import exportCSV from '../Utils/exportCSV'
import isNumber from '../Utils/isNumber'
import { reduce } from 'lodash'

// Audio context of the browser
const AudioContext = window.AudioContext || window.webkitAudioContext

const ALL_FEATURES = CONSTANTS.AUDIO_FEATURES.SINGLE_VALUE.concat(CONSTANTS.AUDIO_FEATURES.ARRAY)

class DataManager {
  constructor(options) {
    this.store = options.store
    this.running = false
    this.analyzer = null
    this.selectedClass = null
    this.currentAudioContext = null
    this.sampleLength = CONSTANTS.DEFAULT_SAMPLE_LENGTH
    this.bufferSize = null
    this.nFrame = 0
    this.targetNFrame = null
    this.count = {
      chloe: 0,
      music: 0
    }
    this.classChangeTimestamp = []
    this.data = this.getEmptyData()
    this.dataInFrames = this.getEmptyDataInFrames()
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
    this.running = true
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
    this.bufferSize = null
    this.nFrame = 0
    this.targetNFrame = null
    this.running = false
    this.store.dispatch(setActiveSignal(false))
    this.store.dispatch(addLog('Stop collecting data'))
  }

  selectedClassChange(selectedClass) {
    this.selectedClass = selectedClass
    if (this.running && selectedClass !== null) {
      this.classChangeTimestamp.push(Date.now())
    }
  }

  sampleLengthChange(sampleLength) {
    this.sampleLength = sampleLength
  }

  async export() {
    await exportCSV(this.data, this.classChangeTimestamp)
    this.reset()
    console.log('Exported data CSV')
  }

  // --------------------------------------------------------------------------
  // Private Functions
  // --------------------------------------------------------------------------

  createAnalyzer(source) {
    return Meyda.createMeydaAnalyzer({
      audioContext: this.currentAudioContext,
      source: source,
      bufferSize: this.bufferSize,
      numberOfMFCCCoefficients: CONSTANTS.N_MFCC,
      featureExtractors: ALL_FEATURES,
      callback: (features) => {
        this.extractFeatures(features)
      }
    })
  }

  extractFeatures(features) {
    if (this.isValidValue(features) && this.selectedClass) {
      ALL_FEATURES.forEach((featureName) => {
        const value = features[featureName]
        this.dataInFrames[featureName].push(value)
      })

      if (this.nFrame === this.targetNFrame - 1) {
        this.reduceDataInFrames()
        this.incrementDatasetCount()
        this.dataInFrames = this.getEmptyDataInFrames()
        this.checkActiveSignal(features.rms)
        this.nFrame = 0
      } else {
        this.nFrame += 1
      }
    }
  }

  // Store mean of values in current frame along with delta between each sample in the frame
  reduceDataInFrames() {
    this.reduceSingleValueData()
    this.reduceArrayData()
    this.data.class.push(CONSTANTS.CLASS_TO_NUMBER[this.selectedClass])
    this.data.timestamp.push(Date.now())
  }

  reduceSingleValueData() {
    CONSTANTS.AUDIO_FEATURES.SINGLE_VALUE.forEach((feature) => {
      const dataInFrames = this.dataInFrames[feature]
      const data = this.data[feature]
      const delta = this.data['delta_' + feature]
      const arrLength = data.length

      if (dataInFrames.length > 0) {
        const avg = mean(dataInFrames)
        const d1 = arrLength < 1 ? null : abs(avg - data[arrLength - 1])
        const d2 = arrLength < 2 ? null : abs(avg - data[arrLength - 2])

        if (d1 !== null) {
          delta.push(round(Math.max(d1, d2), 7))
        } else {
          delta.push(NaN)
        }
        data.push(round(avg, 7))
      } else {
        data.push(NaN)
        delta.push(NaN)
      }
    })
  }

  // Store mean of value in the arrays in the current frame, mean along axis 0
  reduceArrayData() {
    CONSTANTS.AUDIO_FEATURES.ARRAY.forEach((feature) => {
      const dataInFrames = this.dataInFrames[feature]
      const data = this.data[feature]
      if (this.isArray(dataInFrames)) {
        data.push(round(mean(dataInFrames, 0), 7))
      } else {
        // Convert Float32Array into normal array
        const normalArray = dataInFrames.map((arr) => Array.from(arr))
        const meanArray = mean(normalArray, 0)
        data.push(round(meanArray, 7))
      }
    })
  }

  isArray(arrayOfarrays) {
    return reduce(
      arrayOfarrays,
      (bool, arr) => {
        return bool && Array.isArray(arr)
      },
      true
    )
  }

  calculateDataNeededPerSampleLength() {
    // sampleRate = sampling rate of WebAPI audio (usually 48000)
    // bufferSizePowOf2 = number of audio data in a buffer for each FFT calculation
    // frameLength = number of milliseconds of sample per each FFT calculation
    // targetNFrame = number of FFT calculation needed to reach duration of sampleLength
    // sampleLength = number of milliseconds of sample per each dataset (to be used in ML training)
    // TARGET_FRAME_LENGTH = Default to 25ms of audio for each FFT calculation

    // Need to calculate buffer size (as power of 2) in order for ~25ms of audio to be used in
    // calculating FFT and other featuers. This will depend on the sample rate of the browser
    // Multiple research papers consider 20-25ms an optimum value for MFCC

    // Chrome sample rate is usually 48000 samples per second
    // Therefore, buffer size should be 0.025 * 48000 = 1200
    // Which this is the size of the buffer to give 25ms of audio

    // However, 1024 is the closest power of two
    // Hence, we'll use buffer size of 1024

    // We get 48000 samples per second, so to get 1024 samples, it will take 21.333ms
    // This means every 21.333ms we will get 1 audio feature extraction
    // Hence, to get ~700ms worth of sample, we have to collect ~32 extractions
    // Therefore, we collect 32 extractions, then find the mean of each feature
    // The mean for each feature will count as 1 dataset

    const sampleRate = this.currentAudioContext.sampleRate
    const theoreticalBufferSize = CONSTANTS.TARGET_FRAME_LENGTH * sampleRate
    const bufferSizePowOf2 = pow(2, round(log(theoreticalBufferSize, 2)))
    const frameLength = (bufferSizePowOf2 / sampleRate) * 1000.0
    this.bufferSize = bufferSizePowOf2
    this.targetNFrame = floor(this.sampleLength / frameLength)
    console.log(`Sampling rate: ${sampleRate} Hz`)
    console.log(`Frame duration: ${frameLength} ms`)
    console.log(`Dataset duration: ${this.sampleLength} ms`)
    console.log(`Buffer size needed: ${bufferSizePowOf2}`)
    console.log(`Number of frames per dataset: ${this.targetNFrame}`)
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

  // Update class count
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

  getEmptyData() {
    const data = {
      class: [],
      timestamp: []
    }
    CONSTANTS.AUDIO_FEATURES.SINGLE_VALUE.forEach((key) => {
      data[key] = []
      data['delta_' + key] = []
    })
    CONSTANTS.AUDIO_FEATURES.ARRAY.forEach((key) => {
      data[key] = []
    })
    return data
  }

  getEmptyDataInFrames() {
    const data = {}
    ALL_FEATURES.forEach((key) => {
      data[key] = []
    })
    return data
  }

  isValidValue(features) {
    return CONSTANTS.AUDIO_FEATURES.SINGLE_VALUE.reduce((isValid, featureName) => {
      return isValid && isNumber(features[featureName])
    }, true)
  }

  reset() {
    this.data = this.getEmptyData()
    this.dataInFrames = this.getEmptyDataInFrames()
    this.count.chloe = 0
    this.count.music = 0
    this.nFrame = 0
    this.classChangeTimestamp = []
  }
}

export default DataManager
