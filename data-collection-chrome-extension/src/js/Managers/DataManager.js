import { abs, floor, log, mean, pow, round } from 'mathjs'
import { addLog, setActiveSignal, updateCount } from '../redux/actions'

import CONSTANTS from '../constants/CONSTANTS'
import Meyda from 'meyda'
import exportCSV from '../Utils/exportCSV'
import isNumber from '../Utils/isNumber'

// Audio context of the browser
const AudioContext = window.AudioContext || window.webkitAudioContext

// Features to calculate additional delta between current and previous values
const FEATURES_SINGLE_VALUE = [
  'rms',
  'energy',
  'spectralCentroid',
  'spectralFlatness',
  'spectralRolloff',
  'spectralSkewness',
  'perceptualSpread',
  'perceptualSharpness'
]

const FEATURES_ARRAY = ['mfcc', 'powerSpectrum']

const ALL_FEATURES = FEATURES_SINGLE_VALUE.concat(FEATURES_ARRAY)

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
    this.data = this.getEmptyDataHolder()
    this.delta = this.getEmptyDataHolder()
    this.dataInCurrentFrame = this.getEmptyDataHolder()
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

  export() {
    exportCSV(this.data, this.delta, this.classChangeTimestamp)
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
    // Discard when any of the features have invalid value
    if (this.isValidValue(features)) {
      if (this.nFrame < this.targetNFrame) {
        // Accumulate features in current time frame
        ALL_FEATURES.forEach((featureName) => {
          const value = features[featureName]
          this.dataInCurrentFrame[featureName].push(value)
        })

        // Increment frame
        this.nFrame += 1
      } else {
        // If class is selected
        if (this.selectedClass) {
          // Store mean of values in current frame along with delta between each sample in the frame
          FEATURES_SINGLE_VALUE.forEach((featureName) => {
            const dataInCurrentFrame = this.dataInCurrentFrame[featureName]
            const data = this.data[featureName]
            const delta = this.delta[featureName]
            const arrLength = data.length

            if (dataInCurrentFrame.length > 0) {
              const avg = mean(dataInCurrentFrame)
              const d1 = arrLength < 1 ? null : abs(avg - data[arrLength - 1])
              const d2 = arrLength < 2 ? null : abs(avg - data[arrLength - 2])

              if (d1 !== null) {
                delta.push(Math.max(d1, d2))
              } else {
                delta.push(NaN)
              }
              data.push(avg)
            } else {
              data.push(NaN)
              delta.push(NaN)
            }
          })

          // Store mean MFCC in the current frame, mean along axis 0
          this.data.mfcc.push(mean(this.dataInCurrentFrame.mfcc, 0))

          // Store mean power spectrum in the current frame, mean along axis 0
          this.data.powerSpectrum.push(
            mean(
              // Convert Float32Array into normal array
              this.dataInCurrentFrame.powerSpectrum.map((arr) => Array.from(arr)),
              0
            )
          )

          // Store class and timestamp
          const classInt = this.getClass()
          const now = Date.now()
          this.data.class.push(classInt)
          this.delta.class.push(classInt)
          this.data.timestamp.push(now)
          this.delta.timestamp.push(now)

          // Update class count
          this.incrementDatasetCount()
        }

        // Reset current frame data
        this.dataInCurrentFrame = this.getEmptyDataHolder()

        // Reset number of samples needed for time frame
        this.nFrame = 0

        // Update signal status
        this.checkActiveSignal(features.rms)
      }
    }
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
    console.log(`Buffer size needed: ${bufferSizePowOf2}`)
    console.log(`Number of FFT per dataset: ${this.targetNFrame}`)
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

  getEmptyDataHolder() {
    return {
      rms: [],
      energy: [],
      spectralCentroid: [],
      spectralFlatness: [],
      spectralRolloff: [],
      spectralSkewness: [],
      perceptualSpread: [],
      perceptualSharpness: [],
      mfcc: [],
      powerSpectrum: [],
      class: [],
      timestamp: []
    }
  }

  isValidValue(features) {
    return FEATURES_SINGLE_VALUE.reduce((isValid, featureName) => {
      return isValid && isNumber(features[featureName])
    }, true)
  }

  getClass() {
    return CONSTANTS.CLASS_TO_NUMBER[this.selectedClass]
  }

  reset() {
    this.data = this.getEmptyDataHolder()
    this.delta = this.getEmptyDataHolder()
    this.dataInCurrentFrame = this.getEmptyDataHolder()
    this.count.chloe = 0
    this.count.music = 0
    this.nFrame = 0
    this.classChangeTimestamp = []
  }
}

export default DataManager
