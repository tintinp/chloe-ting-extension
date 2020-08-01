import { keys, mapValues, reduce } from 'lodash'
import { mean, sqrt, variance } from 'mathjs'

import CONSTANTS from '../constants/CONSTANTS'
import isNumber from './isNumber'

const BIN_22 = 21
const BIN_23 = 22
const BIN_43 = 42
const BIN_44 = 43
const MIN_BEEP_AMPLITUDE = 100

const generateCSVString = (data, classChangeTimestamp) => {
  // Remove data that might be due to delay in human speed switching class in the UI or if any value is NaN
  const size = checkSizeConsistency(data)
  let resultArray = [getHeader(data)]
  const minAmplitudes = getMinAmpPowerSpectrum(data)
  console.log(minAmplitudes)
  if (size > 0) {
    // Go through each dataset
    for (let i = 0; i < size; i++) {
      let line = []

      if (validTimestamp(data.timestamp[i], classChangeTimestamp)) {
        let valid = true

        // Go though each feature
        keys(data).forEach((key) => {
          const value = data[key][i]
          // If value is array, eg. mfcc = [[1,2,3], [1,2,3]]
          if (Array.isArray(value)) {
            line.push(value.join(','))
          } else {
            if (!isNumber(value)) {
              valid = false
            }
            line.push(value)
          }
        })

        // Filter out audio data recorded between beeps
        // if (data['powerSpectrum'] && data['class'][i] === CONSTANTS.CLASS_TO_NUMBER['BEEP']) {
        //   valid = valid && checkValidBeep(data['powerSpectrum'][i])
        // }

        if (valid) {
          resultArray.push(line)
        }
      }
    }
  }
  return resultArray.join('\r\n')
}

// A hack to filter out data between the beeps
// Before beep is so fast, when collecting data, we are marking silence between beeps as beep
// which will pollute the training dataset
// When using sample length of 700ms, 1024 n_fft size 48000 sampling rate,
// bin 22 and 23 correspond to ~1000 Hz (which is the frequency of beep sound)
// bin 43 and 44 correspond to ~2000 Hz
const checkValidBeep = (powerSpectrum) => {
  const beep_1000 =
    powerSpectrum[BIN_22] > MIN_BEEP_AMPLITUDE && powerSpectrum[BIN_23] > MIN_BEEP_AMPLITUDE
  const beep_2000 =
    powerSpectrum[BIN_43] > MIN_BEEP_AMPLITUDE && powerSpectrum[BIN_44] > MIN_BEEP_AMPLITUDE
  if (beep_1000 || beep_2000) {
    return true
  }
  return false
}

const validTimestamp = (time, timestampArray) => {
  // Use for loop so it can break early
  for (let i = 0; i < timestampArray.length; i++) {
    const timestamp = timestampArray[i]
    if (time > timestamp - CONSTANTS.LATENCY_TIME_TO_DELETE_DATASET && time <= timestamp) {
      return false
    }
  }
  return true
}

const checkSizeConsistency = (data) => {
  let size = null
  keys(data).forEach((key) => {
    if (size === null) {
      size = data[key].length
    }
    if (size !== data[key].length) {
      return 0
    }
  })
  return size
}

const getMinAmpPowerSpectrum = (data) => {
  const { powerSpectrum } = data
  const beepAmplitudes = reduce(
    powerSpectrum,
    (acc, amplitudes) => {
      acc.amp22.push(amplitudes[BIN_22])
      acc.amp23.push(amplitudes[BIN_23])
      acc.amp43.push(amplitudes[BIN_43])
      acc.amp44.push(amplitudes[BIN_44])
      return acc
    },
    {
      amp22: [],
      amp23: [],
      amp43: [],
      amp44: []
    }
  )

  return mapValues(beepAmplitudes, (arrayOfAmps) => {
    return mean(arrayOfAmps) + sqrt(variance(arrayOfAmps))
  })
}

const getHeader = (data) => {
  const resultArray = []
  keys(data).forEach((key) => {
    if (Array.isArray(data[key][0])) {
      let arrayHeader = ''
      const length = data[key][0].length
      for (let i = 1; i < length + 1; i++) {
        if (arrayHeader === '') {
          arrayHeader = `${key}_1`
        } else {
          arrayHeader = `${arrayHeader},${key}_${i}`
        }
      }
      resultArray.push(arrayHeader)
    } else {
      resultArray.push(key)
    }
  })
  return resultArray.join(',')
}

export default generateCSVString
