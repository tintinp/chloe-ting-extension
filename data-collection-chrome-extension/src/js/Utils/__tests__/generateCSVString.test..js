describe('generateCSVString', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  afterEach(() => {})

  test('remove correct timestamp', () => {
    const generateCSVString = require('../generateCSVString').default

    const data = {
      class: [0, 2, 0, 2, 0, 1, 1, 1],
      timestamp: [10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500],
      a: [1, 2, 3, 4, 5, 6, 7, 8],
      delta_a: [NaN, 1, 1, 1, 1, 1, 1, 1],
      b: [1, 1, 1, 1, 1, 1, 1, 1],
      delta_b: [NaN, 0, 0, 0, 0, 0, 0, 0],
      array1: [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10],
        [3, 3],
        [4, 4],
        [5, 5]
      ],
      array2: [
        [1, 1],
        [10, 10],
        [1, 1],
        [10, 10],
        [1, 1],
        [10, 10],
        [1, 1],
        [10, 10]
      ]
    }

    const classChangeTimestamp = [11500, 13499]

    const expected =
      `class,a,delta_a,b,delta_b,array1_1,array1_2,array2_1,array2_2\r\n` +
      `2,2,1,1,0,3,4,10,10\r\n` +
      `0,5,1,1,0,9,10,1,1\r\n` +
      `1,8,1,1,0,5,5,10,10`

    const result = generateCSVString(data, classChangeTimestamp)

    expect(result).toStrictEqual(expected)
  })
})
