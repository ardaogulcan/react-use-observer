// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  roots: [
    'src',
  ],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,mjs}',
  ],
  coverageReporters: [
    'text',
    'html',
    'json',
  ],
}
