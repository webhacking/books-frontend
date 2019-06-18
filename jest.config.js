module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/types/**/*',
    '!**/__test__/*.*',
    '!**/_document.tsx',
    '!**/utils/sentry.ts',
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.svg': '<rootDir>/src/tests/__mocks__/svgrMock.ts',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules'],
};
