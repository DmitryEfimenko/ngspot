# Ngspot

<p style="display: flex; align-items: center;">
  <img src="./logo.png" width="200">
  <span style="font-size: larger;">A collection of Angular packages.</span>
</p>

## Development

This project was generated using [Nx](https://nx.dev).

### Basic Workflow

One time config: `git config --global push.followTags true`

1. Develop
1. Write specs
1. Run `npm run test`
1. Run `git add .`
1. Run `npm run c` and choose fix or feature
1. Run `nx run <lib>:version --dryRun true`
1. Make sure that CHANGELOG looks right and run the command without --dryRun option
1. Run `npm run build:all`
1. Run `nx publish <lib> --ver=<required-version> --tag=latest`
1. Push changes `git push`

🔎 **Smart, Fast and Extensible Build System**

## Generate a publishable library

### Generate JS lib

```
nx g @nrwl/js:lib my-lib --publishable --importPath="@ngspot/my-lib"
```

### Generate NG lib

[Docs](https://nx.dev/packages/angular/generators/library)

```
nx g @nrwl/angular:library [optional-scope/]my-lib --publishable --importPath="@ngspot/my-lib" --changeDetection="OnPush" --prefix="ngs" --standalone --style="scss"
```

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@ngspot/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Build

Run `nx build my-lib` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-lib` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
