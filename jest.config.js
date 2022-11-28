/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
  preset: 'ts-jest',
  rootDir: 'tests/jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '.*\\.[jt]s$',
};
