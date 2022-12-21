const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: getJestProjects(),
  setupFilesAfterEnv: ['node_modules/@hirez_io/jest-given/dist/jest-given.js'],
};
