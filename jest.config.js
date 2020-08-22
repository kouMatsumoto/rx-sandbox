module.exports = {
  rootDir: '.',
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(fp-ts)/)'],
  testURL: 'http://localhost/',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/specs/',
    '/test-helpers/',
    '/testing/',
    '/tests/',
  ],
  coverageReporters: ['lcov', 'text-summary'],
  verbose: true,
  preset: 'ts-jest',
  restoreMocks: true,
};
