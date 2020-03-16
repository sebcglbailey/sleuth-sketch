# Sketch Library Usage Report Contributing Guide

We're glad that you are interested in contributing to this project. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](https://github.com/infusionsoft/sleuth-sketch/blob/dev/.github/CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Issue Reporting Guidelines

- Use [the issues page](https://github.com/infusionsoft/sleuth-sketch/issues/new) to create new issues.

## Pull Request Guidelines

- The `master` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.

- **DO NOT** checkin `docs` or `src/reports` in the commits.

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- Make sure `npm test` passes. (see [development setup](#development-setup))

- If adding a new feature:
  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

## Development Setup

You will need [Node.js](http://nodejs.org) **version 8+** and [yarn](https://yarnpkg.com/en/docs/install).

After cloning the repo, run:

``` bash
$ yarn # install the dependencies of the project
```

### Commonly used NPM scripts

``` bash
# watch and auto re-build dist/vue.js
$ npm run dev

# build all dist files
$ npm run build

# run the report generation script against your abstract org or Sketch project directory
$ npm run report [-abstract|Directory]
```

There are some other scripts available in the `scripts` section of the `package.json` file.

## Project Structure

- **`reporting`**: contains the scripts for finding your sketch files (or getting them from Abstract) and generating the reports from them.

  - `reporting/analyze-sketch.js`: script for processing each sketch file and its layers.

  - `reporting/main.js`: processes all the reading and writing of sketch and json files for the reports.

- **`docs`**: contains the publishable report page.

- **`src`**: contains the source code for the report page.

  - **`assets`**: contains icons and images for the report page.

  - **`components`**: contains vue components used for the report page.

  - **`mixins`**: contains frontend rendering helper utilities.

  - **`reports`**: contains processed reports from `$ yarn report`. **Do not commit to this folder**.

  - **`shared`**: contains utilities shared across the entire codebase.

  - **`styles`**: contains global styles (scss).
