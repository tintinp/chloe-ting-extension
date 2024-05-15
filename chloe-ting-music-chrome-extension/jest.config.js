const testPathIgnorePatterns = ['/node_modules/', '/build/']

module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: './coverage/',
  setupFiles: ['jest-date-mock'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/+(*.)+(spec|test).ts?(x)'],
  testPathIgnorePatterns
}
