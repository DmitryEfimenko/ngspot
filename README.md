# Ngspot

<p style="display: flex; align-items: center;">
  <img src="./logo.png" width="200">
  <span style="font-size: larger;">A collection of Angular packages.</span>
</p>

## Packages

- [@ngspot/expandable-input](https://github.com/DmitryEfimenko/ngspot/tree/main/packages/expandable-input/package) ([Demo](https://dmitryefimenko.github.io/ngspot/expandable-input))
- [@ngspot/ngx-errors](https://github.com/DmitryEfimenko/ngspot/tree/main/packages/ngx-errors/package)
- [@ngspot/ngx-errors-material](https://github.com/DmitryEfimenko/ngspot/tree/main/packages/ngx-errors-material/package)
- [@ngspot/remote-data](https://github.com/DmitryEfimenko/ngspot/tree/main/packages/remote-data)
- [@ngspot/remote-data-rx](https://github.com/DmitryEfimenko/ngspot/tree/main/packages/remote-data-rx)
- [@ngspot/ng-superclass](https://github.com/DmitryEfimenko/ngspot/tree/main/packages/ng-superclass/package)
- [@ngspot/ng-superclass-material](https://github.com/DmitryEfimenko/ngspot/tree/main/packages/ng-superclass-material/package)

## Development

This project was generated using [Nx](https://nx.dev).

### Basic Workflow

One time config: `git config --global push.followTags true`

> `<project>` in the commands below is a value of the `name` property found in `project.json` file of each project in this monorepo.

#### **[For contributor]** Contribute a feature

1. Switch to a feature branch: `git checkout -b feat/myfeature`
1. Develop
1. Write tests
1. Run `npm run test`
1. Run `git add ./packages/<project-dir>`
1. Run `npm run c` and choose fix or feature
1. Push feature branch, create a PR and have it merged: `git push`
   - Make sure that your PR contains only changes for a single \<project\>.  
     If related changes were made in a different \<project\>, create a separate PR with these changes.

#### **[For maintainer]** Release a new version

1. Switch to main branch: `git checkout main`.
1. Make sure you have latest: `git pull` and `npm install`.
1. Update the version in the package's `package.json` file to the next version.
1. Run `git add .` and `npm run c`. Select "chore" for type
1. Run `npm run nx -- build <project>`
1. Run the corresponding package dry release script `npm run release:[package]:dry`.
  * If reported version is incorrect, see *Debugging release (commit tag) section
1. Make sure that CHANGELOG looks right and run the release command without the `:dry` suffix
  1. This command will ask whether you want to complete release form in the web. Select "Yes".
  1. Adjust Changelog if needed and publish the release
  1. Go back to the terminal
  1. Now it asks whether to publish new package version to npm. Select "Yes"

## Generate a publishable library

### Generate JS lib

```
nx g @nx/js:lib my-lib --publishable --importPath="@ngspot/my-lib"
```

### Generate NG lib

[Docs](https://nx.dev/packages/angular/generators/library)

```sh
nx g @nx/angular:library my-lib --publishable --importPath="@ngspot/my-lib" --changeDetection="OnPush" --standalone --style="scss"
```

Then move it to `package` folder:

```sh
nx generate @nx/angular:move my-lib/package --projectName=my-lib --no-interactive --dry-run
```

Create demo package:

```sh
nx g @nx/angular:library my-lib-demo --buildable --importPath="@ngspot/my-lib-demo" --changeDetection="OnPush" --prefix="ngs" --standalone --style="scss"
```

Move it:

```sh
nx generate @nx/angular:move my-lib/demo --projectName=my-lib-demo --no-interactive --dry-run
```

After the lib is generated:

- update `project.json` file:
  - update `name`: remove "-package" suffix
  - update `tags` to include `"lib", "lib:my-lib"`
  - consider adding `test` into `targets`. See `project.json` file from the existing libs as example.
  - if publishable lib was created, add `targets`: `publish` and `version`. See `project.json` file from the existing libs as example.
- add `CHANGELOG.md` file
- update `package.json` file:
  - Update `name` - remove `/package` suffix
  - Add additional metadata such as "author", "keywords", "license", etc. See other libs for example.
- update `scopes` in `changelog.config.js` to add the new lib

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@ngspot/mylib`.

#### Example command creating a demo project:

```
nx g @nx/angular:library ng-superclass/demo --importPath="@ngspot/ng-superclass-demo" --changeDetection="OnPush" --prefix="ngs" --standalone --style="scss"
```

## To add a new library via schematic

Example with `@angular/material`. Instead of running `ng add @angular/material`, do the following:

```
npm i @angular/material [-D]
npm run nx -- g @angular/material:ng-add --project=demo
```

## Debugging release (commit tag)

Issue can appear when performing `git commit --amend`. The tag won't be moved automatically on a new commit hash. To move it:

```sh
git tag -d <tagname>                  # delete the old tag locally
git push origin :refs/tags/<tagname>  # delete the old tag remotely
git tag <tagname> <commitId>          # make a new tag locally
git push origin <tagname>             # push the new local tag to the remote 
```
Example:
```sh
git tag -d ngx-errors-material-4.0.0
git push origin :refs/tags/ngx-errors-material-4.0.0
git tag ngx-errors-material-4.0.0 4a4838b26b68c596085b3d8ba37874208758cb1e
git push origin ngx-errors-material-4.0.0
```

### Additional commands:

* list tags: `git tag --sort=-creatordate`
* list tags for prefix: `git tag --sort=-creatordate -l 'ngx-errors-material*'`
* list commits with corresponding tags: `git show-ref --tags -d`

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Build

Run `nx build my-lib` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-lib` to execute the unit tests via Karma.

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
