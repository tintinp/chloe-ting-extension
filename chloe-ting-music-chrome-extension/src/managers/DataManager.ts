// import { abs, floor, log, mean, pow, round } from 'mathjs'
// import { keys, reduce } from 'lodash'

import { AppState } from '../redux/reducers'
// import { CONSTANTS } from '../constants/constants'
// // import Meyda from 'meyda'
// import PredictorManager from './PredictorManager'
import { Store } from 'redux'
// import isNumber from '../Utils/isNumber'

// const SINGLE_VALUE_FEATURES = [CONSTANTS.FEATURES.SPECTRAL_FLATNESS]
// const ARRAY_VALUE_FEATURES = [CONSTANTS.FEATURES.MFCC, CONSTANTS.FEATURES.POWER_SPECTRUM]
// const ALL_FEATURES = SINGLE_VALUE_FEATURES.concat(ARRAY_VALUE_FEATURES)
// const MAX_DATA_CAPACITY = 100

// // Audio context of the browser
// const AudioContext = window.AudioContext || window.webkitAudioContext

type DataManagerOptions = {
  store: Store
}

// class DataManager {
//   private store: Store
//   private running: boolean
//   private activeSignal: boolean
//   // private analyzer: any
//   private sampleLength: any
//   private bufferSize: any
//   private nFrame: number
//   private targetNFrame: any
//   private data: any
//   private dataInFrames: any
//   private tfModel: PredictorManager
//   private audioElement: HTMLAudioElement | null
//   private currentAudioContext: AudioContext | null

//   constructor(options: DataManagerOptions) {
//     this.store = options.store
//     this.running = false
//     this.activeSignal = false
//     // this.analyzer = null
//     this.currentAudioContext = null
//     this.sampleLength = CONSTANTS.DEFAULT_SAMPLE_LENGTH
//     this.bufferSize = null
//     this.nFrame = 0
//     this.targetNFrame = null
//     this.data = this.getEmptyData()
//     this.dataInFrames = this.getEmptyDataInFrames()
//     this.tfModel = new PredictorManager()
//     this.audioElement = null
//   }

//   // --------------------------------------------------------------------------
//   // Public Functions
//   // --------------------------------------------------------------------------

//   async start() {
//     await this.tfModel.loadModel(CONSTANTS.TF_TRAINED_MODEL_PATH)
//   }

//   startExtraction(stream: MediaProvider) {
//     // A hack to start playing audio stream without connecting to speaker is to create HTML Audio element
//     // and connect the stream to the element's srcObject
//     this.audioElement = new Audio()
//     this.audioElement.srcObject = stream
//     this.currentAudioContext = new AudioContext()
//     this.calculateDataNeededPerSampleLength()
//     const source = this.currentAudioContext.createMediaStreamSource(stream)
//     // this.analyzer = this.createAnalyzer(source)
//     this.analyzer.start()
//     this.running = true
//     console.log('Start extracting audio features...')
//   }

//   async stopExtraction() {
//     if (this.analyzer) {
//       this.analyzer.stop()
//       this.analyzer = null
//     }
//     this.audioElement = null
//     this.currentAudioContext = null
//     this.activeSignal = false
//     this.bufferSize = null
//     this.nFrame = 0
//     this.targetNFrame = null
//     this.running = false
//   }

//   // --------------------------------------------------------------------------
//   // Private Functions
//   // --------------------------------------------------------------------------

//   // createAnalyzer(source) {
//   //   return Meyda.createMeydaAnalyzer({
//   //     audioContext: this.currentAudioContext,
//   //     source: source,
//   //     bufferSize: this.bufferSize,
//   //     numberOfMFCCCoefficients: CONSTANTS.N_MFCC,
//   //     featureExtractors: ALL_FEATURES,
//   //     callback: (features) => {
//   //       this.extractFeatures(features)
//   //     }
//   //   })
//   // }

//   extractFeatures(features) {
//     if (this.isValidValue(features)) {
//       ALL_FEATURES.forEach((featureName) => {
//         const value = features[featureName]
//         this.dataInFrames[featureName].push(value)
//       })

//       if (this.nFrame === this.targetNFrame - 1) {
//         this.reduceDataInFrames()
//         const features = this.getLatestData()
//         if (features) {
//           this.tfModel.predict(features)
//         }
//         this.dataInFrames = this.getEmptyDataInFrames()
//         this.nFrame = 0
//       } else {
//         this.nFrame += 1
//       }
//     }
//   }

//   // Store mean of values in current frame along with delta between each sample in the frame
//   reduceDataInFrames() {
//     this.reduceSingleValueData()
//     this.reduceMFCCData()
//     this.reducePowerSpectrumData()
//     this.checkDataSize()
//   }

//   reduceSingleValueData() {
//     SINGLE_VALUE_FEATURES.forEach((feature) => {
//       const dataInFrames = this.dataInFrames[feature]
//       const data = this.data[feature]
//       const delta = this.data['delta_' + feature]
//       const arrLength = data.length

//       if (dataInFrames.length > 0) {
//         const avg = mean(dataInFrames)
//         const d1 = arrLength < 1 ? null : abs(avg - data[arrLength - 1])
//         const d2 = arrLength < 2 ? null : abs(avg - data[arrLength - 2])

//         if (d1 !== null) {
//           delta.push(round(Math.max(d1, d2), 7))
//         } else {
//           delta.push(NaN)
//         }
//         data.push(round(avg, 7))
//       } else {
//         data.push(NaN)
//         delta.push(NaN)
//       }
//     })
//   }

//   reduceMFCCData() {
//     const dataInFrames = this.dataInFrames[CONSTANTS.FEATURES.MFCC]
//     const data = this.data[CONSTANTS.FEATURES.MFCC]
//     const meanArray = this.getMeanArray(dataInFrames)
//     const selectedBins = CONSTANTS.MFCC_BINS.map((bin) => {
//       return meanArray[bin - 1]
//     })
//     data.push(round(selectedBins, 7))
//   }

//   reducePowerSpectrumData() {
//     const dataInFrames = this.dataInFrames[CONSTANTS.FEATURES.POWER_SPECTRUM]
//     const data = this.data[CONSTANTS.FEATURES.POWER_SPECTRUM]
//     const meanArray = this.getMeanArray(dataInFrames)
//     const selectedBins = CONSTANTS.POWER_SPECTRUM_BINS.map((bin) => {
//       return meanArray[bin - 1]
//     })
//     data.push(round(selectedBins, 7))
//   }

//   // Store mean of value in the arrays in the current frame, mean along axis 0
//   getMeanArray(data) {
//     if (this.isArray(data)) {
//       return mean(data, 0)
//     } else {
//       // Convert Float32Array into normal array
//       const normalArray = data.map((arr) => Array.from(arr))
//       return mean(normalArray, 0)
//     }
//   }

//   checkDataSize() {
//     keys(this.data).forEach((key) => {
//       if (this.data[key].length > MAX_DATA_CAPACITY) {
//         this.data[key].shift()
//       }
//     })
//   }

//   getLatestData() {
//     let sF = this.data[CONSTANTS.FEATURES.SPECTRAL_FLATNESS]
//     let deltaSF = this.data[`delta_${CONSTANTS.FEATURES.SPECTRAL_FLATNESS}`]
//     let mfcc = this.data[CONSTANTS.FEATURES.MFCC]
//     let pS = this.data[CONSTANTS.FEATURES.POWER_SPECTRUM]

//     if (!isNumber(deltaSF[deltaSF.length - 1])) {
//       return null
//     }

//     let features = []
//     features.push(sF[sF.length - 1])
//     features.push(deltaSF[deltaSF.length - 1])
//     return features.concat(mfcc[mfcc.length - 1], pS[pS.length - 1])
//   }

//   isArray(arrayOfarrays) {
//     return reduce(
//       arrayOfarrays,
//       (bool, arr) => {
//         return bool && Array.isArray(arr)
//       },
//       true
//     )
//   }

//   calculateDataNeededPerSampleLength() {
//     // sampleRate = sampling rate of WebAPI audio (usually 48000)
//     // bufferSizePowOf2 = number of audio data in a buffer for each FFT calculation
//     // frameLength = number of milliseconds of sample per each FFT calculation
//     // targetNFrame = number of FFT calculation needed to reach duration of sampleLength
//     // sampleLength = number of milliseconds of sample per each dataset (to be used in ML training)
//     // TARGET_FRAME_LENGTH = Default to 25ms of audio for each FFT calculation

//     // Need to calculate buffer size (as power of 2) in order for ~25ms of audio to be used in
//     // calculating FFT and other featuers. This will depend on the sample rate of the browser
//     // Multiple research papers consider 20-25ms an optimum value for MFCC

//     // Chrome sample rate is usually 48000 samples per second
//     // Therefore, buffer size should be 0.025 * 48000 = 1200
//     // Which this is the size of the buffer to give 25ms of audio

//     // However, 1024 is the closest power of two
//     // Hence, we'll use buffer size of 1024

//     // We get 48000 samples per second, so to get 1024 samples, it will take 21.333ms
//     // This means every 21.333ms we will get 1 audio feature extraction
//     // Hence, to get ~700ms worth of sample, we have to collect ~32 extractions
//     // Therefore, we collect 32 extractions, then find the mean of each feature
//     // The mean for each feature will count as 1 dataset

//     const sampleRate = this.currentAudioContext.sampleRate
//     const theoreticalBufferSize = CONSTANTS.TARGET_FRAME_LENGTH * sampleRate
//     const bufferSizePowOf2 = pow(2, round(log(theoreticalBufferSize, 2)))
//     const frameLength = (bufferSizePowOf2 / sampleRate) * 1000.0
//     this.bufferSize = bufferSizePowOf2
//     this.targetNFrame = floor(this.sampleLength / frameLength)
//     console.log(`Sampling rate: ${sampleRate} Hz`)
//     console.log(`Frame duration: ${frameLength} ms`)
//     console.log(`Dataset duration: ${this.sampleLength} ms`)
//     console.log(`Buffer size needed: ${bufferSizePowOf2}`)
//     console.log(`Number of frames per dataset: ${this.targetNFrame}`)
//   }

//   getEmptyData() {
//     const data = {}
//     SINGLE_VALUE_FEATURES.forEach((key) => {
//       data[key] = []
//       data['delta_' + key] = []
//     })
//     ARRAY_VALUE_FEATURES.forEach((key) => {
//       data[key] = []
//     })
//     return data
//   }

//   getEmptyDataInFrames() {
//     const data = {}
//     ALL_FEATURES.forEach((key) => {
//       data[key] = []
//     })
//     return data
//   }

//   // Only check at the single value feature has valid data, assumes that array value features gives valid data
//   isValidValue(features) {
//     return SINGLE_VALUE_FEATURES.reduce((isValid, featureName) => {
//       return isValid && isNumber(features[featureName])
//     }, true)
//   }
// }

// export default DataManager

export class DataManager {
  constructor(options: DataManagerOptions) {}
}
