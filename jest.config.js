module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/__test__/*.*', '!**/_{document,app}.tsx'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules'],
};
