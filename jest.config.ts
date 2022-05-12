const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: getJestProjects(),
  setupFilesAfterEnv: ['node_modules/@hirez_io/jest-given/dist/jest-given.js'],
};
