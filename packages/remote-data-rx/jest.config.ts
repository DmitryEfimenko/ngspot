/* eslint-disable */
export default {
  displayName: 'remote-data-rx',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/remote-data-rx',
  resolver: '@nrwl/jest/plugins/resolver',
};
