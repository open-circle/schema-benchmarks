# Contributing to Schema Benchmarks

Firstly, thank you for wanting to contribute! Ideas for improvements are always welcome, and pull requests are even better.

## Getting set up

1. Fork the repository
2. Clone your fork
3. Install pnpm with `corepack enable` (or a method of your choice)
4. Install dependencies with `pnpm install`
5. Install Playwright with `pnpm exec playwright install --with-deps chromium` (needed for browser tests)
6. Build the schemas with `pnpm schemas:build`
7. Run the website with `pnpm website:dev`

## Git Etiquette

Please avoid creating merge commits, instead rebase your changes on top of main and force push. This allows the history to remain linear, and changes to be traceable to a single commit (with `git bisect`, for example).

Keeping commit history simple is appreciated, but not necessarily required. For example, you can include many small commits during your workflow, and interactively rebase them into a few logical chunks before submitting for review.

## Adding a new library

1. Add the library to the dependencies of the `schemas` package. (`pnpm --filter schemas add <library>`)
2. Create a new folder in `schemas/libraries` named after the library.
3. Add a `index.ts` file with the schema definition. Usually this should be a single function that creates and returns the schema - any other values and types can be exported as well. The schema should match as much of the validation specified as possible. Use existing library schema factories as a reference.
4. Add a `benchmarks.ts` file with the benchmark definitions. Use other benchmarks as a reference.
5. Create download benchmarks (usually just a single `download.ts` file, but can be a `download/` folder with multiple files). This should match how the library would typically be used, matching the specified data type.
6. Build the schema package with `pnpm schemas:build`
7. Run the benchmarks with `pnpm bench:all` to check all is working, but do not commit the changed results (GitHub will push them after you open a PR)
8. Open a PR with your changes.

## Bug reports/feature requests

Please open an issue for any bugs you find, or features you would like to see. Opening a PR without confirmation it's desired means it may not be merged.

Make sure any changes meet our coding standards. We lint with [`oxlint`](https://oxc.rs/docs/guide/usage/linter.html) and format with [`oxfmt`](https://oxc.rs/docs/guide/usage/formatter.html), type check using [TypeScript](https://www.typescriptlang.org/) (specifically TS Go) and test using [Vitest](https://vitest.dev/).

Prefer browser tests (`*.browser.test.ts(x)`) for anything needing DOM specific features (e.g. React components), and Node tests (`*.node.test.ts`) for everything else. Include type tests (`*.test-d.ts`) for anything with complex typing.

The following commands will help you check your changes before opening a PR:

- `pnpm check` - runs lint and format checks
- `pnpm typecheck` - runs type checks
- `pnpm test` - runs tests

## PRs written by AI

Please do not submit PRs solely written by AI. There's nothing wrong with using an assistant to speed up the process, but you should (at the very least) always review and test the changes yourself before submitting.
Opening "slop" PRs is inconsiderate and only adds to the workload of the maintainers.
