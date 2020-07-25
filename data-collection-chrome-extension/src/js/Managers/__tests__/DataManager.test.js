const { keys, reduce, mean, cloneDeep } = require('lodash')
const { advanceTo, clear, advanceBy } = require('jest-date-mock')
const { default: CONSTANTS } = require('../../constants/CONSTANTS')

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

    dataManager.currentAudioContext = {}
    dataManager.currentAudioContext.sampleRate = 48000
    dataManager.calculateDataNeededPerSampleLength()

    const features = {
      rms: 1,
      energy: 1,
      spectralCentroid: 1,
      spectralFlatness: 1,
      spectralRolloff: 1,
      spectralSkewness: 1,
      perceptualSharpness: 1,
      perceptualSpread: 1,
      mfcc: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      powerSpectrum: [...Array(10)].map(() => 1)
    }

    // ------------------------------------------------------------------
    // Set up result
    // ------------------------------------------------------------------
    const expectedDataInFrames = {}
    keys(features).forEach((key) => {
      expectedDataInFrames[key] = [features[key]]
    })

    // ------------------------------------------------------------------
    // Run test
    // ------------------------------------------------------------------
    dataManager.selectedClassChange(CONSTANTS.CHLOE)
    dataManager.extractFeatures(features)
    expect(dataManager.data).toStrictEqual(dataManager.getEmptyData())
    expect(dataManager.dataInFrames).toStrictEqual(expectedDataInFrames)
  })

  test('extractFeatures: 32 extraction frames for 1 dataset', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    // ------------------------------------------------------------------
    // Set up dataManager state
    // ------------------------------------------------------------------
    dataManager.currentAudioContext = {}
    dataManager.currentAudioContext.sampleRate = 48000
    dataManager.calculateDataNeededPerSampleLength()
    dataManager.selectedClassChange(CONSTANTS.CHLOE)

    const featuresArray = []

    for (let i = 0; i < 32; i++) {
      featuresArray.push({
        rms: i,
        energy: i,
        spectralCentroid: i,
        spectralFlatness: i,
        spectralRolloff: i,
        spectralSkewness: i,
        perceptualSharpness: i,
        perceptualSpread: i,
        mfcc: [i, i + 1, i + 2],
        powerSpectrum: [...Array(5)].map(() => 1)
      })
    }

    // ------------------------------------------------------------------
    // Set up result
    // ------------------------------------------------------------------
    const expectedDataIn32ndFrame = reduce(
      featuresArray,
      (acc, features) => {
        keys(features).forEach((key) => {
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(features[key])
        })
        return acc
      },
      {}
    )

    const expectedDataIn31stFrame = cloneDeep(expectedDataIn32ndFrame)
    keys(expectedDataIn31stFrame).forEach((key) => {
      expectedDataIn31stFrame[key].pop()
    })

    const valueArray = [mean([...Array(32).keys()])]
    const deltaArray = [NaN]

    const expectedData = {
      rms: valueArray,
      delta_rms: deltaArray,
      energy: valueArray,
      delta_energy: deltaArray,
      spectralCentroid: valueArray,
      delta_spectralCentroid: deltaArray,
      spectralFlatness: valueArray,
      delta_spectralFlatness: deltaArray,
      spectralRolloff: valueArray,
      delta_spectralRolloff: deltaArray,
      spectralSkewness: valueArray,
      delta_spectralSkewness: deltaArray,
      perceptualSpread: valueArray,
      delta_perceptualSpread: deltaArray,
      perceptualSharpness: valueArray,
      delta_perceptualSharpness: deltaArray,
      mfcc: [[mean(range(32, 0)), mean(range(32, 1)), mean(range(32, 2))]],
      powerSpectrum: [[...Array(5)].map(() => 1)],
      class: [0],
      timestamp: [Date.now()]
    }

    // ------------------------------------------------------------------
    // Run test
    // ------------------------------------------------------------------
    featuresArray.forEach((features, iteration) => {
      if (iteration === 31) {
        expect(dataManager.dataInFrames).toStrictEqual(expectedDataIn31stFrame)
      }
      dataManager.extractFeatures(features)
    })

    expect(dataManager.dataInFrames).toStrictEqual(dataManager.getEmptyDataInFrames())
    expect(dataManager.data).toStrictEqual(expectedData)
  })

  test('extractFeatures: 32 extraction frames for 3 dataset', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    // ------------------------------------------------------------------
    // Set up dataManager state
    // ------------------------------------------------------------------
    dataManager.currentAudioContext = {}
    dataManager.currentAudioContext.sampleRate = 48000
    dataManager.calculateDataNeededPerSampleLength()

    const featuresArray = []

    for (let i = 0; i < 32; i++) {
      featuresArray.push({
        rms: i,
        energy: i,
        spectralCentroid: i,
        spectralFlatness: i,
        spectralRolloff: i,
        spectralSkewness: i,
        perceptualSharpness: i,
        perceptualSpread: i,
        mfcc: [i, i + 1, i + 2],
        powerSpectrum: [...Array(5)].map(() => 1)
      })
    }

    // ------------------------------------------------------------------
    // Set up result
    // ------------------------------------------------------------------
    const valueArray = [
      mean([...Array(32).keys()]),
      mean([...Array(32).keys()]),
      mean([...Array(32).keys()])
    ]
    const deltaArray = [NaN, 0, 0]
    const eachMFCC = [mean(range(32, 0)), mean(range(32, 1)), mean(range(32, 2))]
    const mfccArray = [eachMFCC, eachMFCC, eachMFCC]
    const eachPowerSpectrum = [...Array(5)].map(() => 1)
    const powerSpectrumArray = [eachPowerSpectrum, eachPowerSpectrum, eachPowerSpectrum]

    const expectedData = {
      rms: valueArray,
      delta_rms: deltaArray,
      energy: valueArray,
      delta_energy: deltaArray,
      spectralCentroid: valueArray,
      delta_spectralCentroid: deltaArray,
      spectralFlatness: valueArray,
      delta_spectralFlatness: deltaArray,
      spectralRolloff: valueArray,
      delta_spectralRolloff: deltaArray,
      spectralSkewness: valueArray,
      delta_spectralSkewness: deltaArray,
      perceptualSpread: valueArray,
      delta_perceptualSpread: deltaArray,
      perceptualSharpness: valueArray,
      delta_perceptualSharpness: deltaArray,
      mfcc: mfccArray,
      powerSpectrum: powerSpectrumArray,
      class: [0, 0, 2],
      timestamp: [Date.now(), Date.now() + 2000, Date.now() + 3000]
    }

    // ------------------------------------------------------------------
    // Run test
    // ------------------------------------------------------------------
    dataManager.selectedClassChange(CONSTANTS.CHLOE)
    featuresArray.forEach((features) => {
      dataManager.extractFeatures(features)
    })
    advanceBy(1000)

    dataManager.selectedClassChange(null)
    featuresArray.forEach((features) => {
      dataManager.extractFeatures(features)
    })
    advanceBy(1000)

    dataManager.selectedClassChange(CONSTANTS.CHLOE)
    featuresArray.forEach((features) => {
      dataManager.extractFeatures(features)
    })
    advanceBy(1000)

    dataManager.selectedClassChange(CONSTANTS.MUSIC)
    featuresArray.forEach((features) => {
      dataManager.extractFeatures(features)
    })

    expect(dataManager.dataInFrames).toStrictEqual(dataManager.getEmptyDataInFrames())
    expect(dataManager.data).toStrictEqual(expectedData)
  })

  test('reduceDataInFrames', () => {
    const DataManager = require('../DataManager').default

    const dataManager = new DataManager({ store: fakeStore })

    // ------------------------------------------------------------------
    // Set up dataManager state
    // ------------------------------------------------------------------
    dataManager.currentAudioContext = {}
    dataManager.currentAudioContext.sampleRate = 48000
    dataManager.calculateDataNeededPerSampleLength()

    const prevData = {
      rms: [10, 1],
      delta_rms: [NaN, 9],
      energy: [10, 1],
      delta_energy: [NaN, 9],
      spectralCentroid: [10, 1],
      delta_spectralCentroid: [NaN, 9],
      spectralFlatness: [10, 1],
      delta_spectralFlatness: [NaN, 9],
      spectralRolloff: [10, 1],
      delta_spectralRolloff: [NaN, 9],
      spectralSkewness: [10, 1],
      delta_spectralSkewness: [NaN, 9],
      perceptualSpread: [10, 1],
      delta_perceptualSpread: [NaN, 9],
      perceptualSharpness: [10, 1],
      delta_perceptualSharpness: [NaN, 9],
      mfcc: [
        [1, 2, 3],
        [2, 3, 4]
      ],
      powerSpectrum: [
        [1, 1],
        [1, 1]
      ],
      class: [2, 2],
      timestamp: [Date.now() - 2000, Date.now() - 1000]
    }

    const dataInFrames = {
      rms: [11, 13],
      energy: [11, 13],
      spectralCentroid: [11, 13],
      spectralFlatness: [11, 13],
      spectralRolloff: [11, 13],
      spectralSkewness: [11, 13],
      perceptualSharpness: [11, 13],
      perceptualSpread: [11, 13],
      mfcc: [
        [2, 3, 4],
        [4, 5, 6]
      ],
      powerSpectrum: [
        [1, 1],
        [1, 1]
      ]
    }

    const expectedData = {
      rms: [10, 1, 12],
      delta_rms: [NaN, 9, 11],
      energy: [10, 1, 12],
      delta_energy: [NaN, 9, 11],
      spectralCentroid: [10, 1, 12],
      delta_spectralCentroid: [NaN, 9, 11],
      spectralFlatness: [10, 1, 12],
      delta_spectralFlatness: [NaN, 9, 11],
      spectralRolloff: [10, 1, 12],
      delta_spectralRolloff: [NaN, 9, 11],
      spectralSkewness: [10, 1, 12],
      delta_spectralSkewness: [NaN, 9, 11],
      perceptualSpread: [10, 1, 12],
      delta_perceptualSpread: [NaN, 9, 11],
      perceptualSharpness: [10, 1, 12],
      delta_perceptualSharpness: [NaN, 9, 11],
      mfcc: [
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5]
      ],
      powerSpectrum: [
        [1, 1],
        [1, 1],
        [1, 1]
      ],
      class: [2, 2, 0],
      timestamp: [Date.now() - 2000, Date.now() - 1000, Date.now()]
    }

    dataManager.data = prevData
    dataManager.dataInFrames = dataInFrames
    dataManager.selectedClassChange(CONSTANTS.CHLOE)
    dataManager.reduceDataInFrames()
    expect(expectedData).toStrictEqual(dataManager.data)
  })
})
