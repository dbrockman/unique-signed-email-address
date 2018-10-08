module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*\\.test)\\.tsx?$',
  modulePathIgnorePatterns: ['/build/'],
  // testPathIgnorePatterns: [
  //   "/node_modules/",
  //   "<rootDir>/node_modules/",
  // ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
};
