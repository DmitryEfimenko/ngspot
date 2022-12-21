/* eslint-disable */
export default {
  displayName: 'remote-data-rx',
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
  coverageDirectory: '../../coverage/packages/remote-data-rx',
  resolver: '@nrwl/jest/plugins/resolver',
};
