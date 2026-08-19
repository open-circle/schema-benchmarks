# Agent Instructions

## Project Commands

Use `pnpm` and the version specified by the repository's `packageManager` field.

- `pnpm check` runs formatting and lint checks.
- `pnpm typecheck` runs all TypeScript checks.
- `pnpm test` runs unit and integration tests.
- `pnpm e2e` runs Playwright end-to-end tests.
- `pnpm schemas:build` builds the schemas package.
- `pnpm bench:all` runs all benchmark suites.
- `pnpm website:dev` starts the website locally.

Run the narrowest relevant command first, then broaden validation when the change warrants it.

## Repository Areas

- `schemas/` contains validation-library adapters and schema definitions.
- `bench/` contains benchmark runners and result generation.
- `website/` contains the frontend and end-to-end tests.
- `json-schema-tests/` contains the JSON Schema compliance suite.
- `utils/` contains shared utilities used across packages.

Keep changes in the package that owns the behavior. Follow neighboring implementations before introducing new abstractions.

## Common Changes

When adding a validation library:

1. Add the dependency to the `schemas` package.
2. Add a library folder under `schemas/libraries/`.
3. Add its schema definition and benchmark definitions.
4. Add download benchmarks matching typical library usage.
5. Run `pnpm schemas:build` and the relevant benchmark commands.

Use existing library folders as templates and preserve the library's idiomatic API in the adapter.

## Testing Conventions

- Use `*.node.test.ts` for Node.js behavior.
- Use `*.browser.test.ts(x)` for DOM-specific behavior.
- Use `*.test-d.ts` for complex TypeScript typing behavior.

Prefer focused tests for the changed package before running the repository-wide checks. Update tests when changing behavior or public contracts.

When available, prefer using VSCode's built-in test runner instead of CLI commands.

## Generated Files and External Data

Do not edit generated files manually when a repository command can regenerate them. Check the owning package scripts and nearby documentation for the generation command.

Benchmark output and external API data can be regenerated or refreshed by scripts. Avoid committing incidental output changes unless the change requires them or the existing workflow expects them.

## Style and Scope

- Follow the existing TypeScript, React, and package-local patterns.
- Use `oxfmt` for formatting and `oxlint` for linting.
- Avoid unrelated refactors, dependency upgrades, and formatting churn.
- Preserve existing public APIs unless the task explicitly requires a breaking change.
- Do not add inline comments unless they clarify non-obvious behavior.

## Git and Contributions

Read `CONTRIBUTING.md` for setup, Git etiquette, library contribution details, and pull request expectations. In particular, prefer a linear history without merge commits.

AI assistance is welcome for speeding up work, but every change must be reviewed and tested by a human before submission.
