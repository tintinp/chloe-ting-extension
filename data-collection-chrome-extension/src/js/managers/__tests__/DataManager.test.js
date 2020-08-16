jest.mock('../../constants/CONSTANTS')

import { advanceBy, advanceTo, clear } from 'jest-date-mock'
import { cloneDeep, keys, mean, reduce } from 'lodash'

import CONSTANTS from '../../constants/CONSTANTS'
import { abs } from 'mathjs'

describe('DataManager', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    advanceTo(new Date(2020, 7, 25, 10, 11, 11))
  })

  afterEach(() => {
    clear()
  })

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  const fakeStore = {
    dispatch: () => {}
  }

  const range = (size, startAt = 0) => {
    return [...Array(size).keys()].map((i) => i + startAt)
  }

  // ------------------------------------------------------------------
  // Tests
  // ------------------------------------------------------------------
  test('Init', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    expect(dataManager).toBeInstanceOf(DataManager)
  })

  test('getEmptyData and getEmptyDataInFrames', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    const expectedData = {
      class: [],
      timestamp: [],
      a: [],
      b: [],
      delta_a: [],
      delta_b: [],
      array1: [],
      array2: []
    }
    const expectedDataInFrames = { a: [], b: [], array1: [], array2: [] }

    expect(dataManager.getEmptyData()).toStrictEqual(expectedData)
    expect(dataManager.getEmptyDataInFrames()).toStrictEqual(expectedDataInFrames)
  })

  test('Calculate target frames per dataset and buffer size', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    // Set up dataManager state
    dataManager.currentAudioContext = {}
    dataManager.currentAudioContext.sampleRate = 48000

    dataManager.calculateDataNeededPerSampleLength()

    expect(dataManager.targetNFrame).toStrictEqual(32)
    expect(dataManager.bufferSize).toStrictEqual(1024)
  })

  test('extractFeatures: missing features', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    const features = { rms: 1 }

    dataManager.extractFeatures(features)
    expect(dataManager.data).toStrictEqual(dataManager.getEmptyData())
    expect(dataManager.dataInFrames).toStrictEqual(dataManager.getEmptyDataInFrames())
  })

  test('extractFeatures: 1 extraction frame', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    // ------------------------------------------------------------------
    // Set up dataManager state
    // ------------------------------------------------------------------
    // This should give buffer size of 1024 and target frames of 3
    dataManager.currentAudioContext = {}
    dataManager.currentAudioContext.sampleRate = 41000 // 41000Hz
    dataManager.sampleLengthChange(75) // 75ms
    dataManager.calculateDataNeededPerSampleLength()

    const features = {
      a: 1,
      b: 1,
      array1: [1, 2, 3],
      array2: [1, 2, 3]
    }

    // ------------------------------------------------------------------
    // Set up result
    // ------------------------------------------------------------------
    const expectedDataInFrames = {
      a: [1],
      b: [1],
      array1: [[1, 2, 3]],
      array2: [[1, 2, 3]]
    }

    // ------------------------------------------------------------------
    // Run test
    // ------------------------------------------------------------------
    dataManager.selectedClassChange(CONSTANTS.CHLOE)
    dataManager.extractFeatures(features)
    expect(dataManager.data).toStrictEqual(dataManager.getEmptyData())
    expect(dataManager.dataInFrames).toStrictEqual(expectedDataInFrames)
  })

  test('extractFeatures: 3 extraction frames for 1 dataset', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    // ------------------------------------------------------------------
    // Set up dataManager state
    // ------------------------------------------------------------------
    // This should give buffer size of 1024 and target frames of 3
    dataManager.currentAudioContext = {}
    dataManager.currentAudioContext.sampleRate = 41000 // 41000Hz
    dataManager.sampleLengthChange(75) // 75ms
    dataManager.calculateDataNeededPerSampleLength()

    const features_frame_1 = {
      a: 1,
      b: 1,
      array1: [1, 2, 3],
      array2: new Float32Array([1, 1, 1])
    }

    const features_frame_2 = {
      a: 2,
      b: 10,
      array1: [2, 3, 4],
      array2: new Float32Array([2, 2, 2])
    }

    const features_frame_3 = {
      a: 3,
      b: 20,
      array1: [3, 4, 5],
      array2: new Float32Array([3, 3, 3])
    }

    // ------------------------------------------------------------------
    // Set up result
    // ------------------------------------------------------------------
    const expectedDataInFrame_2 = {
      a: [1, 2],
      b: [1, 10],
      array1: [
        [1, 2, 3],
        [2, 3, 4]
      ],
      array2: [new Float32Array([1, 1, 1]), new Float32Array([2, 2, 2])]
    }

    const expectedData = {
      class: [0],
      timestamp: [Date.now()],
      a: [2],
      delta_a: [NaN],
      b: [10.3333333],
      delta_b: [NaN],
      array1: [[2, 3, 4]],
      array2: [[2, 2, 2]]
    }

    // ------------------------------------------------------------------
    // Run test
    // ------------------------------------------------------------------
    dataManager.selectedClassChange(CONSTANTS.CHLOE)
    dataManager.extractFeatures(features_frame_1)
    dataManager.extractFeatures(features_frame_2)
    expect(dataManager.dataInFrames).toStrictEqual(expectedDataInFrame_2)

    dataManager.extractFeatures(features_frame_3)
    expect(dataManager.data).toStrictEqual(expectedData)
  })

  test('extractFeatures: 32 extraction frames for 3 dataset', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    // ------------------------------------------------------------------
    // Set up dataManager state
    // ------------------------------------------------------------------
    // This should give buffer size of 1024 and target frames of 3
    dataManager.currentAudioContext = {}
    dataManager.currentAudioContext.sampleRate = 41000 // 41000Hz
    dataManager.sampleLengthChange(75) // 75ms
    dataManager.calculateDataNeededPerSampleLength()

    // ------------------------------------------------------------------
    // Set up dataset 1
    // ------------------------------------------------------------------

    let features_frame_1 = {
      a: 1,
      b: 1,
      array1: [1, 2, 3],
      array2: new Float32Array([1, 1, 1])
    }

    let features_frame_2 = {
      a: 2,
      b: 10,
      array1: [2, 3, 4],
      array2: new Float32Array([2, 2, 2])
    }

    let features_frame_3 = {
      a: 3,
      b: 20,
      array1: [3, 4, 5],
      array2: new Float32Array([3, 3, 3])
    }

    let expectedData = {
      class: [0],
      timestamp: [Date.now()],
      a: [2],
      delta_a: [NaN],
      b: [10.3333333],
      delta_b: [NaN],
      array1: [[2, 3, 4]],
      array2: [[2, 2, 2]]
    }

    // ------------------------------------------------------------------
    // Run test
    // ------------------------------------------------------------------
    dataManager.selectedClassChange(CONSTANTS.CHLOE)
    dataManager.extractFeatures(features_frame_1)
    dataManager.extractFeatures(features_frame_2)
    dataManager.extractFeatures(features_frame_3)
    advanceBy(1000)
    expect(dataManager.data).toStrictEqual(expectedData)

    // No class selected, should not add new data
    dataManager.selectedClassChange(null)
    dataManager.extractFeatures(features_frame_1)
    dataManager.extractFeatures(features_frame_2)
    dataManager.extractFeatures(features_frame_3)
    expect(dataManager.data).toStrictEqual(expectedData)

    // ------------------------------------------------------------------
    // Set up dataset 2
    // ------------------------------------------------------------------

    features_frame_1 = {
      a: 2,
      b: 2,
      array1: [1, 1, 1],
      array2: new Float32Array([1, 1, 1])
    }

    features_frame_2 = {
      a: 3,
      b: 3,
      array1: [1, 1, 1],
      array2: new Float32Array([2, 2, 2])
    }

    features_frame_3 = {
      a: 4,
      b: 4,
      array1: [1, 1, 1],
      array2: new Float32Array([3, 3, 3])
    }

    expectedData = {
      class: [0, 2],
      timestamp: [Date.now() - 1000, Date.now()],
      a: [2, 3],
      delta_a: [NaN, 1],
      b: [10.3333333, 3],
      delta_b: [NaN, 7.3333333],
      array1: [
        [2, 3, 4],
        [1, 1, 1]
      ],
      array2: [
        [2, 2, 2],
        [2, 2, 2]
      ]
    }

    // ------------------------------------------------------------------
    // Run test
    // ------------------------------------------------------------------
    dataManager.selectedClassChange(CONSTANTS.MUSIC)
    dataManager.extractFeatures(features_frame_1)
    dataManager.extractFeatures(features_frame_2)
    dataManager.extractFeatures(features_frame_3)
    advanceBy(1000)
    expect(dataManager.data).toStrictEqual(expectedData)

    // ------------------------------------------------------------------
    // Set up dataset 3
    // ------------------------------------------------------------------

    features_frame_1 = {
      a: 2,
      b: 2,
      array1: [1, 1, 1],
      array2: new Float32Array([1, 1, 1])
    }

    features_frame_2 = {
      a: 3,
      b: 3,
      array1: [1, 1, 1],
      array2: new Float32Array([10, 10, 10])
    }

    features_frame_3 = {
      a: 4,
      b: 4,
      array1: [1, 1, 1],
      array2: new Float32Array([10, 20, 30])
    }

    expectedData = {
      class: [0, 2, 0],
      timestamp: [Date.now() - 2000, Date.now() - 1000, Date.now()],
      a: [2, 3, 3],
      delta_a: [NaN, 1, 1],
      b: [10.3333333, 3, 3],
      delta_b: [NaN, 7.3333333, 7.3333333],
      array1: [
        [2, 3, 4],
        [1, 1, 1],
        [1, 1, 1]
      ],
      array2: [
        [2, 2, 2],
        [2, 2, 2],
        [7, 10.3333333, 13.6666667]
      ]
    }

    // ------------------------------------------------------------------
    // Run test
    // ------------------------------------------------------------------
    dataManager.selectedClassChange(CONSTANTS.CHLOE)
    dataManager.extractFeatures(features_frame_1)
    dataManager.extractFeatures(features_frame_2)
    dataManager.extractFeatures(features_frame_3)
    advanceBy(1000)
    expect(dataManager.data).toStrictEqual(expectedData)
    expect(dataManager.dataInFrames).toStrictEqual(dataManager.getEmptyDataInFrames())
  })
})
