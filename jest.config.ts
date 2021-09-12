import type { Config } from '@jest/types';


const config: Config.InitialOptions = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  roots: [
    'test'
  ],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  verbose: true,
  globals: {
    'ENV': 'test'
  },
  testEnvironment: 'node',
  moduleDirectories: [ 'node_modules', 'src', 'test' ],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    'test/(.*)': '<rootDir>/test/$1'
  }
};
export default config;