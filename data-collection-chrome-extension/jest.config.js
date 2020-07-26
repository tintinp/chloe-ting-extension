const testPathIgnorePatterns = ['/node_modules/', '/build/']

module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './coverage/',
  setupFiles: ['jest-date-mock'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/+(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns
}
