module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/types/**/*',
    '!**/__test__/*.*',
    '!**/_{document,app}.tsx',
    '!**/utils/sentry.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules'],
};
