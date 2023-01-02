/* eslint-disable */
export default {
  displayName: 'rxjs',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/rxjs',
  setupFilesAfterEnv: [
    '../../node_modules/@hirez_io/jest-given/dist/jest-given.js',
  ],
};