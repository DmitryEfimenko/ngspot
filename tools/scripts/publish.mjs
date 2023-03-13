/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import nrwlDevkit from '@nrwl/devkit';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const { readCachedProjectGraph } = nrwlDevkit;

// Executing publish script: node path/to/publish.mjs --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
let [, , tag = 'next', verbose = false] = process.argv;

if (tag === 'undefined') {
  tag = 'next';
}

if (verbose === 'undefined') {
  verbose = false;
}

invariant(
  !!tag && ['next', 'latest'].includes(tag),
  `Argument tag is invalid. Got "${tag}".`
);

const name = process.env['NX_TASK_TARGET_PROJECT'];

invariant(!!name, `Could not determine project name. Got "${name}".`);

if (verbose) {
  console.log(`Publishing package ${name}`);
}

const project = getProject(name);
const projectRoot = getProjectRoot(project);
const version = getVersion(projectRoot);
const outputPath = getOutputPath(project, projectRoot);

process.chdir(outputPath);
// updateDistPackageJsonVersion(outputPath);
execSync(`npm publish --access public --tag ${tag}`);

function getProject(name) {
  const graph = readCachedProjectGraph();
  const project = graph.nodes[name];

  invariant(
    project,
    `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
  );

  if (verbose) {
    console.log(`Got project`, project.name);
  }

  return project;
}

function getProjectRoot(project) {
  const projectRoot = project.data?.root;

  invariant(
    projectRoot,
    `Could not determine projectRoot directory. Got "${projectRoot}"`
  );

  if (verbose) {
    console.log(`Project root:`, projectRoot);
  }

  return projectRoot;
}

function getVersion(projectRoot) {
  try {
    const packageJSON = fs.readFileSync(
      path.join('.', projectRoot, 'package.json')
    );
    const { version } = JSON.parse(packageJSON);

    // A simple SemVer validation to validate the version
    const validVersion = /^\d+\.\d+\.\d(-\w+\.\d+)?/;

    invariant(
      version && validVersion.test(version),
      `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`
    );

    if (verbose) {
      console.log('Version:', version);
    }

    return version;
  } catch (e) {
    console.error(
      chalk.bold.red(
        `Error reading package.json file from library root directory.`
      )
    );
    console.error(e);
    process.exit(1);
  }
}

function getOutputPath(project, projectRoot) {
  let outputPath =
    project.data?.targets?.build?.executor === '@nrwl/angular:package'
      ? project.data?.targets?.build?.outputs?.[0]
      : project.data?.targets?.build?.options?.outputPath;

  invariant(
    outputPath,
    `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
  );

  outputPath = outputPath.replace('{workspaceRoot}', '.');
  outputPath = outputPath.replace('{projectRoot}', projectRoot);

  if (verbose) {
    console.log('Output Path', outputPath);
  }

  return outputPath;
}

function updateDistPackageJsonVersion(outputPath) {
  // Updating the version in "package.json" before publishing
  try {
    const json = JSON.parse(fs.readFileSync(`package.json`).toString());
    json.version = version;
    fs.writeFileSync(`package.json`, JSON.stringify(json, null, 2));
  } catch (e) {
    console.error(
      chalk.bold.red(
        `Error reading package.json file from library build output: "${outputPath}"`
      )
    );
    console.error(e);
    process.exit(1);
  }
}

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}
