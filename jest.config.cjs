/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/backend', '<rootDir>/__tests__'],
  transform: {
    '^.+\\.ts$': ['babel-jest']
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'lcov',
    'text-summary',
    'cobertura'
  ],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ],
  testPathIgnorePatterns: [
    '/__tests_fe__/',
    '/node_modules/'
  ],
  collectCoverageFrom: [
    'backend/**/*.ts',
    '!backend/**/*.d.ts'
  ]
};

module.exports = config;