const testPathIgnorePatterns = ['/node_modules/', '/build/']

module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './coverage/',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/+(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns
}
