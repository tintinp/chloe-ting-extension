import CONSTANTS from '../constants/CONSTANTS'
import isNumber from './isNumber'
import { keys } from 'lodash'

const generateCSVString = (data, classChangeTimestamp) => {
  // Remove data that might be due to delay in human speed switching class in the UI or if any value is NaN
  const size = checkSizeConsistency(data)
  let resultArray = [getHeader(data)]
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

        if (valid) {
          resultArray.push(line)
        }
      }
    }
  }
  return resultArray.join('\r\n')
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
